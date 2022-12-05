import React from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import styled, { css } from "styled-components";
import "./Main.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LS2Request from "@enact/webos/LS2Request";

const StyledButton = styled.button`
  font-size: 40px;
  font-weight: 700;
  padding: 20px 40px;
  border: none;
  border-radius: 25px;
  color: white;
  background-color: rgb(100, 131, 149, 0.5);
  border: white;
  &:hover {
    color: rgb(157, 211, 243);
    background-color: white;
    box-shadow: 0 0 10px 0 rgb(157, 211, 243) inset,
      0 0 10px 4px rgb(157, 211, 243);
  }
`;

const Main = () => {
  const location = useLocation();
  const history = useHistory();
  const bridge = new LS2Request();
  console.log(location.state.count);

  const closeApp = (app_id) => {
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
  };

  const mainPage = () => {
    history.push({ pathname: "/video" });
  };

  return (
    <Panel className="main">
      <Header
        title="운동 보조"
        className="app-title"
        onClose={() => closeApp("com.exercise.app")}
      />
      <div className="tem">
        <div className="analysis">
          <p>총 횟수: {location.state.count}</p>
          <p>시간 : {location.state.time}</p>
          <p>5초당 최대 횟수 : {location.state.max}</p>
          <p>5초당 최소 횟수 : {location.state.min}</p>
        </div>
        <div className="png-box">
          <img
            src={`data:image/png;base64,${location.state.img.slice(2, -1)}`}
          ></img>
          <StyledButton className="but" onClick={mainPage}>
            녹화 영상 보기
          </StyledButton>
        </div>
      </div>
    </Panel>
  );
};

export default Main;
