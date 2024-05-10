import * as React from 'react';

const list = [
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

const App = () => (
    <div>
      <h1>
        welcome to my first react app
      </h1>

      <Search/>

      <hr />
      
      {/*render list here */}
      <List />

    </div>
  );

const List = () => (
    <ul>
        {list.map((item) =>  (
            <li key={item.objectID}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comment}</span>
              <span>{item.points}</span>
            </li>
          )
        )}
      </ul>
  );
  
const Search = () =>{
  const handleChange = (event) => {
    console.log(event.target.value);
  }
  return(
    <div>
    <label htmlFor="search">Search:</label><br></br>
      <input id="search" type="text" onChange={handleChange}/>
    </div>
  );
}


export default App;
