import {
  Entity, Column, BeforeInsert, BeforeUpdate,
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
     email: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      name: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      password: string;

    @Column({ type: 'text' })
    @IsString()
    @IsIn(['student', 'mentor', 'admin'])
      role: string;

    @OneToMany(() => AssessmentEntity, (assessment) => assessment.mentor, { onDelete: 'CASCADE' })
      assessments: AssessmentEntity[];

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

    constructor(
      id: string,
      email: string,
      name: string,
      password: string,
      assessments: AssessmentEntity[],
      createdAt: Date,
      updatedAt: Date,
      role: string = 'student',
    ) {
      super(id, createdAt, updatedAt);
      this.email = email;
      this.name = name;
      this.role = role;
      this.password = password;
      this.assessments = assessments;
    }
}
