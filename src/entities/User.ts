import {
  Entity, Column, BeforeInsert, BeforeUpdate, JoinTable,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsIn, IsString } from 'class-validator';

import AppEntity from './Base';
import AssessmentEntity from './Assessment';
import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity extends AppEntity {
   @Column({ unique: true, type: 'text', nullable: false })
    @IsEmail()
     email!: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      name!: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      password!: string;

    @Column({ type: 'text' })
    @IsIn(['student', 'mentor', 'admin'])
      role?: string = 'student';

    @OneToMany(() => AssessmentEntity, (assessment) => assessment.mentor, { onDelete: 'CASCADE' })
    @JoinTable()
      assessments?: AssessmentEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this.password != null) this.password = await bcrypt.hashString(this.password);
    }

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
