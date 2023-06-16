import { PartialType } from '@nestjs/mapped-types';
import { CreateDeckBuilderDto } from './create-deck-builder.dto';

export class UpdateDeckBuilderDto extends PartialType(CreateDeckBuilderDto) {}
