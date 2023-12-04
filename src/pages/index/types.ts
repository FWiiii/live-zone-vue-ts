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
