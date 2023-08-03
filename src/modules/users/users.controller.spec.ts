import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let jwtGuard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: CacheInterceptor,
          useValue: {},
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jwtGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('profile', () => {
    it('should return the user profile', async () => {
      // Mock data untuk request.user
      const user = {
        id: 'user-1',
        username: 'user1',
        email: 'test@example.com',
        role: Role.USER,
      };

      const request = {
        user: user,
      };

      const result = await controller.getProfile(request);

      expect(result).toEqual(user);
    });
  });
});
