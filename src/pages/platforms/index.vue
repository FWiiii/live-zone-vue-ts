<script setup lang="ts">
import { changeLoadingStatus } from '~/store'

interface Platform {
  name: string
  code: string
  logoImage: string
  androidDanmuSupport: boolean
}

const platforms = ref<Platform[]>()

async function getAllSupportPlatforms() {
  changeLoadingStatus(true)
  const { data } = await useFetch('http://live.yj1211.work/api/live/getAllSupportPlatforms').get().json()
  changeLoadingStatus(false)
  platforms.value = data.value.data.platformList
}

onMounted(async () => {
  await getAllSupportPlatforms()
  console.log(platforms.value)
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div flex="~ wrap justify-between gap-y-4" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`">
      <a-card v-for="item in platforms" :key="item.code" hoverable max-h-100 w-60 flex="~ col items-center gap-2" bg-gray-100>
        <template #cover>
          <div h-60 w-60>
            <img :src="item.logoImage" h-full w-full object-cover>
          </div>
        </template>
        <span>{{ item.name }}</span>
      </a-card>
    </div>
  </IndexLayout>
</template>
