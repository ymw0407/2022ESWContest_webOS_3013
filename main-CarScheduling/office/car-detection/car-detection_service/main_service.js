const pkgInfo = require("./package.json");
const Service = require("webos-service");
const luna = require("./luna_service");
const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");
const { exec } = require("child_process");
const execSync = require("child_process").execSync;
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
require("dotenv").config();

const kindID = "com.log.db:2";

const MQTT = process.env.MQTT
// mosquitto_pub -h 3.34.50.139 -t "car" -m "{\"time\":\"123\", \"carNumber\":\"123\", \"status\":\"registered\"}"

const putKind = (msg) => {
  service.call(
    "luna://com.webos.service.db/putKind",
    {
      id: kindID,
      owner: pkgInfo.name,
      indexes: [
        { name: "time", props: [{ name: "time" }] },
        { name: "carNumber", props: [{ name: "carNumber" }] },
        { name: "status", props: [{ name: "status" }] },
      ],
    },
    (res) => {
      console.log(logHeader, res.payload);
      console.log("putKind");
      putPermissions(msg);
    }
  );
};

const putPermissions = (msg) => {
  service.call(
    "luna://com.webos.service.db/putPermissions",
    {
      permissions: [
        {
          operations: {
            read: "allow",
            create: "allow",
            update: "allow",
            delete: "allow",
          },
          object: kindID,
          type: "db.kind",
          caller: pkgInfo.name,
        },
      ],
    },
    (res) => {
      console.log(logHeader, res.payload);
      console.log("putPermissions");
      find(msg);
    }
  );
};

const put = (res, msg) => {
  service.call(
    "luna://com.webos.service.db/put",
    {
      objects: [
        {
          _kind: kindID,
          time: res.time,
          carNumber: res.carNumber,
          status: res.category,
        },
      ],
    },
    (res) => {
      console.log(res);
      console.log("put");
      find(msg);
    }
  );
};

const find = (msg) => {
  service.call(
    "luna://com.webos.service.db/find",
    {
      query: {
        from: kindID,
      },
    },
    (res) => {
      let results = res.payload.results;
      console.log(results);
      console.log("find");
      msg.respond({ returnValue: true, results: results });
    }
  );
};

async function tesseract(){
  let capture = await luna.cameraCapture("/media/images/").then((result) => {console.log(result)}).catch((error) => {console.log(error)});
  let file_name = execSync("ls /media/images/");
  let parsed_file_name = String(file_name).split("\n")
  let latest_file_name = parsed_file_name[parsed_file_name.length - 2]
  console.log(file_name + "")
  console.log(latest_file_name + "")
   console.log("docker exec tesseract python3.9 /root/tesseract-ocr/app.py --vid " + String(latest_file_name))
  execSync("docker exec tesseract python3.9 /root/tesseract-ocr/app.py --vid " + String(latest_file_name))
}

service.register("init", (msg) => {
  putKind(msg);
});

service.register("loop", (msg) => {
  luna.init(service);

  mqtt.init(mosquitto);
  client = mqtt.connect(MQTT);
  mqtt.subscribe(["car/detect", "car/data"]);

  let log = exec("systemctl restart docker");
  console.log(log + "")
  let log2 = exec("docker start tesseract");
  console.log(log2 + "")
  luna.toast("서비스 시작!");
  //luna.tts("서비스 시작!");
  luna.cameraReady("camera1");

  client.on("message", (topic, message, packet) => {
    console.log("[message] : " + message);
    console.log("[topic] : " + topic);
    if (topic == "car/detect" && message == "recognized"){ // ESP8266으로부터 차량이 도착한 정보를 받으면 사진을 찍어 tesseract에 넘긴다.
      //luna.tts("차량이 도착했습니다.");
      luna.toast("차량이 도착했습니다.");
      tesseract();
    }
    // if (topic == "car/analyze") { // tesseract로부터 데이터를 받아온 후 DB8에 put --> 그리고 데이터 파싱하는 과정에 분석하여 결과가 등록된 차량이었다면 tts로 알려주면 좋을듯
    //   let messageParse = String(message);
    //   let jsonMsg = JSON.parse(messageParse);
      
    // }
    if (topic == "car/data") {
      let messageParse = String(message);
      let jsonMsg = JSON.parse(messageParse);
      put(jsonMsg, msg);
      if (jsonMsg.category == "register" || jsonMsg.category == "general"){
        //luna.tts("등록된 차량입니다. 환영합니다.");
        luna.toast("등록된 차량입니다. 환영합니다.");
      } else {
        //luna.tts("미등록 차량입니다.");
        luna.toast("미등록 차량입니다.");
      }
    }
  });

  console.log("loop");

  //------------------------- heartbeat 구독 -------------------------
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });

  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload));
    });

  //------------------------- heartbeat 구독 -------------------------
});

//----------------------------------------------------------------------heartbeat----------------------------------------------------------------------
// handle subscription requests
const subscriptions = {};
let heartbeatinterval;
function createHeartBeatInterval() {
  if (heartbeatinterval) {
    return;
  }
  console.log(logHeader, "create_heartbeatinterval");
  heartbeatinterval = setInterval(function () {
    sendResponses();
  }, 1000);
}

// send responses to each subscribed client
function sendResponses() {
  console.log(logHeader, "send_response");
  console.log(
    "Sending responses, subscription count=" + Object.keys(subscriptions).length
  );
  for (const i in subscriptions) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
      const s = subscriptions[i];
      s.respond({
        returnValue: true,
        event: "beat ",
      });
    }
  }
}

var heartbeat = service.register("heartbeat");
heartbeat.on("request", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
  message.respond({ event: "beat" }); // initial response
  if (message.isSubscription) {
    subscriptions[message.uniqueToken] = message; //add message to "subscriptions"
    if (!heartbeatinterval) {
      createHeartBeatInterval();
    }
  }
});
heartbeat.on("cancel", function (message) {
  delete subscriptions[message.uniqueToken]; // remove message from "subscriptions"
  var keys = Object.keys(subscriptions);
  if (keys.length === 0) {
    // count the remaining subscriptions
    console.log("no more subscriptions, canceling interval");
    clearInterval(heartbeatinterval);
    heartbeatinterval = undefined;
  }
});
