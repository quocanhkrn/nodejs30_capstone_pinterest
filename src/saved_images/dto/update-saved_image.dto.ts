import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedImageDto } from './create-saved_image.dto';

export class UpdateSavedImageDto extends PartialType(CreateSavedImageDto) {}
