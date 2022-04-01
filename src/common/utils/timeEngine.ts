




import { DateTime, Interval } from 'luxon';


export const roundMinutes = (min: number, steps: number) => {
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
 
    const timeList = Object.keys(timeslots);
    const roundDuration = roundMinutes(duration, steps)
    const innerCount = (roundDuration / steps) + 1

    if (innerCount === 2) {
        return timeList.reduce((pairs, fromTime) => {
            const toTime = DateTime.fromISO(fromTime).plus({ minutes: roundDuration }).toFormat('T')
              if (timeslots[toTime] === true || timeslots[fromTime] === true  ) {
                pairs.push({ fromTime, toTime })
              }
              return pairs
        }, [])
    }

    return timeList.reduce((pairs, currentTime) => {
        const targetTime = DateTime.fromISO(currentTime).plus({ minutes: roundDuration }).toFormat('T')
          if (timeslots[targetTime] !== undefined) {
            pairs.push([currentTime, targetTime])
          }
          return pairs
    }, []).reduce((ts, pair) => {
            const [fromTime, toTime] = pair
            const fromTimeObj = DateTime.fromISO(fromTime)
            const matches = []
            for (let m = steps; m < roundDuration; m += steps) {
                const time = fromTimeObj.plus({ minutes: m }).toFormat('T')
                if (timeslots[time] !== true) {
                    break;
                }
                matches.push(timeslots[time])
            }
            if (matches.length === innerCount - 2) {
                ts.push({ fromTime,  toTime })
            }

            return ts
    }, [])
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