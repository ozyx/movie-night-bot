import { UserDocument, UserInput } from '../model/user.model';
import { connection } from "../db/Connection";
const User = connection.models.User;

export async function userExists(user: UserInput): Promise<boolean> {
    return await User.exists({ discord_id: user.discord_id });
}

export async function createUser(user: UserInput): Promise<UserDocument> {
    return await User.findOneAndUpdate({ discord_id: user.discord_id }, user, { upsert: true, new: true });
}

export async function getUser(user: UserInput): Promise<UserDocument> {
    return await User.findOne({ discord_id: user.discord_id });
}
