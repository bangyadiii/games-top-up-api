import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUserDTO';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, role, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async register(data: CreateUserDto) {
    const exist = await this.usersService.findByEmail(data.email);
    if (exist) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.usersService.createUser(data);
    const { password, ...result } = user;
    return result;
  }
}
