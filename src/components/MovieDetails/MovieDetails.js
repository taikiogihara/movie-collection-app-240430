import React from "react";
import "./MovieDetails.css";

const MovieDetails = ({ movie, onSaveMovie, onCloseModal }) => {
    return (
        <div className="movie-details">
            <button onClick={onCloseModal} className="close-modal">✖</button>
            <h2>{movie.title} {movie.japanese_title ? `(${movie.japanese_title})` : ""}</h2>
            <h3>{movie.collection_name}</h3>
            <p>{movie.overview}</p>
            {movie.japanese_overview && <p>{movie.japanese_overview}</p>}
            <p>Released on: {movie.release_date}</p>
            <div className="movie-cast">
                <h4>Cast:</h4>
                {movie.cast.map((actor, index) => (
                    <p key={index}>{actor.name} as {actor.character}</p>
                ))}
            </div>
            <div className="movie-crew">
                <h4>Crew:</h4>
                {movie.crew.map((member, index) => (
                    <p key={index}>{member.name} ({member.job})</p>
                ))}
            </div>
            <button onClick={() => onSaveMovie(movie)} className="save-movie">
                {movie.saved ? "Saved" : "Save"}
            </button>
        </div>
    );
};

export default MovieDetails;