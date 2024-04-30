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
                return (
                    <React.Fragment key={movie.id}>
                        {movie.belongs_to_collection && (
                            <div
                                className="movie-item collection-name"
                                onClick={() =>
                                    onFetchCollectionMovies(
                                        movie.belongs_to_collection.id
                                    )
                                }
                            >
                                {movie.belongs_to_collection.name}
                            </div>
                        )}
                        <MovieItem
                            movie={movie}
                            isSaved={isSaved}
                            onOpenModal={onOpenModal}
                            onSaveMovie={onSaveMovie}
                            onMovieClick={onMovieClick}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default MovieList;