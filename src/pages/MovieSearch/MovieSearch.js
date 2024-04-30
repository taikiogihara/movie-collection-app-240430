import React, { useState } from "react";
import axios from "axios";
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

Modal.setAppElement("#root");

const MovieSearch = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [savedMovies, setSavedMovies] = useState([]);
    const [sortCriteria, setSortCriteria] = useState("popularity");

    // ... (fetchSavedMovies, handleSearch, handleKeyDown, saveMovieToAPI, deleteMovieFromAPI, handleSaveMovie, openModal, closeModal, handleSortCriteriaChange の実装は変更なし)

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
                onFetchCollectionMovies={fetchCollectionMovies}
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
