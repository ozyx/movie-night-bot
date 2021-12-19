import mongoose from "mongoose";
import { IUser } from "../typings/User";

interface UserInput {
  discord_id: IUser["discord_id"];
  discord_tag?: IUser["discord_tag"];
  hash?: IUser["hash"];
  salt?: IUser["salt"];
  email?: IUser["email"];
}

type UserDocument = UserInput & mongoose.Document;

const UserType: Record<keyof IUser, any> = {
  discord_id: {
    type: String,
    required: true,
  },
  discord_tag: {
    type: String,
    required: false,
  },
  hash: {
    type: String,
    required: false,
  },
  salt: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
}


const userSchema = new mongoose.Schema(UserType);

export { userSchema, UserDocument, UserInput }