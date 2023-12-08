<script setup lang="ts">
import Artplayer from 'artplayer'
import flvjs from 'flv.js'
import Hls from 'hls.js'
import { getRealUrlMultiSource } from '../request'
import type { Datum, liveSourceInfoType } from '../types'
import emitter from '~/utils/emitter'

const route = useRoute()
const platform = route.query.platform as string
const id = route.query.id as string

const realUrlMultiSource = ref<{ [key: string]: Datum[] }>({})
const liveSourceInfo = reactive<liveSourceInfoType>({
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
    lastSelectQualityList.forEach((quality: { qualityName: string }) => {
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
    qualityList.forEach((quality: { qualityName: any, playUrl: string }) => {
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

function changPlayUrl(source: string | HTMLElement, rate: string | HTMLElement, art: Artplayer) {
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

const danmuStatus = ref<boolean>(true)

let artComponent: Artplayer

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
      	tooltip: '弹幕开关',
      	position: 'right',
      	html: `<div text-center>
          <svg class="danmu-show" h-6 block viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M558.545455 721.454545H155.927273C123.345455 721.454545 93.090909 691.2 93.090909 658.618182V318.836364C93.090909 286.254545 123.345455 256 155.927273 256h572.509091c32.581818 0 62.836364 30.254545 62.836363 62.836364V349.090909c0 13.963636 9.309091 23.272727 23.272728 23.272727s23.272727-9.309091 23.272727-23.272727v-30.254545c0-58.181818-51.2-109.381818-109.381818-109.381819H155.927273C97.745455 209.454545 46.545455 260.654545 46.545455 318.836364v339.781818C46.545455 716.8 97.745455 768 155.927273 768H558.545455c13.963636 0 23.272727-9.309091 23.272727-23.272727s-9.309091-23.272727-23.272727-23.272728z"></path><path d="M325.818182 349.090909h46.545454v46.545455h-46.545454zM418.909091 349.090909h186.181818v46.545455h-186.181818zM186.181818 465.454545h46.545455v46.545455H186.181818zM279.272727 465.454545h186.181818v46.545455h-186.181818zM372.363636 581.818182h186.181819v46.545454h-186.181819zM279.272727 581.818182h46.545455v46.545454h-46.545455zM802.909091 465.454545c-95.418182 0-174.545455 79.127273-174.545455 174.545455s79.127273 174.545455 174.545455 174.545455 174.545455-79.127273 174.545454-174.545455-79.127273-174.545455-174.545454-174.545455z m0 302.545455c-69.818182 0-128-58.181818-128-128s58.181818-128 128-128 128 58.181818 128 128-58.181818 128-128 128z"></path><path d="M900.654545 586.472727c-9.309091-9.309091-23.272727-9.309091-32.581818 0l-81.454545 81.454546-48.872727-48.872728c-9.309091-9.309091-23.272727-9.309091-32.581819 0-9.309091 9.309091-9.309091 23.272727 0 32.581819l65.163637 65.163636c9.309091 9.309091 23.272727 9.309091 32.581818 0l97.745454-97.745455c9.309091-9.309091 9.309091-23.272727 0-32.581818z"></path></svg>
          <svg class="danmu-hide" h-6 hidden viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M209.454545 349.090909h46.545455v46.545455H209.454545zM302.545455 349.090909h302.545454v46.545455H302.545455zM349.090909 465.454545h302.545455v46.545455H349.090909zM256 465.454545h46.545455v46.545455h-46.545455z"></path><path d="M558.545455 721.454545H155.927273C123.345455 721.454545 93.090909 691.2 93.090909 658.618182V318.836364C93.090909 286.254545 123.345455 256 155.927273 256h572.509091c32.581818 0 62.836364 30.254545 62.836363 62.836364V349.090909c0 13.963636 9.309091 23.272727 23.272728 23.272727s23.272727-9.309091 23.272727-23.272727v-30.254545c0-58.181818-51.2-109.381818-109.381818-109.381819H155.927273C97.745455 209.454545 46.545455 260.654545 46.545455 318.836364v339.781818C46.545455 716.8 97.745455 768 155.927273 768H558.545455c13.963636 0 23.272727-9.309091 23.272727-23.272727s-9.309091-23.272727-23.272727-23.272728z"></path><path d="M802.909091 465.454545c-95.418182 0-174.545455 79.127273-174.545455 174.545455s79.127273 174.545455 174.545455 174.545455 174.545455-79.127273 174.545454-174.545455-79.127273-174.545455-174.545454-174.545455z m0 302.545455c-69.818182 0-128-58.181818-128-128 0-23.272727 6.981818-44.218182 16.290909-62.836364l174.545455 174.545455c-18.618182 9.309091-39.563636 16.290909-62.836364 16.290909z m97.745454-46.545455L721.454545 542.254545c23.272727-18.618182 51.2-30.254545 81.454546-30.254545 69.818182 0 128 58.181818 128 128 0 30.254545-11.636364 60.509091-30.254546 81.454545z"></path></svg>
          </div>`,
      	click() {
          danmuStatus.value = !danmuStatus.value
          const danmuShow = document.querySelector('.danmu-show')
          const danmuHide = document.querySelector('.danmu-hide')
      		if (!danmuStatus.value) {
            danmuShow?.removeAttribute('block')
            danmuShow?.setAttribute('hidden', '')
            danmuHide?.removeAttribute('hidden')
            danmuHide?.setAttribute('block', '')
          }
          else {
            danmuHide?.removeAttribute('block')
            danmuHide?.setAttribute('hidden', '')
            danmuShow?.removeAttribute('hidden')
            danmuShow?.setAttribute('block', '')
      		}
          emitter.emit('danmu-show', danmuStatus.value)
      	},
      },
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
  art.on('resize', () => {
    emitter.emit('resize')
  })
  artComponent = art
}

onMounted(async () => {
  realUrlMultiSource.value = await getRealUrlMultiSource(platform, id)
  setLiveSourceInfo()
  createPlayer()
})

onBeforeUnmount(() => {
  artComponent.destroy()
})
</script>

<template>
  <div class="artplayer-app" bg-black flex="~ justify-center items-center" />
</template>
