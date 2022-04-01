




import { roundMinutes, createTimeSlot, getAvailableTimeslots, bookTimeSlot } from './timeEngine'

const STEPS = 15
const timeSlots = {
    '09:00' : true,
    '09:15' : true,
    '09:30' : true,
    '09:45' : true,
    '10:00' : true
}

const availableTimeSlots = [
    {
        fromTime: '09:00',
        toTime: '09:30'
    },
    {
        fromTime: '09:30',
        toTime: '10:00'
    }
]
describe('timeEngine.roundMinutes() rounds to the nearest 15', () => {

    it('it should round 13 minutes to 15', async () => {

        expect(roundMinutes(13, STEPS)).toEqual(15);

    });

    it('it should round 36 minutes to 45', async () => {

        expect(roundMinutes(36, STEPS)).toEqual(45);

    });
  });

  describe('timeEngine.createTimeSlot()', () => {
   
    const fromTime = '09:00'
    const toTime = '10:00'
    it('it should return timeslotsmap given time from 9:00 to 10:00', async () => {

      expect(createTimeSlot(fromTime, toTime, STEPS)).toStrictEqual(timeSlots);
    });

  });

  describe('timeEngine.getAvailableTimeslots', () => {
   
    const duration = 30
    it('it should return available timeslots for 30 minutes consultations', async () => {

      expect(getAvailableTimeslots(timeSlots, duration, STEPS)).toStrictEqual(availableTimeSlots);
    });

  });

  describe('timeEngine.bookTimeSlot', () => {
   
    const fromTime = '09:15'
    const toTime = '09:45'
    it('it should return available timeslots for 30 minutes consultations', async () => {

      expect(bookTimeSlot(fromTime, toTime, timeSlots, STEPS)).toStrictEqual({
        '09:00' : true,
        '09:15' : false,
        '09:30' : false,
        '09:45' : false,
        '10:00' : true
      });
    });

  });