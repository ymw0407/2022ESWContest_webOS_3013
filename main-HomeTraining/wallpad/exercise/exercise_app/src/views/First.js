import React, { useEffect, useState } from "react";
import { Header, Panel } from "@enact/sandstone/Panels";
import styled, { css } from "styled-components";
import { useHistory } from "react-router-dom";
import LS2Request from "@enact/webos/LS2Request";
import "./First.css";

const StyledButton = styled.button`  
  font-size: 40px;
  font-weight: 700;
  padding: 20px 40px;
  border: none;
  border-radius: 25px;
  color: white;
  background-color: rgb(100,131,149,0.5);
  border: white;
  &:hover{
    color: rgb(157,211,243);
    background-color: white;
    box-shadow: 0 0 10px 0 rgb(157,211,243) inset, 0 0 10px 4px rgb(157,211,243);
  }
}
`;

const First = () => {
  const [ch, setch] = useState(false);
  const history = useHistory();
  const bridge = new LS2Request();

  useEffect(() => {
    console.log("cam on");
    let params = {};
    let lsRequest = {
      service: "luna://com.exercisedemo.app.service",
      method: "serviceStart",
      parameters: params,
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  }, []);
  const changeBut = () => {
    const butText = document.getElementById("but");
    butText.innerText = "녹화 종료";
    console.log("녹화 종료");
    setch((prevch) => !prevch);
    let params = {};
    let lsRequest = {
      service: "luna://com.exercisedemo.app.service",
      method: "record",
      parameters: params,
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };
  const ifbut = () => {
    console.log("페이지 이동");
    history.push("/load");
  };

  return (
    <Panel className="first">
      <Header
        title="운동 보조"
        className="app-title"
        onClose={() => console.log("close")}
      />
      <div className="tem">
        <div className="but">
          <StyledButton id="but" onClick={ch ? ifbut : changeBut}>
            녹화 시작
          </StyledButton>
        </div>
        <div className="content">
          <h2 className="exercise-name">팔 굽혀 펴기</h2>
          <div className="exercise-steps">
            <p>step1 : 허리 펴기</p>
            <p>step2 : 팔 굽히기</p>
            <p>step3 : 팔 펴기</p>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default First;
