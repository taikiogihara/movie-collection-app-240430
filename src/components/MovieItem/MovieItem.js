import React from "react";
import "./MovieItem.css";

const MovieItem = ({
    movie,
    isSaved,
    onOpenModal,
    onSaveMovie,
    onMovieClick,
}) => {
    const handleClick = () => {
        if (onOpenModal) {
            onOpenModal(movie);
        } else if (onMovieClick) {
            onMovieClick(movie);
        }
    };

    return (
        <div className="movie-item" onClick={handleClick}>
            {movie.poster_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                />
            ) : (
                <div className="no-image">No Image</div>
            )}
            <div className="movie-info">
                <h4>
                    {movie.original_title}
                    {movie.japanese_title && (
                        <>
                            <br />
                            {movie.japanese_title}
                        </>
                    )}
                </h4>
                {isSaved && <span className="saved-label">Saved</span>}
                {onSaveMovie && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSaveMovie(movie);
                        }}
                    >
                        {isSaved ? "Unsave" : "Save"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieItem;
