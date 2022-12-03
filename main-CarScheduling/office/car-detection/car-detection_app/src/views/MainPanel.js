import { Header, Panel } from "@enact/sandstone/Panels";
import Button from "@enact/sandstone/Button";
import Scroller from "@enact/ui/Scroller";
import Logs from "./Logs";
import LS2Request from "@enact/webos/LS2Request";
import { useEffect, useState } from "react";
import css from "./MainPanel.module.less";

const MainPanel = () => {
  const [cars, setCars] = useState([
    {
      time: "날짜",
      carNumber: "차량 번호",
      status: "차량 정보",
      permission: "통과 여부",
    },
  ]);
  const bridge = new LS2Request();

  async function start() {
    await init();
    loop();
  }

  useEffect(() => {
    start();
  }, []);

  const init = () => {
    return new Promise((resolve, reject) => {
      let params = {};
      let lsRequest = {
        service: "luna://com.cardetection.app.service",
        method: "init",
        parameters: params,
        onSuccess: (msg) => {
          findHandler(msg);
          resolve();
          console.log(msg);
        },
        onFailure: (err) => {
          console.log(err);
          reject();
        },
      };
      bridge.send(lsRequest);
    });
  };

  const findHandler = (res) => {
    let lst = [];
    const results = res.results;
    for (let i in results) {
      let status = "";
      let permission = "";
      if (results[i].status === "register") {
        status = "임시 등록 차량";
        permission = "통과";
      }
      if (results[i].status === "unknown") {
        status = "미등록 차량";
        permission = "거부";
      }
      if (results[i].status === "general") {
        status = "입주민 차량";
        permission = "통과";
      }
      let result = {
        time: results[i].time.slice(0, -7),
        carNumber: results[i].carNumber,
        status: status,
        permission: permission,
      };
      lst.unshift(result);
    }
    setCars(
      lst.sort((a, b) => {
        if (a > b) return -1;
        else if (b > a) return 1;
        else return 0;
      })
    );
    console.log(lst);
  };

  const loop = () => {
    let params = { subscribe: true };
    let lsRequest = {
      service: "luna://com.cardetection.app.service",
      method: "loop",
      parameters: params,
      onSuccess: (msg) => {
        console.log(msg);
        findHandler(msg);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  return (
    <Panel className={css.bg}>
      <Header title="log app" noCloseButton={true} />
      <Scroller>
        <Logs cars={cars}/>
      </Scroller>
    </Panel>
  );
};

export default MainPanel;
