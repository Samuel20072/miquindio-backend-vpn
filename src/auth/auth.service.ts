import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.Dto';
import { ForgotPasswordDto } from './forgot-password.dto';
import { ResetPasswordDto } from './reset-password.dto';
import { EmailService } from './email.service';
import { ResetPasswordJwtService } from './ResetPasswordJwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService, // JWT de login
    private emailService: EmailService,
    private resetJwtService: ResetPasswordJwtService, // JWT de reset
  ) {}
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales inválidas');

    const roleName = user.role?.nombre || 'usuario';

    const token = this.jwtService.sign(
      { sub: user.id, email: user.email, role: roleName },
      {
        secret: process.env.JWT_SECRET || 'defaultSecret',
        expiresIn: '1h',
      },
    );
    return { user, access_token: token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const resetToken = this.resetJwtService.generateToken(user.id, user.email);
    await this.emailService.sendPasswordReset(email, resetToken);

    return {
      message:
        'Se envió un correo con instrucciones para recuperar la contraseña',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      const decoded = this.resetJwtService.verifyToken(token);

      const user = await this.usersRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user) throw new NotFoundException('Usuario no encontrado');

      const hashedPassword = await bcrypt.hash(newPassword, 8);
      user.password = hashedPassword;

      await this.usersRepository.save(user);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
