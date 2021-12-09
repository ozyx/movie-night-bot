import mongoose from "mongoose";

interface UserInput {
  discord_id: string;
  discord_tag?: string;
  hash?: string;
  salt?: string;
  email?: string;
}

type UserDocument = UserInput & mongoose.Document;

const UserType = {
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