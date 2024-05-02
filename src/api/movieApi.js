import axios from "axios";

const API_KEY = "5893689a1b35b0083127c388b31bcd75";
const cache = {};

export const searchMovies = async (query) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        );
        const movieResults = response.data.results;
        const moviesWithDetails = await Promise.all(
            movieResults.map(async (movie) => {
                const details = await getMovieDetails(movie.id);
                return { ...movie, ...details };
            })
        );
        return moviesWithDetails;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

export const fetchCollectionMovies = async (collectionId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}`
        );
        const collectionMovies = response.data.parts;
        const moviesWithDetails = await Promise.all(
            collectionMovies.map(async (movie) => {
                const details = await getMovieDetails(movie.id);
                return { ...movie, ...details };
            })
        );
        return moviesWithDetails;
    } catch (error) {
        console.error("Error fetching collection movies:", error);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    if (cache[movieId]) {
        return cache[movieId];
    }

    const details = await fetchMovieDetails(movieId);
    const credits = await fetchMovieCredits(movieId);
    const translations = await fetchMovieTranslations(movieId);

    const japaneseTranslation = translations.find(
        (translation) => translation.iso_3166_1 === "JP"
    );
    if (japaneseTranslation) {
        details.japanese_title =
            japaneseTranslation.data.title || details.original_title;
        details.japanese_overview = japaneseTranslation.data.overview;
    }

    details.cast = credits.cast;
    details.crew = credits.crew;
    details.translations = translations;

    if (details.belongs_to_collection) {
        const collectionDetails = await fetchCollectionDetails(
            details.belongs_to_collection.id
        );
        details.belongs_to_collection = collectionDetails;
    }

    cache[movieId] = details;
    return details;
};

const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};

const fetchMovieCredits = async (movieId, language = null) => {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}${
            language ? `&language=${language}` : ""
        }`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching movie credits:", error);
        return null;
    }
};

const fetchMovieTranslations = async (movieId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/translations?api_key=${API_KEY}`
        );
        return response.data.translations;
    } catch (error) {
        console.error("Error fetching movie translations:", error);
        return null;
    }
};

const fetchCollectionDetails = async (collectionId) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/collection/${collectionId}?api_key=${API_KEY}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching collection details:", error);
        return null;
    }
};
