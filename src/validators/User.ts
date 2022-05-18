import {
  IsEmail, IsString, IsIn, Equals, IsNotEmpty,
} from 'class-validator';

import IsValidFields from '.';
import { UserFields } from '../models/User';

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

    @IsIn(['mentor', 'admin'], { message: 'User role must be mentor or admin', context: { errorCode: 403 }, groups: ['restricted'] })
      restricted!: string;

    @Equals('admin', { message: 'User role must be admin', context: { errorCode: 403 }, groups: ['admin'] })
      admin!: string;

    async isAdmin(user: UserFields) {
      this.admin = user.role;
      return this.validateProps({ groups: ['admin'], validationError: { target: false } });
    }

    async isRestricted(user: UserFields) {
      this.restricted = user.role;
      return this.validateProps({ groups: ['restricted'], validationError: { target: false } });
    }

    async isLogin({ email, password }: any | UserFields) {
      this.email = email;
      this.password = password;
      return this.validateProps({ validationError: { target: true }, groups: ['login'] });
    }
}

export { IsUserFields };
