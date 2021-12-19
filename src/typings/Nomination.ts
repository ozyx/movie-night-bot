import { IUser } from "./User";
import { IMovie } from "./Movie";


export interface INomination {
    category: string;
    user: string;
    movie: string;
    season_num: number;
    date_watched?: Date;
    watched: boolean;
}

export interface ExpandedNomination {
    category: string;
    user: IUser;
    movie: IMovie;
    season_num: number;
    date_watched?: Date;
    watched: boolean;
}