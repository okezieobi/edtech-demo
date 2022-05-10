import {
  Entity, Column, OneToOne,
} from 'typeorm';
import { } from 'class-validator';
import { Type } from 'class-transformer';

import MainEntity from './Main';
import SubmissionEntity from './Submissions';

@Entity()
export default class GradeEntity extends MainEntity {
    @Column({ type: 'text' })
      mark!: string;

    @Column({ type: 'text' })
      remarks!: string;

    @Type(() => SubmissionEntity)
    @OneToOne(() => SubmissionEntity, (submission) => submission.grade)
      submission!: SubmissionEntity;
}
