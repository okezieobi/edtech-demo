import { IsUUID } from 'class-validator';

import Validator from '.';

interface IdParam {
    id: string;
}

export default class IdValidator extends Validator implements IdParam {
    @IsUUID()
      id: string;

    constructor(id: string) {
      super();
      this.id = id;
    }
}
