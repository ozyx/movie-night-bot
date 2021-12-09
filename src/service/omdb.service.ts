import axios from "axios";
import { MovieInput } from "../model/movie.model";

function mapToMovie(data): MovieInput {
    return {
        title: data.Title,
        year: data.Year,
        rated: data.Rated,
        released: data.Released,
        runtime: data.Runtime,
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        poster: data.Poster,
        ratings: data.Ratings,
        metascore: data.Metascore,
        imdbRating: data.imdbRating,
        imdbVotes: data.imdbVotes,
        imdbID: data.imdbID,
        dvd: data.DVD,
        boxOffice: data.BoxOffice,
        production: data.Production,
        website: data.Website,
    };
}


export async function getMovie(imdbId) {
    const omdbUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbId}`;
    const response = await axios.get(omdbUrl, {
        responseType: "json",
    });

    if (response.status !== 200) {
        throw new Error(`getMovie(): GET/ ${omdbUrl} - ${response.status}`);
    }

    return mapToMovie(response.data);
}