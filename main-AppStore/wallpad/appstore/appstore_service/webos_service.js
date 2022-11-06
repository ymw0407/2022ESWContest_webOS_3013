// eslint-disable-next-line import/no-unresolved
const pkgInfo = require("./package.json");
const Service = require("webos-service");
const luna = require("./luna_service");
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
const fs = require("fs");
const PWD = __dirname;
const execSync = require("child_process").execSync;

service.register("getInstalledApps", (msg) => {
  const installPath = "/media/developer/apps/usr/palm/applications/";
  let installedApps = [];
  fs.readdir(installPath, (err, apps) => {
    if (err) {
      console.log(err);
    }
    apps.forEach((app) => {
      installedApps.unshift(app);
    });
    console.log(installedApps);
    msg.respond({ installedApps: installedApps, returnValue: true });
  });

  //------------------------- heartbeat 구독 -------------------------
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  const max = 100; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
  let count = 0;
  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload));
    if (++count >= max) {
      sub.cancel();
    }
  });
  //------------------------- heartbeat 구독 -------------------------
});

service.register("install", (msg) => {
  luna.init(service);
  luna.tts(msg.payload.app + "앱이 설치됩니다.");
  luna.toast(msg.payload.app + "앱이 설치됩니다.");
  luna.appDownload(
    msg.payload.appid,
    msg.payload.appname,
    PWD + "/app/" + msg.payload.appname
  );
  msg.respond({ reply: "install success" });

  //----------------------------앱별 추가 설치------------------------------

  if (msg.payload.app == "배달") {
    console.log("배달 앱은 추가로 설치되는 환경 설정이 없습니다!");
  }

  if (msg.payload.app == "차량") {
    console.log("임시 차량 등록 앱은 추가로 설치되는 환경이 없습니다!"); // client가 아닌 경비실용 차량 앱은 환경 설정이 필요하지만 해당 앱은 client에게 제공되는 앱입니다
  }
  if (msg.payload.app == "CCTV") {
    console.log("CCTV 앱은 추가로 설치되는 환경 설정이 없습니다!");
  }

  if (msg.payload.app == "가전제어") {
    // console.log("가전제어 앱은 bareapp을 수정하여 사용합니다!")
    // execSync("wget http://3.34.50.139:8000/apps/bareapp -O ")
  }

  if (msg.payload.app == "운동보조") {
    console.log(
      "운동보조 앱은 추가로 mediapipe 관련 환경 설정, camera2 및 media LS2 API 설정이 필요합니다!"
    );
  }

  //------------------------- heartbeat 구독 -------------------------
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  const max = 100; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
  let count = 0;
  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload));
    if (++count >= max) {
      sub.cancel();
    }
  });
  //------------------------- heartbeat 구독 -------------------------
});

service.register("remove", function (msg) {
  luna.init(service);
  luna.tts(msg.payload.app + "앱이 삭제됩니다");
  luna.toast(msg.payload.app + "앱이 삭제됩니다.");
  luna.appRemove(msg.payload.appname);
  execSync("rm -f " + PWD + "/app/" + msg.payload.appname);
  msg.respond({ reply: "remove success" });

  //------------------------- heartbeat 구독 -------------------------
  const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {
    subscribe: true,
  });
  const max = 100; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
  let count = 0;
  sub.addListener("response", function (msg) {
    console.log(JSON.stringify(msg.payload));
    if (++count >= max) {
      sub.cancel();
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
