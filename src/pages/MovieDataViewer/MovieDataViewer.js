import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listMovies } from "../../graphql/queries";
import { deleteMovie } from "../../graphql/mutations";
import "./MovieDataViewer.css";
import MovieList from "../../components/MovieList/MovieList";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
import Modal from "react-modal";

Modal.setAppElement("#root");

const client = generateClient();

const MovieDataViewer = () => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        setModalIsOpen(true);
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
            setModalIsOpen(false);
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
        setIsDeleting(false);
    };

    const closeModal = () => {
        setSelectedMovie(null);
        setModalIsOpen(false);
    };

    return (
        <div className="movie-data-viewer">
            <h2>Saved Movies</h2>
            <MovieList
                movies={savedMovies}
                onMovieClick={handleMovieClick}
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
                        onDeleteMovie={handleDeleteMovie}
                        onCloseModal={closeModal}
                        isDeleting={isDeleting}
                    />
                )}
            </Modal>
        </div>
    );
};

export default MovieDataViewer;