import {
  Entity, Column, ManyToOne,
} from 'typeorm';
import { IsString, IsDateString } from 'class-validator';

import AppEntity from './App';
import UserEntity from './User';

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
}
