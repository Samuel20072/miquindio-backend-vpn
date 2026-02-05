import {
  Length,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNotEmpty({ message: 'El Email es obligatorio' })
  @IsEmail()
  email: string;

  @Length(8, 255, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe incluir mayúscula, minúscula, número y caracter especial',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  remember_token?: boolean;
}
