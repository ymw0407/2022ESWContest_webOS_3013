import Button from "@enact/sandstone/Button";
import { useState, useEffect } from "react";
import LS2Request from "@enact/webos/LS2Request";
import css from "../components/Tiles.module.less";
import Proptypes from "prop-types";

const bridge = new LS2Request();

const Btn = ({ app, installedApps, installState, setInstallState }) => {
  const [btnState, setBtnState] = useState("install");

  useEffect(() => {
    btnInit();
  }, [installedApps]);

  function btnInit() {
    if (installedApps.includes(app.id)) {
      setBtnState("remove");
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
    setInstallState("installing");
    console.log("[install] " + app_name);
    toast(app_name + "앱을 설치합니다.");
    tts(app_name + "앱을 설치합니다.");
    let lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "install",
      parameters: {
        app_name: app_name,
        app_id: app_id,
        app_file: app_file,
        subscribe: true,
      },
      onSuccess: (msg) => {
        toast(app_name + "앱 설치가 완료되었습니다.");
        tts(app_name + "앱이 설치되었습니다.");
        console.log(msg.reply);
        setBtnState("remove");
        setInstallState("idle");
      },
      onFailure: (err) => {
        console.log(err);
        setBtnState("Failed to install");
        setTimeout(() => {
          setBtnState("install");
        }, 500);
        setInstallState("idle");
      },
    };
    bridge.send(lsRequest);
  }

  function appRemove(app_name, app_id, app_file) {
    setInstallState("removing");
    console.log("[remove] " + app_name);
    toast(app_name + "앱을 삭제합니다.");
    tts(app_name + "앱을 삭제합니다.");
    let lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "remove",
      parameters: {
        app_name: app_name,
        app_id: app_id,
        app_file: app_file,
        subscribe: true,
      },
      onSuccess: (msg) => {
        toast(app_name + "앱 삭제가 완료되었습니다.");
        tts(app_name + "앱이 삭제되었습니다.");
        console.log(msg.reply);
        setBtnState("install");
        setInstallState("idle");
      },
      onFailure: (err) => {
        console.log(err);
        setBtnState("Failed to remove");
        setTimeout(() => {
          setBtnState("remove");
        }, 500);
        setInstallState("idle");
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
    // 다른 앱 설치나 삭제 중이 아닐 때
    if (installState == "idle") {
      // install
      if (btnState === "install") {
        setBtnState("Installing...");
        appInstall(app.name, app.id, app_file);
        // remove
      } else if (btnState === "remove") {
        setBtnState("Removing...");
        appRemove(app.name, app.id, app_file);
      }
      // 다른 앱 설치나 삭제 중일 때
    } else {
      let opStatus = "";
      if (installState == "installing"){
        opStatus = "설치 중"
      }
      if (installState == "removing"){
        opStatus = "삭제 중"
      }
      console.log("다른 앱 " + opStatus + " 입니다.")
    }
  }

  return (
    <div className={css.btn}>
      <Button onClick={() => buttonOnClick()}>{btnState}</Button>
      {btnState === "remove" && (
        <Button onClick={() => appOpen(app.id)}>open</Button>
      )}
    </div>
  );
};

Btn.propTypes = {
  app: Proptypes.object,
  installedApps: Proptypes.array,
  setInstallState: Proptypes.func,
  installState: Proptypes.string,
};

export default Btn;
