import * as React from 'react';


const App = () => {
  console.log("App Rendered");
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

  const [searchTerm, setSearchTerm] = React.useState('React');

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

      <Search search = {searchTerm} onSearch={handleSearch}/>

      <hr />
      
      {/*render list here */}
      <List list = {searchedStories} />

    </div>
  );
}

const List = (props) =>{
  console.log("List rendered");
  return(
    <ul>
        {props.list.map((item) =>  (
            <Item key = {item.objectID} item = {item}/>
          )
        )}
      </ul>
  );
}

  const Item = (props) =>{
    console.log("Item Rendered");
    return(
    <li>
      <span>
      <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comment}</span>
      <span>{props.item.points}</span>
    </li>
  );
}
  
const Search = ({search,onSearch}) =>{
  return(
    <div>
    <label htmlFor="search">Search:</label>
      <input id="search" type="text" value = {search} onChange={onSearch}/>

    </div>
  )}


export default App;
