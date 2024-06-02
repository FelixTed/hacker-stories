import * as React from 'react';
import "./App.css";

const SortButtons = ({onTopicSort,onUpvotesSort,onCommentsSort}) => {
    return(
        <div>
            <button className='button' onClick={onTopicSort}>Topic</button>
            <button className='button' onClick={onUpvotesSort}>Upvotes</button>
            <button className='button' onClick={onCommentsSort}>Comments</button>
        </div>
    );
}

export { SortButtons };