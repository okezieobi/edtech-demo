import {
  Entity, Column, ManyToOne, CreateDateColumn, OneToOne,
} from 'typeorm';
import {
  IsArray, ValidateNested, IsUrl, ArrayMaxSize, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import AppEntity from './App';
import AssessmentEntity from './Assessment';
import GradeEntity from './Grade';

@Entity()
export default class SubmissionEntity extends AppEntity {
    @IsArray()
    @ArrayMaxSize(6)
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => IsUrl)
    @Column('text', { array: true })
      links!: Array<string>;

    @CreateDateColumn()
      submittedAt!: Date;

    @Type(() => AssessmentEntity)
    @ManyToOne(() => AssessmentEntity, (assessment) => assessment.submissions)
      assessment!: AssessmentEntity;

    @Type(() => GradeEntity)
    @OneToOne(() => GradeEntity, (grade) => grade.submission, { nullable: true })
      grade?: GradeEntity;
}
