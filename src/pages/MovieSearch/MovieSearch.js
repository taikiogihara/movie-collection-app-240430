import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./MovieSearch.css";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
import MovieSort from "../../components/MovieSort/MovieSort";
import { createMovie, deleteMovie } from "../../graphql/mutations";
import { listMovies } from "../../graphql/queries";
import {
    searchMovies,
    fetchCollectionMovies,
    getMovieDetails,
} from "../../api/movieApi";
import MovieList from "../../components/MovieList/MovieList";
import { generateClient } from "aws-amplify/api";
const client = generateClient();

Modal.setAppElement("#root");

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

    const handleSearch = async () => {
        const searchResults = await searchMovies(query);
        setMovies(searchResults);
    };

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            const searchResults = await searchMovies(query);
            setMovies(searchResults);
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
            await deleteMovieFromAPI(movie.id);
            setSavedMovies(
                savedMovies.filter((savedMovie) => savedMovie.id !== movie.id)
            );
        } else {
            const details = await getMovieDetails(movie.id);
            await saveMovieToAPI(details);
            setSavedMovies([...savedMovies, details]);
        }
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

    const handleFetchCollectionMovies = async (collectionId) => {
        const collectionResults = await fetchCollectionMovies(collectionId);
        setMovies(collectionResults);
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
            <MovieList
                movies={sortedMovies}
                savedMovies={savedMovies}
                onOpenModal={openModal}
                onSaveMovie={handleSaveMovie}
                onFetchCollectionMovies={handleFetchCollectionMovies}
            />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Movie Details"
                className="modal"
                overlayClassName="modal-overlay"
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
