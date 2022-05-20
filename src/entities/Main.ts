// import {
//   PrimaryGeneratedColumn, BeforeUpdate,
//   CreateDateColumn, UpdateDateColumn, BeforeInsert,
// } from 'typeorm';
// import { validateOrReject } from 'class-validator';

// export default class Main {
//     @PrimaryGeneratedColumn('uuid')
//       id!: string;

//      @CreateDateColumn()
//        createdAt!: Date;

//     @UpdateDateColumn()
//       updatedAt!: Date;

//     @BeforeInsert()
//     @BeforeUpdate()
//     async validateFields() {
//       return validateOrReject(
//         this,
//         { whitelist: true, validationError: { target: false }, forbidUnknownValues: true },
//       );
//     }
// }
