<script setup lang="ts">
import { onMounted } from 'vue'
import type { Areas, RecommendData, RecommendResponse } from './types'
import { changeLoadingStatus } from '~/store'
import useScroll from '~/hooks/useScroll'

const route = useRoute()
const platform = route.query.platform

const areas = ref<Array<Areas[]>>([])
async function getAreas() {
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getAreas?platform=${platform}`).get().json()
  const res = data.value
  areas.value = res.data
}

const recommendData = ref<RecommendData[]>()
const page = ref<number>(1)
const size = ref<number>(20)
const selectedArea = ref<string>('全部')
async function getRecommendData() {
  changeLoadingStatus(true)
  let url
  const allUrl = `http://live.yj1211.work/api/live/getRecommendByPlatform?platform=${platform}&page=${page.value}&size=${size.value}`
  const areaUrl = `http://live.yj1211.work/api/live/getRecommendByPlatformArea?platform=${platform}&area=${selectedArea.value}&page=${page.value}&size=${size.value}`
  selectedArea.value === '全部' ? url = allUrl : url = areaUrl

  const { data } = await useFetch(url).get().json()
  changeLoadingStatus(false)
  const res: RecommendResponse = data.value
  page.value === 1 ? recommendData.value = res.data : recommendData.value = recommendData.value!.concat(res.data)
}

async function selectArea(areaName) {
  selectedArea.value = areaName
  page.value = 1
  await getRecommendData()
}

const scrollContainer = ref<HTMLElement>()
useScroll(scrollContainer, async () => {
  page.value++
  await getRecommendData()
})

onMounted(async () => {
  await getRecommendData()
  getAreas()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div ref="scrollContainer" :style="`height:${contentHeight}px; overflow-y:auto;padding: 16px`">
      <span mr-4 cursor-pointer font-bold @click="selectArea('全部')">全部</span>
      <a-dropdown v-for="item, index in areas" :key="index" relative :trigger="['click']" placement="bottomRight">
        <span mr-4 cursor-pointer font-bold>
          {{ item[0].typeName }}
        </span>
        <template #overlay>
          <div absolute left-0 top-2 max-h-120 min-w-30 of-y-auto bg-white p-4>
            <div v-for="i, index in item" :key="index" my-1 cursor-pointer @click="selectArea(i.areaName)">
              {{ i.areaName }}
            </div>
          </div>
        </template>
      </a-dropdown>
      <div flex="~ wrap justify-between gap-y-4" mt-4>
        <div v-for="roomData in recommendData" :key="roomData.roomId">
          <RoomCard :room-data="roomData" />
        </div>
      </div>
    </div>
  </IndexLayout>
</template>
