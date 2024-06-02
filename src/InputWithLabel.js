import * as React from 'react';
import "./App.css";

const InputWithLabel = ({id,type, value, isFocused, onInputChange,children}) =>{
    const inputRef = React.useRef();
  
    React.useEffect(() => {
      if(isFocused && inputRef.current){
        inputRef.current.focus()
      }
    },[isFocused])
    
    return(
      <>
      <label className='label' htmlFor={id}>{children}</label>
      &nbsp;
        <input className='input' ref = {inputRef} id={id} type={type} value = {value} autoFocus={isFocused} onChange={onInputChange}/>
  
      </>
    )}

    export { InputWithLabel }