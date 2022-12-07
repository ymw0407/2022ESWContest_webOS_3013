import React, { useState, useEffect } from "react";
import spinner from '../gif/spinner.gif';
import './Loading.css';
import { useHistory } from "react-router-dom";



const Loading = (props) => {
  //const [loading, setLoading] = useState(true);
  const history = useHistory();
  

  const nextPage = () => {
    history.push({pathname: '/main'});
  }

  return (
    <div className="load">
      { <img src={spinner} style={{"width":"200px", "display":"flex"}} />}
    </div>
  )
}

export default Loading;