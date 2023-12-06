<script setup lang="ts">
import { getRoomInfo } from '../request'
import type { RoomInfo } from '../types'
import { getPlatformName, nummberFormat } from '~/utils'

const route = useRoute()
const platform = route.query.platform as string
const id = route.query.id as string

const roomInfo = ref<RoomInfo>()

async function fetchInitData() {
  roomInfo.value = await getRoomInfo(platform, id)
}

fetchInitData()
</script>

<template>
  <div h-full flex="~ justify-between items-center">
    <div h-full flex="~ gap-4">
      <img :src="roomInfo?.ownerHeadPic" h-full rounded-full>
      <div flex="~ col justify-between items-start">
        <span text-xs font-bold>{{ roomInfo?.ownerName }}</span>
        <span text-xl font-bold>{{ roomInfo?.roomName }}</span>
        <div text-xs flex="~ items-center gap-2">
          <span>{{ getPlatformName(roomInfo?.platForm) }} </span>
          <span>{{ roomInfo?.categoryName }}</span>
          <span flex="~ items-center">
            <div i-carbon:fire />
            {{ nummberFormat(roomInfo?.online) }}
          </span>
        </div>
      </div>
    </div>
    <div flex="~ gap-2">
      <a-button flex="~ items-center">
        <template #icon>
          <div i-carbon:star-filled />
        </template>
        已关注
      </a-button>
      <a-button flex="~ items-center justify-center">
        <template #icon>
          <div i-carbon:link />
        </template>
      </a-button>
    </div>
  </div>
</template>
