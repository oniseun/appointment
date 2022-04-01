import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsService } from './doctors.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { IDoctor } from './interfaces/doctor.interface';
import { Model } from 'mongoose';

// const mockCustomer: any = {
//   firstName: 'firstName #1',
//   lastName: 'lastName #1',
//   email: 'test@example.it',
//   phone: '1234567890',
//   address: 'address #1',
//   description: 'description #1',
//   organizations: 'organization #1',
// };

// const mockCustomerUpdate: any = {
//   _id: 'anyid',
//   firstName: 'firstName update',
//   lastName: 'lastName update',
//   email: 'test@example.it',
//   phone: '1234567890',
//   address: 'address update',
//   description: 'description update',
//   organizations: 'organization update',
// };

// const customersArray = [
//   {
//     _id: 'anyid',
//     firstName: 'firstName #1',
//     lastName: 'lastName #1',
//     email: 'test@example.it',
//     phone: '1234567890',
//     address: 'address #1',
//     description: 'description #1',
//     organizations: 'organization #1',
//   },
//   {
//     _id: 'anyid',
//     firstName: 'firstName #2',
//     lastName: 'lastName #2',
//     email: 'test@example.it',
//     phone: '1234567890',
//     address: 'address #2',
//     description: 'description #2',
//     organizations: 'organization #2',
//   },
// ];

// const createCustomerDto: CreateDoctorDto = {
//   firstName: 'firstName #1',
//   lastName: 'lastName #1',
//   email: 'test@example.it',
//   phone: '1234567890',
//   address: 'address #1',
//   description: 'description #1',
//   organizations: 'organization #1',
// };

// const updateCustomerDto: UpdateDoctorDto = {
//   firstName: 'firstName update',
//   lastName: 'lastName update',
//   email: 'test@example.it',
//   phone: '1234567890',
//   address: 'address update',
//   description: 'description update',
//   organizations: 'organization update',
// };

// describe('CustomersService', () => {
//   let service: CustomersService;
//   let model: Model<ICustomer>;

//   const paginationQueryDto: PaginationQueryDto = {
//     limit: 10,
//     offset: 1,
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CustomersService,
//         {
//           provide: getModelToken('Customer'),
//           useValue: {
//             find: jest.fn().mockReturnValue(customersArray),
//             findById: jest.fn(),
//             findByIdAndUpdate: jest.fn(),
//             findByIdAndRemove: jest.fn(),
//             new: jest.fn().mockResolvedValue(mockCustomer),
//             constructor: jest.fn().mockResolvedValue(mockCustomer),
//             create: jest.fn().mockResolvedValue(createCustomerDto),
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             update: jest.fn(),
//             remove: jest.fn(),
//             exec: jest.fn(),
//             populate: jest.fn(),
//             skip: jest.fn(),
//             offset: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<DoctorsService>(DoctorsService);
//     model = module.get<Model<IDoctor>>(getModelToken('Doctor'));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('findAll()', () => {
//     it('should return all customers', async () => {
//       jest.spyOn(model, 'find').mockReturnValue({
//         exec: jest.fn().mockResolvedValueOnce(customersArray),
//         skip: jest.fn().mockReturnThis(),
//         limit: jest.fn().mockReturnThis(),
//         populate: jest.fn().mockReturnThis(),
//       } as any);
//       const customers = await service.findAll(paginationQueryDto);
//       expect(customers).toEqual(customersArray);
//     });
//   });

//   describe('findOne()', () => {
//     it('should return one customer', async () => {
//       const findSpy = jest.spyOn(model, 'findById').mockReturnValueOnce({
//         exec: jest.fn().mockResolvedValueOnce(mockCustomer),
//         populate: jest.fn().mockReturnThis(),
//       } as any);
//       const response = await service.findOne('anyid');
//       expect(findSpy).toHaveBeenCalledWith({ _id: 'anyid' });
//       expect(response).toEqual(mockCustomer);
//     });

//     it('should throw if find one customer throws', async () => {
//       jest.spyOn(model, 'findById').mockReturnValueOnce({
//         exec: jest.fn(() => null),
//         populate: jest.fn().mockReturnThis(),
//       } as any);
//       await expect(service.findOne('anyid')).rejects.toThrow(
//         new NotFoundException('Customer #anyid not found'),
//       );
//     });
//   });

//   describe('create()', () => {
//     it('should insert a new organization', async () => {
//       jest.spyOn(model, 'create').mockImplementationOnce(() =>
//         Promise.resolve({
//           _id: 'a id',
//           firstName: 'firstName #1',
//           lastName: 'lastName #1',
//           email: 'test@example.it',
//           phone: '1234567890',
//           address: 'address #1',
//           description: 'description #1',
//           organizations: 'organization #1',
//         }),
//       );
//       const newCustomer = await service.create({
//         firstName: 'firstName #1',
//         lastName: 'lastName #1',
//         email: 'test@example.it',
//         phone: '1234567890',
//         address: 'address #1',
//         description: 'description #1',
//         organizations: 'organization #1',
//       });
//       expect(newCustomer).toEqual({
//         _id: 'a id',
//         firstName: 'firstName #1',
//         lastName: 'lastName #1',
//         email: 'test@example.it',
//         phone: '1234567890',
//         address: 'address #1',
//         description: 'description #1',
//         organizations: 'organization #1',
//       });
//     });
//   });

// });
