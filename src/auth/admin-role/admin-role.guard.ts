import {
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AdminRoleGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AdminRoleGuard.name);

  constructor(private readonly userService: UserService) {
    super();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (user.role !== Role.ADMIN) throw new ForbiddenException();

    return user;
  }
}
