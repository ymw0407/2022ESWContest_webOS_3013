import { Panel, Header } from "@enact/sandstone/Panels";
import Scroller from "@enact/sandstone/Scroller";
import LS2Request from "@enact/webos/LS2Request";
import Tile from "../components/Tile";
import { useState, useEffect, useLayoutEffect } from "react";
import Proptypes from "prop-types";
import css from "./Tiles.module.less";

const apps = [
  {
    name: "배달",
    desc: "택배 상자 인식을 통한 배달 도난 방지 기능",
    id: "com.delivery.app",
  },
  {
    name: "차량",
    desc: "방문 차량 접수도 간단하게! 차량 스케줄링 기능",
    id: "com.register.app",
  },
  {
    name: "cctv",
    desc: "우리 아이 안전한가요...? CCTV 기능",
    id: "com.cctv.app",
  },
  { name: "가전제어", desc: "터치 한번으로 간편하게!", id: "com.control.app" },
  {
    name: "운동보조",
    desc: "집에서도 운동하자! 홈 트레이닝 도우미 기능",
    id: "com.exercise.app",
  },
];

const Tiles = ({ ...rest }) => {
  let installedApps;

  const bridge = new LS2Request();

  const getInstalledApps = () => {
    let params = { subscribe: true };
    let lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "getInstalledApps",
      parameter: params,
      onSuccess: (msg) => {
        console.log(msg);
        installedApps = msg.installedApps;
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  useEffect(() => {
    getInstalledApps();
  }, []);

  return (
    <Panel className={css.gnd} {...rest}>
      <Header className={css.gnd} title="Home++ App Store" />
      <Scroller direction="vertical">
        <Tile apps={apps} installedApps={installedApps}></Tile>
        <p className={css.madeby}>Copyright © 2022 방파제</p>
      </Scroller>
    </Panel>
  );
};

export default Tiles;
