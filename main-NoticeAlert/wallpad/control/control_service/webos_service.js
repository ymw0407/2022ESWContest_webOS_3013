// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');
const luna = require("./luna_service");
const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
const mosquitto = require("mqtt");
const mqtt = require("./mqtt_lib");

const ip = "3.34.50.139";

service.register("init", function(msg) {
    
    luna.init(service);

    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    mqtt.subscribe(["status/led"]);

    luna.toast("서비스 시작!");
    luna.tts("서비스 시작!");

    mqtt.publish("init/led", "1");

    client.on("message", (topic, message, packet) =>{
        console.log("[message] : " + message);
        console.log("[topic] : " + topic);
        stringMsg = String(message);
        jsonMsg = JSON.parse(stringMsg);
        msg.respond({reply: jsonMsg})
        if (topic=="status/led"){
            sub.cancel();
            client.end();
        }
    });

    //------------------------- heartbeat 구독 -------------------------
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 1; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        if (count >= max) {
            sub.cancel();
        }
    });
    //------------------------- heartbeat 구독 -------------------------

});

service.register("subscribe", function(msg) {

    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    mqtt.subscribe(["status/led", "control/window", "control/blind", "control/led"]);

    client.on("message", (topic, message, packet) =>{
        console.log("[message] : " + message);
        console.log("[topic] : " + topic);
        stringMsg = String(message);
        jsonMsg = JSON.parse(stringMsg);
        msg.respond({reply: jsonMsg})
        if (topic == "control/window"|| topic == "control/blind" || topic == "control/led"){
            sub.cancel();
            client.end();
        }
    });

    //------------------------- heartbeat 구독 -------------------------
    const sub = service.subscribe(`luna://${pkgInfo.name}/heartbeat`, {subscribe: true});
    const max = 1; //heart beat 횟수 /// heart beat가 꺼지면, 5초 정도 딜레이 생김 --> 따라서 이 녀석도 heart beat를 무한히 돌릴 필요가 있어보임.
    let count = 0;
    sub.addListener("response", function(msg) {
        console.log(JSON.stringify(msg.payload));
        if (count >= max) {
            sub.cancel();
        }
    });
    //------------------------- heartbeat 구독 -------------------------

});

service.register("led", function(msg) {
    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    console.log(msg.payload.led)
    message = Buffer.from(JSON.stringify(msg.payload.led), 'utf-8')
    mqtt.publish("control/led", message);
    msg.respond({message: "led success"});
})

service.register("blind", function(msg) {
    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    console.log(msg.payload.blind)
    message = Buffer.from(String(msg.payload.blind.state), 'utf-8')
    mqtt.publish("control/blind", message);
    msg.respond({message: "blind success"});
})

service.register("window", function(msg) {
    mqtt.init(mosquitto);
    client = mqtt.connect(ip);
    console.log(msg.payload.window)
    message = Buffer.from(String(msg.payload.window.state), 'utf-8')
    mqtt.publish("control/window", message);
    msg.respond({message: "window success"});
})

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