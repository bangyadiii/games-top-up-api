import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Role, Status, User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { SerializedUser } from './dtos/serialized-user';
import { PrismaService } from '../prisma/prisma.service';

let authService: AuthService;
let userService: UserService;
let jwtService: JwtService;
const email = 'test@example.com';
const password = 'password';
const hashedPassword =
  '$2a$12$IWPo9kRGiyi2TidPG8MGIeNC40QjiE791a472EFg8PXCF9cvRx44u'; // plain text: 'password' -> saltOrRound = 12

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

describe('AuthService', () => {
  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService }, // Menggunakan mockUserService sebagai gantinya
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService); // Akan mendapatkan mockUserService dari modul pengujian di atas
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

      const result = await authService.validateUser(email, password);
      expect(result).toEqual(user);
    });

    it('should return null if email or password is invalid', async () => {
      const wrongPassword = 'wrongpassword';

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user);

      // Case: Wrong password
      let result = await authService.validateUser(email, wrongPassword);
      expect(result).toBeNull();

      // Case: Wrong email

      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);
      result = await authService.validateUser(
        'wrongemail@example.com',
        password,
      );
      expect(result).toBeNull();
    });
  });

  it('login', async () => {
    const payload = { email: user.email, sub: user.id };
    const accessToken = 'generated-access-token';

    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(accessToken);

    const result = await authService.login(user);
    expect(result).toEqual({ access_token: accessToken });
  });
});

describe('register', () => {
  it('should throw ConflictException if email is already registered', async () => {
    const existingUser = user;

    const createUserDto: CreateUserDto = {
      email: email,
      password: 'newpassword',
      username: 'user123',
    };

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser);

    await expect(authService.register(createUserDto)).rejects.toThrowError(
      ConflictException,
    );
  });

  it('should create new user and return serialized user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'newpassword',
      username: 'user123',
    };

    const createdUser: User = {
      id: 'userid-123',
      email: createUserDto.email,
      username: 'user123',
      password: 'hashedpassword',
      status: Status.Y,
      role: Role.USER,
      passwordSalt: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const expectedSerializedUser: SerializedUser = createdUser;

    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

    const result = await authService.register(createUserDto);
    expect(result).toEqual(expectedSerializedUser);
  });
});
