import { message } from 'ant-design-vue'
import type { Datum, RealUrlMultiSourceResponse, RoomInfoResponse } from './types'

export async function getRoomInfo(platform: string, id: string) {
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRoomInfo?platform=${platform}&roomId=${id}`).get().json()
  const res: RoomInfoResponse = data.value
  return res.data
}

const retryCount = ref<number>(0)
export async function getRealUrlMultiSource(platform: string, id: string): Promise<{ [key: string]: Datum[] }> {
  retryCount.value++
  if (retryCount.value > 10)
    return message.error('获取直播源失败，请稍后再试')
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRealUrlMultiSource?platform=${platform}&roomId=${id}`).get().json()
  if (JSON.stringify(data.value.data) === '{}')
    return await getRealUrlMultiSource(platform, id)
  retryCount.value = 0
  const res: RealUrlMultiSourceResponse = data.value
  return res.data
}
