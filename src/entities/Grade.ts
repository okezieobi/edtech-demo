import {
  Entity, Column, OneToOne, BeforeInsert, BeforeRemove, BeforeUpdate,
} from 'typeorm';
import { } from 'class-validator';
import { Type } from 'class-transformer';

import Main from './Main';
import SubmissionEntity from './Submissions';
import AppError from '../errors';

interface GradeFields {
  mark: string;
  remarks: string;
}

@Entity()
export default class GradeEntity extends Main implements GradeFields {
    @Column({ type: 'text' })
      mark!: string;

    @Column({ type: 'text' })
      remarks!: string;

    @Type(() => SubmissionEntity)
    @OneToOne(() => SubmissionEntity, (submission) => submission.grade)
      submission!: SubmissionEntity;

   @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    validateRole(): void {
      if (this.submission.assessment.mentor.role === 'student') {
        throw new AppError('Only mentors or admins can write to this data, user role is student', 'Forbidden', { msg: 'Grade write failed, user role is student' });
      }
    }
}

export { GradeFields };
