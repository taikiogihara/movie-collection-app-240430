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
    const [isLoading, setIsLoading] = useState(false);
    const [sortCriteria, setSortCriteria] = useState("popularity");

    useEffect(() => {
        fetchSavedMovies();
    }, []);

    const fetchSavedMovies = async () => {
        try {
            const movieData = await client.graphql({ query: listMovies });
            setMovies(movieData.data.listMovies.items);
        } catch (error) {
            console.error("Error fetching saved movies:", error);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const searchResults = await searchMovies(query);
            setMovies(searchResults);
        } catch (error) {
            console.error("Error during movie search:", error);
        }
        setIsLoading(false);
    };

    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleSaveMovie = async (movie) => {
        const movieDetails = await getMovieDetails(movie.id);
        const movieInput = formatMovieInput(movieDetails);
        try {
            const result = await client.graphql({
                query: createMovie,
                variables: { input: movieInput },
            });
            setMovies([...movies, result.data.createMovie]);
        } catch (error) {
            console.error("Error saving movie:", error);
        }
    };

    const formatMovieInput = (movie) => {
        return {
            title: movie.title,
            original_title: movie.original_title,
            japanese_title: movie.japanese_title || "",
            overview: movie.overview,
            japanese_overview: movie.japanese_overview || "",
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            popularity: movie.popularity,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            // Add more fields as necessary
        };
    };

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setModalIsOpen(false);
    };

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    return (
        <div className="movie-search">
            <h1>Movie Search</h1>
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
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <MovieList
                    movies={movies}
                    onSaveMovie={handleSaveMovie}
                    onOpenModal={openModal}
                />
            )}
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
