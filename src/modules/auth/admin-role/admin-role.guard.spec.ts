import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminRoleGuard } from './admin-role.guard';

describe('AdminRoleGuard', () => {
  let guard: AdminRoleGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRoleGuard],
    }).compile();

    guard = module.get<AdminRoleGuard>(AdminRoleGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return user if user has admin role', () => {
    const user = { role: Role.ADMIN };

    const result = guard.handleRequest(null, user, null);

    expect(result).toBe(user);
  });

  it('should throw ForbiddenException if user does not have admin role', () => {
    const user = { role: Role.USER }; // User role bukan ADMIN

    try {
      guard.handleRequest(null, user, null);
      // Jika handleRequest tidak melempar exception, maka test gagal
      fail('Expected ForbiddenException to be thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should throw UnauthorizedException if user is null', () => {
    try {
      guard.handleRequest(null, null, null);
      // Jika handleRequest tidak melempar exception, maka test gagal
      fail('Expected UnauthorizedException to be thrown.');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should throw UnauthorizedException if there is an error', () => {
    const error = new Error('Some error');

    try {
      guard.handleRequest(error, null, null);
      // Jika handleRequest tidak melempar exception, maka test gagal
      fail('Expected UnauthorizedException to be thrown.');
    } catch (thrownError) {
      expect(thrownError).toBe(error);
    }
  });
});
