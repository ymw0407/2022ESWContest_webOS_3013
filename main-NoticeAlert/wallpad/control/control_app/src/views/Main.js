import React, { useEffect, useState } from "react";
import styled, {css} from 'styled-components';
import { useHistory } from "react-router-dom";
import './Main.css';
import LightToggle from "./LightToggle";
import CheckBox from "./CheckBox";
import CheckBox2 from "./CheckBox2";

const Main = () => {
 
  return (
    <div className="first">
      <div className="app-title">가전 제어</div>
      <div className="tem">
        <div className="light">
          <div className="lbox1">
            <LightToggle />
          </div>
        </div>
        <div className="window">
          <div className="window1">
            <p>창문</p>
            <CheckBox2 />
          </div>
        </div>
        <div className="blind">
          <div className="blind1">
            <p>블라인드</p>
            <CheckBox />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;