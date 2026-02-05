import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResetPasswordJwtService {
  private jwt: JwtService;

  constructor() {
    this.jwt = new JwtService({
      secret: process.env.JWT_SECRET_RESET || 'defaultSecretReset',
      signOptions: { expiresIn: '2m' }, // token expira en 1 minuto
    });
  }

  // Generar token de recuperación
  generateToken(userId: number, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }

  // Verificar token de recuperación
  verifyToken(token: string) {
    try {
      // ⚠ se asegura de respetar la expiración
      const decoded = this.jwt.verify(token, { ignoreExpiration: false });
      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}
