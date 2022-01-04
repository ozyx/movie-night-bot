import { NominationDocument } from '../model/nomination.model';
import { MongoClient } from '../structures/MongoClient';
import { ExpandedNomination } from '../typings/Nomination';
const Nomination = MongoClient.getConnection().models.Nomination;

export async function getNominationCount(userId: string, season_num: number): Promise<number> {
    return await Nomination.count({
        user: userId,
        season_num: season_num
    });
}

export async function hasWatchedCategory(userId: string, season_num: number, category: string): Promise<boolean> {
    return await Nomination.count({
        user: userId,
        season_num: season_num,
        category: category,
        watched: true
    }) > 0;
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

export async function getNominations(seasonNum: number, userId?: string): Promise<ExpandedNomination[]> {
    const agg: unknown[] = [
        {
            '$lookup': {
                'from': 'movies',
                'localField': 'movie',
                'foreignField': '_id',
                'as': 'movie'
            }
        }, {
            '$unwind': {
                'path': '$movie',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'user',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unset': [
                'user.hash', 'user.salt', 'user.email'
            ]
        }
    ]

    const match = {
        '$match': {
            'season_num': seasonNum,
        }
    }

    if (userId) {
        match['$match']['user.discord_id'] = userId;
    }

    agg.push(match);

    return await Nomination.aggregate(agg);
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

export async function unnominate(userId: string, season_num: number, category: string): Promise<NominationDocument> {
    return await Nomination.findOneAndRemove({
        user: userId,
        season_num: season_num,
        category: category
    });
}