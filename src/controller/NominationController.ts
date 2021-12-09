import { getUnwatchedNominationCount } from "../service/nomination.service"

export class NominationController {
    public static async canNominate(user_id: string): Promise<boolean> {
        return await getUnwatchedNominationCount(user_id) < 2;
    }
}