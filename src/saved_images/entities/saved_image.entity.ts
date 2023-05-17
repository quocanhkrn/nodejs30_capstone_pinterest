import { ApiProperty } from '@nestjs/swagger';

export class SavedImage {
  @ApiProperty()
  id: number;
  @ApiProperty()
  image_id: number;
  @ApiProperty()
  saved_by_id: number;
  @ApiProperty()
  is_remove?: 'true' | 'false';
}
