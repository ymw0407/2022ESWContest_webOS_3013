import React from "react";
import './Cctv.css';
import { Link } from "react-router-dom";

const Playground = ({ children }) => {
  return (
    
    <div className="Cctv">
<<<<<<< Updated upstream
      <div className="app-title">CCTV<img src={"/cctv.png"} style={{float:'right' ,width:'120px'}}/></div>
=======
      <button className="button btnPush xbutton" style={{width: '90px', height:'90px', marginRight: '100px', float:'right'}}><img src={require("./x.png")} style={{width:'50px', height:'50px'}} /></button>
      <div className="app-title">CCTV</div>
>>>>>>> Stashed changes
      <div className="tem">
        <div className="app-list">
          <ul>
            <li><Link to='/frontdoor'>현관</Link></li>
            <li><Link to='/playground'>놀이터</Link></li>
            <li><Link to='/parking'>주차장</Link></li>
          </ul>
        </div>
<<<<<<< Updated upstream
        <div className="content">
          <img src={"http://" + ip + "/"} style={{margin:'auto', display:'block', backgroundColor:'white', width:'70%'}}/> 
        </div>
=======
>>>>>>> Stashed changes
      </div>
      <div className="content">
        <img src="http://192.168.1.110/" style={{margin:'auto', display:'block', backgroundColor:'white', width:'100%'}}/>  
      </div>
    </div>
      
  );
};

export default Playground;