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
  return(
    <div>
      <h1>
        welcome to my first react app
      </h1>

      <Search/>

      <hr />
      
      {/*render list here */}
      <List list = {stories} />

    </div>
  );
}

const List = (props) => (
    <ul>
        {props.list.map((item) =>  (
            <Item key = {item.objectID} item = {item}/>
          )
        )}
      </ul>
  );

  const Item = (props) => (
    <li>
      <span>
      <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comment}</span>
      <span>{props.item.points}</span>
    </li>
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
