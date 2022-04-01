import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { IAvailability } from './interfaces/availability.interface';
import { DoctorsService } from '../doctors/doctors.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { IDoctor } from '../doctors/interfaces/doctor.interface';
import { Model } from 'mongoose';
import { CreateAvailabilityInput, FindAvailabilityInput } from './availability.model';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

const mockDoctor: any = {
    _id: "623a4be15eec415b89ed269",
    fullName: 'Fola Scholz',
    age: 40,
    specialization: 'Dentist'
};
const weekDay = (new Date()).getDay();
let testDate = DateTime.now().plus({days: [0, 5, 6].includes(weekDay) ? 4 : 1 }).toISODate()

const findAvailabilityInput: FindAvailabilityInput = {
    doctorId: "623a4be15eec415b89ed269",
    fromDate: testDate,
    toDate: testDate,
    duration: 30
  };

  const createAvailabilityInput: CreateAvailabilityInput = {
    doctorId: "623a4be15eec415b89ed269",
    date: testDate,
    timeslots: [{
        fromTime: '09:00',
        toTime: '10:00'
    }],
  };

  const availabilities = [
      {
        _id: "id123",
        doctorId: "623a4be15eec415b89ed269",
        date: new Date(testDate),
        fromTime: '',
        toTime: '',
        timeslots: JSON.stringify({
            '09:00' : true,
            '09:15' : true,
            '09:30' : true,
            '09:45' : true,
            '10:00' : true
        }),
        tz: "Europe/Berlin",
      }
  ]

  const availableTimeSlots = [
    {
        doctorId: "623a4be15eec415b89ed269",
        date: new Date(testDate),
        fromTime: '09:00',
        toTime: '09:30'
    },
    {
        doctorId: "623a4be15eec415b89ed269",
        date: new Date(testDate),
        fromTime: '09:30',
        toTime: '10:00'
    }
]

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let availabilityModel: Model<IAvailability>;
  let doctorModel: Model<IDoctor>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        ConfigService,
        {
          provide: getModelToken('Availability'),
          useValue: {
            find: jest.fn().mockReturnValue(availabilities),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(availabilities[0]),
            constructor: jest.fn().mockResolvedValue(availabilities[0]),
            create: jest.fn().mockResolvedValue(availabilities[0]),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
          
        },

        {
          provide: getModelToken('Doctor'),
          useValue: {
            find: jest.fn().mockReturnValue([mockDoctor]),
            findById: jest.fn().mockResolvedValue(mockDoctor),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockDoctor),
            constructor: jest.fn().mockResolvedValue(mockDoctor),
            create: jest.fn().mockResolvedValue(mockDoctor),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
            populate: jest.fn(),
            skip: jest.fn(),
            offset: jest.fn(),
          },
          
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    availabilityModel = module.get<Model<IAvailability>>(getModelToken('Availability'));
    doctorModel = module.get<Model<IDoctor>>(getModelToken('Doctor'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return availabilties from 09:00 - 10:00', async () => {
   jest.spyOn(availabilityModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(availabilities),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any); 
    
    jest.spyOn(doctorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockDoctor),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
    } as any); 

      const available_slots = await service.findAll(findAvailabilityInput);
      expect(available_slots).toStrictEqual(availableTimeSlots);
    });
  });

  describe('create()', () => {
    it('should create availability for a doctor given an input', async () => {
        jest.spyOn(availabilityModel, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(undefined),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
        } as any
      );
      jest.spyOn(availabilityModel, 'create').mockImplementationOnce(() =>
        Promise.resolve({
            _id: "id123",
            doctorId: "623a4be15eec415b89ed269",
            date: new Date(testDate),
            fromTime: '',
            toTime: '',
            timeslots: JSON.stringify({
                '09:00' : true,
                '09:15' : true,
                '09:30' : true,
                '09:45' : true,
                '10:00' : true
            }),
            tz: "Europe/Berlin",
          }),
      );
      jest.spyOn(doctorModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockDoctor),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
    } as any); 

      const newAvailability = await service.create(createAvailabilityInput);
      expect(newAvailability).toStrictEqual(availabilities[0]);
    });
  });

});
