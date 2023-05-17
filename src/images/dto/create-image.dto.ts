import { ApiProperty } from '@nestjs/swagger/dist';

export class CreateImageDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  file_name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  created_by_id: number;
}
