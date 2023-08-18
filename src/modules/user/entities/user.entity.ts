import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/types/role.type';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform((params) => params.obj._id.toString())
  _id: ObjectId;

  @ApiProperty()
  @Prop()
  firstname: string;

  @ApiProperty()
  @Prop()
  lastname: string;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({
    index: {
      unique: true,
      name: 'email_unique_insensitive',
      collation: { locale: 'en', strength: 2 },
    },
  })
  email: string;

  @ApiProperty()
  @Prop()
  emailConfirmed: boolean;

  @ApiProperty()
  @Prop()
  phoneNumber: string;

  @ApiProperty({ enum: ['admin', 'user'] })
  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: Role;

  @ApiProperty({ enum: ['FR', 'DE', 'IT', 'EN'] })
  @Prop({ enum: ['FR', 'DE', 'IT', 'EN'], default: 'EN' })
  language: 'FR' | 'DE' | 'IT' | 'EN';

  @ApiProperty()
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserModel = SchemaFactory.createForClass(User);
