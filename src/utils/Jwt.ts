import jwt from 'jsonwebtoken';

import Env from './Env';

interface JwtInterface {
    jwt?: typeof jwt;
}

export default class Jwt implements JwtInterface {
  jwt: typeof jwt;

  constructor(jsonwebtoken = jwt) {
    this.jwt = jsonwebtoken;
    this.verify = this.verify.bind(this);
    this.generate = this.generate.bind(this);
  }

  async generate(id: string): Promise<string> {
    const { jwtSecret } = new Env();
    return this.jwt.sign({
      id,
    }, jwtSecret ?? '', {
      expiresIn: '3d',
    });
  }

  async verify(token: string): Promise<string | jwt.JwtPayload> {
    const { jwtSecret } = new Env();
    return this.jwt.verify(token, jwtSecret ?? '');
  }
}
