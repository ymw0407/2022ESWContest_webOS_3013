import React from "react";
import './Cctv.css';
import { Link } from "react-router-dom";

const Frontdoor = ({ children }) => {
  return (
    
    <div className="Cctv" >
      <div className="app-title">CCTV</div>
      <div className="tem">
        <div className="app-list">
          <ul>
            <li><Link to='/frontdoor'>현관</Link></li>
            <li><Link to='/playground'>놀이터</Link></li>
            <li><Link to='/parking'>주차장</Link></li>
          </ul>
        </div>
      </div>
      <div className="content">
        <img src="http://192.168.1.28/" style={{margin:'auto', display:'block', backgroundColor:'white', width:'70%'}}/> 
      </div>
  </div>
      
  );
};

export default Frontdoor;