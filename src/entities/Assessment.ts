import {
  Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany, BeforeRemove,
} from 'typeorm';
import { IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

import Main from './Main';
import UserEntity from './User';
import SubmissionEntity from './Submissions';
import AppError from '../errors';

interface AssessmentFields {
  title: string;
  description: string,
  deadline: Date,
}

@Entity()
export default class Assessment extends Main implements AssessmentFields {
    @Column({ type: 'text' })
    @IsString()
      title!: string;

    @Column({ type: 'text' })
    @IsString()
      description!: string;

    @Type(() => UserEntity)
    @ManyToOne(() => UserEntity, (mentor) => mentor.assessments)
      mentor!: UserEntity;

    @Type(() => SubmissionEntity)
    @OneToMany(() => SubmissionEntity, (submission) => submission.assessment, { onDelete: 'CASCADE', nullable: true })
      submissions?: SubmissionEntity[];

    @Column({ type: 'timestamptz' })
    @IsDateString()
      deadline!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    validateRole(): void {
      if (this.mentor.role === 'student') {
        throw new AppError('Users must be admin or mentor', 'Forbidden', { msg: 'Assessment write failed, user role invalid' });
      }
    }
}

export { AssessmentFields };
