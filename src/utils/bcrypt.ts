import bcrypt from 'bcrypt';

export default {
  hashString(arg: string | any) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(`${arg}`, salt);
  },

  async compareString(arg: string, hashedArg?: string) {
    return bcrypt.compare(`${arg}`, `${hashedArg}`);
  },
};
