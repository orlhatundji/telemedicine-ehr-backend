import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('hospital/login')
  hospitalLogin(@Body() signInDto: { email: string; password: string }) {
    return this.authService.hospitalSignIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard)
  @Get('user')
  getUser(@Req() { user }) {
    return user;
  }
}
