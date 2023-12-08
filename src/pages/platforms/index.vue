<script setup lang="ts">
import type { Platform } from './types'
import { changeLoadingStatus } from '~/store'

const platforms = ref<Platform[]>()

async function getAllSupportPlatforms() {
  changeLoadingStatus(true)
  const { data } = await useFetch('http://live.yj1211.work/api/live/getAllSupportPlatforms').get().json()
  changeLoadingStatus(false)
  platforms.value = data.value.data.platformList
}

onMounted(async () => {
  await getAllSupportPlatforms()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div flex="~ wrap justify-between gap-y-4" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`">
      <template v-for="item in platforms" :key="item.code">
        <router-link :to="{ path: '/platform', query: { platform: item.code } }">
          <a-card hoverable max-h-100 w-60 flex="~ col items-center gap-2" bg-gray-100>
            <template #cover>
              <img :src="item.logoImage" h-60 w-60 object-cover>
            </template>
            <span>{{ item.name }}</span>
          </a-card>
        </router-link>
      </template>
    </div>
  </IndexLayout>
</template>
