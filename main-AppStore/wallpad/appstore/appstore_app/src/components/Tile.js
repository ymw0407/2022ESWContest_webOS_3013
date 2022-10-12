import kind from "@enact/core/kind";
import Proptypes from "prop-types";
import Button from "@enact/sandstone/Button";
import css from "./Tile.module.less";
import { useState, useEffect } from "react";
import LS2Request from "@enact/webos/LS2Request";
import thumbnail1 from "../../resources/1.png";
import thumbnail2 from "../../resources/2.png";
import thumbnail3 from "../../resources/3.png";
import thumbnail4 from "../../resources/4.png";
import thumbnail5 from "../../resources/5.png";

const bridge = new LS2Request();

const Btn = ({ app }) => {
  const [toggle, chToggle] = useState("Install");
  let app_name;
  let app_id;
  if (app == "배달") {
    app_name = "com.delivery.app_1.0.0_all.ipk";
    app_id = "com.delivery.app"
  } else if (app == "차량") {
    app_name = "com.registercar.app_1.0.0_all.ipk";
    app_id = "com.register.app"
  } else if (app == "cctv") {
    app_name = "com.cctv.app_1.0.0_all.ipk";
    app_id = "com.cctv.app"
  } else if (app == "가전제어") {
    app_name = "com.control.app_1.0.0_all.ipk";
    app_id = "com.control.app"
  } else if (app == "운동보조") {
    app_name = "com.exercise.app_1.0.0_all.ipk";
    app_id = "com.exercise.app"
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

  function appInstall(app, appname, app_id) {
    console.log("[install] " + app);
    var lsRequest = {
      service: "luna://com.appstore.app.service",
      method: "install",
      parameters: { app: app, appname : appname, appid: app_id },
      onSuccess: (msg) => {
        console.log(msg.reply);
        chToggle("Remove")
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
      parameters: { app: app, appname : appname, appid: app_id },
      onSuccess: (msg) => {
        console.log(msg.reply);
        chToggle("Install");
      },
      onFailure: (msg) => {
        console.log(msg);
        console.log("error");
      },
    };
    bridge.send(lsRequest);
  }

  function changeToggle(){
    if (toggle == "Install") {
      chToggle("Installing...");
      appInstall(app, app_name, app_id);
    } else if (toggle == "Installing..."){
      console.log("Installing...");
      toast("Installing...");
      tts("Installing...");
    } else if (toggle == "Remove"){
      chToggle("Removing...")
      appRemove(app, app_name, app_id);
    } else if (toggle == "Removing..."){
      toast("Removing...");
      tts("Removing...");
    }
  }

  return (
    <div className={css.btn}>
      <Button onClick={() => changeToggle()}>
        {toggle}
      </Button>
    </div>
  );
};

const icons = {
  배달: thumbnail1,
  차량: thumbnail2,
  cctv: thumbnail3,
  가전제어: thumbnail4,
  운동보조: thumbnail5,
};

const descs = {
  배달: "택배 상자 인식을 통한 배달 도난 방지 기능",
  차량: "방문 차량 접수도 간단하게! 차량 스케줄링 기능",
  cctv: "우리 아이 안전한가요...? CCTV 기능",
  가전제어: "터치 한번으로 간편하게! ",
  운동보조: "집에서도 운동하자! 홈 트레이닝 도우미 기능",
};

const TileBase = kind({
  name: "TileBase",

  styles: {
    css,
    className: "tile-box",
  },

  propTypes: {
    children: Proptypes.string,
    desc: Proptypes.string,
    size: Proptypes.number,
  },

  defaultProps: {
    size: 200,
  },

  render: ({ children, size, ...rest }) => {
    return (
      <div {...rest}>
        <div className={css.tile}>
          <div className={css.icon}>
            <img
              className={css.img}
              src={icons[children]}
              width={size}
              height={size}
            />
            <div className={css.appName}>{children}</div>
          </div>
          <div className={css.desc}>{descs[children]}</div>
          <Btn app={children} />
        </div>
      </div>
    );
  },
});

const Tile = TileBase;

export default TileBase;
export { Tile, TileBase };
