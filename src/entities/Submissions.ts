import {
  Entity, Column, ManyToOne, CreateDateColumn, OneToOne,
} from 'typeorm';
import {
  IsArray, ValidateNested, IsUrl, ArrayMaxSize, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

import Main from './Main';
import AssessmentEntity from './Assessment';
import GradeEntity from './Grade';
import UserEntity from './User';

interface SubmissionFields {
  links: Array<string>
  submittedAt: Date;
}
@Entity()
export default class SubmissionEntity extends Main {
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

    @Type(() => UserEntity)
    @ManyToOne(() => UserEntity, (student) => student.submissions)
      student!: UserEntity;

    @Type(() => GradeEntity)
    @OneToOne(() => GradeEntity, (grade) => grade.submission, { nullable: true })
      grade?: GradeEntity;
}

export { SubmissionFields };
