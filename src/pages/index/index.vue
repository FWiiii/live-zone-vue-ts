<script setup lang="ts">
import type { RecommendData, RecommendResponse } from './types'
import { changeLoadingStatus } from '~/store'

const indexRecommendData = ref<RecommendData[]>()

const page = ref<number>(1)
const size = ref<number>(20)

async function getIndexRecommendData() {
  changeLoadingStatus(true)
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRecommend?page=${page.value}&size=${size.value}`).get().json()
  const res: RecommendResponse = data.value
  changeLoadingStatus(false)
  page.value === 1 ? indexRecommendData.value = res.data : indexRecommendData.value = indexRecommendData.value!.concat(res.data)
}

const scrollContainer = ref<HTMLElement>()

async function loadMoreData() {
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value!
  const d = scrollHeight - scrollTop - clientHeight
  if (d < 1 && d > -1) {
    page.value++
    await getIndexRecommendData()
  }
}

onMounted(async () => {
  await getIndexRecommendData()
  scrollContainer.value!.addEventListener('scroll', loadMoreData)
})

onBeforeUnmount(() => {
  scrollContainer.value!.removeEventListener('scroll', loadMoreData)
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div ref="scrollContainer" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`" class="container">
      <div flex="~ wrap justify-between gap-y-4" class="card-container">
        <div v-for="roomData in indexRecommendData" :key="roomData.roomId">
          <RoomCard :room-data="roomData" />
        </div>
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
  background: transparent;
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
