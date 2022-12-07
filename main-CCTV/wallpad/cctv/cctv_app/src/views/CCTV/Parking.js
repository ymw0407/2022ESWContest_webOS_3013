import React from "react";
import "./Cctv.css";
import { Link } from "react-router-dom";
import LS2Request from "@enact/webos/LS2Request";

const bridge = new LS2Request();

const Parking = () => {

  const closeApp = (app_id) => {
    let lsRequest = {
      service: "luna://com.webos.service.applicationmanager",
      method: "close",
      parameters: {
        id: app_id,
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  };

  const launchApp = (app_id) => {
    return new Promise((resolve, reject) => {
      let lsRequest = {
        service: "luna://com.webos.service.applicationmanager",
        method: "launch",
        parameters: {
          id: app_id,
        },
        onSuccess: (msg) => {
          console.log(msg);
          resolve();
        },
        onFailure: (msg) => {
          console.log(msg);
          reject();
        },
      };
      bridge.send(lsRequest);
    });
  };

  return (
    <div className="Cctv">
      <button
        className="button btnPush xbutton"
        style={{
          width: "90px",
          height: "90px",
          marginTop: "100px",
          marginRight: "100px",
          float: "right",
        }}
        onClick={() => {
          launchApp("com.webos.app.home");
          closeApp("com.cctv.app");
        }}
      >
        <img
          src={require("./x.png")}
          style={{ width: "50px", height: "50px" }}
        />
      </button>
      <div className="app-title">CCTV</div>
      <div className="tem">
        <div className="app-list">
          <ul>
            <li>
              <Link to="/frontdoor">현관</Link>
            </li>
            <li>
              <Link to="/playground">놀이터</Link>
            </li>
            <li>
              <Link to="/parking">주차장</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="content">
        <img
          src="http://192.168.1.109"
          style={{
            margin: "auto",
            display: "block",
            backgroundColor: "white",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Parking;
