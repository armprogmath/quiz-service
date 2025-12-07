import { IsArray, IsInt, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsArray()
  @ArrayMinSize(2)
  options: string[];

  @IsInt()
  correct_option_index: number;
}
