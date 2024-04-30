import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listMovies } from "./graphql/queries";
import { deleteMovie } from "./graphql/mutations";
import "./MovieDataViewer.css";
import { FaTrash } from "react-icons/fa";

const client = generateClient();

const MovieDataViewer = () => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleDeleteMovie = async (movieId) => {
        setIsDeleting(true);
        try {
            await client.graphql({
                query: deleteMovie,
                variables: { input: { id: movieId } },
            });
            const updatedMovies = savedMovies.filter(
                (movie) => movie.id !== movieId
            );
            setSavedMovies(updatedMovies);
            setSelectedMovie(null);
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
        setIsDeleting(false);
    };

    const getTruncatedOverview = (overview) => {
        const lines = overview.split("\n");
        const truncatedLines = lines.slice(0, 5);
        return truncatedLines.join("\n");
    };

    return (
        <div className="movie-data-viewer">
            <h2>Saved Movies</h2>
            <div className="movie-list">
                {savedMovies.map((movie) => (
                    <React.Fragment key={movie.id}>
                        {movie.belongs_to_collection && (
                            <div className="movie-item collection-name">
                                {movie.belongs_to_collection.name}
                            </div>
                        )}
                        <div
                            className="movie-item"
                            onClick={() => handleMovieClick(movie)}
                        >
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            )}
                            <div className="movie-info">
                                <h4>{movie.original_title}</h4>
                                <p className="clamp-text">
                                    {getTruncatedOverview(
                                        movie.japanese_overview ||
                                            movie.overview
                                    )}
                                </p>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            {selectedMovie && (
                <div className="movie-details">
                    <h3>{selectedMovie.title}</h3>
                    <p>Original Title: {selectedMovie.original_title}</p>
                    <p>Japanese Title: {selectedMovie.japanese_title}</p>
                    <p>Overview: {selectedMovie.overview}</p>
                    <p>Japanese Overview: {selectedMovie.japanese_overview}</p>
                    <p>Release Date: {selectedMovie.release_date}</p>
                    <p>Popularity: {selectedMovie.popularity}</p>
                    <p>Vote Average: {selectedMovie.vote_average}</p>
                    <p>Vote Count: {selectedMovie.vote_count}</p>
                    {selectedMovie.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                        />
                    )}
                    <button
                        className="delete-button"
                        onClick={() => handleDeleteMovie(selectedMovie.id)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            "Deleting..."
                        ) : (
                            <>
                                <FaTrash /> Delete
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MovieDataViewer;
