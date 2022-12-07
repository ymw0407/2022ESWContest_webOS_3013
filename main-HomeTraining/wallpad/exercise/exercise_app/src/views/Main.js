import React from "react";
import styled, { css } from "styled-components";
import { Header } from "@enact/sandstone/Panels";
import LS2Request from "@enact/webos/LS2Request";
import "./Main.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const StyledButton = styled.button`
  font-size: 40px;
  font-weight: 700;
  padding: 20px 40px;
  border: none;
  border-radius: 25px;
  color: white;
  background-color: #0c7ac3;
  border: white;
  &:hover {
    color: #0c7ac3;
    background-color: rgb(235, 235, 235);
  }
`;

const Main = () => {
  const location = useLocation();
  const history = useHistory();
  const bridge = new LS2Request()
  
  console.log(location.state.count);

  const mainPage = () => {
    history.push({ pathname: "/video" });
  };


  function closeApp(app_id) {
    var lsRequest = {
      service: "luna://com.exercise.app.service",
      method: "close",
      parameters: {
        app_id: app_id,
        subscribe: true,
      },
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
    <div className="main">
      <Header
        className="app-title"
        title="운동 분석"
        onClose={() => closeApp("com.exercise.app")}
      />
      <div className="tem">
        <div className="analysis">
          <p>총 횟수: {location.state.count}</p>
          <p>시간 : {location.state.time}</p>
          <p>5초당 최대 횟수 : {location.state.max}</p>
          <p>5초당 최소 횟수 : {location.state.min}</p>
        </div>
        <div className="png">
          <img
            src={`data:image/png;base64,${location.state.img.slice(2, -1)}`}
          ></img>
        </div>
        <div className="but">
          <StyledButton onClick={mainPage}>녹화영상보기</StyledButton>
        </div>
      </div>
    </div>
  );
};

export default Main;
