import { Exclude } from 'class-transformer';

export class SerializedUser {
  id: string;

  email: string;

  username: string;

  status: string;
  role: string;

  @Exclude()
  password: string;

  @Exclude()
  passwordSalt: string;

  updatedAt: Date;

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
