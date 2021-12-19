import { getNominationCount, getNominations, hasNominatedCategory, hasNominatedMovie, hasWatchedCategory } from "../service/nomination.service"
import { getCurrentSeason } from "../service/season.service";
import { nominate, unnominate } from "../service/nomination.service";
import { NominationDocument } from "../model/nomination.model";
import { ExpandedNomination } from "../typings/Nomination";

export class NominationController {
    public static async canNominate(user_id: string, category: string, movie_id: string): Promise<boolean> {
        const currentSeason = await getCurrentSeason();
        const season_num = currentSeason.season_num + 1;

        if (!currentSeason.end_date) {
            throw new Error("Can't nominate-- the new season hasn't started yet!");
        }

        if (await getNominationCount(user_id, season_num) === 2) {
            throw new Error("Can't nominate-- you've already nominated for this season!");
        }

        if (await hasNominatedCategory(user_id, season_num, category)) {
            throw new Error(`Can't nominate for ${category}-- you've already nominated for this category!`);
        }

        if (await hasNominatedMovie(user_id, season_num, movie_id)) {
            throw new Error(`Can't nominate this movie-- you've already nominated this movie for Season #${season_num}!`);
        }

        return true
    }

    public static async canUnnominate(user_id: string, category: string): Promise<boolean> {
        const currentSeason = await getCurrentSeason();
        const season_num = currentSeason.season_num + 1;

        if (!currentSeason.end_date) {
            throw new Error("Can't unnominate-- the new season hasn't started yet!");
        }

        if (!await hasNominatedCategory(user_id, season_num, category)) {
            throw new Error(`Can't unnominate movie for ${category}-- you haven't nominated anything for this category!`);
        }

        if (await hasWatchedCategory(user_id, season_num, category)) {
            throw new Error(`Can't unnominate movie for ${category}-- you've already watched this movie!`);
        }

        return true
    }

    /**
     * Nominate a movie for a category.
     * @param user_id The user ID of the user who is nominating.
     * @param movie_id The ID of the movie to nominate.
     * @param season_num The season number of the season to nominate for.
     * @param category The category to nominate the movie for.
     * @returns The nomination document.
     */
    public static async nominate(user_id: string, movie_id: string, season_num: number, category: string): Promise<NominationDocument> {
        return await nominate(user_id, movie_id, season_num, category);
    }

    public static async unnominate(user_id: string, season_num: number, category: string): Promise<NominationDocument> {
        return await unnominate(user_id, season_num, category);
    }

    public static async getCurrentNominations(userId?: string): Promise<ExpandedNomination[]> {
        const currentSeason = await getCurrentSeason();
        const end_date = currentSeason.end_date;
        const season_num = end_date ? currentSeason.season_num + 1 : currentSeason.season_num;

        return await getNominations(season_num, userId);
    }
}