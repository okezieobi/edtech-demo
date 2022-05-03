import {
  Entity, PrimaryGeneratedColumn, BeforeUpdate,
  CreateDateColumn, UpdateDateColumn, BeforeInsert,
} from 'typeorm';
import { validateOrReject } from 'class-validator';

@Entity()
export default class AppEntity {
    @PrimaryGeneratedColumn('uuid')
      id!: string;

     @CreateDateColumn({ default: new Date() })
       createdAt!: Date;

    @UpdateDateColumn({ default: new Date() })
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
