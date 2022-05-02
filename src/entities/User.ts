import {
  Entity, Column, BeforeInsert,
  // OneToMany,
} from 'typeorm';
import { IsEmail, IsIn, IsString } from 'class-validator';

import AppEntity from './Base';
// import FileEntity from './File';
import bcrypt from '../utils/bcrypt';
import AppError from '../errors';

@Entity()
export default class UserEntity extends AppEntity {
  constructor(
    id: string,
    email: string,
    name: string,
    password: string,
    // files: FileEntity[],
    createdAt: Date,
    updatedAt: Date,
    role: string = 'student',
  ) {
    super(id, createdAt, updatedAt);
    this.email = email;
    this.name = name;
    this.role = role;
    this.password = password;
    // this.files = files;
  }

    @Column({ unique: true, type: 'text', nullable: false })
    @IsEmail()
      email: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      name: string;

    @Column({ nullable: false, type: 'text' })
    @IsString()
      password: string;

    @Column({ type: 'text' })
    @IsString()
    @IsIn(['student', 'mentor', 'admin'])
      role: string;

    //   @OneToMany(() => FileEntity, (file) => file.user, { onDelete: 'CASCADE' })
    //     files: FileEntity[];

    @BeforeInsert()
    async hashPassword() {
      if (this.password != null) this.password = await bcrypt.hashString(this.password);
    }

    async validatePassword(password: string, param: string = 'password') {
      const isValidPassword = await bcrypt.compareString(password, this.password);
      if (!isValidPassword) {
        throw new AppError('Password provided does not match user', 'Authorization', { param, msg: 'Authentication failed, mismatched password' });
      }
    }
}
