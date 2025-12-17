import { IsArray, IsInt, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateQuestionDto {
  @ApiProperty({
    description: 'The text of the question',
    example: 'What is 2 + 2?',
  })
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ApiProperty({
    description: 'Possible answer options for the question',
    example: ['1', '2', '3', '4'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(2)
  options: string[];

  @ApiProperty({
    description: 'Index of the correct option in the options array (0-based)',
    example: 3,
  })
  @IsInt()
  correct_option_index: number;
}