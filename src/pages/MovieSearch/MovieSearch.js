import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./MovieSearch.css";
import MovieDetails from "./MovieDetails";
import MovieSort from "./MovieSort";
import { generateClient } from "aws-amplify/api";
import { createMovie, updateMovie, deleteMovie } from "./graphql/mutations";
import { listMovies } from "./graphql/queries";

const API_KEY = "5893689a1b35b0083127c388b31bcd75";
const client = generateClient();

const MovieSearch = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [savedMovies, setSavedMovies] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("popularity");

    useEffect(() => {
        const fetchSavedMovies = async () => {
            try {
                const movieData = await client.graphql({ query: listMovies });
                const movies = movieData.data.listMovies.items;
                setSavedMovies(movies);
            } catch (error) {
                console.error("Error fetching saved movies:", error);
            }
        };

        fetchSavedMovies();
    }, []);

    const searchMovies = async (query) => {
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
            setMovies(moviesWithDetails);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const fetchCollectionMovies = async (collectionId) => {
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
            setMovies(moviesWithDetails);
        } catch (error) {
            console.error("Error fetching collection movies:", error);
        }
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

    const getMovieDetails = async (movieId) => {
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

        return details;
    };

    const handleSearch = () => {
        searchMovies(query);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            searchMovies(query);
        }
    };

    const saveMovieToAPI = async (movie) => {
        try {
            const collectionInput = movie.belongs_to_collection
                ? {
                      id: movie.belongs_to_collection.id,
                      name: movie.belongs_to_collection.name,
                      poster_path: movie.belongs_to_collection.poster_path,
                      backdrop_path: movie.belongs_to_collection.backdrop_path,
                  }
                : null;

            const castInput = movie.cast.map((person) => ({
                id: person.id,
                name: person.name,
                character: person.character,
                profile_path: person.profile_path,
            }));

            const crewInput = movie.crew.map((person) => ({
                id: person.id,
                name: person.name,
                job: person.job,
                profile_path: person.profile_path,
            }));

            const translationsInput = movie.translations.map((translation) => ({
                iso_3166_1: translation.iso_3166_1,
                iso_639_1: translation.iso_639_1,
                name: translation.name,
                english_name: translation.english_name,
                data: {
                    title: translation.data.title,
                    overview: translation.data.overview,
                    homepage: translation.data.homepage,
                },
            }));

            const movieInput = {
                title: movie.title,
                original_title: movie.original_title,
                japanese_title: movie.japanese_title,
                overview: movie.overview,
                japanese_overview: movie.japanese_overview,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                popularity: movie.popularity,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                belongs_to_collection: collectionInput,
                cast: castInput,
                crew: crewInput,
                translations: translationsInput,
            };

            const result = await client.graphql({
                query: createMovie,
                variables: { input: movieInput },
            });

            const createdMovie = result.data.createMovie;
            setSavedMovies([...savedMovies, createdMovie]);
        } catch (error) {
            console.error("Error saving movie:", error);
        }
    };

    const deleteMovieFromAPI = async (movieId) => {
        try {
            await client.graphql({
                query: deleteMovie,
                variables: { input: { id: movieId } },
            });
            const updatedMovies = savedMovies.filter(
                (savedMovie) => savedMovie.id !== movieId
            );
            setSavedMovies(updatedMovies);
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    const handleSaveMovie = async (movie) => {
        const isSaved = savedMovies.some(
            (savedMovie) => savedMovie.id === movie.id
        );

        if (isSaved) {
            console.log("Movie is already saved. Skipping save operation.");
            return;
        }

        const details = await getMovieDetails(movie.id);
        await saveMovieToAPI(details);
        setSavedMovies([...savedMovies, details]);
    };

    const openModal = async (movie) => {
        const details = await getMovieDetails(movie.id);
        setSelectedMovie(details);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setModalIsOpen(false);
    };

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const sortedMovies = movies.sort((a, b) => {
        if (sortCriteria === "popularity") {
            return b.popularity - a.popularity;
        } else if (sortCriteria === "releaseDate") {
            return new Date(b.release_date) - new Date(a.release_date);
        } else if (sortCriteria === "title") {
            const titleA = a.japanese_title || a.original_title;
            const titleB = b.japanese_title || b.original_title;
            return titleA.localeCompare(titleB);
        }
        return 0;
    });

    return (
        <div className="movie-search">
            <h1>Movie Search</h1>
            <div className="search-and-sort">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a movie search query"
                />
                <MovieSort
                    sortCriteria={sortCriteria}
                    onSortCriteriaChange={handleSortCriteriaChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="movie-list">
                {sortedMovies.map((movie) => {
                    const isSaved = savedMovies.some(
                        (savedMovie) => savedMovie.id === movie.id
                    );
                    return (
                        <div key={movie.id} className="movie-item">
                            <div
                                className="movie-image"
                                onClick={() => openModal(movie)}
                            >
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="movie-info">
                                <label onClick={() => openModal(movie)}>
                                    {movie.original_title}
                                    {movie.japanese_title && (
                                        <>
                                            <br />
                                            {movie.japanese_title}
                                        </>
                                    )}
                                </label>
                                <br />
                                {movie.belongs_to_collection && (
                                    <span
                                        className="collection-name"
                                        onClick={() =>
                                            fetchCollectionMovies(
                                                movie.belongs_to_collection.id
                                            )
                                        }
                                    >
                                        {movie.belongs_to_collection.name}
                                    </span>
                                )}
                                <br />
                                <button onClick={() => handleSaveMovie(movie)}>
                                    {isSaved ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Movie Details"
            >
                {selectedMovie && (
                    <MovieDetails
                        movie={selectedMovie}
                        onSaveMovie={handleSaveMovie}
                        onCloseModal={closeModal}
                    />
                )}
            </Modal>
        </div>
    );
};
export default MovieSearch;
