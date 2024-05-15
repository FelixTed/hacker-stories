import * as React from 'react';

const initialStories = [
  {
    title: "React",
    url: 'https://reactjs.org',
    author: "Jordan Walke",
    num_comment:3,
    points: 4,
    objectID:3,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author:"Dan Abramov, Andrew Clarke",
    num_comments: 3,
    points: 4,
    objectID:1,
  }
];

const getAsyncStories = () =>
  new Promise((resolve) => 
    setTimeout(() => resolve({data: {stories:initialStories}}),2000)
  );

const useSemiPersistentState = (key,initialState) => {
  const [value,setValue] = React.useState(localStorage.getItem(key)||initialState);

  React.useEffect(() => {localStorage.setItem(key,value);},[value,key]);

  return [value,setValue];
}

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState(localStorage.getItem('search'),'React');

  const[stories,setStories] = React.useState([]);
  const[isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    });
  },[]);

  const handleRemoveStory = (item) => {
    const newStories = stories.filter((story) => item.objectID !== story.objectID);
    setStories(newStories);   
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const searchedStories = stories.filter((story) =>
    story.title.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  );
  return(
    <div>
      <h1>
        welcome to my first react app
      </h1>

      <InputWithLabel id = "search" value = {searchTerm} isFocused onInputChange = {handleSearch}>
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      
      {isLoading ? (
        <p>Loading ...</p>
      ):(
        <List list = {searchedStories} onRemoveItem={handleRemoveStory} />
      )}
      

    </div>
  );
}

const List = ({list,onRemoveItem}) =>{
  console.log("List rendered");
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
