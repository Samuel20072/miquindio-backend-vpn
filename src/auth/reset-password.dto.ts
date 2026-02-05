// src/auth/dto/reset-password.dto.ts
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255, { message: 'La contraseña debe tener almenos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe incluir mayúscula, minúscula, número y caracter especial',
  })
  newPassword: string;
}
