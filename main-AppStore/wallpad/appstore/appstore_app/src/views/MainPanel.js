import { Panel, Header } from "@enact/sandstone/Panels";
import Scroller from "@enact/sandstone/Scroller";
import LS2Request from "@enact/webos/LS2Request";
import Tiles from "../components/Tiles";
import WebOSApp from "../WebOSApp";
import { useState, useEffect } from "react";
import css from "./MainPanel.module.less";

import delivery_icon from "../../resources/1.png";
import registercar_icon from "../../resources/2.png";
import cctv_icon from "../../resources/3.png";
import control_icon from "../../resources/4.png";
import exercise_icon from "../../resources/5.png";

const bridge = new LS2Request();
const APP_ID = "com.appstore.app";

const delivery = new WebOSApp(
  "배달",
  "com.delivery.app",
  "택배 상자 인식을 통한 배달 도난 방지 기능",
  delivery_icon
);
const registercar = new WebOSApp(
  "차량",
  "com.registercar.app",
  "방문 차량 접수도 간단하게! 차량 스케줄링 기능",
  registercar_icon
);
const cctv = new WebOSApp(
  "CCTV",
  "com.cctv.app",
  "우리 아이 안전한가요...? CCTV 기능",
  cctv_icon
);
const control = new WebOSApp(
  "가전제어",
  "com.control.app",
  "터치 한번으로 간편하게!",
  control_icon
);
const exercise = new WebOSApp(
  "운동보조",
  "com.exercise.app",
  "집에서도 운동하자! 홈 트레이닝 도우미 기능",
  exercise_icon
);

const apps = [delivery, registercar, cctv, control, exercise];

const MainPanel = ({ ...rest }) => {
  const [List, setList] = useState([]);

  useEffect(() => {
    checkAppsdir();
  }, []);

  const checkAppsdir = () => {
    let params = {};
    let lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "checkAppsdir",
      parameter: params,
      onSuccess: (msg) => {
        console.log("checked");
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  const getInstalledApps = () => {
    let params = { subscribe: true };
    let lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "getInstalledApps",
      parameter: params,
      onSuccess: (msg) => {
        setList(msg.installedApps);
        console.log("getInstalledApps", List);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  function appClose(app_id) {
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "close",
      parameters: {
        app_id: app_id,
        subscribe: true,
      },
      onSuccess: (msg) => {
        console.log(msg.reply);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }

  useEffect(() => {
    getInstalledApps();
  }, []);

  return (
    <Panel className={css.gnd} {...rest}>
      <Header
        onClose={() => appClose(APP_ID)}
        className={css.gnd}
        title="Home++ App Store"
      />
      <Scroller direction="vertical">
        <Tiles apps={apps} installedApps={List}></Tiles>
        <p className={css.madeby}>Copyright © 2022 방파제</p>
      </Scroller>
    </Panel>
  );
};

export default MainPanel;
