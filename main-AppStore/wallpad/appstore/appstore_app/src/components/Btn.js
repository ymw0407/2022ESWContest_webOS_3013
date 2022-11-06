import Button from "@enact/sandstone/Button";
import { useState, useEffect } from "react";
import LS2Request from "@enact/webos/LS2Request";
import css from "../components/Tile.module.less";
import Proptypes from "prop-types";

const bridge = new LS2Request();

const Btn = ({ app, installedApps }) => {
  const [installToggle, chInstallToggle] = useState("Install");
  const [removeToggle, chRemoveToggle] = useState("Remove");

  const app_file = app.id + "_1.0.0_all.ipk";

  // createToast 함수 - 올바른 값을 넣지 않았을때 toast, 즉 텍스트로 알림해주는 역할을 한다.
  function toast(text) {
    console.log("toast");
    let lsRequest = {
      service: "luna://com.webos.notification",
      method: "createToast",
      parameters: { message: text },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }

  //tts 함수 - 올바른 값을 넣지 않았을때 음성으로 알림해주는 역할을 한다.
  function tts(text) {
    console.log("tts");
    let lsRequest = {
      service: "luna://com.webos.service.tts",
      method: "speak",
      parameters: {
        text: text,
        language: "ko-KR",
        clear: true,
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

  function appInstall(app, appname, app_id) {
    console.log("[install] " + app);
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "install",
      parameters: { app: app, appname: appname, appid: app_id },
      onSuccess: (msg) => {
        console.log(msg.reply);
        chInstallToggle("Remove");
      },
      onFailure: (msg) => {
        console.log(msg);
        console.log("error");
      },
    };
    bridge.send(lsRequest);
  }

  function appRemove(app, appname, app_id) {
    console.log("[remove] " + app);
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "remove",
      parameters: { app: app, appname: appname, appid: app_id },
      onSuccess: (msg) => {
        console.log(msg.reply);
        chInstallToggle("Install");
      },
      onFailure: (msg) => {
        console.log(msg);
        console.log("error");
      },
    };
    bridge.send(lsRequest);
  }

  function installToRemove() {
    if (removeToggle === "Install") {
      chRemoveToggle("Installing...");
      appInstall(app.name, app_file, app.id);
    } else if (removeToggle === "Installing...") {
      console.log("Installing...");
      toast("Installing...");
      tts("Installing...");
    } else if (removeToggle === "Remove") {
      chRemoveToggle("Removing...");
      appRemove(app.name, app_file, app.id);
    } else if (removeToggle === "Removing...") {
      toast("Removing...");
      tts("Removing...");
    }
  }

  function removetoInstall() {
    if (removeToggle === "Install") {
      chInstallToggle("Installing...");
      appInstall(app.name, app_file, app.id);
    } else if (removeToggle === "Installing...") {
      console.log("Installing...");
      toast("Installing...");
      tts("Installing...");
    } else if (removeToggle === "Remove") {
      chInstallToggle("Removing...");
      appRemove(app.name, app_file, app.id);
    } else if (removeToggle === "Removing...") {
      toast("Removing...");
      tts("Removing...");
    }
  }

  if (true) {
    console.log(installedApps);
    return (
      <div className={css.btn}>
        <Button onClick={() => removetoInstall()}>{removeToggle}</Button>
        <Button onClick={() => console.log("open")}>{"open"}</Button>
      </div>
    );
  } else {
    return (
      <div className={css.btn}>
        <Button onClick={() => installToRemove()}>{installToggle}</Button>
      </div>
    );
  }
};

Btn.propTypes = {
  app: Proptypes.string,
  installedApps: Proptypes.array,
};

export default Btn;
