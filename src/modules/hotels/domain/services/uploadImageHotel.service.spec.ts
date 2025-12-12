import { Hotel } from '@prisma/client';
import { IHotelRepository } from '../repositories/Ihotel.repository';
import { UploadImageHotelService } from './uploadImageHotel.service';
import { Test, TestingModule } from '@nestjs/testing';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import { NotFoundException } from '@nestjs/common';
import { stat, unlink } from 'fs/promises';
import { join } from 'path';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';

let service: UploadImageHotelService;
let hotelRepository: IHotelRepository;
let redis: { del: jest.Mock };

const hotelMock: Hotel = {
  id: 1,
  name: 'Hotel Test',
  description: 'A Test Hotel description',
  image: 'test-image.jpg',
  price: 100,
  address: '123 Test St, Test City',
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock('fs/promises', () => ({
  stat: jest.fn(),
  unlink: jest.fn(),
}));

describe('UploadImageHotelService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadImageHotelService,
        {
          provide: REPOSITORY_TOKEN_HOTEL,
          useValue: {
            findHotelById: jest.fn().mockResolvedValue(hotelMock),
            updateHotel: jest.fn().mockResolvedValue(hotelMock),
          },
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: {
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadImageHotelService>(UploadImageHotelService);
    hotelRepository = module.get<IHotelRepository>(REPOSITORY_TOKEN_HOTEL);
    redis = module.get('default_IORedisModuleConnectionToken');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundExecption when hotel is not found', async () => {
    (hotelRepository.findHotelById as jest.Mock).mockResolvedValue(null);

    await expect(service.execute('1', 'test-image.jpg')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete existing image if it exists', async () => {
    (stat as jest.Mock).mockResolvedValue(true);

    await service.execute('1', 'test-image.jpg');

    const directory = join(process.cwd(), 'uploads-hotel');

    const imageHotelFilePath = join(directory, hotelMock.image);

    expect(stat).toHaveBeenCalledWith(imageHotelFilePath);
    expect(unlink).toHaveBeenCalledWith(imageHotelFilePath);
  });
 it('should throw the error when stat or unlink throw an error with code !== ENOENT', async () => {
  (stat as jest.Mock).mockReset();
  (unlink as jest.Mock).mockReset();
  const customError = Object.assign(new Error('unexpected error'), { code: 'EACCES' });

  (stat as jest.Mock).mockRejectedValueOnce(customError);

  await expect(service.execute('1', 'test-image.jpg')).rejects.toBe(customError);

  const directory = join(process.cwd(), 'uploads-hotel');
  const imageHotelFilePath = join(directory, hotelMock.image);

  expect(stat).toHaveBeenCalledWith(imageHotelFilePath);
  expect(unlink).not.toHaveBeenCalled();
  expect(redis.del).not.toHaveBeenCalled();
  expect(hotelRepository.updateHotel).not.toHaveBeenCalled();
});

  it('should not throw ig existing image dois not exist', async () => {
    (stat as jest.Mock).mockResolvedValue(false);

    await expect(service.execute('1', 'test-image.jpg')).resolves.not.toThrow();
  });

  it('should update the hotel with the new image', async () => {
    (stat as jest.Mock).mockResolvedValue(true);

    await service.execute('1', 'test-image.jpg');

    expect(hotelRepository.updateHotel).toHaveBeenCalledWith(1, {
      image: 'test-image.jpg',
    });
  });

  it('should delete the Redis cache', async () => {
    await service.execute('1', 'test-image.jpg');

    expect(redis.del).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
  });
});
