<script setup lang="ts">
import type { RecommendData, RecommendResponse } from './types'
import { changeLoadingStatus } from '~/store'
import useScroll from '~/hooks/useScroll'

const route = useRoute()
const typeName = route.query.typeName
const areaName = route.query.areaName
const page = ref<number>(1)
const recommendData = ref<RecommendData[]>()

async function getRecommendByCategory() {
  changeLoadingStatus(true)
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRecommendByAreaAll?areaType=${typeName}&area=${areaName}&page=${page.value}`).get().json()
  const res: RecommendResponse = data.value
  recommendData.value = res.data
  changeLoadingStatus(false)
  page.value === 1 ? recommendData.value = res.data : recommendData.value = recommendData.value!.concat(res.data)
}

const scrollContainer = ref<HTMLElement>()
useScroll(scrollContainer, async () => {
  page.value++
  await getRecommendByCategory()
})

onMounted(async () => {
  await getRecommendByCategory()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div ref="scrollContainer" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`" class="container">
      <span text-2xl font-bold>{{ typeName }} · {{ areaName }}</span>
      <div mt-2 flex="~ wrap justify-between gap-y-4" class="card-container">
        <div v-for="roomData in recommendData" :key="roomData.roomId">
          <RoomCard :room-data="roomData" />
        </div>
      </div>
    </div>
  </IndexLayout>
</template>
