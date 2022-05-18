import { validateOrReject, IsNotEmpty, IsUUID } from 'class-validator';

export default class IsValidFields {
   @IsNotEmpty({ message: '$value not found', context: { errorCode: 404 }, groups: ['notFound'] })
     $target!: any;

   @IsUUID(undefined, { context: { errorCode: 400 }, groups: ['uuid'] })
     id!: string;

   async validate(options: object) {
     return validateOrReject(this, options);
   }
}
