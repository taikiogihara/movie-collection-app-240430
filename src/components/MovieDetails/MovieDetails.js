import React from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import "./MovieDetails.css";

const MovieDetails = ({ movie, onDeleteMovie, onCloseModal, isDeleting }) => {
    return (
        <div className="selected-movie">
            <div className="close-button" onClick={onCloseModal}>
                <FaTimes />
            </div>
            <h2>{movie.japanese_title || movie.title}</h2>
            {movie.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
            )}
            {movie.japanese_overview ? (
                <p>Japanese Overview: {movie.japanese_overview}</p>
            ) : (
                <p>Overview: {movie.overview}</p>
            )}
            <p>Release Date: {movie.release_date}</p>
            {movie.genres && (
                <p>
                    Genres: {movie.genres.map((genre) => genre.name).join(", ")}
                </p>
            )}
            <p>Original Language: {movie.original_language}</p>
            {movie.translations && (
                <div>
                    <h4>Available Translations:</h4>
                    <ul>
                        {movie.translations.map((translation) => (
                            <li key={translation.iso_639_1}>
                                {translation.english_name} (
                                {translation.iso_639_1})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {movie.cast && (
                <div>
                    <h4>Cast:</h4>
                    {movie.cast.slice(0, 5).map((cast) => (
                        <p key={cast.credit_id}>
                            {cast.name} as {cast.character}
                        </p>
                    ))}
                </div>
            )}
            {movie.crew && (
                <div>
                    <h4>Crew:</h4>
                    {Object.entries(
                        movie.crew.reduce((acc, crew) => {
                            if (!acc[crew.job]) {
                                acc[crew.job] = [];
                            }
                            acc[crew.job].push(crew.name);
                            return acc;
                        }, {})
                    ).map(([job, names]) => (
                        <p key={job}>
                            {job}: {names.join(", ")}
                        </p>
                    ))}
                </div>
            )}
            {onDeleteMovie && (
                <button
                    className="delete-button"
                    onClick={() => onDeleteMovie(movie.id)}
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
            )}
        </div>
    );
};

export default MovieDetails;
