import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role, Status, User } from '@prisma/client';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user object if user is found', async () => {
      const payload = { sub: 'user-1' };
      const user: User = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        passwordSalt: 'salt',
        role: Role.USER,
        status: Status.Y,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(userService, 'findById').mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const payload = { sub: 'user-1' };
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      try {
        await jwtStrategy.validate(payload);
        fail('Expected UnauthorizedException to be thrown.');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
