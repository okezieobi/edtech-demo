import bcrypt from 'bcrypt';

export default {
    async hashString(arg: string | any) {
        const salt = bcrypt.genSaltSync();
        return bcrypt.hash(`${arg}`, salt);
    },

    async compareString(arg: string, hashedArg: string, param: string) {
        const isValid = await bcrypt.compare(`${arg}`, `${hashedArg}`);
        if (!isValid) {
            const error = new Error(`${param} is not a match`);
            error.name = `${param}Error`;
            throw error;
        }
    },
};
