import { ApiProperty } from '@nestjs/swagger/dist';

export class CreateSavedImageDto {
  @ApiProperty()
  image_id: number;
  @ApiProperty()
  saved_by_id: number;
}
