import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Request,
  Put,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const user = await this.authService.validateUser(
        loginDto.correo,
        loginDto.password,
      );
      if (!user) throw new UnauthorizedException('Credenciales incorrectas');
      return this.authService.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw the specific UnauthorizedException from service
      }
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    const userId = req.user.userId;

    const user = await this.authService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile/address')
  async updateAddress(
    @Request() req: RequestWithUser,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const userId = req.user.userId;
    return this.authService.updateAddress(userId, updateAddressDto);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const user = await this.authService.verifyEmail(token);
    if (!user) {
      return res.redirect('http://localhost:5173/verification-failed');
    }
    return res.redirect('http://localhost:5173/verification-success');
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get('users')
  async getUsers() {
    return this.authService.findAllUsers();
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.authService.updateUserRole(id, role);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put('users/:id/ban')
  async updateUserBanStatus(
    @Param('id') id: string,
    @Body('isBanned') isBanned: boolean,
  ) {
    return this.authService.updateUserBanStatus(id, isBanned);
  }
}
