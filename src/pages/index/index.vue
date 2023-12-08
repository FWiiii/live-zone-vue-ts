<script setup lang="ts">
import type { RecommendData, RecommendResponse } from './types'
import { changeLoadingStatus } from '~/store'
import useScroll from '~/hooks/useScroll'

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
useScroll(scrollContainer, async () => {
  page.value++
  await getIndexRecommendData()
})

onMounted(async () => {
  await getIndexRecommendData()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div ref="scrollContainer" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`" class="scroll-container">
      <div flex="~ wrap justify-between gap-y-4" class="card-container">
        <div v-for="roomData in indexRecommendData" :key="roomData.roomId">
          <RoomCard :room-data="roomData" />
        </div>
      </div>
    </div>
  </IndexLayout>
</template>
