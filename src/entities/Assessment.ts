import {
  Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate,
} from 'typeorm';
import { IsString, IsDateString } from 'class-validator';

import AppEntity from './App';
import UserEntity from './User';
import AppError from '../errors';

@Entity()
export default class AssessmentEntity extends AppEntity {
    @Column({ type: 'text' })
    @IsString()
      title!: string;

    @Column({ type: 'text' })
    @IsString()
      description!: string;

    @ManyToOne(() => UserEntity, (mentor) => mentor.assessments)
      mentor!: UserEntity;

    @Column({ type: 'timestamptz' })
    @IsDateString()
      deadline!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    validateMentorRole() {
      if (this.mentor.role === 'student') {
        throw new AppError('Users must be admin or mentor', 'Forbidden', { msg: 'Assessment write failed, user role invalid' });
      }
    }
}
