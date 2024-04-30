import React from "react";
import "./MovieSort.css";

const MovieSort = ({ sortCriteria, onSortCriteriaChange }) => {
    return (
        <select value={sortCriteria} onChange={onSortCriteriaChange}>
            <option value="title">Sort by Title</option>
            <option value="releaseDate">Sort by Release Date</option>
            <option value="popularity">Sort by Popularity</option>
        </select>
    );
};

export default MovieSort;