import * as React from 'react';
import axios from 'axios';
import './App.css';
import styled from 'styled-components';
import { SiCreatereactapp } from "react-icons/si"

import { SearchForm } from './SearchForm';
import { List } from './List';
import { SortButtons } from './SortButtons';


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

// Initial state with sort states and directions
const initialState = {
  upvotesSortState: 1,
  commentsSortState: 1,
  topicSortState: 1,
  currentSort: "base"
};

// Reducer function to manage sort states and directions
const sortReducer = (state, action) => {
  console.log(state);
  switch(action.type) {
    case "upvoteSort":
      return {
        ...state,
        upvotesSortState: state.upvotesSortState * -1,
        currentSort: "UPVOTE"
      };
    case "commentSort":
      return {
        ...state,
        commentsSortState: state.commentsSortState * -1,
        currentSort: "COMMENT"
      };
    case "topicSort":
      return {
        ...state,
        topicSortState: state.topicSortState * -1,
        currentSort: "TOPIC"
      };
    case "base":
      return {
        ...state,
        currentSort: "BASE"
      };
    default:
      throw new Error("Unknown action type");
  }
};
const useSemiPersistentState = (key,initialState) => {
  const isMounted = React.useRef(false);

  const [value,setValue] = React.useState(localStorage.getItem(key)||initialState);

  React.useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
    }else{
    localStorage.setItem(key,value);
    }
  },[value,key]);

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


const getSumComments = (stories) => {
  console.log('C');

  return stories.data.reduce(
    (result, value) => result + value.num_comments,0
  );
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



  const [sortState,setSortState] = React.useReducer(sortReducer,initialState);

  const handleUpvotesSort = () => {
      setSortState({type: "upvoteSort"});
  };
  const handleCommentSort = () => {
    setSortState({type: "commentSort"});
  };
  const handleTopicSort = () => {
    setSortState({type: "topicSort"});
  };

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

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  },[]);

  const sumComments = React.useMemo(() => getSumComments(stories),[stories]);

  return(
    <StyledContainer>
      <StyledHeadlinePrimary>
        welcome to my first react app with {sumComments} comments.&nbsp;
        <SiCreatereactapp />
      </StyledHeadlinePrimary>
      
      <SearchForm searchTerm = {searchTerm} onSearchInput = {handleSearchInput} onSearchSubmit = {handleSearchSubmit}></SearchForm>
      <SortButtons onUpvotesSort = {handleUpvotesSort} onCommentsSort = {handleCommentSort} onTopicSort = {handleTopicSort} sortState={sortState}></SortButtons>
      <hr />
      
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ):(
        <List list = {stories.data} sortState = {sortState}onRemoveItem={handleRemoveStory} />
      )}
      

    </StyledContainer>
  );
}

// const List = React.memo(({list,onRemoveItem}) =>{
//   console.log("List");
//   return(
//     <ul>
//        {list.map(item => (
//         <Item
//           key={item.objectID}
//           item = {item}
//           onRemoveItem={onRemoveItem}
//         />
//       ))}
//       </ul>
//   );
// }
// );

//   const Item = ({item,onRemoveItem}) =>{
//     return(
//     <StyledItem>
//       <StyledColumn width = '40%'>
//       <a href={item.url}>{item.title}</a>
//       </StyledColumn>
//       <StyledColumn width ="30%">{item.author}</StyledColumn>
//       <StyledColumn width = "10%">{item.num_comments}</StyledColumn>
//       <StyledColumn width ="10%">{item.points}</StyledColumn>
//       <StyledColumn width = "10%">
//         <button type = "button" onClick={() => onRemoveItem(item)} className ="button buttonSmall" >Dismiss</button>
//         <Check height="18px" width = "18px" />
//       </StyledColumn>
//     </StyledItem>
//   );
// }

// const InputWithLabel = ({id,type, value, isFocused, onInputChange,children}) =>{
//   const inputRef = React.useRef();

//   React.useEffect(() => {
//     if(isFocused && inputRef.current){
//       inputRef.current.focus()
//     }
//   },[isFocused])
  
//   return(
//     <>
//     <StyledLabel htmlFor={id}>{children}</StyledLabel>
//     &nbsp;
//       <StyledInput ref = {inputRef} id={id} type={type} value = {value} autoFocus={isFocused} onChange={onInputChange}/>

//     </>
//   )}

 

  // const SearchForm = ({searchTerm,onSearchInput,onSearchSubmit}) =>(
  //   <StyledSearchForm onSubmit={onSearchSubmit}>
  //   <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {onSearchInput}>
  //     <strong>Search:</strong>
  //   </InputWithLabel>
    

  //   <StyledButtonLarge type="submit" disabled ={!searchTerm}>
  //     Submit
  //   </StyledButtonLarge>
  // </StyledSearchForm>
  // );


export default App;

