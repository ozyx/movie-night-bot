import { getNominationCount, hasNominatedCategory, hasNominatedMovie } from "../service/nomination.service"
import { getLatestSeason } from "../service/season.service";
import { nominate } from "../service/nomination.service";
import { NominationDocument, NominationInput } from "../model/nomination.model";

export class NominationController {
    public static async canNominate(user_id: string, category: string, movie_id: string): Promise<boolean> {
        const latestSeason = await getLatestSeason();
        
        if(latestSeason.end_date) {
            throw new Error("Can't nominate-- the new season hasn't started yet!");
        }

        if(await getNominationCount(user_id, latestSeason.season_num) === 2) {
            throw new Error("Can't nominate-- you've already nominated for this season!");
        }

        if(await hasNominatedCategory(user_id, latestSeason.season_num, category)) {
            throw new Error(`Can't nominate for ${category}-- you've already nominated for this category!`);
        }

        if(await hasNominatedMovie(user_id, latestSeason.season_num, movie_id)) {
            throw new Error(`Can't nominate this movie-- you've already nominated this movie!`);
        }

        return true
    }

    public static async nominate(user_id: string, movie_id: string, category: string): Promise<NominationDocument> {
        const latestSeason = await getLatestSeason();

        return await nominate(user_id, movie_id, latestSeason.season_num, category);
    }
}