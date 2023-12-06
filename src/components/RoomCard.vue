<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { stringFormat } from '~/utils'

defineProps<{
  roomData: any
}>()

const bodyStyle: CSSProperties = {
  padding: '8px 16px',
}
</script>

<template>
  <router-link :to="{ path: '/live', query: { id: roomData.roomId, platform: roomData.platForm } }" decoration-none>
    <a-card hoverable :body-style="bodyStyle" w-300px>
      <template #cover>
        <img
          v-lazy="roomData.roomPic"
          h-40
          w-full
          object-cover
        >
      </template>
      <div flex="~ gap-x-5">
        <img :src="roomData.ownerHeadPic" h-10 w-10 rounded-full>
        <div flex="~ col items-start gap-2" text-xs>
          <span text-sm font-bold>{{ stringFormat(roomData.roomName, 12) }}</span>
          <span op-70>{{ roomData.ownerName }}</span>
          <span op-70>  {{ roomData.categoryName || '未知分类' }}</span>
        </div>
      </div>
    </a-card>
  </router-link>
</template>
