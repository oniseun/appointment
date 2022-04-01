import { Test, TestingModule } from '@nestjs/testing';
import { IAvailability } from '../availability/interfaces/availability.interface';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { BookConsultationInput, GetConsultationsInput } from './consultation.model';
import { ConsultationService } from './consultation.service';
import { IConsultation } from './interfaces/consultation.interface';

const weekDay = DateTime.now().weekday;
let testDate = DateTime.now().plus({days: weekDay > 4 ? 3 : 1 }).toISODate()

const getConsultationInput: GetConsultationsInput = {
    doctorId: "623a4be15eec415b89ed269",
    date: '2022-04-01'
  };

  const bookConsultationInput: BookConsultationInput = {
    doctorId: "623a4be15eec415b89ed269",
    date: testDate,
    fromTime: '09:00',
    toTime: '10:00',
    patientName: 'David grey',
    consultationId: 'id1234'
  };
  const bookConsultationResponse = {
    _id: "id123",
    doctorId: "623a4be15eec415b89ed269",
    patientName: 'David grey',
    date: new Date(testDate),
    fromTime: '09:00',
    toTime: '09:30',
    fromDateTime: new Date(`${testDate}T09:00`),
    toDateTime: new Date(`${testDate}T09:30`),
    tz: "Europe/Berlin",
    consultationId: 'id1234'
  }

  const consultation = {
    _id: "id123",
    doctorId: "623a4be15eec415b89ed269",
    patientName: 'David grey',
    date: new Date('2022-04-01'),
    fromTime: '09:00',
    toTime: '09:30',
    fromDateTime: new Date('2022-04-01T09:00'),
    toDateTime: new Date('2022-04-01T09:00'),
    tz: "Europe/Berlin",
    consultationId: 'id1234'
  }

  const consultations = [
      {
        _id: "id123",
        doctorId: "623a4be15eec415b89ed269",
        patientName: 'David grey',
        date: new Date('2022-04-01'),
        fromTime: '09:00',
        toTime: '09:30',
        fromDateTime: new Date('2022-04-01T09:00'),
        toDateTime: new Date('2022-04-01T09:00'),
        tz: "Europe/Berlin",
        consultationId: 'id1234'
      },
      {
        _id: "id1234",
        doctorId: "623a4be15eec415b89ed269",
        patientName: 'David grey',
        date: new Date('2022-04-01'),
        fromTime: '09:30',
        toTime: '10:00',
        fromDateTime: new Date('2022-04-01T09:00'),
        toDateTime: new Date('2022-04-01T09:00'),
        tz: "Europe/Berlin",
        consultationId: 'id123455'
      },

  ]

  const availabilities = [
    {
      _id: "id123",
      doctorId: "623a4be15eec415b89ed269",
      date: new Date('2022-04-01'),
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


describe('ConsultationService', () => {
  let service: ConsultationService;
  let consultationModel: Model<IConsultation>;
  let availabilityModel: Model<IAvailability>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationService,
        ConfigService,

        {
          provide: getModelToken('Consultation'),
          useValue: {
            find: jest.fn().mockReturnValue([consultation]),
            findById: jest.fn().mockResolvedValue(consultation),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(consultation),
            constructor: jest.fn().mockResolvedValue(consultation),
            create: jest.fn().mockResolvedValue(consultation),
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
      ],
    }).compile();

    service = module.get<ConsultationService>(ConsultationService);
    availabilityModel = module.get<Model<IAvailability>>(getModelToken('Availability'));
    consultationModel = module.get<Model<IConsultation>>(getModelToken('Consultation'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return consultations given doctorId and date', async () => {
   jest.spyOn(consultationModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(consultations),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any); 

      const consultation_list = await service.findAll(getConsultationInput);
      expect(consultation_list).toStrictEqual(consultations);
    });
  });

  describe('findOne()', () => {
    it('should consultation by consultationId', async () => {
      const findSpy = jest.spyOn(consultationModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(consultation),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const response = await service.findOne('id123');
      expect(findSpy).toHaveBeenCalledWith({ consultationId: 'id123' });
      expect(response).toEqual(consultation);
    });
})

  describe('create()', () => {
    it('should create availability for a doctor given an input', async () => {
        jest.spyOn(availabilityModel, 'findOne').mockReturnValue({
            exec: jest.fn().mockResolvedValueOnce(availabilities[0]),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
        } as any
      );
      jest.spyOn(consultationModel, 'create').mockImplementationOnce(() =>
      Promise.resolve(bookConsultationResponse),
    ); 

      const newConsultation = await service.create(bookConsultationInput);
      expect(newConsultation).toStrictEqual(bookConsultationResponse);
    });
  });

});
