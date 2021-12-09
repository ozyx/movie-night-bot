import { connection } from '../db/connection';
import { NominationInput } from '../model/nomination.model';
const Nomination = connection.models.Nomination;

export async function getUnwatchedNominationCount(userId: string): Promise<number> {
    return await Nomination.count({
        where: {
            user: userId,
            date_watched: undefined
        }
    });
}