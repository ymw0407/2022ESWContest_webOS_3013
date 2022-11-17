import Button from "@enact/sandstone/Button";
import { Header, Panel } from "@enact/sandstone/Panels";
import Scroller from "@enact/ui/Scroller";
import Logs from "./Logs";
import Logs1 from "./Logs1";
import PropTypes from "prop-types";
import LS2Request from "@enact/webos/LS2Request";
import { useEffect, useState } from "react";
import css from "./MainPanel.module.less";

//-------------------------------------------------------------------
const bridge = new LS2Request(); // LS2 서비스 요청 인스턴스 생성
//-------------------------------------------------------------------
const MainPanel = ({ onClick, title, ...rest }) => {
  //useState를 통해서 log를 관리한다.
  const [registerLogs, setRegisterLogs] = useState(["임시 등록 차량"]);
  const [generalLogs, setGeneralLogs] = useState(["일반 등록 차량"]);
  //-----------------------------------------------
  // 해당 페이지가 새로 켜질때마다 maininit의 과정을 거친다.
  useEffect(() => {
    mainInit();
  }, []);
  //-----------------------------------------------------------
  // mongodb connect -> schema -> show -> setlogs의 과정을 거쳐 log를 새로고침해준다.
  function mainInit() {
    console.log("mainInit");
    let lsRequest = {
      service: "luna://com.registercar.app.service",
      method: "mainInit",
      parameters: {},
      onSuccess: (msg) => {
        console.log(msg);
        setRegisterLogs(msg.carData.register);
        setGeneralLogs(msg.carData.general);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }
  //-------------------------------------------------------------
  function closeApp(app_id) {
    var lsRequest = {
      service: "luna://com.registercar.app.service",
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
    <Panel {...rest}>
      <Header title={title} onClose={() => closeApp("com.registercar.app")} />
      <div>
        <Scroller>
          <Button
            className={css.button}
            onClick={onClick}
            backgroundOpacity="transparent"
          >
            Register
          </Button>
          <Logs>{registerLogs}</Logs>
        </Scroller>
      </div>
      <div>
        <Scroller>
          <Logs1>{generalLogs}</Logs1>
        </Scroller>
      </div>
    </Panel>
  );
};

MainPanel.propTypes = {
  closeApp: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default MainPanel;
