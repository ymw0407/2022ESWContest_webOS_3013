import React from "react";
import './Cctv.css';
import { Link } from "react-router-dom";

const Parking = ({ children }) => {
  return (
    
    <div className="Cctv">
      <div className="app-title">CCTV</div>
      <div className="tem">
        <div className="app-list">
          <ul>
            <li><Link to='/frontdoor'>현관</Link></li>
            <li><Link to='/playground'>놀이터</Link></li>
            <li><Link to='/parking'>주차장</Link></li>
          </ul>
        </div>
        <div className="content">
          <img src="http://192.168.1.109/" style={{width:'1000px', marginLeft:'-1367px'}}/> 
        </div>
      </div>
  </div>
      
  );
};

export default Parking;