import {
  IsEmail, IsString, IsIn, Equals, IsNotEmpty,
} from 'class-validator';

import IsValidFields from '.';

interface IsUserFields {
    email: string;
    password: string;
}

export default class IsUser extends IsValidFields implements IsUserFields {
    @IsEmail(undefined, { context: { errorCode: 400 }, groups: ['login'] })
      email!: string;

    @IsNotEmpty({ message: 'User not found', context: { errorCode: 401 }, groups: ['userNotFound'] })
      $exists!: any;

    @IsString({ context: { errorCode: 400 }, groups: ['login'] })
    @IsNotEmpty({ context: { errorCode: 400 }, groups: ['login'] })
      password!: string;

    @IsIn(['mentor', 'admin'], { message: 'User role must be mentor or admin', context: { errorCode: 403 }, groups: ['restricted'] })
      restricted!: string;

    @Equals('admin', { message: 'User role must be admin', context: { errorCode: 403 }, groups: ['admin'] })
      admin!:string;
}

export { IsUserFields };
