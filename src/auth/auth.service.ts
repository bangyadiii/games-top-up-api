import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { SerializedUser } from './dtos/serialized-user';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, role, passwordSalt, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async register(data: CreateUserDto) {
    const exist = await this.usersService.findByEmail(data.email);
    if (exist) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.usersService.createUser(data);
    return new SerializedUser(user);
  }
}
