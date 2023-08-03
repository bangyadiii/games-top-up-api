import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Role, Status, User } from '@prisma/client';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

const email = 'test@example.com';
const password = 'password';
const hashedPassword =
  '$2a$12$IWPo9kRGiyi2TidPG8MGIeNC40QjiE791a472EFg8PXCF9cvRx44u'; // plain text: 'password' -> saltOrRound = 12

describe('UserService', () => {
  let userService: UserService;
  let cacheService: Cache;
  let prismaService: Partial<PrismaService>;
  const user: User = {
    id: 'user-1',
    username: 'user1',
    email: email,
    password: hashedPassword,
    role: Role.USER,
    passwordSalt: '',
    status: Status.Y,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    const mockBcrypt = {
      genSalt: jest.fn(),
      hash: jest.fn(),
    };

    userService = module.get<UserService>(UserService);
    cacheService = module.get<Cache>(CACHE_MANAGER);
    prismaService = module.get<Partial<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user if email exists in the cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(user);
      const result = await userService.findByEmail(email);
      expect(result).toBeDefined();
      expect(result?.email).toBe(email);
    });

    it('should return user if email doesnt exists in the cache but exists in the database', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(undefined);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      const result = await userService.findByEmail(email);
      expect(result).toBeDefined();
      expect(result?.email).toBe(email);
    });

    it('should return null if email does not exist in the database', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      const nonExistentEmail = 'non-existent-email@example.com';
      const user = await userService.findByEmail(nonExistentEmail);
      expect(user).toBeNull();
    });
  });
  // findById
  describe('findById', () => {
    it('should return user if userId exists in the cache', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(user);
      const result = await userService.findById(user.id);
      expect(result).toBeDefined();
      expect(result?.email).toBe(email);
    });

    it('should return user if user id doesnt exists in the cache but exists in the database', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(undefined);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      const result = await userService.findById(user.id);
      expect(result).toBeDefined();
      expect(result).toBe(user);
    });

    it('should return null if user id does not exist in the database', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      const nonExistentUserId = 'nonexisting-user-id';
      const user = await userService.findByEmail(nonExistentUserId);
      expect(user).toBeNull();
    });
  });

  //createUser
  describe('createUser', () => {
    it('should create a new user and return the user data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
        username: 'user123',
      };
      const salt = 'generated-salt' as never;
      const hash = 'generated-hash' as never;

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce(salt);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hash);

      const createdUser: User = {
        id: 'userid-123',
        email: createUserDto.email,
        username: createUserDto.username,
        password: hash,
        status: Status.Y,
        role: Role.USER,
        passwordSalt: salt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

      const result = await userService.createUser(createUserDto);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: createdUser.password, // Perhatikan bahwa kami menggunakan hasil hash dari bcrypt
          passwordSalt: createdUser.passwordSalt,
          role: Role.USER,
          status: Status.Y,
          username: createUserDto.username,
        },
      });

      // Pastikan hasil yang di-return oleh function createUser sesuai dengan hasil mock createdUser
      expect(result).toEqual(createdUser);
    });
  });
});
