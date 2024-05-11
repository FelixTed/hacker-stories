import * as React from 'react';


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
const handleSearch = (event) => {
  console.log(event.target.value);
};

  return(
    <div>
      <h1>
        welcome to my first react app
      </h1>

      <Search onSearch={handleSearch}/>

      <hr />
      
      {/*render list here */}
      <List list = {stories} />

    </div>
  );
}

const List = (props) =>{
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
  
const Search = (props) =>{
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);

    props.onSearch(event);
  };
  return(
    <div>
    <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={handleChange}/>

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );
}


export default App;
