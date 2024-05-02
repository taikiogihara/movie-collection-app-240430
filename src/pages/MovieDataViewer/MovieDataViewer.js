import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listMovies } from "../../graphql/queries";
import { deleteMovie } from "../../graphql/mutations";
import "./MovieDataViewer.css";
import { FaTrash } from "react-icons/fa";
import MovieList from "../../components/MovieList/MovieList";
import MovieDetails from "../../components/MovieDetails/MovieDetails";

const client = generateClient();

const MovieDataViewer = () => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredSavedMovies = savedMovies.filter((movie) => {
        const movieTitle = movie.title.toLowerCase();
        const query = searchQuery.toLowerCase();
        return movieTitle.includes(query);
    });

    return (
        <div className="movie-data-viewer">
            <h2>Saved Movies</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search saved movies"
            />
            <MovieList
                movies={filteredSavedMovies}
                onMovieClick={handleMovieClick}
            />
            {selectedMovie && (
                <MovieDetails
                    movie={selectedMovie}
                    onDeleteMovie={handleDeleteMovie}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
};

export default MovieDataViewer;
