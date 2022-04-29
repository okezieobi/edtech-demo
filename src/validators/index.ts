import { validateOrReject } from 'class-validator';

export default class Validator {
  async validate(options: object) {
    return validateOrReject(this, options);
  }
}
