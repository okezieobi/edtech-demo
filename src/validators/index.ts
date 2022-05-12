import { validateOrReject } from 'class-validator';

export default class Fields {
  async validate(options: object) {
    return validateOrReject(this, options);
  }
}
