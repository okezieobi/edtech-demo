import { Optional } from 'sequelize';
import {
  Model, Table, Column, DataType, HasMany,
  BeforeCreate, BeforeUpdate, BeforeUpsert,
} from 'sequelize-typescript';

import AppError from '../Error';
import bcrypt from '../utils/bcrypt';
import Assessment from './Assessment';
import Submission from './Submission';

interface UserFields {
  id: string;
  email: string
  name: string;
  password?: string;
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
      id!: string;

    @Column({
      allowNull: false,
      unique: true,
      type: DataType.STRING,
      validate: {
        isEmail: true,
      },
    })
      email!: string;

    @Column({
      allowNull: false,
      type: DataType.STRING,
    })
      name!: string;

    @Column({
      allowNull: false,
      type: DataType.TEXT,
    })
      password?: string;

    @Column({
      defaultValue: 'student',
      type: DataType.ENUM('student', 'admin', 'mentor'),
    })
      role!: string;

    @HasMany(() => Assessment)
      assessments!: Assessment[];

    @HasMany(() => Submission)
      submissions!: Submission[];

    @BeforeCreate
    @BeforeUpdate
    @BeforeUpsert
    async hashPassword(): Promise<void> {
      if (this.password != null) this.password = await bcrypt.hashString(this.password);
    }

    async validatePassword(password: string, param: string = 'password'): Promise<void> {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
