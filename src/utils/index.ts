export function stringFormat(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n)} ... ` : str
}

export function nummberFormat(num: number | undefined): string {
  return typeof num === 'undefined'
    ? ''
    : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function getPlatformName(platform: string | undefined): string {
  if (typeof platform === 'undefined')
    return ''
  switch (platform) {
    case 'huya':
      return '虎牙'
    case 'douyu':
      return '斗鱼'
    case 'bilibili':
      return '哔哩哔哩'
    case 'douyin':
      return '抖音'
    case 'cc':
      return '网易CC'
    default:
      return ''
  }
}
