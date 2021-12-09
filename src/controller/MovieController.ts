import { getMovie } from "../service/omdb.service";
import { createMovie } from "../service/movie.service";
import { MovieDocument } from "../model/movie.model";

export class MovieController {
    public static async getOrCreateMovie(imdbID: string): Promise<MovieDocument> {
        const movieInput = await getMovie(imdbID);
        const movieDoc = await createMovie(movieInput);
        return movieDoc;
    }
}