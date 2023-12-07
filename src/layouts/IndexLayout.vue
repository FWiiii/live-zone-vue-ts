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
  background: '#fff',
}

const selectedKeys = ref([])
const openKeys = ref([])
const items = ref([
  {
    key: '/',
    label: '推荐',
    title: '推荐',
  },
  {
    key: '/follows',
    label: '关注',
    title: '关注',
  },
  {
    key: '/platforms',
    label: '平台',
    title: '平台',
  },
  {
    key: '/categories',
    label: '分区',
    title: '分区',
  },
])

const router = useRouter()

function handleClick(e) {
  router.push({ path: e.key })
}
</script>

<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      Header
    </a-layout-header>
    <a-layout>
      <a-layout-sider :style="siderStyle">
        <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys"
          mode="vertical"
          :items="items"
          @click="handleClick"
        />
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
