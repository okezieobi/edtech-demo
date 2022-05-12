import { IsEmail, IsString } from 'class-validator';

import Fields from '.';

interface LoginFields {
    email: string;
    password: string;
}

export default class Login extends Fields implements LoginFields {
    @IsEmail()
      email!: string;

    @IsString()
      password!: string;
}

export { LoginFields };
