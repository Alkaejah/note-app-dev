import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'My Important Note',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Title is required. Please provide a title.' })
  @IsString({ message: 'Please provide a valid title (text only).' })
  @MaxLength(100, { message: 'Title cannot be longer than 100 characters.' })
  readonly title!: string;

  @ApiPropertyOptional({
    description: 'The content of the note',
    example: 'This is the content of my note...',
  })
  @IsString({ message: 'Content should be text.' })
  @IsOptional()
  readonly content?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorizing the note',
    example: ['work', 'important', 'meeting'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  readonly tags?: string[];

  @ApiPropertyOptional({
    description: 'Category for the note',
    example: 'Work',
  })
  @IsString({ message: 'Category should be text.' })
  @IsOptional()
  readonly category?: string;
}
