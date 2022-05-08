import {
  PrimaryGeneratedColumn, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { validateOrReject } from 'class-validator';

export default class AppEntity {
    @PrimaryGeneratedColumn('uuid')
      id!: string;

     @CreateDateColumn()
       createdAt!: Date;

    @UpdateDateColumn()
      updatedAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async validateFields() {
      return validateOrReject(
        this,
        { validationError: { target: false }, forbidUnknownValues: true },
      );
    }
}
