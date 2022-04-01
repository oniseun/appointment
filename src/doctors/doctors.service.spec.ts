import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { IDoctor } from './interfaces/doctor.interface';
import { Model } from 'mongoose';
import { AddDoctorInput } from './doctors.model';

const mockDoctor: any = {
    fullName: 'Fola Scholz',
    age: 40,
    specialization: 'Dentist'
};

const doctorsArray = [
  {
    _id: 'anyid1',
    fullName: 'Fola Scholz',
    age: 40,
    specialization: 'Dentist'
  },
  {
    _id: 'anyid2',
    fullName: 'Nuelmma Cronma',
    age: 27,
    specialization: 'Pedriatician'
  },
];

const createDoctorInput: AddDoctorInput = {
  fullName: 'Olaf Scholz',
  age: 40,
  specialization: 'Optomerist',
};


describe('DoctorsService', () => {
  let service: DoctorsService;
  let model: Model<IDoctor>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: getModelToken('Doctor'),
          useValue: {
            find: jest.fn().mockReturnValue(doctorsArray),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
            new: jest.fn().mockResolvedValue(mockDoctor),
            constructor: jest.fn().mockResolvedValue(mockDoctor),
            create: jest.fn().mockResolvedValue(createDoctorInput),
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

    service = module.get<DoctorsService>(DoctorsService);
    model = module.get<Model<IDoctor>>(getModelToken('Doctor'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return all doctors', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(doctorsArray),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const doctors = await service.findAll();
      expect(doctors).toEqual(doctorsArray);
    });
  });

  describe('findOne()', () => {
    it('should return one doctor', async () => {
      const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockDoctor),
        populate: jest.fn().mockReturnThis(),
      } as any);
      const response = await service.findOne('anyid1');
      expect(findSpy).toHaveBeenCalledWith({ _id: 'anyid1' });
      expect(response).toEqual(mockDoctor);
    });

    it('should throw if find one doctor throws', async () => {
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn(() => null),
        populate: jest.fn().mockReturnThis(),
      } as any);
      await expect(service.findOne('anyid')).rejects.toThrow(
        new NotFoundException('Doctor #anyid not found'),
      );
    });
  });

  describe('create()', () => {
    it('should insert a doctor', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          _id: 'a id',
          fullName: 'Andela Markrel',
          age: 34,
          specialization: 'Optician'
        }),
      );
      const newDoctor = await service.create({
        fullName: 'Andela Markrel',
        age: 34,
        specialization: 'Optician'
      });
      expect(newDoctor).toEqual({
        _id: 'a id',
        fullName: 'Andela Markrel',
        age: 34,
        specialization: 'Optician'
      });
    });
  });

});
