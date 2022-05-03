import {
  Entity, Column, ManyToOne, CreateDateColumn, BeforeInsert, BeforeUpdate, BeforeRemove,
} from 'typeorm';
import { IsString } from 'class-validator';

import AppEntity from './Base';
import AppError from '../errors';
import UserEntity from './User';

@Entity()
export default class AssessmentEntity extends AppEntity {
    @Column({ nullable: false, type: 'text' })
    @IsString()
      title: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      description: string;

    @ManyToOne(() => UserEntity, (user) => user.assessments)
      mentor: UserEntity;

    @CreateDateColumn({ default: new Date() })
      deadline: Date;

    @BeforeInsert()
    @BeforeUpdate()
    @BeforeRemove()
    validateRole() {
      if (this.mentor.role === 'student') {
        throw new AppError('Only mentors or admins can create, edit or delete an assessment', 'Forbidden', { param: this, msg: 'Assessment write query failed, user not permitted' });
      }
    }

    constructor(
      id: string,
      title: string,
      description: string,
      mentor: UserEntity,
      deadline: Date,
      createdAt: Date,
      updatedAt: Date,
    ) {
      super(id, createdAt, updatedAt);
      this.title = title;
      this.description = description;
      this.mentor = mentor;
      this.deadline = deadline;
    }
}
