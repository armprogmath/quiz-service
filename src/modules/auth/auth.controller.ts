import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() regiserDto: RegisterDto) {
    return this.auth.register(regiserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.auth.login(loginDto);
  }
}
