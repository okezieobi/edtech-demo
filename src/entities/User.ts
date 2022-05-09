import {
  Entity, Column, BeforeInsert, BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import AppEntity from './App';
import AssessmentEntity from './Assessment';
import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity extends AppEntity {
   @Column({ unique: true, type: 'text' })
    @IsEmail()
     email!: string;

    @Column({ type: 'text' })
    @IsString()
      name!: string;

    @Column({ select: false, type: 'text' })
    @IsString()
      password?: string;

    @Column({ type: 'text' })
    @IsIn(['student', 'mentor', 'admin'])
      role?: string = 'student';

    @Type(() => AssessmentEntity)
    @OneToMany(() => AssessmentEntity, (assessment) => assessment.mentor, { nullable: true, onDelete: 'CASCADE' })
      assessments?: AssessmentEntity[];

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
