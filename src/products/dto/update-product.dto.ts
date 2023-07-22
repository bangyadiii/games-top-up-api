import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  coinQuantity: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsUUID()
  gameId: string;

  @IsUUID()
  @IsOptional()
  coinId: string;
}
