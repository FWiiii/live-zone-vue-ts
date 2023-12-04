<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { loading } from '~/store'

const documentHeight = document.documentElement.clientHeight
const headerHeight = 64
const contentHeight = documentHeight - headerHeight

const headerStyle: CSSProperties = {
  height: 64,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
}

const contentStyle: CSSProperties = {
  height: contentHeight,
  overflowY: 'hidden',
  position: 'relative',
}

const siderStyle: CSSProperties = {
  lineHeight: `${contentHeight}px`,
  backgroundColor: '#3ba0e9',
}
</script>

<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      Header
    </a-layout-header>
    <a-layout>
      <a-layout-sider :style="siderStyle">
        Sider
      </a-layout-sider>
      <a-layout-content :style="contentStyle">
        <div v-if="loading" class="absolute left-50% top-50%">
          <a-spin size="large" />
        </div>
        <slot :content-height="contentHeight" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
