import mongoose from 'mongoose';

export interface IRefreshToken {
    token: string;
    createdAt: Date;
}

export interface IUser {
    _id?: string;
    id?: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    refreshTokens: IRefreshToken[];
    createdAt: Date;
    updatedAt: Date;
    addRefreshToken(token: string): void;
    removeRefreshToken(token: string): void;
    save(): Promise<IUser>;
}

export interface UserModel extends mongoose.Model<IUser> {
    findByRefreshToken(token: string): Promise<IUser | null>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshTokens: [{
    token: String,
    createdAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Method to add refresh token
userSchema.methods.addRefreshToken = function(token: string) {
  this.refreshTokens.push({
    token,
    createdAt: new Date()
  });
};

// Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token: string) {
  this.refreshTokens = this.refreshTokens.filter((t: IRefreshToken) => t.token !== token);
};

// Static method to find user by refresh token
userSchema.statics.findByRefreshToken = function(token: string) {
  return this.findOne({ 'refreshTokens.token': token });
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
