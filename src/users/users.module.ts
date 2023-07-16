import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { UserController } from '../user/user.controller';
import { UserController } from './users.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
