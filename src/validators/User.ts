import {
  IsEmail, IsString, IsNotEmpty,
} from 'class-validator';

import IsValidFields, { UserFields } from '.';

interface IsUserFields {
    email: string;
    password: string;
}

export default class IsUser extends IsValidFields implements IsUserFields {
    @IsEmail(undefined, { context: { errorCode: 400 }, groups: ['login'] })
      email!: string;

    @IsString({ context: { errorCode: 400 }, groups: ['login'] })
    @IsNotEmpty({ context: { errorCode: 400 }, groups: ['login'] })
      password!: string;

    async isLogin({ email, password }: any | UserFields) {
      this.email = email;
      this.password = password;
      return this.validateProps({ validationError: { target: true }, groups: ['login'] });
    }
}

export { IsUserFields, UserFields };
