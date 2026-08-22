import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

const coverColors = [
  'bg-primary',
  'bg-sage',
  'bg-dusty-rose',
  'bg-accent',
  'bg-warm',
  'bg-washi-pink/10',
  'bg-washi-mint/10',
  'bg-washi-gold/10',
] as const;

export class CreateSavedBookDto {
  @IsString()
  @MaxLength(255)
  externalBookId!: string;

  @IsString()
  @Length(1, 300)
  title!: string;

  @IsString()
  @Length(1, 200)
  author!: string;

  @IsString()
  @MaxLength(16)
  emoji!: string;

  @IsIn(coverColors)
  coverColor!: string;

  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'coverUrl must be a valid URL' })
  @MaxLength(1000)
  coverUrl?: string;

  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsString({ each: true })
  @Length(1, 500, { each: true })
  clues!: string[];

  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  ingredients!: string[];
}
