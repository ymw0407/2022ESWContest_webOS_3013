import Button from "@enact/sandstone/Button";
import { useState, useEffect } from "react";
import LS2Request from "@enact/webos/LS2Request";
import css from "../components/Tile.module.less";
import Proptypes from "prop-types";

const bridge = new LS2Request();

const Btn = ({ app, installedApps }) => {
  const [state, setState] = useState("install");

  useEffect(() => {
    btnInit();
  }, [installedApps]);

  function btnInit() {
    console.log(app, installedApps);
    if (installedApps.includes(app.id)) {
      setState("remove");
    }
  }

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

  function appInstall(app_name, app_id, app_file) {
    console.log("[install] " + app_name);
    console.log("Installing...");
    toast("Installing...");
    tts("Installing...");
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "install",
      parameters: {
        app_name: app_name,
        app_id: app_id,
        app_file: app_file,
        subscribe: true,
      },
      onSuccess: (msg) => {
        console.log(msg.reply);
        setState("remove");
      },
      onFailure: (msg) => {
        console.log(msg);
        console.log("error");
        setState("Failed to install");
        setTimeout(() => {
          setState("install");
        }, 500);
      },
    };
    bridge.send(lsRequest);
  }

  function appRemove(app_name, app_id, app_file) {
    console.log("[remove] " + app_name);
    console.log("Removing...");
    toast("Removing...");
    tts("Removing...");
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "remove",
      parameters: {
        app_name: app_name,
        app_id: app_id,
        app_file: app_file,
        subscribe: true,
      },
      onSuccess: (msg) => {
        console.log(msg.reply);
        setState("install");
      },
      onFailure: (msg) => {
        console.log(msg);
        console.log("error");
        setState("Failed to remove");
        setTimeout(() => {
          setState("remove");
        }, 500);
      },
    };
    bridge.send(lsRequest);
  }

  function appOpen(app_id) {
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "open",
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
  const app_file = app.id + "_1.0.0_all.ipk";
  function buttonOnClick() {
    // install
    if (state === "install") {
      setState("Installing...");
      appInstall(app.name, app.id, app_file);
      // remove
    } else if (state === "remove") {
      setState("Removing...");
      appRemove(app.name, app.id, app_file);
    }
  }

  return (
    <div className={css.btn}>
      <Button onClick={() => buttonOnClick()}>{state}</Button>
      {state === "remove" && (
        <Button onClick={() => appOpen(app.id)}>open</Button>
      )}
    </div>
  );
};

Btn.propTypes = {
  app: Proptypes.string,
  installedApps: Proptypes.array,
};

export default Btn;
