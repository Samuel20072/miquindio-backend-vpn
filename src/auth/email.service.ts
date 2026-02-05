import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPasswordReset(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL;
    const url = `${frontendUrl}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Mi Quindio 👋" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      html: `
      <h2>Recupera tu contraseña</h2>
      <p>Haz clic en este enlace para resetear tu contraseña:</p>
      <a href="${url}">${url}</a>
      <br/><br/>
      <small>Este enlace expira en 2 minutos.</small>
    `,
    });
  }
}
