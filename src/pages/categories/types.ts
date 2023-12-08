export enum TypeName {
  其他 = '其他',
  单机 = '单机',
  娱乐 = '娱乐',
  手游 = '手游',
  网游 = '网游',
}
export interface Categorie {
  id: number
  typeName: TypeName
  areaName: string
  priority: number
  areaPic: string
}
