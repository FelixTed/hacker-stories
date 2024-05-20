import * as React from 'react';
import axios from "axios";
import './App.scss';


  const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

  const storiesReducer = (state,action) => {
    switch(action.type){
      case "STORIES_FETCH_INIT":
        return {
          ...state,
          isLoading:true,
          isError:false
        };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isLoading:false,
          isError:false,
          data: action.payload,
        }
      case "STORIES_FETCH_FAILURE":
        return{
          ...state,
          isLoading:false,
          isError:true,
        }
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter((story) => action.payload.objectID !== story.objectID),
        }
      default:
        throw new Error();
    }
  };

const useSemiPersistentState = (key,initialState) => {
  const [value,setValue] = React.useState(localStorage.getItem(key)||initialState);

  React.useEffect(() => {localStorage.setItem(key,value);},[value,key]);

  return [value,setValue];
}

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState(localStorage.getItem('search'),'React');

  const[stories, dispatchStories] = React.useReducer(storiesReducer,{data: [], isLoading:false, isError: false});
  
  const[url,setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }
  const handleSearchSubmit = (event) =>{
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  }

  const handleFetchStories = React.useCallback(async () => {

    dispatchStories({type: "STORIES_FETCH_INIT"});


    try{
    const result = await axios.get(url);
  
    dispatchStories({
      type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    }catch{
      dispatchStories({type:"STORY_FETCH_FAILURE"});
    }
    },[url]);

  React.useEffect(() => {
    handleFetchStories();
  },[handleFetchStories]);


  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };
  
  return(
    <div className="container">
      <h1 className="headline-primary">
        welcome to my first react app
      </h1>
      
      <SearchForm searchTerm = {searchTerm} onSearchInput = {handleSearchInput} onSearchSubmit = {handleSearchSubmit}></SearchForm>

      <hr />
      
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ):(
        <List list = {stories.data} onRemoveItem={handleRemoveStory} />
      )}
      

    </div>
  );
}

const List = ({list,onRemoveItem}) =>{
  return(
    <ul>
       {list.map(item => (
        <Item
          key={item.objectID}
          item = {item}
          onRemoveItem={onRemoveItem}
        />
      ))}
      </ul>
  );
}

  const Item = ({item,onRemoveItem}) =>{

    return(
    <li className='item'>
      <span style={{width:'40%'}}>
      <a href={item.url}>{item.title}</a>
      </span>&nbsp;
      <span style={{width:"30%"}}>{item.author}</span>&nbsp;
      <span style ={{width:"10%"}}>{item.num_comments}</span>&nbsp;
      <span style = {{width:"10%"}}>{item.points}</span>&nbsp;
      <span style = {{width:"10%"}}>
        <button type = "button" onClick={() => onRemoveItem(item)} className="button button_small">Dismiss</button>
      </span>
    </li>
  );
}
  
const InputWithLabel = ({id,type, label, value, isFocused, onInputChange,children}) =>{
  const inputRef = React.useRef();

  React.useEffect(() => {
    if(isFocused && inputRef.current){
      inputRef.current.focus()
    }
  },[isFocused])
  
  return(
    <>
    <label htmlFor={id} className ="label">{children}</label>
    &nbsp;
      <input ref = {inputRef} id={id} type={type} value = {value} autoFocus={isFocused} onChange={onInputChange} className='input'/>

    </>
  )}

  const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit}) =>(
    <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {onSearchInput}>
      <strong>Search:</strong>
    </InputWithLabel>
    

    <button type="submit" disabled ={!searchTerm} className="button_large">
      Submit
    </button>
  </form>
  );


export default App;
