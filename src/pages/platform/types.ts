export interface RecommendData {
  categoryName: string
  roomId: string
  roomName: string
  isFollowed: number
  roomPic: string
  isLive: number
  ownerName: string
  online: number
  platForm: string
  categoryId: string | null
  ownerHeadPic: string
}

export interface RecommendResponse {
  code: number
  data: RecommendData[]
  message: string
}
export interface Response {
  code: number
  message: string
  data: Array<Areas[]>
}

export interface Areas {
  id: number
  platform: string
  areaType: string
  typeName: string
  areaId: string
  areaName: string
  areaPic: string
  shortName: null
  indexArea: number
  indexType: string
}
