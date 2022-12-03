import { Header, Panel } from "@enact/sandstone/Panels";
import Scroller from "@enact/ui/Scroller";
import Button from "@enact/sandstone/Button";
import Logs from "../../components/log-app/Logs";
import LS2Request from "@enact/webos/LS2Request";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import css from "./LogPanel.module.less";

const LogPanel = ({ onClick }) => {
  const [logs, setLogs] = useState([
    { time: "도착/수령 시간", status: "도착/수령" },
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
      let params = { subscribe: true };
      let lsRequest = {
        service: "luna://com.delivery.app.service",
        method: "init",
        parameters: params,
        onSuccess: (msg) => {
          findHandler(msg);
          resolve();
          console.log("[init] " + msg);
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
    let time = res.time;
    let status = "";
    for (let i in results) {
      if (results[i].status === "arrived") {
        status = "도착";
      }
      if (results[i].status == "received") {
        status = "수령";
      }
      lst.unshift({time: time, status: status});
    }
    setLogs(lst);
    console.log("[findHandler] " + lst);
  };

  const loop = () => {
    let params = { subscribe: true };
    let lsRequest = {
      service: "luna://com.delivery.app.service",
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

  function closeApp(app_id) {
    var lsRequest = {
      service: "luna://com.delivery.app.service",
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
    <Panel className={css.gnd}>
      <Header
        className={css.gnd}
        title="배달 기록 조회"
        onClose={() => {
          closeApp("com.delivery.app");
        }}
      />
      <Button cssName={css.btn} onClick={onClick}>
        영상 조회
      </Button>
      <Scroller>
        <Logs logs={logs}/>
      </Scroller>
    </Panel>
  );
};

LogPanel.propTypes = {
  onClick: PropTypes.func,
};

export default LogPanel;
