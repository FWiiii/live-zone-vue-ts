import type { RealUrlMultiSourceResponse, RoomInfoResponse } from './types'

export async function getRoomInfo(platform: string, id: string) {
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRoomInfo?platform=${platform}&roomId=${id}`).get().json()
  const res: RoomInfoResponse = data.value
  return res.data
}

export async function getRealUrlMultiSource(platform: string, id: string) {
  const { data } = await useFetch(`http://live.yj1211.work/api/live/getRealUrlMultiSource?platform=${platform}&roomId=${id}`).get().json()
  const res: RealUrlMultiSourceResponse = data.value
  return res.data
}
