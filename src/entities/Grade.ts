// import {
//   Entity, Column, OneToOne,
// } from 'typeorm';
// import { IsNotEmpty, IsString } from 'class-validator';
// import { Type } from 'class-transformer';

// import Main from './Main';
// import Submission from './Submissions';

// interface GradeFields {
//   mark: string;
//   remarks: string;
// }

// @Entity()
// export default class GradeEntity extends Main implements GradeFields {
//     @Column({ type: 'text' })
//     @IsString()
//     @IsNotEmpty()
//       mark!: string;

//     @Column({ type: 'text' })
//     @IsString()
//     @IsNotEmpty()
//       remarks!: string;

//     @Type(() => Submission)
//     @OneToOne(() => Submission, (submission) => submission.grade)
//       submission!: Submission;
// }

// export { GradeFields };
