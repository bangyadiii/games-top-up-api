import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;
}
