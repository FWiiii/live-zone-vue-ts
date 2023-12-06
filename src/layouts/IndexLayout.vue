<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { loading } from '~/store'

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
      <a-layout-content relative :style="contentStyle">
        <div v-if="loading" absolute z-100 h-full w-full class="bg-black/10">
          <div
            class="absolute left-50% top-50%"
            flex="~ col items-center justify-center"
            h-20 w-20 rounded-xl bg-white
          >
            <a-spin size="large" />
            <span text-xs font-300>加载中</span>
          </div>
        </div>
        <slot :content-height="contentHeight" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
