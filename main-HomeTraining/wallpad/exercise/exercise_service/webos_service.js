const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const { resourceLimits } = require('worker_threads');
const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
const exec = require("child_process").exec;
require("dotenv").config();

const ip = process.env.MQTT

// service.register("windowOn", function(message){
//     var setWindow = exec("/usr/sbin/camera_window_manager_exporter 0 0 1920 1080 &");
//     console.log("setWindow");
// })

service.register("serviceStart", function(message) {
    luna.init(service);
    luna.cameraReady("camera1");
    console.log("camera on");
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
    luna.toast("녹화가 종료되었습니다!");
    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    mqtt.subscribe(['exercise/result', 'exercise/next']);
    var py_pro = exec("python3 video.py");

    client.on("message", (topic, msg) => {
        console.log("[message] : " + String(msg));
        console.log("[topic] : " + topic);
        if(topic == "exercise/next"){
            message.respond({
                reply: "nextPage"
            })
            client.end();
            sub.cancel();
        }
        else{
            message.respond({
                reply: String(msg)
            });
        }
    });

    client.on("close", () => {
        console.log("mqtt closed");
    })
   
    //------------------------- heartbeat 구독 -------------------------
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 100; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        // if (count >= max) {
        //     sub.cancel();
        //     setTimeout(function(){
        //         console.log(max+" responses received, exiting...");
        //         process.exit(0);
        //     }, 1000);
        // }
        // setTimeout(function(){
        //     console.log(max+" responses received, exiting...");
        //     process.exit(0);
        // }, 1000);
    });
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
                event: "beat "
            });
        }
    }
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
