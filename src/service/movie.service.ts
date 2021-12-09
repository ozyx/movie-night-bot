import { MovieDocument, MovieInput } from "../model/movie.model";
import { connection } from "../db/connection";
const Movie = connection.models.Movie;

export async function createMovie(movie: MovieInput): Promise<MovieDocument> {
    return await Movie.findOneAndUpdate({ imdbID: movie.imdbID }, movie, { upsert: true, new: true });
}
