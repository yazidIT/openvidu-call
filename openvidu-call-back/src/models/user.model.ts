import mongoose, { Schema } from "mongoose";

export interface IPicture extends Document {
    originalName: string;
    size: number;
    mimeType: string;
    nameOnServer: string;
}

export interface IAvatar extends Document {
    picture: IPicture;
    thumbnail: IPicture;
}

export interface IUser extends Document {
    fullname: string;
    name: string;//display name
    sortName: string;
    description: string;
    userid: string;
    password: string;
    email: string;
    status: number; // 1: Enabled, 0: Disabled
    avatar: IAvatar;
    groups: Array<string>;
  }
  
  const UserSchema: Schema = new Schema({
    fullname: String,
    name: String,//display name
    sortName: String,
    description: String,
    userid: { type:String, unique: true, sparse: true },
    password: String,
    email:String,
    status: Number, // 1: Enabled, 0: Disabled
    avatar: {
        picture: {
            originalName: String,
            size: Number,
            mimeType: String,
            nameOnServer: String
        },
        thumbnail: {
            originalName: String,
            size: Number,
            mimeType: String,
            nameOnServer: String
        }
    },
    groups: [ String ],
  });
  
  // Export the model and return your IUser interface
  const User = mongoose.model<IUser>('User', UserSchema);
  export default User;