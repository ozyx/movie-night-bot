import { MongoClient } from '../structures/MongoClient';
const Nomination = MongoClient.getConnection().models.Nomination;

export async function getUnwatchedNominationCount(userId: string): Promise<number> {
    return await Nomination.count({
        where: {
            user: userId,
            date_watched: undefined
        }
    });
}