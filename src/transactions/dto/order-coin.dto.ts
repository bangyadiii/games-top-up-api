import { IsNotEmpty, IsString } from 'class-validator';

export class OrderCoinDTO {
  @IsNotEmpty()
  @IsString()
  productId;
}
