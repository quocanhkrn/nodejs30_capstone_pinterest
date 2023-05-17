import { ApiProperty } from '@nestjs/swagger/dist';

export class CreateCommentDto {
  @ApiProperty()
  image_id: number;
  @ApiProperty()
  content: string;
  @ApiProperty()
  created_by_id: number;
  date: any;
}
