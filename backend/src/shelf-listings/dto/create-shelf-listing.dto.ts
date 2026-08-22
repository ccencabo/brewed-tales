import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsString,
  Length,
  MaxLength,
  Max,
  Min,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

const coverColors = [
  'bg-primary',
  'bg-sage',
  'bg-dusty-rose',
  'bg-accent',
  'bg-warm',
] as const;

export class CreateShelfListingDto {
  @IsIn(coverColors)
  coverColor!: string;

  @IsString()
  @MaxLength(16)
  emoji!: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @Length(5, 180, { each: true })
  hooks!: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publicationYear?: number;

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  ingredients!: string[];
}
