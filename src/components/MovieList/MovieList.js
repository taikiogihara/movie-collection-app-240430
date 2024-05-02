import React from "react";
import MovieItem from "../MovieItem/MovieItem";
import "./MovieList.css";

const MovieList = ({
    movies,
    savedMovies,
    onOpenModal,
    onSaveMovie,
    onFetchCollectionMovies,
    onMovieClick,
}) => {
    return (
        <div className="movie-list">
            {movies.map((movie) => {
                const isSaved = savedMovies?.some(
                    (savedMovie) => savedMovie.id === movie.id
                );
                return movie.belongs_to_collection ? null : (
                    <MovieItem
                        key={movie.id}
                        movie={movie}
                        isSaved={isSaved}
                        onOpenModal={onOpenModal}
                        onSaveMovie={onSaveMovie}
                        onMovieClick={onMovieClick}
                    />
                );
            })}
        </div>
    );
};

export default MovieList;
