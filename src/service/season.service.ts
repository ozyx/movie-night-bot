import { SeasonDocument } from '../model/season.model';
import { MongoClient } from '../structures/MongoClient';
const Season = MongoClient.getConnection().models.Season;

export async function getCurrentSeason(): Promise<SeasonDocument> {
    return await Season.findOne({}).sort({ season_num: -1 });
}

export async function startSeason(): Promise<SeasonDocument> {
    const latestSeason = await getCurrentSeason();

    if (!latestSeason.end_date) {
        throw new Error(`Can't start a new season-- Season #${latestSeason.season_num} is still in progress!`);
    }

    const newSeason = new Season({
        season_num: latestSeason ? latestSeason.season_num + 1 : 1,
        start_date: new Date(),
    });

    return Season.create(newSeason)
}

export async function endSeason(): Promise<SeasonDocument> {
    const latestSeason = await getCurrentSeason();

    if (latestSeason.end_date) {
        throw new Error(`Can't end season #${latestSeason.season_num}-- it's already ended!`);
    }

    if (!latestSeason.start_date) {
        throw new Error(`Can't end season #${latestSeason.season_num}-- it hasn't started yet!`);
    }

    latestSeason.end_date = new Date();

    return latestSeason.save();
}