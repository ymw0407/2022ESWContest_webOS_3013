const { MqttClient } = require("mqtt");

var ls2 = undefined;
var handle = undefined;
var key = undefined;

function init(service){
    ls2 = service;
}

function tts(text){
    let tts_url = "luna://com.webos.service.tts/speak";
    let tts_params = {
        "text": text,
        "language" :"ko-KR",
        "clear":true
    };
    var callback = (m) => {
        console.log("[tts] called : " + text);
    };
    ls2.call(tts_url, tts_params, callback);
}

function toast(msg){
    let toast_url = "luna://com.webos.notification/createToast";
    let toast_params = {
        message: msg,
        persistent:true
    };
    let callback = (m) =>{
        console.log("[Toast] called : "+ msg);
    }
    ls2.call(toast_url, toast_params, callback);
}

function launchApp(app_id){
    let launchApp_url = "luna://com.webos.service.applicationmanager/launch";
    let launchApp_params = {
        id: app_id
    };
    let callback = (m) =>{
        console.log("[launch app] called : "+ app_id);
    }
    ls2.call(launchApp_url, launchApp_params, callback);
}

function cameraOpen(device){
    return new Promise((resolve, reject) => {
        let cameraOpen_url = "luna://com.webos.service.camera2/open";
        let cameraOpen_params = {
            "id":device
        }
        ls2.call(cameraOpen_url, cameraOpen_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera open] " + JSON.stringify(msg.payload));
                resolve(msg.payload.handle);
            } else {
                console.log("error!");
                reject("[camera open] " + JSON.stringify(msg.payload));
            }
        });
    });
}

function cameraPreviewStart(){
    return new Promise((resolve, reject) => {
        let cameraPreviewStart_url = "luna://com.webos.service.camera2/startPreview";
        let cameraPreviewStart_params = {
            "handle":handle,
            "params":{
            "type":"sharedmemory",
            "source":"0"
            }
        }
        ls2.call(cameraPreviewStart_url, cameraPreviewStart_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera preview] " + JSON.stringify(msg.payload))
                resolve(JSON.stringify(msg.payload.key));
            }
            else {
                console.log("error!")
                reject("[camera preview] " + JSON.stringify(msg.payload))
            }
        })
    });
}

async function cameraReady(device){
    let open = await cameraOpen(device).then((result) => {handle = result}).catch((error) => {console.log(error)});
    console.log(handle);
    let privew = await cameraPreviewStart(handle).then((result) => {key = result}).catch((error) => {console.log(error)});
    console.log(key);
}

function cameraCapture(path){
    let cameraCapture_url = "luna://com.webos.service.camera2/startCapture";
    let cameraCapture_params = {
        "handle": handle,
        "params":
            {
                "width": 640,
                "height": 480,
                "format": "JPEG",
                "mode":"MODE_ONESHOT"
            },
        "path": path
    }
    ls2.call(cameraCapture_url, cameraCapture_params, (msg) => {
        console.log("[CameraCapture]" + JSON.stringify(msg));
    });
}

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.launchApp = launchApp;
exports.cameraReady =cameraReady;
exports.cameraCapture = cameraCapture;