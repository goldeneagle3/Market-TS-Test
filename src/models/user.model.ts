import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import IUser from './../interfaces/user.interface';

enum roleType {
  ADMIN = 'admin',
  USER = 'user',
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique:true,
      required:true,
      trim:true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: roleType.USER,
      enum: Object.values(roleType),
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', UserSchema);
