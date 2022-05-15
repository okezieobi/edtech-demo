import {
  Entity, Column, BeforeInsert, BeforeUpdate,
  OneToMany,
} from 'typeorm';
import {
  IsEmail, IsNotEmpty, IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

import Main from './Main';
import Assessment from './Assessment';
import Submission from './Submissions';
import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

interface UserFields {
  email: string
  name: string;
  password?: string;
  role?: string;
}

@Entity()
export default class User extends Main implements UserFields {
   @Column({ unique: true, type: 'text' })
    @IsEmail()
     email!: string;

    @Column({ type: 'text' })
    @IsString()
      name!: string;

    @Column({ select: false, type: 'text' })
    @IsString()
    @IsNotEmpty()
      password?: string;

    @Column({ type: 'enum', default: 'student', enum: ['student', 'admin', 'mentor'] })
      role!: string;

    @Type(() => Assessment)
    @OneToMany(() => Assessment, (assessment) => assessment.mentor, { nullable: true, onDelete: 'CASCADE' })
      assessments?: Assessment[];

    @Type(() => Submission)
    @OneToMany(() => Submission, (submission) => submission.student, { onDelete: 'CASCADE', nullable: true })
      submissions?: Submission[];

    @BeforeInsert()
    @BeforeUpdate()
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

export { UserFields };
