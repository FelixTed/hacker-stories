import * as React from 'react';

const useSemiPersistentState = (key,initialState) => {
  const [value,setValue] = React.useState(localStorage.getItem(key)||initialState);

  React.useEffect(() => {localStorage.setItem(key,value);},[value,key]);

  return [value,setValue];
}

const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(localStorage.getItem('search'),'React');

  // React.useEffect(() => {
  //   localStorage.setItem("search",searchTerm);
  //   console.log('stored content');
  // },[searchTerm])

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
      
      {/*render list here */}
      <List list = {searchedStories} />

    </div>
  );
}

const List = ({list}) =>{
  console.log("List rendered");
  return(
    <ul>
       {list.map(item => (
        <Item
          key={item.objectID}
          title={item.title}   
          url={item.url}
          author={item.author}
          num_comments={item.num_comments}
          points={item.points}
        />
      ))}
      </ul>
  );
}

  const Item = ({title,url,author,num_comments,points}) =>{
    console.log("Item Rendered");
    return(
    <li>
      <span>
      <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
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
