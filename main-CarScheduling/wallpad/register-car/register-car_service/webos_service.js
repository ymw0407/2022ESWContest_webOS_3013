// eslint-disable-next-line import/no-unresolved
const pkgInfo = require("./package.json");
const logHeader = "[" + pkgInfo.name + "]";

const Service = require("webos-service");
const luna = require("./luna_service");
const mongo = require("./mongodb_lib");
const service = new Service(pkgInfo.name); // Create service by service name on package.json
var schema = undefined;
var Car = undefined;
// connect => schema => show => send to Enact => close
service.register("mainInit", async function (message) {
  // DB 연결
  let connect = await mongo
    .connectDB()
    .then((result) => {
      console.log("[mainInit]", result);
    })
    .catch((error) => {
      console.log("[mainInit]", error);
    });
  // -------------------------------------
  // 스키마 설정
  if (Car == undefined) {
    schema = await mongo.carSchema("cars").then((result) => {
      Car = result;
      console.log("[mainInit]", result);
    });
  }
  // -------------------------------------
  // 데이터 가져오기
  let showGeneralCar = await mongo.showGeneralCarData(Car).then((result) => {
    generalCarArray = result;
    console.log("[mainInit]", generalCarArray);
  });
  let showRegisterCar = await mongo.showRegisterCarData(Car).then((result) => {
    registerCarArray = result;
    console.log("[mainInit]", registerCarArray);
  });
  // -------------------------------------
  // 데이터 UI에 전송
  message.respond({
    carData: { general: generalCarArray, register: registerCarArray },
  });
  // -------------------------------------
  // DB 연결 끊기
  let close = mongo
    .closeDB()
    .then((result) => console.log("[mainInit]", result))
    .catch((err) => console.log("[mainInit]", err));
  // -------------------------------------
});

// connect => schema => put => close
service.register("registerCar", async function (message) {
  luna.init(service);
  // DB 연결
  let connect = await mongo
    .connectDB()
    .then((result) => {
      console.log("[registerCar]", result);
    })
    .catch((error) => {
      console.log("[registerCar]", error);
    });
  let startAt = new Date(message.payload.put.startAt);
  let endAt = new Date(message.payload.put.endAt);
  startAt = new Date(startAt.getTime() - startAt.getTimezoneOffset() * 60000);
  endAt = new Date(endAt.getTime() - endAt.getTimezoneOffset() * 60000);
  console.log(typeof startAt.toISOString(), startAt.toISOString());
  console.log(typeof endAt.toISOString(), endAt.toISOString());
  // -------------------------------------
  // DB에 임시 등록 차량 등록
  let register = await mongo
    .createRegisterCar(
      Car,
      message.payload.put.carNumber,
      startAt.toISOString(),
      endAt.toISOString(),
    )
    .then((result) => {
      console.log("[registerCar]", result);
      luna.tts(message.payload.put.carNumber + " 차량이 임시등록 되었습니다");
      luna.toast(message.payload.put.carNumber + " 차량이 임시등록 되었습니다");
      console.log("[registerCar] Register Successed!");
    })
    .catch((error) => console.log("[registerCar]", error));
  // -------------------------------------
  // DB 연결 끊기
  let close = mongo
    .closeDB()
    .then((result) => console.log("[registerCar]", result))
    .catch((err) => console.log("[registerCar]", err));
  // -------------------------------------
});

// connect => schema => delete => show => close
service.register("deleteCarData", async function (msg) {
  console.log(msg);
  // DB 연결
  let connect = await mongo
    .connectDB()
    .then((result) => {
      console.log("[deleteCarData]", result);
    })
    .catch((error) => {
      console.log("[deleteCarData]", error);
    });
  // -------------------------------------
  // DB에서 특정 차량 번호를 삭제
  let remove = await mongo
    .deleteCarData(Car, msg.payload.carNumber)
    .then((result) => {
      console.log(result);
      console.log(msg.payload.carNumber + " : delete success");
    })
    .catch((error) => {
      console.log(error);
    });
  let show = await mongo.showRegisterCarData(Car).then((result) => {
    registerCarArray = result;
  });
  msg.respond({ returnValue: true, registerCarArray: registerCarArray });
  // -------------------------------------
  // DB 연결 끊기
  let close = mongo
    .closeDB()
    .then((result) => console.log("[deleteCarData]", result))
    .catch((err) => console.log("[deleteCarData]", err));
  // -------------------------------------
});

// 홈 화면으로 돌아가기
service.register("close", (msg) => {
  luna.init(service);
  console.log(msg.payload);
  // 해당 앱 종료
  luna.closeApp(msg.payload.app_id);
  // bareapp 실행
  luna.launchApp("com.webos.app.home");
  msg.respond({ returnValue: true });
});
