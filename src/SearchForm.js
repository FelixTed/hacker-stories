import * as React from 'react';
import { InputWithLabel } from './InputWithLabel';
import './App.css';


const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit}) =>(
    <form onSubmit={onSearchSubmit} className='search-form'>
    <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {onSearchInput}>
      <strong>Search:</strong>
    </InputWithLabel>
    

    <button className='button button_large' type="submit" disabled ={!searchTerm}>
      Submit
    </button>
  </form>
  );

  export { SearchForm }; 