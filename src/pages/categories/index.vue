<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type'
import { TypeName } from './types'
import type { Categorie } from './types'
import { changeLoadingStatus } from '~/store'
import useScroll from '~/hooks/useScroll'

const categories = ref<Categorie[][]>()
const cat = ref<{ [key in TypeName]: Categorie[] }>({
  [TypeName.网游]: [],
  [TypeName.手游]: [],
  [TypeName.单机]: [],
  [TypeName.娱乐]: [],
  [TypeName.其他]: [],
})
async function getAllCategories() {
  changeLoadingStatus(true)
  const { data } = await useFetch('http://live.yj1211.work/api/live/getAllAreas').get().json()
  changeLoadingStatus(false)
  categories.value = data.value.data
  categories.value?.forEach((item) => {
    cat.value[item[0].typeName] = item
  })
}

const selectedType = ref(TypeName.网游)
const selectedCategory = computed(() => cat.value[selectedType.value])
const renPage = ref<number>(0)
const renSise = ref<number>(20)
const renderCategory = computed(() => {
  return selectedCategory.value.slice(0, renPage.value + renSise.value)
})

function tabClick(key: Key) {
  selectedType.value = key as TypeName
  renPage.value = 0
}

const scrollContainer = ref<HTMLElement>()
useScroll(scrollContainer, () => {
  renPage.value += renSise.value
})

const routerObj = {
  path: '/category',
  query: ['typeName', 'areaName'],
}

onMounted(async () => {
  await getAllCategories()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div ref="scrollContainer" class="scroll-container" :style="`height:${contentHeight}px;overflow-y:auto;padding: 16px`">
      <a-tabs @tabClick="tabClick">
        <a-tab-pane v-for="(val, key, index) in cat" :key="key" :tab="key">
          <div flex="~ wrap justify-between gap-y-4" class="card-container">
            <router-link v-for="item in renderCategory" :key="item.id" :to="{ path: '/category', query: { typeName: `${selectedType}`, areaName: item.areaName } }">
              <a-card hoverable max-h-100 w-60 flex="~ col items-center gap-2" bg-gray-100>
                <template #cover>
                  <img v-lazy="item.areaPic" h-60 w-60 object-cover>
                </template>
                <span>{{ item.areaName }}</span>
              </a-card>
            </router-link>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </IndexLayout>
</template>
