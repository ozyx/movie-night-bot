import { SeasonDocument } from "../model/season.model";
import { startSeason, endSeason, getCurrentSeason } from "../service/season.service"

export class SeasonController {
    public static async startSeason(): Promise<SeasonDocument> {
        return await startSeason();
    }

    public static async endSeason(): Promise<SeasonDocument> {
        return await endSeason()
    }

    public static async getNextSeasonNum(): Promise<number> {
        const latestSeason = await getCurrentSeason();
        return latestSeason.season_num + 1;
    }
}