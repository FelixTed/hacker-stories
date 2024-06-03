import React from "react";
import "./App.css";

const LastSearches = ({lastSearches,onLastSearch}) => {
    return(
    <>
    {lastSearches.map((searchTerm,index) => (<button className = "button" key ={searchTerm + index} type = "button" onClick={() => onLastSearch(searchTerm)}>{searchTerm}</button>))}

    </>
    );
}
export {LastSearches};