import { NominationDocument } from '../model/nomination.model';
import { MongoClient } from '../structures/MongoClient';
const Nomination = MongoClient.getConnection().models.Nomination;

export async function getNominationCount(userId: string, season_num: number): Promise<number> {
    return await Nomination.count({
        user: userId,
        season_num: season_num
    });
}

export async function hasNominatedCategory(userId: string, season_num: number, category: string): Promise<boolean> {
    return await Nomination.exists({
        user: userId,
        season_num: season_num,
        category: category
    });
}

export async function hasNominatedMovie(userId: string, season_num: number, movieId: string): Promise<boolean> {
    return await Nomination.exists({
        user: userId,
        season_num: season_num,
        movie: movieId
    });
}

export async function nominate(userId: string, movieId: string, season_num: number, category: string): Promise<NominationDocument> {
    const nomination = new Nomination({
        user: userId,
        movie: movieId,
        season_num: season_num,
        category: category
    });

    return await nomination.save();
}