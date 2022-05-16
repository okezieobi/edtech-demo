import { Optional } from 'sequelize';
import {
  Model, Table, Column, DataType, ForeignKey, BelongsTo, HasOne,
} from 'sequelize-typescript';
import { isURL, arrayMaxSize, arrayNotEmpty } from 'class-validator';

import User from './User';
import Assessment from './Assessment';
import Grade from './Grade';

interface SubmissionFields {
    id: string;
  links: Array<string>
  submittedAt: Date;
}

interface SubmissionCreationFields extends Optional<SubmissionFields, 'id'> {}

@Table({
  timestamps: true,
  paranoid: true,
})
export default class Submission extends Model<SubmissionCreationFields, SubmissionFields> {
 @Column({
   type: DataType.UUID,
   primaryKey: true,
   defaultValue: DataType.UUIDV4,
 })
   id!: string;

    @Column({
      allowNull: false,
      type: DataType.ARRAY,
      validate: {
        isArray: true,
        isArrayOfUrls(value: Array<string>) {
          arrayNotEmpty(value);
          arrayMaxSize(value, 4);
          value.forEach((val) => isURL(val));
        },
      },
    })
      links!: Array<string>;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
    submittedAt!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    studentId!: string;

  @BelongsTo(() => User)
    student!: User;

  @ForeignKey(() => Assessment)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
    assessmentId!: string;

  @BelongsTo(() => Assessment)
    assessment!: Assessment;

  @HasOne(() => Grade)
    grade!: Grade;
}
