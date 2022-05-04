import { IsEmail, IsString } from 'class-validator';

import Validator from '.';

interface LoginParams {
    email: string;
    password: string;
}

export default class LoginValidator extends Validator implements LoginParams {
    @IsEmail()
      email!: string;

    @IsString()
      password!: string;
}

export { LoginParams };
