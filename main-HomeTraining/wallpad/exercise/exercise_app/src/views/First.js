import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import { Header } from "@enact/sandstone/Panels";
import LS2Request from "@enact/webos/LS2Request";
import "./First.css";

const StyledButton = styled.button`
  font-size: 1.5rem;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  margin-left: 8rem;
  border: none;
  border-radius: 25px;
  color: white;
  background-color: #0c7ac3;
  border: white;
  &:hover{
    color: #0c7ac3;
    background-color: rgb(235,235,235);
  }
}
`;

const First = () => {
  const [ch, setch] = useState(false);
  const history = useHistory();
  const bridge = new LS2Request()

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

  const changeBut = () => {
    const butText = document.getElementById("but");
    butText.innerText = "녹화 종료";
    console.log("녹화 종료");
    setch((prevch) => !prevch);
  };
  const ifbut = () => {
    console.log("페이지 이동");
    history.push("/load");
  };

  return (
    <div className="First">
      <Header
        className="app-title"
        title="운동 보조"
        onClose={() => closeApp("com.exercise.app")}
      />
      <div className="tem">
        <div className="but">
          <StyledButton id="but" onClick={ch ? ifbut : changeBut}>
            녹화 시작
          </StyledButton>
        </div>
      </div>
      <div className="content">
        <p>step1 : 허리 펴기</p>
        <p>step2 : 팔 굽히기</p>
        <p>step3 : 팔 펴기</p>
      </div>
    </div>
  );
};

export default First;
