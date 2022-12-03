import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import "./Main.css";
import LightToggle from "./LightToggle";
import CheckBox from "./CheckBox";
import CheckBox2 from "./CheckBox2";
import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();

const Main = () => {
  function closeApp() {
    var lsRequest = {
      service: "luna://com.control.app.service",
      method: "closeApp",
      parameters: {app_id: "com.control.app"},
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }

  return (
    <div className="first">
      <button
        className="button btnPush xbutton"
        style={{
          width: "90px",
          height: "90px",
          marginTop: "100px",
          marginRight: "100px",
          float: "right",
        }}
        onClick={() => closeApp()}
      >
        <img
          src={require("./x.png")}
          style={{ width: "50px", height: "50px" }}
        />
      </button>
      <div className="app-title">
        가전 제어
        <img
          src={require("./blind.png")}
          style={{
            float: "right",
            width: "300px",
            marginRight: "200px",
            marginTop: "-30px",
          }}
        />
      </div>
      <div className="tem">
        <div className="light">
          <div className="lbox1">
            <LightToggle />
          </div>
        </div>
        <div className="tem2">
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
      <div className="footer">
        <img src={"/control.png"} style={{ float: "right", width: "400px" }} />
      </div>
    </div>
  );
};

export default Main;
