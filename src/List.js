import * as React from 'react';

const List = React.memo(({list,onRemoveItem}) =>{
    console.log("List");
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
  );
  
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
          <button type = "button" onClick={() => onRemoveItem(item)} className ="button buttonSmall" >Dismiss</button>
          <Check height="18px" width = "18px" />
        </StyledColumn>
      </StyledItem>
    );
  }

  export {List};