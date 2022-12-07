import Button from "@enact/sandstone/Button";
import LS2Request from "@enact/webos/LS2Request";
import css from "../components/Log.module.less";
import MainPanel from "./MainPanel";
//-------------------------------------------------------------------
const bridge = new LS2Request(); // LS2 서비스 요청 인스턴스 생성
//-------------------------------------------------------------------

const RegisteredCars = ({ cars, mainInit }) => {
  function deleteCarData(carNumber) {
    console.log("remove" + carNumber);
    let lsRequest = {
      service: "luna://com.registercar.app.service",
      method: "deleteCarData",
      parameters: { carNumber: carNumber },
      onSuccess: (msg) => {
        mainInit();
        console.log(msg.payload);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }

  const Logs = cars.map((car) => (
    <li key={cars.indexOf(car)}>
      <div className={css.bor}>
        <div className={css.log}>
          <div>{car.carNumber}</div>
          <div>{car.startAt}</div>
          <div>~</div>
          <div>{car.expireAt}</div>
          <div>{car.status}</div>
          <Button
            onClick={() => {
              deleteCarData(car.carNumber);
            }}
          >
            remove
          </Button>
        </div>
      </div>
    </li>
  ));
  return (
    <div>
      <div>
        <div>임시 등록 차량</div>
      </div>
      <div>{Logs}</div>
    </div>
  );
};

export default RegisteredCars;
