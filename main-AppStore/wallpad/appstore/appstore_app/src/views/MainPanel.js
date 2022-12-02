import { Panel, Header } from "@enact/sandstone/Panels";
import Scroller from "@enact/sandstone/Scroller";
import LS2Request from "@enact/webos/LS2Request";
import Tiles from "../components/Tiles";
import { useState, useEffect } from "react";
import css from "./MainPanel.module.less";

const bridge = new LS2Request();
const APP_ID = "com.appstore.app";

const MainPanel = ({ ...rest }) => {
  const [InstalledAppList, setInstalledAppList] = useState([]);
  const [appList, setAppList] = useState([]);

  useEffect(() => {
    appInit();
  }, []);

  const appInit = async () => {
    await appSetUp();
    getInstalledApps();
  };

  const appSetUp = () => {
    return new Promise((resolve, reject) => {
      let params = {};
      let lsRequest = {
        service: "luna://com.appstore.app.service",
        method: "appSetUp",
        parameter: params,
        onSuccess: (msg) => {
          setAppList(msg.appList);
          resolve();
          console.log(msg);
        },
        onFailure: (err) => {
          reject();
          console.log(err);
        },
      };
      bridge.send(lsRequest);
    });
  };

  const getInstalledApps = () => {
    return new Promise((resolve, reject) => {
      let params = { subscribe: true };
      let lsRequest = {
        service: "luna://com.appstore.app.service",
        method: "getInstalledApps",
        parameter: params,
        onSuccess: (msg) => {
          setInstalledAppList(msg.installedApps);
          resolve();
          console.log("getInstalledApps", InstalledAppList);
        },
        onFailure: (err) => {
          console.log(err);
          reject();
        },
      };
      bridge.send(lsRequest);
    });
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

  return (
    <Panel className={css.gnd} {...rest}>
      <Header
        onClose={() => appClose(APP_ID)}
        className={css.gnd}
        title="Home++ App Store"
      />
      <Scroller direction="vertical">
        <Tiles apps={appList} installedApps={InstalledAppList}></Tiles>
        <p className={css.madeby}>Copyright © 2022 방파제</p>
      </Scroller>
    </Panel>
  );
};

export default MainPanel;
