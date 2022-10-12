import kind from "@enact/core/kind";
import VideoPlayerBase from "@enact/sandstone/VideoPlayer";
import Panel from "@enact/sandstone/Panels";
import LS2Request from "@enact/webos/LS2Request";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Player = ({ index, backBtn }) => {
  const [vids, setVids] = useState([]);
  const vid_index = index;
  console.log(vid_index);

  const bridge = new LS2Request();

  const getVids = () => {
    let params = {};
    let lsRequest = {
      service: "luna://com.delivery.app.service",
      method: "getVids",
      parameter: params,
      onSuccess: (msg) => {
        console.log(msg.vidlist);
        setVids(msg.vidlist);
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
    <VideoPlayerBase title={vids[vid_index]} onBack={backBtn}>
      <source
        src={"http://3.34.50.139:8000/package/" + vids[vid_index] + ".mp4"}
        // src={"http://3.34.50.139:8000/package/koss.mp4"}
        type="video/mp4"
      />
    </VideoPlayerBase>
  );
};

Player.propTypes = {
  index: PropTypes.number,
  backBtn: PropTypes.func,
};

const VideoBase = kind({
  name: "VideoBase",

  propTypes: {
    index: PropTypes.number,
    backBtn: PropTypes.func,
  },

  render: ({ index, backBtn, ...rest }) => (
    <Panel {...rest}>
      <Player index={index} backBtn={backBtn} />
    </Panel>
  ),
});

const Video = VideoBase;

export default Video;
export { VideoBase as Video, VideoBase };
