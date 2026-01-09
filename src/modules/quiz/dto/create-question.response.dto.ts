import {ApiProperty} from "@nestjs/swagger";

export class CreateQuestionResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'What is 2 + 2?', description: 'Question text' })
    question_text: string;

    @ApiProperty({
        example: ['1', '2', '3', '4'],
        description: 'Array of possible answer options',
        type: [String]
    })
    options: string[];

    @ApiProperty({ example: 3, description: 'Index of the correct option (0-based)' })
    correct_option_index: number;

    @ApiProperty({ example: '2025-12-08T12:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2025-12-08T12:00:00.000Z' })
    updatedAt: string;
}