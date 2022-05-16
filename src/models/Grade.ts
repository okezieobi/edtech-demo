import { Optional } from 'sequelize';
import {
  Model, Table, Column, DataType, ForeignKey, BelongsTo,
} from 'sequelize-typescript';

import Submission from './Submission';

interface GradeFields {
    id: string;
  mark: string;
  remarks: string;
}

interface GradeCreationFields extends Optional<GradeFields, 'id'> { }

@Table({
  timestamps: true,
  paranoid: true,
})
export default class Grade extends Model<GradeFields, GradeCreationFields> {
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
      mark!: string;

    @Column({
      allowNull: false,
      type: DataType.STRING,
    })
      remarks!: string;

    @ForeignKey(() => Submission)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
      submissionId!: Submission;

    @BelongsTo(() => Submission)
      submission!: Submission;
}
