import kind from "@enact/core/kind";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { Panels } from "@enact/sandstone/Panels";
import Chanageable from "@enact/ui/Changeable";
import LS2Request from "@enact/webos/LS2Request";
import PropTypes from "prop-types";

import VideoList from "./VideoList";
import Video from "./Video";

import css from "./VideoPanel.module.less";

const bridge = new LS2Request();

const Sample = kind({
  name: "App",

  styles: {
    css,
    className: "app",
  },

  propTypes: {
    index: PropTypes.number,
    video: PropTypes.number,
    onNavigate_: PropTypes.func,
    onSelectVid: PropTypes.func,
    onClick: PropTypes.func,
    closeApp: PropTypes.func,
    backBtn: PropTypes.func,
  },

  defaultProps: {
    index: 0,
  },

  handlers: {
    onSelectVid: (ev, { onNavigate_, onSelectVid }) => {
      if (onSelectVid) {
        onSelectVid({
          video: ev.index,
        });
      }

      // navigate to the detail panel on selection
      if (onNavigate_) {
        onNavigate_({
          index: 1,
        });
      }
    },

    backBtn: ({ onNavigate_ }) => {
      onNavigate_({
        index: 0,
      });
    },
    closeApp: (app_id) => {
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
    },
  },

  render: ({
    index,
    video,
    onNavigate_,
    onSelectVid,
    onClick,
    closeApp,
    ...rest
  }) => (
    <div {...rest}>
      <Panels
        index={index}
        onBack={onNavigate_}
        onClose={() => {
          closeApp("com.delivery.app");
        }}
      >
        <VideoList onSelectVid={onSelectVid} onClick={onClick}></VideoList>
        <Video index={video} backBtn={onNavigate_} />
      </Panels>
    </div>
  ),
});

const VideoPanel = Chanageable(
  { prop: "index", change: "onNavigate_" },
  Chanageable({ prop: "video", change: "onSelectVid" }, Sample)
);

export default ThemeDecorator(VideoPanel);
