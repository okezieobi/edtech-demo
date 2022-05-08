import {
  Entity, Column, OneToOne,
} from 'typeorm';
import { } from 'class-validator';
import { Type } from 'class-transformer';

import AppEntity from './App';
import SubmissionEntity from './Submissions';

@Entity()
export default class GradeEntity extends AppEntity {
    @Column({ type: 'text' })
      mark!: string;

    @Column({ type: 'text' })
      remarks!: string;

    @Type(() => SubmissionEntity)
    @OneToOne(() => SubmissionEntity, (submission) => submission.grade)
      submission!: SubmissionEntity;
}
