<script setup lang="ts">
import type { CSSProperties } from 'vue'
import Artplayer from './components/ArtPlayer.vue'
import RoomInfo from './components/RoomInfo.vue'
import Danmu from './components/Danmu.vue'

const documentHeight = document.documentElement.clientHeight
const headerHeight = 40
const contentHeight = documentHeight - headerHeight

const headerStyle: CSSProperties = {
  height: `${headerHeight}px`,
  lineHeight: `${headerHeight}px`,
  background: '#fff',
}

const contentStyle: CSSProperties = {
  height: `${contentHeight}px`,
}
</script>

<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      <router-link :to="{ path: '/live', query: { id: 178432, platform: 'douyu' } }">
        <span>Live Zone</span>
      </router-link>
    </a-layout-header>
    <a-layout-content :style="contentStyle">
      <div flex="~" h-full w-full>
        <div flex="~ col 1">
          <Artplayer flex-1 />
          <div box-border h-16 p="x-8 y-1">
            <RoomInfo />
          </div>
        </div>
        <div w-330px flex="~ col">
          <Danmu />
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>
