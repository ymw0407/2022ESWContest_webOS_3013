import React from "react";
import './Cctv.css';
import { Link } from "react-router-dom";
var ip = "192.168.1.110";

const Playground = ({ children }) => {
  return (
    
    <div className="Cctv">
      <div className="app-title">CCTV<img src={"/cctv.png"} style={{float:'right' ,width:'120px'}}/></div>
      <div className="tem">
        <div className="app-list">
          <ul>
            <li><Link to='/frontdoor'>현관</Link></li>
            <li><Link to='/playground'>놀이터</Link></li>
            <li><Link to='/parking'>주차장</Link></li>
          </ul>
        </div>
        <div className="content">
          <img src={"http://" + ip + "/"} style={{margin:'auto', display:'block', backgroundColor:'white', width:'70%'}}/> 
        </div>
      </div>
  </div>
      
  );
};

export default Playground;