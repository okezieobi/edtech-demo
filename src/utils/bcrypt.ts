import bcrypt from 'bcrypt';

export default {
  async hashString(arg: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(`${arg}`, salt);
  },

  async compareString(arg: string, hashedArg: string) {
    return bcrypt.compare(`${arg}`, `${hashedArg}`);
  },
};
