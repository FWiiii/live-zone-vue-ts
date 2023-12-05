export interface RoomInfo {
  categoryId: string
  categoryName: string
  egameToken: any
  isFollowed: number
  isLive: number
  online: number
  ownerHeadPic: string
  ownerName: string
  platForm: string
  realUrl: any
  roomId: string
  roomName: string
  roomPic: string
}

export interface RoomInfoResponse {
  code: number
  data: RoomInfo
  message: string
}

export interface RealUrlMultiSourceResponse {
  code: number
  message: string
  data: { [key: string]: Datum[] }
}

export interface Datum {
  qualityName: string
  priority: number
  playUrl: string
  urlType: string
  sourceName: string
}
