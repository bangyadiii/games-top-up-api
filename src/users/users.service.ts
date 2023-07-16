import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/CreateUserDTO';
import { Role, Status, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly dbService: PrismaService,
  ) {}

  async findByEmail(email: string) {
    let user = (await this.cacheManager.get(email)) as User | undefined;
    if (!user) {
      user = await this.dbService.user.findUnique({
        where: {
          email: email,
        },
      });

      await this.cacheManager.set(email, user, 1 * 1000);
    }

    if (user === null) {
      return null;
    }

    return user;
  }

  async createUser(payload: CreateUserDto) {
    // Hash password
    const hash = await bcrypt.hash(payload.password, saltOrRounds);

    return await this.dbService.user.create({
      data: {
        email: payload.email,
        password: hash,
        role: Role.USER,
        status: Status.Y,
        username: payload.username,
      },
    });
  }
}
