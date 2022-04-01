




import { BadRequestException } from '@nestjs/common';
import { isOpeningHours, validateTimeSlotInput } from './timeValidator'

describe('timeValidator.isOpeningHours() check if time falls in opening hours ', () => {
    /**
     *  opening hours is between 08:00 - 12:00 and 14:00 - 18:00
     */
    const time = '07:00'
    it('it should return false if time is 07:00 am ', async () => {

        expect(isOpeningHours(time)).toBeFalsy();

    });
    const time2 = '09:00'
    it('it should return true if time is 09:00 am', async () => {

        expect(isOpeningHours(time2)).toBeTruthy();

    });
    const time3 = '13:00'
    it('it should return false if time is 13:00 (1:00PM)', async () => {

        expect(isOpeningHours(time3)).toBeFalsy();

    });
  });

  describe('timeValidator.validateTimeSlotInput()', () => {
   
    const timeSlotInput1 = [
      {
        fromTime: "8:00",// invalid time
        toTime: "10:00"
      },
      {
        fromTime: "14:00",
        toTime: "17:00"
      }
    ]
    it('it should throw a BadrequestException if one of the time is invalid', async () => {
      const eMsg1 = "Time: 8:00 is an Invalid time, please use format 'mm:hh'"
      try {
        expect(validateTimeSlotInput(timeSlotInput1)).toThrowError(new BadRequestException(eMsg1));
      } catch(e) {
        expect(e).toEqual(new BadRequestException(eMsg1));
      }
    });

    const timeSlotInput2 = [
      {
        fromTime: "08:00",
        toTime: "10:00"
      },
      {
        fromTime: "09:00",
        toTime: "17:00"
      }
    ]
    it('it should throw a BadRequestException if the next FromTime is less than last toTime ', async () => {
      const eMsg2 = 'previous end time 10:00 cannot be greater than next start time 09:00'
      try {
        expect(validateTimeSlotInput(timeSlotInput2)).toThrowError(new BadRequestException(eMsg2));
      } catch(e) {
        expect(e).toEqual(new BadRequestException(eMsg2));
      }
    });

    const timeSlotInput3 = [
      {
        fromTime: "10:00",
        toTime: "08:00"
      },
      {
        fromTime: "14:00",
        toTime: "17:00"
      }
    ]
    it('it should throw a BadRequestException if fromTime is > toTime ', async () => {
      const eMsg3 = 'toTime:08:00 should be greater than fromTime: 10:00'
      try {
        expect(validateTimeSlotInput(timeSlotInput3)).toThrow(new BadRequestException(eMsg3));
      } catch(e) {
        expect(e).toEqual(new BadRequestException(eMsg3));
      }
    });

  });