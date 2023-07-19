import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;
}
