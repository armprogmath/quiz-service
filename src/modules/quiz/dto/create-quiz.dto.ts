import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateQuizDto {
  @ApiProperty({
    example: 'General Knowledge', description: 'Quiz title'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'A short description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 60,
    description: 'Time limit in seconds (optional)'
  })
  @IsOptional()
  @IsNumber()
  timeLimit?: number;
}
