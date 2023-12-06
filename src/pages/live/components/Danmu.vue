<script setup lang="ts">
import VirtualList from 'vue3-virtual-scroll-list'
import Danmaku from 'danmaku/dist/esm/danmaku.canvas.js'
import type { Danmu } from '../types'
import DanmuItem from './DanmuItem.vue'
import emitter from '~/utils/emitter'
import Danmulib from '~/utils/danmu'

const route = useRoute()
const platform = route.query.platform as string
const id = route.query.id as string

const comp = reactive<any>({
  ws: null,
  interval: null,
  danmaku: null,
})

const danmuList = ref<Danmu[]>([])

function createRandomId(length: number): number {
  return +(Math.random().toString().substring(2, length) + Date.now()).toString(36)
}

const needReconnect = ref<boolean>(true)
const vsl = ref<any>()

function initHuyaWs() {
  fetch(`http://live.yj1211.work/api/live/getHuyaInfo?roomId=${id}`)
    .then(async (response) => {
      const res = await response.json()
      const data = res.data
      const ws = new WebSocket('wss://cdnws.api.huya.com/')
      comp.ws = ws
      ws.onopen = function () {
        const inRoomMsg = Danmulib._bind_ws_info(data.luid)
        const loginMsg = Danmulib.huyaSendPingReq()
        ws.send(inRoomMsg)
        ws.send(loginMsg)
      }
      comp.interval = setInterval(() => {
        const heartBeatMsg = Danmulib.huyaSendPingReq()
        ws.send(heartBeatMsg)
      }, 30 * 1000)

      ws.onmessage = async function (msg) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(msg.data)
        reader.onload = function () {
          const msg_obj = Danmulib._on_mes(this.result) || ''
          if (msg_obj.type === 'chat') {
            // if (_this.isBanned('999', msg_obj.content))
            // if (danmuList.value.length > danmuLength.value)
            //   danmuList.value.shift()
            danmuList.value.push({ msg: msg_obj.content, user: msg_obj.name, id: createRandomId(2) })
            emitDanmu(msg_obj.content)
          }
        }
      }
      ws.onclose = function () {
        clearInterval(comp.interval)
        if (needReconnect.value)
          setTimeout(initHuyaWs, 5000)
      }
    })
}

function initDouyuWs() {
  const ws = new WebSocket('wss://danmuproxy.douyu.com:8503/')
  comp.ws = ws

  ws.onopen = function () {
    const loginMsg = Danmulib.douyuEncode(`type@=loginreq/roomid@=${id}/`)
    const joinGroupMsg = Danmulib.douyuEncode(`type@=joingroup/rid@=${id}/gid@=1/`)
    const heartBeatMsg = Danmulib.douyuEncode('type@=mrkl/')
    ws.send(heartBeatMsg)
    ws.send(loginMsg)
    ws.send(joinGroupMsg)
  }

  comp.interval = setInterval(() => {
    const heartBeatMsg = Danmulib.douyuEncode('type@=mrkl/')
    ws.send(heartBeatMsg)
  }, 45000)

  ws.onmessage = async function (msg) {
    const packet = await Danmulib.douyuDecode(msg.data)
    switch (packet.body.type) {
      case 'loginres':
        // console.log('获取直播间弹幕成功');
        break
      case 'chatmsg':
        // if (danmuList.value.length > danmuLength.value)
        //   danmuList.value.shift()
        danmuList.value.push({ msg: packet.body.txt, user: packet.body.nn, id: createRandomId(2) })
        emitDanmu(packet.body.txt)
        break
    }
  }

  ws.onclose = function () {
    clearInterval(comp.interval)
    if (needReconnect.value)
      setTimeout(initDouyuWs, 5000)
  }
}

function initBilibiliWs() {
  const ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:2245/sub')
  comp.ws = ws
  ws.onopen = function () {
    const sendInfo = Danmulib.encode(JSON.stringify({
      roomid: Number(id),
    }), 7)
    ws.send(sendInfo)
  }
  comp.interval = setInterval(() => {
    ws.send(Danmulib.encode('', 2))
  }, 30000)
  ws.onmessage = async function (msgEvent) {
    const packet = await Danmulib.decode(msgEvent.data)
    switch (packet.op) {
      case 8:
        break
      case 5:
        packet.body.forEach((body) => {
          switch (body.cmd) {
            case 'DANMU_MSG':
              // if (_this.isBanned(body.info[4][0], `${body.info[1]}`))
              // if (danmuList.value.length > danmuLength.value)
              //   danmuList.value.shift()
              danmuList.value.push({ msg: body.info[1], user: body.info[2][1], id: createRandomId(2) })
              emitDanmu(body.info[1])
              break
          }
        })
        break
    }
  }
  ws.onclose = function () {
    clearInterval(comp.interval)
    if (needReconnect.value)
      setTimeout(initBilibiliWs, 5000)
  }
}

function initDanmaku(el: HTMLElement) {
  comp.danmaku = new Danmaku({
    container: el,
    engine: 'canvas',
  })
}

function emitDanmu(text) {
  const danmu = {
    text,
    style: {
      font: '20px sans-serif',
      textAlign: 'start',
      textBaseline: 'bottom',
      direction: 'inherit',
      fillStyle: '#fff',
      strokeStyle: '#fff',
      lineWidth: 1.0,
    },
  }
  comp.danmaku.emit(danmu)
}

const danmuLock = ref<boolean>(false)
watch(() => danmuList.value.length, () => {
  if (danmuLock.value)
    return
  vsl.value.scrollToBottom()
}, { flush: 'post' })

function initDanmu() {
  if (platform === 'huya')
    initHuyaWs()
  if (platform === 'douyu')
    initDouyuWs()
  if (platform === 'bilibili')
    initBilibiliWs()
}

onMounted(() => {
  const danmakuId = setInterval(() => {
    const el: HTMLElement | null = document.querySelector('.art-danmuku')
    if (el) {
      clearInterval(danmakuId)
      initDanmaku(el)
      initDanmu()
      emitter.on('resize', () => {
        comp.danmaku.resize()
      })
      emitter.on('danmu-show', (show) => {
        show
          ? comp.danmaku.show()
          : comp.danmaku.hide()
      })
    }
  }, 500)
})

onBeforeUnmount(() => {
  clearInterval(comp.interval)
  comp.ws.close()
  comp.danmaku.destroy()
  needReconnect.value = false
})
</script>

<template>
  <div border-b py-2 flex="~ justify-center items-center">
    <span>直播弹幕</span>
    <span ml-4 cursor-pointer text-xs @click="danmuLock = !danmuLock"> {{ danmuLock ? '固定' : '自由' }}</span>
  </div>
  <div w-full flex-1 of-x-hidden of-y-auto px-2>
    <VirtualList
      ref="vsl" h-full
      class="container"
      of-x-hidden
      of-y-auto
      data-key="id"
      :data-sources="danmuList"
      :data-component="DanmuItem"
      :estimate-size="80"
    />
  </div>
</template>

<style scoped>
.container::-webkit-scrollbar {
  width: 10px;
}

.container::-webkit-scrollbar-track {
  background: transparent;
}

.container::-webkit-scrollbar-thumb {
  background: rgb(136, 136, 136);
  border-radius: 10px;
}

.container::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 100, 100);
  border-radius: 10px;
}

.container::-webkit-scrollbar-thumb:active {
  background: rgb(68, 68, 68);
  border-radius: 10px;
}
</style>
