import { IsUUID, IsOptional } from 'class-validator';

import Validator from '.';

interface OptionalUserParam {
    user?: string;
}

export default class OptionUserValidator extends Validator implements OptionalUserParam {
  @IsUUID()
  @IsOptional()
    user?: string;

  constructor(user?: string) {
    super();
    this.user = user;
  }
}

export { OptionalUserParam };
