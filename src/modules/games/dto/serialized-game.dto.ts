import { Product } from '@prisma/client';

export class SerializedGame {
  id: string;

  name: string;

  thumbnail: string;

  updatedAt: Date;

  createdAt: Date;

  products: Product[];

  constructor(partial: Partial<SerializedGame>) {
    Object.assign(this, partial);
  }
}
