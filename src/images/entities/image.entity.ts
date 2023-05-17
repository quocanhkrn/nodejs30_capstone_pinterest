import { ApiProperty } from '@nestjs/swagger';

export class Image {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  file_name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  created_by_id: number;
  @ApiProperty()
  is_remove?: 'true' | 'false';
}
