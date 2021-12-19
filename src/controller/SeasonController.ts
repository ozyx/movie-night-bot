import { SeasonDocument } from "../model/season.model";
import { startSeason, endSeason } from "../service/season.service"

export class SeasonController {
    public static async startSeason(): Promise<SeasonDocument> {
        return await startSeason();
    }

    public static async endSeason(): Promise<SeasonDocument> {
        return await endSeason()
    }
}