import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import Request from 'supertest';

jest.mock('ioredis', () => {
  const mRedis = jest.fn().mockImplementation(() => ({
    del: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(JSON.stringify([{ key: 'mock-value' }])),
    quit: jest.fn().mockResolvedValue(null),
  }));
  return { __esModule: true, default: mRedis, Redis: mRedis };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let redisClient: Redis;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    redisClient = new Redis();
    prisma = app.get(PrismaService);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@localhost',
        password: 'admin',
        role: Role.ADMIN,
      },
    });
    const normalUser = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@localhost',
        password: 'user',
        role: Role.USER,
      },
    });

    adminToken = jwt.sign(
      { sub: adminUser.id, role: Role.ADMIN },
      process.env.JWT_SECRET!,
      {
        issuer: 'dnc_hotel',
        audience: 'users',
        expiresIn: 60 * 60 * 24,
      },
    );

    userToken = jwt.sign(
      { sub: normalUser.id, role: Role.USER },
      process.env.JWT_SECRET!,
      {
        issuer: 'dnc_hotel',
        audience: 'users',
        expiresIn: 60 * 60 * 24,
      },
    );
  });

  afterAll(async () => {
    await prisma.hotel.deleteMany({});
    await prisma.reservation.deleteMany({});
    await prisma.user.deleteMany({});
    await redisClient.quit();
    await app.close();
  });

  it('/hotels GET', async () => {
    const response = await Request(app.getHttpServer())
      .get('/hotels')
      .set('Authorization', `Bearer ${userToken}`).expect(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
  });
});
