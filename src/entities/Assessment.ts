import {
  Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany, BeforeRemove,
} from 'typeorm';
import { IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

import Main from './Main';
import User from './User';
import Submission from './Submissions';
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

    @Type(() => User)
    @ManyToOne(() => User, (mentor) => mentor.assessments)
      mentor!: User;

    @Type(() => Submission)
    @OneToMany(() => Submission, (submission) => submission.assessment, { onDelete: 'CASCADE', nullable: true })
      submissions?: Submission[];

    @Column({ type: 'timestamptz' })
    @IsDateString()
      deadline!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    validateRole(): void {
      if (this.mentor?.role === 'student') {
        throw new AppError('Users must be admin or mentor', 'Forbidden', { msg: 'Assessment write failed, user role invalid' });
      }
    }
}

export { AssessmentFields };
