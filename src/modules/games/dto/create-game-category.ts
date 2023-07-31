import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
