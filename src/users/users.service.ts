import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { Role, Status, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly dbService: PrismaService,
  ) {}

  async findById(id: string) {
    let user = await this.cacheManager.get<User | undefined>(id);
    if (!user) {
      user = await this.dbService.user.findUnique({
        where: { id },
      });
      await this.cacheManager.set(id, user, 1 * 1000);
    }

    return user || null;
  }
  async findByEmail(email: string) {
    let user = await this.cacheManager.get<User | undefined>(email);
    if (!user) {
      user = await this.dbService.user.findUnique({
        where: { email },
      });
      await this.cacheManager.set(email, user, 1 * 1000);
    }

    return user || null;
  }

  async createUser(payload: CreateUserDto) {
    // Hash password
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(payload.password, salt);

    return await this.dbService.user.create({
      data: {
        email: payload.email,
        password: hash,
        passwordSalt: salt,
        role: Role.USER,
        status: Status.Y,
        username: payload.username,
      },
    });
  }
}
