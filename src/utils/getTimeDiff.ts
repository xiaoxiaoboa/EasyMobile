const getTimeDiff = (time: string, resultType?: 'dis' | 'time') => {
  const getTime = new Date(time)
  const currTime = Date.now()
  const diff = currTime - getTime.getTime()

  const secondDiff = diff / 1000
  const minuteDiff = secondDiff / 60
  const hourDiff = minuteDiff / 60
  const dayDiff = hourDiff / 24
  const yearDiff = dayDiff / 365

  if (secondDiff < 10) {
    return '刚刚'
  } else if (secondDiff < 60) {
    return resultType === 'dis'
      ? Math.floor(secondDiff) + '秒'
      : `${getTime.getHours()}:${format(getTime.getMinutes())}`
  } else if (minuteDiff < 60) {
    return resultType === 'dis'
      ? Math.floor(minuteDiff) + '分钟'
      : `${getTime.getHours()}:${format(getTime.getMinutes())}`
  } else if (hourDiff < 24) {
    return resultType === 'dis'
      ? Math.floor(hourDiff) + '小时'
      : `${getTime.getHours()}:${format(getTime.getMinutes())}`
  } else if (hourDiff < 48) {
    return '昨天'
  } else if (dayDiff < 365) {
    return resultType === 'dis'
      ? Math.floor(dayDiff) + '天'
      : `${getTime.getMonth() + 1}月${getTime.getDate()}日`
  } else {
    return resultType === 'dis'
      ? Math.floor(yearDiff) + '年'
      : `${getTime.getFullYear()}年${getTime.getMonth() + 1}月${getTime.getDate()}日`
  }
}

const format = (value: number) => {
  const getNum = Math.floor(value / 10)
  if (getNum > 0) {
    return value
  } else {
    return `0${value}`
  }
}

export default getTimeDiff
