import Button from "@enact/sandstone/Button";
import { Header, Panel } from "@enact/sandstone/Panels";
import Scroller from "@enact/ui/Scroller";
import RegisteredCars from "./RegisteredCars";
import GeneralCars from "./GeneralCars";
import PropTypes from "prop-types";
import LS2Request from "@enact/webos/LS2Request";
import { useEffect, useState } from "react";
import css from "./MainPanel.module.less";

//-------------------------------------------------------------------
const bridge = new LS2Request(); // LS2 서비스 요청 인스턴스 생성
//-------------------------------------------------------------------
const MainPanel = ({ onClick, title, ...rest }) => {
  //useState를 통해서 log를 관리한다.
  const [registerLogs, setRegisterLogs] = useState([
    {
      carNumber: "임시 등록 차량",
      startAt: "시작 시간",
      expireAt: "종료 시간",
      status: "상태",
    },
  ]);
  const [generalLogs, setGeneralLogs] = useState([
    { carNumber: "일반 등록 차량" },
  ]);
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
      <Button
        className={css.button}
        onClick={onClick}
        backgroundOpacity="transparent"
      >
        Register
      </Button>
      <Scroller direction="vertical">
        <RegisteredCars cars={registerLogs} mainInit={mainInit} />
        <GeneralCars cars={generalLogs} />
      </Scroller>
    </Panel>
  );
};

MainPanel.propTypes = {
  closeApp: PropTypes.func,
  onClick: PropTypes.func,
  title: PropTypes.string,
};

export default MainPanel;
