import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      console.log(request.user);
      const { id } = request.user;
      const user = this.userService.findById(id);
      return (await user).role == Role.ADMIN;
    }

    return false;
  }
}
