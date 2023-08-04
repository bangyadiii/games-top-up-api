import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SerializedUser } from './dtos/serialized-user';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if email and password are valid', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'USER',
      };
      jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(new SerializedUser(user));

      const result = await localStrategy.validate(email, password);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if email or password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      try {
        await localStrategy.validate(email, password);
        fail('Expected UnauthorizedException to be thrown.');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
