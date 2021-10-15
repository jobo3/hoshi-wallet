
/*
  This function takes a transaction array sorted by date as input and
  returns an array with subarrays, containing transactions with the same "distance" from now.
*/
export const groupTxsByDistanceFromNow = (txs, timeDistanceFunc) => {
  const groupedList = []
  let group = []
  txs.forEach( element => {
    const distance = timeDistanceFunc(new Date(element.date))
    if (group.length === 0) {
      group.push(element)
    }
    else {
      if (timeDistanceFunc(new Date(group[0].date)) === distance) {
        group.push(element)
      }
      else {
        groupedList.push(group)
        group = [element]
      }
    }
  })
  groupedList.push(group)

  return groupedList
}