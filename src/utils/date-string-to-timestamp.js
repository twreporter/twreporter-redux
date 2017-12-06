const DateStringToTimeStamp = (date) => {
  const TIME_STAMP = Date.parse(date) / 1000
  if (isNaN(TIME_STAMP) || typeof date !== 'string') {
    return (new Date().getTime()) / 1000
  }
  return TIME_STAMP
}

export default DateStringToTimeStamp
