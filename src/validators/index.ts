import {
  validateOrReject, IsUUID, isEmpty, ValidationError, IsIn, Equals,
} from 'class-validator';

import User, { UserFields } from '../models/User';

export default abstract class IsValidFields {
  property: string;

  model: { User: typeof User };

   @IsIn(['mentor', 'admin'], { message: 'User role must be mentor or admin', groups: ['restricted'] })
     user_role!: string;

    @Equals('admin', { message: 'User role must be admin', groups: ['admin'] })
      'user.role'!: string;

   @IsUUID(undefined, { message: 'Invalid uuid', groups: ['uuid'] })
     id!: string;

   constructor(model: any, property: string) {
     this.property = property;
     this.model = model;
     this.isFound = this.isFound.bind(this);
     this.isUUID = this.isUUID.bind(this);
     this.validateProps = this.validateProps.bind(this);
   }

   async isAdmin(user: UserFields) {
     this['user.role'] = user.role;
     return this.validateProps(
       { groups: ['admin'], validationError: { target: false } },
       403,
     );
   }

   async isRestricted(user: UserFields) {
     this.user_role = user.role;
     return this.validateProps(
       { groups: ['restricted'], validationError: { target: false } },
       403,
     );
   }

   async isUUID(id: string, target: boolean = true) {
     this.id = id;
     return this.validateProps(
       { groups: ['uuid'], validationError: { target }, forbidUnknownValues: true },
     );
   }

   async validateProps(options: object, errorCode: number = 400) {
     await validateOrReject(this, options)
       .catch((err) => {
         const error = { ...err, errorCode };
         throw error;
       });
   }

   async isFound(arg: any) {
     if (isEmpty(arg)) {
       const err = new ValidationError();
       err.contexts = { errorCode: 404, message: `${this.property} not found` };
       err.property = this.property;
       err.constraints = { type: `${this.property} is null or undefined` };
       throw err;
     }
   }
}

export { UserFields };
