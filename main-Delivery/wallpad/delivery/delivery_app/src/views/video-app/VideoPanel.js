import kind from "@enact/core/kind";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { Panels } from "@enact/sandstone/Panels";
import Chanageable from "@enact/ui/Changeable";
import PropTypes from "prop-types";

import VideoList from "./VideoList";
import Video from "./Video";

import css from "./VideoPanel.module.less";

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
  },

  render: ({ index, video, onNavigate_, onSelectVid, onClick, ...rest }) => (
    <div {...rest}>
      <Panels index={index} onBack={onNavigate_}>
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
