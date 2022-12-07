import Proptypes from "prop-types";
import css from "./Logs.module.less";

// import css from "../components/Log.module.less";

const Logs = ({ logs }) => {
  const Logs = logs.map((log) => (
    <li key={logs.indexOf(log)}>
      <div className={css.log}>
        <div>{log.time}</div>
        <div>{log.status}</div>
      </div>
    </li>
  ));
  return (
    <div>
      <div>{Logs}</div>
    </div>
  );
};

Logs.propTypes = {
  logs: Proptypes.array,
};

export default Logs;
