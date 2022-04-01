




import { BadRequestException } from '@nestjs/common';
import { DateTime, Interval } from 'luxon';

export const isOpeningHours = (time) => {
    const closingHours = [[8, 12], [14, 18]]
    const hour = DateTime.fromISO(time).hour;
    for (let x = 0; x < closingHours.length; x++) {
        const [open, close] = closingHours[x]
        if (hour >= open &&  hour < close ) {
            return true
        }
     }

     return false
}
export const validateTimeSlotInput = (timeslots) => {

    const tsList = timeslots.reduce((list, ts) => {
        const { fromTime, toTime } = ts;
        list.push(...[fromTime, toTime])
        return list
    },[]);

    // check if time is greater than each other 
    for (let x = 0; x < tsList.length; x++) {
        const prevTime = tsList[x - 1]
        const currentTime = tsList[x]
        if (!DateTime.fromISO(currentTime).isValid) {
            throw new BadRequestException(` Time: ${currentTime} is an Invalid time, please use format 'mm:hh'`)
        } else if (x !== 0 && x % 2 === 0 && DateTime.fromISO(prevTime).toMillis() > DateTime.fromISO(currentTime).toMillis()) {
            throw new BadRequestException(`previous end time ${prevTime} cannot be greater than next start time ${currentTime}`)
        } else if (x % 2 !== 0 && DateTime.fromISO(currentTime).toMillis() <= DateTime.fromISO(prevTime).toMillis()) {
            throw new BadRequestException(` toTime:${currentTime} should be greater than fromTime: ${prevTime}`)
        } else if (!isOpeningHours(currentTime)) {
            throw new BadRequestException(` Time ${currentTime} is a closing hour`)
        }
    }
    // check if its closing hours
     
}