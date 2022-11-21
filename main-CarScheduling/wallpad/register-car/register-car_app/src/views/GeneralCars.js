import css from "../components/Log.module.less";

const GeneralCars = ({ cars }) => {
  const Logs = cars.map((car) => (
    <li key={cars.indexOf(car)} className={css.log}>
      <div>{car.carNumber}</div>
    </li>
  ));
  return (
    <div>
      <div>일반 등록 차량</div>
      <div>{Logs}</div>
    </div>
  );
};

export default GeneralCars;
