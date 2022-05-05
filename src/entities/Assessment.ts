import {
  Entity, Column, ManyToOne,
} from 'typeorm';
import { IsString, IsDateString } from 'class-validator';

import AppEntity from './Base';
import UserEntity from './User';

@Entity()
export default class AssessmentEntity extends AppEntity {
    @Column({ nullable: false, type: 'text' })
    @IsString()
      title!: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      description!: string;

    @ManyToOne(() => UserEntity, (mentor) => mentor.assessments, { nullable: false })
      mentor!: UserEntity;

    @Column({ nullable: false, type: 'timestamptz' })
    @IsDateString()
      deadline!: Date;
}
