import { Test, TestingModule } from '@nestjs/testing';
import { REPOSITORY_TOKEN_HOTEL } from '../../utils/repositoriesTokens';
import { CreateHotelService } from './createHotel.service';
import { IHotelRepository } from '../repositories/Ihotel.repository';
import { REDIS_HOTEL_KEY } from '../../utils/redisKey';

let service: CreateHotelService;
let hotelRepository: IHotelRepository;
let redis: { del: jest.Mock };

const createHotelDTOMock = {
  id: 1,
  name: 'Hotel Test',
  description: 'A Test Hotel description',
  image: 'http://image.url/hotel.jpg',
  price: 100,
  address: '123 Test St, Test City',
  ownerId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userIdMock = 1;

describe('CreateHotelService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateHotelService,
        {
          provide: REPOSITORY_TOKEN_HOTEL,
          useValue: {
            createHotel: jest.fn().mockResolvedValue(createHotelDTOMock),
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

    service = module.get<CreateHotelService>(CreateHotelService);
    hotelRepository = module.get<IHotelRepository>(REPOSITORY_TOKEN_HOTEL);
    redis = module.get('default_IORedisModuleConnectionToken');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete the redis key', async () => {
    const redisDelSpy = jest.spyOn(redis, 'del').mockResolvedValue(1);

    await service.execute(createHotelDTOMock, userIdMock);
    expect(redisDelSpy).toHaveBeenCalledWith(REDIS_HOTEL_KEY);
  });

  it('should create a hotel', async () => {
    const result = await service.execute(createHotelDTOMock, userIdMock);
    expect(hotelRepository.createHotel).toHaveBeenCalledWith(
      createHotelDTOMock,
      userIdMock,
    );
    expect(result).toEqual(createHotelDTOMock);
  });
});
