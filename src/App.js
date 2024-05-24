import * as React from 'react';
import axios from "axios";
import styles from './App.module.css';
import styled from 'styled-components';
import {ReactComponent as Check} from './check.svg';

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

const StyledContainer = styled.div`

  height: 100vw;
  padding; 20px;

  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);

  color: #171212;

`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight:300;
  letter-spacing: 2px;
`;

const StyledItem = styled.li`
display: flex;
align-items: center;
padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.1s ease-in;

  &:hover{
    backgroud: #171212;
    color: #ffffff;
  }
`;
// const StyledButtonSmall = styled(StyledButton)`
//   padding: 5px;
// `;
const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;
const StyledSearchForm = styled.form`
  padding: 10px 0 20 px 0;
  dispaly: flex;
  align-items: baseline;
`;
const StyledLabel = styled.label`
  border-top: 10px solid #171212;
  border-left: 10px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;
const StyledInput =styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;

  font-size: 24px;
`;

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
    <StyledContainer>
      <StyledHeadlinePrimary>
        welcome to my first react app
      </StyledHeadlinePrimary>
      
      <SearchForm searchTerm = {searchTerm} onSearchInput = {handleSearchInput} onSearchSubmit = {handleSearchSubmit}></SearchForm>

      <hr />
      
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ):(
        <List list = {stories.data} onRemoveItem={handleRemoveStory} />
      )}
      

    </StyledContainer>
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
    <StyledItem>
      <StyledColumn width = '40%'>
      <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn width ="30%">{item.author}</StyledColumn>
      <StyledColumn width = "10%">{item.num_comments}</StyledColumn>
      <StyledColumn width ="10%">{item.points}</StyledColumn>
      <StyledColumn width = "10%">
        <StyledButton type = "button" onClick={() => onRemoveItem(item)} >Dismiss</StyledButton>
        <Check height="18px" width = "18px" />
      </StyledColumn>
    </StyledItem>
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
    <StyledLabel htmlFor={id}>{children}</StyledLabel>
    &nbsp;
      <StyledInput ref = {inputRef} id={id} type={type} value = {value} autoFocus={isFocused} onChange={onInputChange}/>

    </>
  )}

  const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit}) =>(
    <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {onSearchInput}>
      <strong>Search:</strong>
    </InputWithLabel>
    

    <StyledButtonLarge type="submit" disabled ={!searchTerm}>
      Submit
    </StyledButtonLarge>
  </StyledSearchForm>
  );


export default App;
