<script setup lang="ts">
import type { RecommendData, RecommendResponse } from './types'
import { changeLoadingStatus } from '~/store'

const indexRecommendData = ref<RecommendData[]>()

async function getIndexRecommendData() {
  changeLoadingStatus(true)
  const { data } = await useFetch('http://live.yj1211.work/api/live/getRecommend?page=1&size=20')
  const res: RecommendResponse = JSON.parse(data.value as string)
  changeLoadingStatus(false)
  indexRecommendData.value = res.data
}

onMounted(async () => {
  await getIndexRecommendData()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`" class="container">
      <div flex="~ wrap justify-between gap-y-4" class="card-container">
        <RoomCard :room-data="indexRecommendData" />
      </div>
    </div>
  </IndexLayout>
</template>

<style scoped>
.card-container::after {
  content: '';
  display: block;
  width: 300px;
}

.container::-webkit-scrollbar {
  width: 10px;
}

.container::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
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
