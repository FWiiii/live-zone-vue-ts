<script setup lang="ts">
import { changeLoadingStatus } from '~/store'

enum TypeName {
  其他 = '其他',
  单机 = '单机',
  娱乐 = '娱乐',
  手游 = '手游',
  网游 = '网游',
}
interface Categorie {
  id: number
  typeName: TypeName
  areaName: string
  priority: number
  areaPic: string
}

const categories = ref<Categorie[][]>()
const cat = ref({})
async function getAllCategories() {
  changeLoadingStatus(true)
  const { data } = await useFetch('http://live.yj1211.work/api/live/getAllAreas').get().json()
  changeLoadingStatus(false)
  categories.value = data.value.data
  categories.value?.forEach((item) => {
    cat.value[item[0].typeName] = item
  })
}

const defaultType = ref(TypeName.网游)
const selectedCategory = computed(() => cat.value[defaultType.value])

function tabClick(e) {
  defaultType.value = e
}

onMounted(async () => {
  await getAllCategories()
})
</script>

<template>
  <IndexLayout v-slot="{ contentHeight }">
    <div :style="`height:${contentHeight}px;`">
      <a-tabs ml-8 @tabClick="tabClick">
        <a-tab-pane v-for="(val, key, index) in cat" :key="key" :tab="key" />
      </a-tabs>
      <div flex="~ wrap justify-between gap-y-4" style="overflow-y:auto;padding: 16px">
        <a-card v-for="item in selectedCategory" :key="item.id" hoverable max-h-100 w-60 flex="~ col items-center gap-2" bg-gray-100>
          <template #cover>
            <div h-60 w-60>
              <img v-lazy="item.areaPic" h-full w-full object-cover>
            </div>
          </template>
          <span>{{ item.areaName }}</span>
        </a-card>
      </div>
    </div>
  </IndexLayout>
</template>
