import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  gameCategoryId;

  @IsNotEmpty()
  @IsString()
  gameThumbnailPath: string;
}
