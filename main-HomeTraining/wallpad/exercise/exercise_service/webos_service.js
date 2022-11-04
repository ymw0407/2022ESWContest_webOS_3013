const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const { resourceLimits } = require('worker_threads');
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;

// service.register("windowOn", function(message){
//     var setWindow = exec("/usr/sbin/camera_window_manager_exporter 0 0 1920 1080 &");
//     console.log("setWindow");
// })
service.register("serviceStart", function(message) {
    luna.init(service);
    var setWindow = exec("/usr/sbin/camera_window_manager_exporter 0 0 1920 1080 &");
    setWindow.stdout.on("data", function (data) {
        console.log(data.toString()); // 버퍼 형태로 전달됩니다.
      });
      
      // 표준 에러
    setWindow.stderr.on("data", function (data) {
        console.error(data.toString()); // 버퍼 형태로 전달됩니다.
      });
    console.log("setWindow");
    luna.cameraReady("camera1");
    //------------------------- heartbeat 구독 -------------------------
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 10000; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        if (++count >= max) {
            sub.cancel();
            setTimeout(function(){
                console.log(max+" responses received, exiting...");
                process.exit(0);
            }, 1000);
        }
    });
});

service.register("record", function(message){
    luna.toast("녹화를 시작합니다!");
    luna.startRecord();
    console.log("startRecord");
})

// a method that always returns the same value
service.register("child", function(message) {
    luna.cameraEnd();
    console.log("camera End");
    luna.toast("녹화가 종료되었습니다!")
    var py_pro = spawn("python3", ["pushup.py"]);
    var cnt = 0;
    py_pro.stdout.on("data", function (data) {
        result = data.toString();
        console.log(result);
        cnt++;
        // if(cnt == 4)
        // {
        //     message.respond({
        //         reply:result
        //     }); 
        // }
        if(cnt == 2){
            message.respond({
                reply:result
            }); 
        }
    }); // 실행 결과
      
    py_pro.stderr.on("data", function (data) {
        console.error(data.toString());
    }); // 실행 >에러

    py_pro.on("close", function(code){
        console.log("close");
    });
    //------------------------- heartbeat 구독 -------------------------
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 10000; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        if (++count >= max) {
            sub.cancel();
            setTimeout(function(){
                console.log(max+" responses received, exiting...");
                process.exit(0);
            }, 1000);
        }
    });
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
    heartbeatinterval = setInterval(function() {
        sendResponses();
    }, 1000);
}

// send responses to each subscribed client
function sendResponses() {
    console.log(logHeader, "send_response");
    console.log("Sending responses, subscription count=" + Object.keys(subscriptions).length);
    for (const i in subscriptions) {
        if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
            const s = subscriptions[i];
            s.respond({
                returnValue: true,
                event: "beat " + x
            });
        }
    }
    x++;
}

var heartbeat = service.register("heartbeat");
heartbeat.on("request", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
    message.respond({event: "beat"}); // initial response 
    if (message.isSubscription) { 
        subscriptions[message.uniqueToken] = message; //add message to "subscriptions" 
        if (!heartbeatinterval) {
            createHeartBeatInterval();
        }
    } 
}); 
heartbeat.on("cancel", function(message) { 
    delete subscriptions[message.uniqueToken]; // remove message from "subscriptions" 
    var keys = Object.keys(subscriptions); 
    if (keys.length === 0) { // count the remaining subscriptions 
        console.log("no more subscriptions, canceling interval"); 
        clearInterval(heartbeatinterval);
        heartbeatinterval = undefined;
    } 
});

