import { Optional } from 'sequelize';
import {
  Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany,
} from 'sequelize-typescript';

import User from './User';
import Submission from './Submission';

interface AssessmentFields {
  id: string,
  title: string;
  description: string,
  deadline: Date,
}

interface AssessmentCreationFields extends Optional<AssessmentFields, 'id'> { }

@Table({
  timestamps: true,
  paranoid: true,
})
export default class Assessment extends Model<AssessmentFields, AssessmentCreationFields> {
     @Column({
       type: DataType.UUID,
       primaryKey: true,
       defaultValue: DataType.UUIDV4,
     })
       id!: string;

    @Column({
      allowNull: false,
      type: DataType.STRING,
    })
      title!: string;

     @Column({
       allowNull: false,
       type: DataType.TEXT,
     })
       description!: string;

     @Column({
       allowNull: false,
       type: DataType.DATEONLY,
     })
       deadline!: Date;

    @ForeignKey(() => User)
    @Column({
      allowNull: false,
      type: DataType.UUID,
    })
      mentorId!: string;

    @BelongsTo(() => User)
      mentor!: User;

    @HasMany(() => Submission)
      submissions!: Submission[];
}

export { AssessmentFields };
