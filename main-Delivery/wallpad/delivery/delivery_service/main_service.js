const pkgInfo = require("./package.json");
const logHeader = "[" + pkgInfo.name + "]";

const Service = require("webos-service");
const request = require("request");
const mosquitto = require("mqtt");
require("dotenv").config();

const service = new Service(pkgInfo.name); // Create service by service name on package.json

const luna = require("./luna_service");
const mqtt = require("./mqtt_lib");

const kindID = "com.log.db:3";
const MQTT_IP = process.env.MQTT_BROKER;
const EXPRESS_IP = process.env.EXPRESS_SERVER;
var jsonMsg = undefined;

const putKind = (msg) => {
  service.call(
    "luna://com.webos.service.db/putKind",
    {
      id: kindID,
      owner: pkgInfo.name,
      indexes: [
        { name: "time", props: [{ name: "time" }] },
        { name: "status", props: [{ name: "status" }] },
      ],
    },
    (res) => {
      console.log("[putKind] " + res.payload);
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
      console.log("[putPermissions] " + res.payload);
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
          status: res.status,
        },
      ],
    },
    (res) => {
      console.log("[put] " + res);
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
      console.log("[find] " + results);
      msg.respond({ returnValue: true, results: results });
    }
  );
};

service.register("delVid", (msg) => {
  const options = {
    uri: EXPRESS_IP + `/package/${jsonMsg.time}.mp4`,
  };
  request.delete(options, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log("[delVid] " + body);
      console.log("[delVid] " + res.statusCode);
    } else {
      console.log("[delVid] " + body);
      console.log("[delVid] " + res.statusCode);
    }
  });
});

service.register("getVids", (msg) => {
  const options = {
    uri: EXPRESS_IP + "/vidlist",
    headers: { app: "package" },
  };

  request.get(options, (err, res, body) => {
    if (err) {
      console.log("[getVids] " + err);
      msg.respond({ returnValue: false });
    } else {
      console.log("[getVids] " + body);
      let vidlist = JSON.parse(body).vidlist;
      console.log("[getVids] " + vidlist);
      msg.respond({ returnValue: true, vidlist: vidlist });
    }
  });
});

service.register("close", (msg) => {
  luna.init(service);
  console.log(msg.payload);
  luna.closeApp(msg.payload.app_id);
  luna.launchApp("com.webos.app.home");
  msg.respond({ returnValue: true });
});

service.register("init", (msg) => {
  console.log("[init] init");
  sendClose();
  putKind(msg);
});

service.register("loop", async (msg) => {
  luna.init(service);
  luna.toast("배달 물품이 현관에 도착했습니다.");
  mqtt.init(mosquitto);
  client = mqtt.connect(MQTT_IP);
  mqtt.subscribe(["delivery/arrived", "delivery/received"]);

  client.on("message", (topic, message, packet) => {
    console.log("[loop] message : " + message);
    console.log("[loop] topic : " + topic);
    jsonMsg = JSON.parse(String(message));
    console.log("[loop] " + jsonMsg);
    put(jsonMsg, msg);

    if (topic == "delivery/arrived") {
      // ESP8266으로부터 차량이 도착한 정보를 받으면 사진을 찍어 tesseract에 넘긴다.
      luna.tts("배달 물품이 현관에 도착했습니다.");
      luna.toast("배달 물품이 현관에 도착했습니다.");
      console.log("[loop] 배달 물품이 현관에 도착했습니다.");
    }
    if (topic == "delivery/received") {
      luna.tts("배달 물품이 현관에서 사라졌습니다.");
      luna.toast("배달 물품이 현관에서 사라졌습니다.");
      console.log("[loop] 배달 물품이 현관에서 사라졌습니다.");
      let params = `{ \"message\":\" ${jsonMsg.time}에 배달 물품을 수령하셨습니까?",\"buttons\":[{\"label\":\"Yes\",\"onclick\":\"luna://com.delivery.app.service/delVid\"}, {"label":"No"}]}`;
      luna.alert(params);
      msg.respond({
        returnValue: true,
        time: jsonMsg.time,
        status: jsonMsg.status,
      });
    }
  });

  //------------------------- heartbeat 구독 -------------------------
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload.event));
    if (msg.payload.event == "loopClose") {
      sub.cancel();
      client.end();
      console.log("[heartbeat] heartbeat end");
    }
  });

  //------------------------- heartbeat 구독 -------------------------
});

//----------------------------------------------------------------------heartbeat----------------------------------------------------------------------
// handle subscription requests
const subscriptions = {};
let heartbeatinterval;
let x = 1;
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
  for (const i in subscriptions) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
      const s = subscriptions[i];
      s.respond({
        returnValue: true,
        event: "[heartbeat] running...",
      });
    }
  }
}

function sendClose() {
  for (const i in subscriptions) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
      const s = subscriptions[i];
      s.respond({
        returnValue: true,
        event: "loopClose",
      });
    }
  }
}

var heartbeat = service.register("heartbeat");
heartbeat.on("request", function (message) {
  console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
  if (message.isSubscription) {
    subscriptions[message.uniqueToken] = message; //add message to "subscriptions"
    if (!heartbeatinterval) {
      createHeartBeatInterval();
    }
  }
});
heartbeat.on("cancel", function (message) {
  console.log("message : ", message);
  console.log("uniqueToken : " + message.uniqueToken);
  console.log("subscriptions : ", subscriptions);
  delete subscriptions[message.uniqueToken]; // remove message from "subscriptions"
  console.log("subscriptions : ", subscriptions);
  var keys = Object.keys(subscriptions);
  console.log("keys : ", keys);
  if (keys.length === 0) {
    // count the remaining subscriptions
    console.log("no more subscriptions, canceling interval");
    clearInterval(heartbeatinterval);
    heartbeatinterval = undefined;
  }
});

//mosquitto_pub -h "3.34.50.139" -t "delivery/arrived" -m "{\"time\" : \"박진우\", \"status\" : \"arrived\"}"
