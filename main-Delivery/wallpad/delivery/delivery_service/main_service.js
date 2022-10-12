const pkgInfo = require("./package.json");
const Service = require("webos-service");
const luna = require("./luna_service");
const request = require("request");
const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";

const kindID = "com.log.db:2";

const ip = "3.34.50.139";
// mosquitto_pub -h 3.34.50.139 -t "car" -m "{\"time\":\"123\", \"carNumber\":\"123\", \"status\":\"registered\"}"
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
          status: res.status,
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

// const del = (vid) => {
//   const options = {
//     uri: "http://3.34.50.139:80000/package/" + vid,
//   };
//   request.delete(options, (err, res, body) => {
//     if (!err && res.statusCode == 200) {
//       console.log(body);
//       console.log(res.statusCode);
//     } else {
//       console.log(body);
//       console.log(res.statusCode);
//     }
//   });
// };

service.register("delVid", (msg) => {
  const options = {
    uri: `http://3.34.50.139:8000/package/${jsonMsg.time}.mp4`,
  };
  request.delete(options, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      console.log(body);
      console.log(res.statusCode);
    } else {
      console.log(body);
      console.log(res.statusCode);
    }
  });
});

service.register("getVids", (msg) => {
  const options = {
    uri: "http://3.34.50.139:8000/vidlist",
    headers: { app: "package" },
  };

  request.get(options, (err, res, body) => {
    if (err) {
      console.log(err);
    }
    let vidlist = JSON.parse(body).vidlist;
    console.log(logHeader + vidlist);
    msg.respond({ returnValue: true, vidlist: vidlist });
  });
});

service.register("init", (msg) => {
  putKind(msg);
});

service.register("loop", (msg) => {
  luna.init(service);

  mqtt.init(mosquitto);
  client = mqtt.connect(ip);
  mqtt.subscribe(["delivery/arrived", "delivery/received"]);

  client.on("message", (topic, message, packet) => {
    console.log("[message] : " + message);
    console.log("[topic] : " + topic);
    jsonMsg = JSON.parse(String(message));
    console.log(jsonMsg);
    put(jsonMsg, msg);

    if (topic == "delivery/arrived") {
      // ESP8266으로부터 차량이 도착한 정보를 받으면 사진을 찍어 tesseract에 넘긴다.
      luna.tts("배달 물품이 현관에 도착했습니다.");
      luna.toast("배달 물품이 현관에 도착했습니다.");
    }
    if (topic == "delivery/received") {
      luna.tts("배달 물품이 현관에서 사라졌습니다.");
      luna.toast("배달 물품이 현관에서 사라졌습니다.");
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
  const max = 10000; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
  let count = 0;
  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload));
    if (++count >= max) {
      sub.cancel();
      setTimeout(function () {
        console.log(max + " responses received, exiting...");
        process.exit(0);
      }, 1000);
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
  console.log(logHeader, "send_response");
  console.log(
    "Sending responses, subscription count=" + Object.keys(subscriptions).length
  );
  for (const i in subscriptions) {
    if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
      const s = subscriptions[i];
      s.respond({
        returnValue: true,
        event: "beat " + x,
      });
    }
  }
  x++;
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
