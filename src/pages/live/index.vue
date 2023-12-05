<script setup lang="ts">
import type { CSSProperties } from 'vue'
import Artplayer from 'artplayer'
import flvjs from 'flv.js'
import Hls from 'hls.js'
import type { Datum, RoomInfo } from './types'
import { getRealUrlMultiSource, getRoomInfo } from './request'
import { getPlatformName, nummberFormat } from '~/utils'

const route = useRoute()

const documentHeight = document.documentElement.clientHeight
const headerHeight = 40
const contentHeight = documentHeight - headerHeight

const headerStyle: CSSProperties = {
  height: `${headerHeight}px`,
}

const contentStyle: CSSProperties = {
  height: `${contentHeight}px`,
}

const platform = route.query.platform as string
const id = route.query.id as string

const roomInfo = ref<RoomInfo>()
const realUrlMultiSource = ref<{ [key: string]: Datum[] }>()
const liveSourceInfo = reactive({
  selectSource: '',
  selectRate: '',
  rateSourceSelector: [],
  sourceAndRateMap: new Map(),
  rateSelector: [],
  playUrl: '',
})

function setLiveSourceInfo() {
  const d = realUrlMultiSource.value
  const qualityMap = new Map()

  for (const key in d) {
    if (Object.prototype.hasOwnProperty.call(d, key))
      qualityMap.set(key, d[key])
  }

  const lastSelectSource = localStorage.getItem(`urlSource${platform}`)
  const lastSelectRate = localStorage.getItem(`urlRate${platform}`)

  // 设置当前选中的线路(需要根据上次选中的线路判断)
  if (lastSelectSource != null && qualityMap.has(lastSelectSource))
    liveSourceInfo.selectSource = lastSelectSource

  else
    liveSourceInfo.selectSource = qualityMap.keys().next().value

  // 设置当前选中的清晰度(需要根据上次选中的判断)
  const lastSelectQualityList = qualityMap.get(liveSourceInfo.selectSource)
  if (lastSelectRate != null) {
    lastSelectQualityList.forEach((quality) => {
      if (quality.qualityName === lastSelectRate)
        liveSourceInfo.selectRate = lastSelectRate
    })
  }
  if (liveSourceInfo.selectRate === '')
    liveSourceInfo.selectRate = lastSelectQualityList[0].qualityName

  qualityMap.forEach((qualityList, sourceName) => {
    // 渲染线路
    const isSelectSource = liveSourceInfo.selectSource === sourceName
    liveSourceInfo.rateSourceSelector.push({
      default: isSelectSource,
      html: sourceName,
    })

    // 处理清晰度
    qualityList.forEach((quality) => {
      const rateName = quality.qualityName
      if (rateName.includes('PRO'))
        return

      const isSelectRate = liveSourceInfo.selectRate === rateName
      liveSourceInfo.sourceAndRateMap.set(`${sourceName}===${rateName}`, quality.playUrl)
      // 渲染清晰度
      if (isSelectSource) {
        liveSourceInfo.rateSelector.push({
          default: isSelectRate,
          html: rateName,
        })
        if (isSelectRate)
          liveSourceInfo.playUrl = quality.playUrl
      }
    })
  })
}

function changPlayUrl(source, rate, art) {
  const playUrl = liveSourceInfo.sourceAndRateMap.get(`${source}===${rate}`)
  localStorage.setItem(`urlSource${platform}`, source)
  localStorage.setItem(`urlRate${platform}`, rate)
  switch (art.type) {
    case 'flv':
      art.flv.unload()
      break
    case 'customHls':
      art.hls.stopLoad()
      break
    default:
      break
  }
  if (playUrl.includes('.flv'))
    art.type = 'flv'
  else
    art.type = 'customHls'
  art.switchUrl(playUrl)
}

function createPlayer() {
  const art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true, // 自动播放
    isLive: true, // 直播
    url: liveSourceInfo.playUrl,
    type: liveSourceInfo.playUrl.indexOf('m3u8') > 0 ? 'customHls' : 'flv',
    autoSize: true, // 固定视频比例
    pip: true, // 画中画
    fullscreen: true, // 全屏按钮
    aspectRatio: true, // 长宽比
    setting: true, // 设置按钮
    fullscreenWeb: true, // 网页全屏按钮
    volume: 50, // 默认音量
    flip: true, // 翻转
    screenshot: true, // 截图
    mutex: false, // 假如页面里同时存在多个播放器，是否只能让一个播放器播放
    lang: 'zh-cn', //
    airplay: true,
    customType: {
      customHls(video, url, art) {
        // console.log('播放customHls')
        if (Hls.isSupported()) {
          // console.log('customHls==isSupported')
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          art.hls = hls
          art.once('destroy', () => hls.destroy())
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url
        }
        else {
          art.notice.show = 'Unsupported playback format: m3u8'
        }
      },
      flv(video, url, art) {
        if (flvjs.isSupported()) {
          const flv = flvjs.createPlayer({ type: 'flv', url })
          try {
            flv.attachMediaElement(video)
          }
          catch (error) {
          }
          flv.load()
          // optional
          art.flv = flv
          art.on('destroy', () => {
            flv.destroy()
          })
        }
        else {
          art.notice.show = 'Unsupported playback format: flv'
        }
      },
    },
    controls: [
      {
        name: 'rateSource',
        position: 'right',
        html: liveSourceInfo.selectSource,
        style: {
          marginRight: '5px',
        },
        selector: liveSourceInfo.rateSourceSelector,
        onSelect(item) {
          changPlayUrl(item.html, liveSourceInfo.selectRate, art)
          return item.html
        },
      },
      {
        name: 'rate',
        position: 'right',
        html: liveSourceInfo.selectRate,
        selector: liveSourceInfo.rateSelector,
        onSelect(item) {
          changPlayUrl(liveSourceInfo.selectSource, item.html, art)
          return item.html
        },
      },
    ],
  })
}

async function fetchInitData() {
  const [roomInfoRes, realUrlMultiSourceRes] = await Promise.all([getRoomInfo(platform, id), getRealUrlMultiSource(platform, id)])
  roomInfo.value = roomInfoRes
  realUrlMultiSource.value = realUrlMultiSourceRes
}

onBeforeMount(async () => {
  await fetchInitData()
  setLiveSourceInfo()
  createPlayer()
})
</script>

<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      Header
    </a-layout-header>
    <a-layout-content :style="contentStyle">
      <div flex="~" h-full w-full>
        <div flex="~ col 1">
          <div class="artplayer-app" flex-1 bg-black />
          <div box-border h-20 border="1px solid #fff" p="x-8 y-1">
            <div h-full flex="~ justify-between items-center">
              <div h-full flex="~ gap-4">
                <img :src="roomInfo?.ownerHeadPic" h-full rounded-full>
                <div flex="~ col justify-between items-start">
                  <span text-xs font-bold>{{ roomInfo?.ownerName }}</span>
                  <span text-xl font-bold>{{ roomInfo?.roomName }}</span>
                  <div text-xs flex="~ items-center gap-2">
                    <span>{{ getPlatformName(roomInfo?.platForm) }} </span>
                    <span>{{ roomInfo?.categoryName }}</span>
                    <span flex="~ items-center">
                      <div i-carbon:fire />
                      {{ nummberFormat(roomInfo?.online) }}
                    </span>
                  </div>
                </div>
              </div>
              <div flex="~ gap-2">
                <a-button type="primary" flex="~ items-center">
                  <template #icon>
                    <div i-carbon:star-filled />
                  </template>
                  已关注
                </a-button>
                <a-button type="primary" flex="~ items-center justify-center">
                  <template #icon>
                    <div i-carbon:link />
                  </template>
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <div w-70>
          danmu
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>
