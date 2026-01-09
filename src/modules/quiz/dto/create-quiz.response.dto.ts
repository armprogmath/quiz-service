import {ApiProperty} from "@nestjs/swagger";

export class CreateQuizResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'General Knowledge' })
    title: string;

    @ApiProperty({ example: 'A short description' })
    description: string;

    @ApiProperty({ example: 60 })
    timeLimit: number;

    @ApiProperty({ example: '2025-12-08T12:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2025-12-08T12:00:00.000Z' })
    updatedAt: string;
}