import { UserRoleEnum } from '@app/common/enums/user.role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Qwerty123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'choose role',
    enum: UserRoleEnum,
    example: UserRoleEnum.Admin
  })
  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum;
}
