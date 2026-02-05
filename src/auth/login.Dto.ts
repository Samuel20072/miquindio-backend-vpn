import {Length, IsEmail, IsNotEmpty, IsString,Matches } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: 'El Email es obligatorio' }) 
  @IsString()
  @IsEmail()
  email: string;

  @Length(8, 255, { message: 'La contraseña debe tener almenos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial',
  })
  password: string;
}
  