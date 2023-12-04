<script setup lang="ts">
import { type CSSProperties, onMounted } from 'vue'

// import Artplayer from 'artplayer'

const documentHeight = document.documentElement.clientHeight
const headerHeight = 64
const contentHeight = documentHeight - headerHeight

const headerStyle: CSSProperties = {
  color: '#fff',
  height: headerHeight,
  backgroundColor: '#7dbcea',
}

const contentStyle: CSSProperties = {
  height: `${contentHeight}px`,
  color: '#fff',
  backgroundColor: '#108ee9',
}

onMounted(() => {
  // const art = new Artplayer({
  //   container: '.artplayer-app',
  //   url: '../../../public/na-wo-dong-ni-yi-si-liao-mei-you-ren-zai-hu-ni-zai-hu-de-shi-official-music-video-1080-ytshorts.savetube.me.mp4',
  // })
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
          <div class="artplayer-app" flex-1 />
          <div h-16>
            info
          </div>
        </div>
        <div w-70>
          danmu
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>
