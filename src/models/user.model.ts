import { Document, Schema, model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  name: {type: String, required: true},
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

const User = model<IUser>('User', UserSchema);

export default User;
