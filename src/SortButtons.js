import * as React from 'react';
import "./App.css";

const SortButtons = () => {
    return(
        <div>
            <button className='button'>Topic</button>
            <button className='button'>Upvotes</button>
            <button className='button'>Comments</button>
        </div>
    );
}

export { SortButtons };