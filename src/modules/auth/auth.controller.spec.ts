import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JsonResponse } from 'src/shared/Interfaces/JsonResponse';
import {
  HttpStatus,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { SerializedUser } from './dtos/serialized-user';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JsonResponse with user payload', async () => {
      const user = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
      };
      const payload = { access_token: 'generated-access-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(payload);
      const request = { user: user };

      const result = await controller.login(request);

      const expectedResponse: JsonResponse<typeof payload> = {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: payload,
      };
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());
      const request = { user: null };

      try {
        await controller.login(request);
        fail('Expected UnauthorizedException to be thrown.');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('register', () => {
    it('should return a JsonResponse with user data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
        username: 'testuser',
      };
      const data = {
        id: 'user-1',
        username: 'testuser',
        email: 'test@example.com',
      };
      jest
        .spyOn(authService, 'register')
        .mockResolvedValue(new SerializedUser(data));

      const result = await controller.register(createUserDto);

      const expectedResponse: JsonResponse<typeof data> = {
        statusCode: HttpStatus.CREATED,
        message: 'CREATED',
        data: data,
      };
      expect(result).toEqual(expectedResponse);
    });

    it('should throw ConflictException if registration fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
        username: 'testuser',
      };
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new ConflictException());

      try {
        await controller.register(createUserDto);
        fail('Expected ConflictException to be thrown.');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });
});
