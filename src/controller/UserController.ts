import { userExists, createUser, getUser } from '../service/user.service';
import { UserDocument, UserInput } from '../model/user.model';

export class UserController {
    /**
     * Retrieve the user's ObjectID given their discord id.
     * Creates the user if they do not exist.
     * @param discord_id the discord id of the user
     * @returns The MongoDB ObjectID of the specified User
     */
    public static async getOrCreateUser(discord_id: string): Promise<UserDocument> {
        const user: UserInput = {
            discord_id: discord_id,
        }

        let userDoc: UserDocument;

        const found = await userExists(user);
        if (found) {
            userDoc = await getUser(user);
        } else {
            userDoc = await createUser(user);
        }

        return userDoc;
    }
}