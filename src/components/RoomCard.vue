<script setup lang="ts">
import type { CSSProperties } from 'vue'

defineProps<{
  roomData: any
}>()
function stringFormat(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n)} ... ` : str
}
const bodyStyle: CSSProperties = {
  padding: '8px 16px',
}
</script>

<template>
  <a-card v-for="item in roomData" :key="item.roomId" hoverable :body-style="bodyStyle" w-300px>
    <template #cover>
      <img
        h-40
        w-full
        object-cover
        :src="item.roomPic"
      >
    </template>
    <div flex="~ gap-x-5">
      <img :src="item.ownerHeadPic" h-10 w-10 rounded-full>
      <div flex="~ col items-start gap-2" text-xs>
        <span text-sm font-bold>{{ stringFormat(item.roomName, 14) }}</span>
        <span op-70>{{ item.ownerName }}</span>
        <span op-70>  {{ item.categoryName }}</span>
      </div>
    </div>
  </a-card>
</template>
