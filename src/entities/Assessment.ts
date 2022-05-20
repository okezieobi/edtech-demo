// import {
//   Entity, Column, ManyToOne, OneToMany,
// } from 'typeorm';
// import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
// import { Type } from 'class-transformer';

// import Main from './Main';
// import User from './User';
// import Submission from './Submissions';

// interface AssessmentFields {
//   title: string;
//   description: string,
//   deadline: Date,
// }

// @Entity()
// export default class Assessment extends Main implements AssessmentFields {
//     @Column({ type: 'text' })
//     @IsString()
//     @IsNotEmpty()
//       title!: string;

//     @Column({ type: 'text' })
//     @IsString()
//     @IsNotEmpty()
//       description!: string;

//     @Type(() => User)
//     @ManyToOne(() => User, (mentor) => mentor.assessments)
//       mentor!: User;

//     @Type(() => Submission)
//     @OneToMany(() => Submission, (submission) => submission.assessment, { onDelete: 'CASCADE', nullable: true })
//       submissions?: Submission[];

//     @Column({ type: 'timestamptz' })
//     @IsDateString()
//       deadline!: Date;
// }

// export { AssessmentFields };
