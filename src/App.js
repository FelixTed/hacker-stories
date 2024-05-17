import * as React from 'react';
import axios from "axios";

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
  const handleSearchSubmit = () =>{
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  const handleFetchStories = React.useCallback(() => {

    dispatchStories({type: "STORIES_FETCH_INIT"});

    axios
    .get(url)
    .then((result) => {
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    })
    .catch(() => dispatchStories({type:"STORIES_FETCH_FAILURE"})
    );
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
    <div>
      <h1>
        welcome to my first react app
      </h1>

      <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {handleSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>

      <button
        type="button"
        disabled ={!searchTerm}
        onClick={handleSearchSubmit}
      >
        Submit
      </button>

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
    <li>
      <span>
      <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type = "button" onClick={() => onRemoveItem(item)}>Dismiss</button>
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
    <label htmlFor={id}>{children}</label>
    &nbsp;
      <input ref = {inputRef} id={id} type={type} value = {value} autoFocus={isFocused} onChange={onInputChange}/>

    </>
  )}


export default App;
