import { IsUUID } from 'class-validator';

import Fields from '.';

export default class Id extends Fields {
    @IsUUID()
      id!: string;
}
