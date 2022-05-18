import {
  validateOrReject, IsUUID, isEmpty, ValidationError,
} from 'class-validator';

export default class IsValidFields {
  property: string;

  constructor(property: string) {
    this.property = property;
    this.isFound = this.isFound.bind(this);
    this.isUUID = this.isUUID.bind(this);
    this.validateProps = this.validateProps.bind(this);
  }

   @IsUUID(undefined, { context: { errorCode: 400 }, groups: ['uuid'] })
     id!: string;

   async isUUID(id: string, target: boolean = true) {
     this.id = id;
     return this.validateProps({ groups: ['uuid'], validationError: { target }, forbidUnknownValues: true });
   }

   async validateProps(options: object) {
     return validateOrReject(this, options);
   }

   async isFound(arg: any) {
     if (isEmpty(arg)) {
       const err = new ValidationError();
       err.contexts = { errorCode: 404 };
       err.property = this.property;
       err.constraints = { type: `${this.property} not found` };
       throw err;
     }
   }
}
