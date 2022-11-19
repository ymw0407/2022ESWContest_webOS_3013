import Button from "@enact/sandstone/Button";
import css from "../components/Log.module.less";

const RegisteredCars = ({ cars }) => {
  const Logs = cars.map((car) => (
    <li key={cars.indexOf(car)}>
      <div className={css.log}>
        <div>{car.carNumber}</div>
        <div>{car.startAt}</div>
        <div>{car.expireAt}</div>
        <div>{car.status}</div>
        <Button
          onClick={() => {
            console.log("remove");
          }}
        >
          remove
        </Button>
      </div>
    </li>
  ));
  return <div>{Logs}</div>;
};

export default RegisteredCars;
