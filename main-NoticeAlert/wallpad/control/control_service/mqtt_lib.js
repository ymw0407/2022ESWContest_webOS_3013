var mqtt_start = undefined;
var client = undefined;

function init(mqtt){
    mqtt_start = mqtt;
}

function connect(ip){
    const options = {
        host: ip, //mqtt broker의 IP
        port: 1883
    };
    client = mqtt_start.connect(options) // mqtt broker에 접속
    return client
}

function subscribe(topic_ls){
    client.subscribe(topic_ls, {qos:1});
}

function callback(func){
    client.on("message", (topic, message, packet) =>{
        console.log("[message] : " + message);
        console.log("[topic] : " + topic);
        func();
    });
}

function publish(topic, message){
    client.on("connect", ()=>{
        client.publish(topic, message);
        console.log("connected"+ client.connected)
    });
}


exports.init = init;
exports.connect = connect;
exports.subscribe = subscribe;
exports.callback = callback;
exports.publish = publish;
