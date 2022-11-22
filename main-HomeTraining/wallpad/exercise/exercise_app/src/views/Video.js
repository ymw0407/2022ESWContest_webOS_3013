import VideoPlayerBase from "@enact/sandstone/VideoPlayer";
import PropTypes from "prop-types";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { useHistory } from "react-router-dom";

const Video = () => {

  const history = useHistory();
  const backBtn = () => {
    history.push('/final');
  }

  return (
    <div>
      <VideoPlayerBase onBack={backBtn}>
        <source
          src={"http://3.34.50.139:8000/exercise/output/output.mp4"}
          type="video/mp4"
        />
      </VideoPlayerBase>
    </div>
  );
};

Video.propTypes = {
  backBtn: PropTypes.func,
};

export default ThemeDecorator(Video);