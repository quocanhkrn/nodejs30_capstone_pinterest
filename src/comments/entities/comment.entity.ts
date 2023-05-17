import { ApiProperty } from '@nestjs/swagger/dist';

export class Comment {
  @ApiProperty()
  id: number;
  @ApiProperty()
  image_id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  created_by_id: number;
  date: Date;
  is_remove?: 'true' | 'false';
}
