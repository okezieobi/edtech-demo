import { Optional } from 'sequelize';
import {
  Model, Table, Column, DataType, HasMany,
} from 'sequelize-typescript';

import AppError from '../Error';
import bcrypt from '../utils/bcrypt';
import Assessment from './Assessment';
import Submission from './Submission';

interface UserFields {
  id: string;
  email: string
  name: string;
  password: string | undefined ;
  role: string;
}

interface UserCreationFields extends Optional<UserFields, 'id'> { }

@Table({
  timestamps: true,
  paranoid: true,
})
export default class User extends Model<UserFields, UserCreationFields> {
    @Column({
      type: DataType.UUID,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
    })
  declare id: string;

    @Column({
      allowNull: false,
      unique: true,
      type: DataType.STRING,
      validate: {
        isEmail: true,
      },
    })
    declare email: string;

    @Column({
      allowNull: false,
      type: DataType.STRING,
    })
    declare name: string;

    @Column({
      allowNull: false,
      type: DataType.TEXT,
      set(val) {
        this.setDataValue('password', bcrypt.hashString(val));
      },
    })
    declare password?: string;

    @Column({
      defaultValue: 'student',
      type: DataType.ENUM('student', 'admin', 'mentor'),
    })
    declare role: string;

    @HasMany(() => Assessment)
    declare assessments?: Assessment[];

    @HasMany(() => Submission)
    declare submissions?: Submission[];

    async validatePassword(password: string, param: string = 'password'): Promise<void> {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}

export { UserFields };
