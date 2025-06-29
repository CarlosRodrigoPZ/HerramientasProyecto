/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: Transporter;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'mail.foroul.com',
      port: 465,
      secure: true,
      auth: {
        user: 'LuxuryStore@foroul.com',
        pass: '2tfQk9I3d%eC',
      },
    } as any);
  }

  async register(registerDto: {
    nombre: string;
    apellidos: string;
    pais: string;
    telefono: string;
    correo: string;
    password: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate a simple email verification token (in real app use a better token)
    const emailVerificationToken = Math.random().toString(36).substring(2, 15);

    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
      role: 'user',
      emailVerified: false,
      emailVerificationToken,
      address: {
        street: registerDto.street,
        city: registerDto.city,
        state: registerDto.state,
        postalCode: registerDto.postalCode,
        country: registerDto.country,
      },
    });

    // Send verification email
    const verificationLink = `http://localhost:3000/auth/verify-email/${emailVerificationToken}`;
    const mailOptions = {
      from: '"LuxuryStore" <LuxuryStore@foroul.com>',
      to: user.correo,
      subject: 'Verificación de correo electrónico',
      text: `Por favor, verifica tu correo electrónico haciendo click en el siguiente enlace: ${verificationLink}`,
      html: `<p>Por favor, verifica tu correo electrónico haciendo click en el siguiente enlace: <a href="${verificationLink}">Activar mi cuenta</a></p>`,
    };

    void this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error al enviar correo de verificación:', error);
      }
      console.log('Correo de verificación enviado:', info.response);
    });

    return this.generateToken(user);
  }

  async validateUser(
    correo: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ correo }).select('+password');
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.emailVerified) {
        throw new UnauthorizedException('Por favor, verifica tu correo electrónico para iniciar sesión.');
      }
      if (user.isBanned) {
        throw new UnauthorizedException('Tu cuenta ha sido baneada.');
      }
      return user;
    }
    return null;
  }

  generateToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      correo: user.correo,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUserById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      return null;
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    await user.save();
    return user;
  }

  async findAllUsers() {
    return this.userModel.find().select('-password').exec();
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.role = role;
    await user.save();
    return user;
  }

  async updateUserBanStatus(id: string, isBanned: boolean) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.isBanned = isBanned;
    await user.save();
    return user;
  }

  async updateAddress(id: string, address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.address = { ...user.address, ...address };
    await user.save();
    return user;
  }
}
