import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCoinDTO {
  @IsNotEmpty()
  @IsString()
  coinName: string;

  @IsNotEmpty()
  @IsUUID()
  gameId: string;

  @IsNotEmpty()
  @IsString()
  coinIconBase64: string;
}
