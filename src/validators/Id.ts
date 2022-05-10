import { IsUUID } from 'class-validator';

import Validator from '.';

export default class IdValidator extends Validator {
    @IsUUID()
      id!: string;
}
