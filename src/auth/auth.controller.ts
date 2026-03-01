import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return {
      message: 'User registered successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    const expiresIn = parseInt(
      process.env.JWT_COOKIE_DAYS || '1',
      10,
    );

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Logged in successfully',
      data: {
        user: result.user,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'Logged out successfully',
      data: null,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Res({ passthrough: true }) _res: Response, @Req() req: any) {
    return {
      id: req.user.userId,
      name: req.user.name,
      email: req.user.email,
    };
  }
}
