import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listMovies } from "../../graphql/queries";
import "./MovieDataViewer.css";
import MovieList from "../../components/MovieList/MovieList";
import MovieDetails from "../../components/MovieDetails/MovieDetails";
import Modal from "react-modal";

Modal.setAppElement("#root");

const client = generateClient();

const MovieDataViewer = () => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchSavedMovies = async () => {
            try {
                const movieData = await client.graphql({ query: listMovies });
                setSavedMovies(movieData.data.listMovies.items);
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

    const closeModal = () => {
        setSelectedMovie(null);
        setModalIsOpen(false);
    };

    return (
        <div className="movie-data-viewer">
            <h1>Your Movie Collection</h1>
            <MovieList movies={savedMovies} onMovieClick={handleMovieClick} />
            {selectedMovie && (
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Movie Details"
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <MovieDetails
                        movie={selectedMovie}
                        onCloseModal={closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

export default MovieDataViewer;
