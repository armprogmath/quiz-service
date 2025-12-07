import { UserRoleEnum } from '@app/common/enums/user.role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  @ApiProperty({
    description: 'choose role',
    enum: UserRoleEnum,
    example: UserRoleEnum.Admin || UserRoleEnum.Manager
  })
  role: UserRoleEnum;
}
