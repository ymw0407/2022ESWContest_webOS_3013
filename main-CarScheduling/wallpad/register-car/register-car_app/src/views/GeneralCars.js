import css from "../components/Log.module.less";

const GeneralCars = ({ cars }) => {
  const Logs = cars.map((car) => (
    <li key={cars.indexOf(car)} className={css.log}>
      <div>{car.carNumber}</div>
    </li>
  ));
  return <div>{Logs}</div>;
};

export default GeneralCars;
