import Proptypes from "prop-types";
import css from "./Logs.module.less";

const Logs = ({ cars }) => {
  const appList = cars.map((car) => (
    <li key={cars.indexOf(car)}>
      <div className={css.tile}>
        <div className={css.content} >{car.time}</div>
        <div className={css.content}>{car.carNumber}</div>
        <div className={css.content}>{car.status}</div>
        <div className={css.content}>{car.permission}</div>
      </div>
    </li>
  ));
  return (
    <div>
      <div>{appList}</div>
    </div>
  );
};

Logs.propTypes = {
  cars: Proptypes.array,
};

export default Logs;