




import { DateTime, Interval } from 'luxon';


const roundMinutes = (min: number, steps: number) => {
  return Math.ceil(min / steps) * steps
}

export const createTimeSlot = (fromTime, toTime, steps) => {

    const [frmTimeObj, toTimeObj] = [DateTime.fromISO(fromTime), DateTime.fromISO(toTime)]
    const [fromMin, toMin] = [frmTimeObj.minute, toTimeObj.minute]
    const newFromTime = frmTimeObj.minus({ minutes: fromMin }).plus({ minutes: roundMinutes(fromMin, steps) })
    const newToTime = toTimeObj.minus({ minutes: toMin }).plus({ minutes: roundMinutes(toMin, steps) })
    const intv = Interval.fromDateTimes(newFromTime, newToTime);
    const duration = intv.length('minutes')
    const map = {}
    for (let m = 0; m <= duration; m += steps) {
        const key = newFromTime.plus({ minutes: m }).toFormat('T')
        map[key] = true           
    }

    return map;
}

export const createTimeSlots = (timeslot, steps: number) => {

  return timeslot.reduce((map, ts) => {
        const { fromTime, toTime } = ts
        map = {...map, ...createTimeSlot(fromTime, toTime, steps)}
        return map;
   }, {})
   
}

export const getAvailableTimeslots = (timeslots, duration: number, steps: number) => {
 
  const availableTimeslots = [];
  const matches = []
  const timeList = Object.keys(timeslots);
  const roundDuration = roundMinutes(duration, steps)
  let target;

  for (let t = 0; t < timeList.length; t++) {
        const currentTime = timeList[t]
        const nextTime = timeList[t + 1]
        const nextTimeAvailable = timeslots[nextTime]
        const targetTime = DateTime.fromISO(currentTime).plus({ minutes: roundDuration }).toFormat('T')
        const targetTimeAvailable = timeslots[targetTime]
        const nextCurrentDiff = (Interval.fromDateTimes(DateTime.fromISO(currentTime), DateTime.fromISO(nextTime))).length('minutes');
        const targetGreaterThanCurrent = DateTime.fromISO(target).toMillis() > DateTime.fromISO(currentTime).toMillis()
     if (!target && targetTimeAvailable === true && nextTimeAvailable === true) {
          target = targetTime
          matches.push(currentTime)
      }  else if (target === currentTime) {
          matches.push(currentTime)
          availableTimeslots.push({
              fromTime: matches[0],
              toTime: matches[matches.length - 1]
          }) 
          matches.splice(0, matches.length)

          if (targetTimeAvailable === true && nextTimeAvailable === true) {
              target = targetTime
              matches.push(currentTime)
          } else {
              target = undefined
          }
      } else if (target && nextCurrentDiff === steps && targetGreaterThanCurrent ){
          matches.push(currentTime)
      } else {
          target = undefined
          matches.splice(0, matches.length)
      }
      // console.log({target, currentTime, currentTimeAvailable, nextTime, nextTimeAvailable, targetTime, targetTimeAvailable, matches, })
  }

  return availableTimeslots
}

export const bookTimeSlot = (fromTime: string, toTime: string, timeSlots, steps) => {
    const fromTimeObj = DateTime.fromISO(fromTime)
    const duration = (Interval.fromDateTimes(fromTimeObj, DateTime.fromISO(toTime))).length('minutes');
    for (let m = 0; m <= duration; m += steps) {
        const key = fromTimeObj.plus({ minutes: m }).toFormat('T')
        timeSlots[key] = false 
    }
    return timeSlots
}