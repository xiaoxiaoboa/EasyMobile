const getTimeDiff = (time: string) => {
  const getTime = new Date(time)
  const currTime = Date.now()
  const diff = currTime - getTime.getTime()

  const secondDiff = diff / 1000
  const minuteDiff = secondDiff / 60
  const hourDiff = minuteDiff / 60
  const dayDiff = hourDiff / 24
  const yearDiff = dayDiff / 365

  if (secondDiff < 10) {
    return "刚刚"
  } else if (secondDiff < 60) {
    return Math.floor(secondDiff) + "秒"
  } else if (minuteDiff < 60) {
    return Math.floor(minuteDiff) + "分钟"
  } else if (hourDiff < 24) {
    return Math.floor(hourDiff) + "小时"
  } else if (dayDiff < 365) {
    return Math.floor(dayDiff) + "天"
  } else {
    return Math.floor(yearDiff) + "年"
  }
}

export default getTimeDiff
