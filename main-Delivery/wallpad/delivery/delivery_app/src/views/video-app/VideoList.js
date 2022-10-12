import { Header, Panel } from "@enact/sandstone/Panels";
import Scroller from "@enact/ui/Scroller";
import Button from "@enact/sandstone/Button";
import Proptype from "prop-types";
import LS2Request from "@enact/webos/LS2Request";
import { useEffect, useState } from "react";
import css from "./VideoList.module.less";

import Tiles from "./Tiles";

const VideoList = ({ onSelectVid, onClick, ...rest }) => {
  const [tiles, setTiles] = useState(["loading"]);

  const bridge = new LS2Request();
  const getVids = () => {
    let params = {};
    let lsRequest = {
      service: "luna://com.delivery.app.service",
      method: "getVids",
      parameter: params,
      onSuccess: (msg) => {
        console.log(msg);
        setTiles(msg.vidlist);
      },
      onFailure: (err) => {
        console.log(err);
      },
    };
    bridge.send(lsRequest);
  };

  useEffect(() => {
    getVids();
  }, []);

  return (
    <Panel className={css.gnd} {...rest}>
      <Header className={css.gnd} title="영상 조회" />
      <Button className={css.btn} onClick={onClick}>
        배달 기록 조회
      </Button>
      <Scroller>
        <Tiles onSelectVid={onSelectVid}>{tiles}</Tiles>
      </Scroller>
    </Panel>
  );
};

VideoList.prototype = {
  onSelectVid: Proptype.func,
  onClick: Proptype.func,
};

export default VideoList;
