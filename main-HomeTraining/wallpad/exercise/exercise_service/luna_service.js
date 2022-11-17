var ls2 = undefined;
var handle = undefined;
var key = undefined;
var mediaId = undefined;
var check = undefined;
var check2 = undefined;
var check3 = undefined;

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

function cameraFormat(){
    return new Promise((resolve, reject) => {
        let cameraFormat_url = "luna://com.webos.service.camera2/setFormat";
        let cameraFormat_params = {
            "handle":handle,
            "params":{
                "width":1920,
                "height":1080,
                "format":"JPEG",
                "fps":30
            }
        }
        ls2.call(cameraFormat_url, cameraFormat_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[set format] " + JSON.stringify(msg.payload))
                resolve(JSON.stringify(msg.payload.returnValue));
            }
            else {
                console.log("error!")
                reject("[set format] " + JSON.stringify(msg.payload))
            }
        })
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
function mediaLoad(){
    return new Promise((resolve, reject) => {
        let mediaLoad_url = "luna://com.webos.media/load";
        let media_params = {
            "uri":`camera://com.webos.service.camera2/${key}`,
            "payload":{
               "option":{
                  "appId":"com.webos.app.mediaevents-test",
                  "windowId":"_Window_Id_1",
                  "videoDisplayMode":"Textured",
                  "width":1920,
                  "height":1080,
                  "format":"JPEG",
                  "frameRate":30,
                  "memType":"shmem",
                  "memSrc":key
               }
            },
            "type":"camera"
         }
        ls2.call(mediaLoad_url, media_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[media load] " + JSON.stringify(msg.payload))
                resolve(JSON.stringify(msg.payload.mediaId));
            }
            else {
                console.log("error!")
                reject("[media load] " + JSON.stringify(msg.payload))
            }
        })
    });
}

function mediaPlay(){
    return new Promise((resolve, reject) => {
        let mediaPlay_url = "luna://com.webos.media/play";
        let mediaPlay_params = {
            "mediaId":mediaId
        }
        console.log(mediaPlay_params)
        ls2.call(mediaPlay_url, mediaPlay_params, (msg) => {
            console.log("[media play] " + JSON.stringify(msg.payload));
            if (msg.payload.returnValue) {
                
                resolve(msg.payload.mediaId);
            } else {
                console.log("error!");
                reject("[media play] " + JSON.stringify(msg.payload));
            }
        });
    });
}

function startRecord(){
    let startRecord_url = "luna://com.webos.media/startCameraRecord";
    let startRecord_params = {
        "mediaId" :mediaId,
        "location":"/media/videos/",
        "format" :"MP4",
        "audio":false,
        "audioSrc":"pcm_input"
    };
    console.log(startRecord_params);
    ls2.call(startRecord_url, startRecord_params, (msg) => {
        console.log("[Start Record] " + JSON.stringify(msg.payload))
    });
}

async function cameraReady(device){
    let open = await cameraOpen(device).then((result) => {handle = result}).catch((error) => {console.log(error)});
    console.log(handle);
    let format = await cameraFormat(handle).then((result) => {check = result}).catch((error) => {console.log(error)});
    console.log(check);
    let privew = await cameraPreviewStart(handle).then((result) => {key = result}).catch((error) => {console.log(error)});
    console.log(key);
    let load = await mediaLoad(key).then((result) => {mediaId = result.slice(1, -1)}).catch((error) => {console.log(error)});
    console.log(mediaId);
    const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
    await wait(1000);
    console.log("Wait for 1 sec");
    let play = await mediaPlay(mediaId).then((result) => {mediaId = result}).catch((error) => {console.log(error)});
    console.log(mediaId);
}

function stopRecord(mediaId){
    return new Promise((resolve, reject) => {
        let stopRecord_url = "luna://com.webos.media/stopCameraRecord";
        let stopRecord_params = {
            "mediaId" : mediaId
        };
        ls2.call(stopRecord_url, stopRecord_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[stop Record] " + JSON.stringify(msg.payload))
                resolve(JSON.stringify(msg.payload.mediaId));
            }
            else {
                console.log("error!")
                reject("[stop Record] " + JSON.stringify(msg.payload))
            }
        });
    })
}

function mediaUnload(mediaId){
    return new Promise((resolve, reject) => {
        let stopRecord_url = "luna://com.webos.media/unload";
        let stopRecord_params = {
            "mediaId" : mediaId
        };
        ls2.call(stopRecord_url, stopRecord_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[media unload] " + JSON.stringify(msg.payload))
                resolve(JSON.stringify(msg.payload.mediaId));
            }
            else {
                console.log("error!")
                reject("[media unload] " + JSON.stringify(msg.payload))
            }
        });
    })
}

function cameraPreviewstop(handle){
    return new Promise((resolve, reject) => {
        let cameraPreviewstop_url = "luna://com.webos.service.camera2/stopPreview";
        let cameraPreviewstop_params = {
            "handle": handle
        }
        ls2.call(cameraPreviewstop_url, cameraPreviewstop_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera preview stop] " + JSON.stringify(msg.payload));
                resolve(msg.payload.returnValue);
            } else {
                console.log("error!");
                reject("[camera preview stop] " + JSON.stringify(msg.payload));
            }
        });
    });
}

function cameraClose(handle){
    return new Promise((resolve, reject) => {
        let cameraClose_url = "luna://com.webos.service.camera2/close";
        let cameraClose_params = {
            "handle": handle
        }
        ls2.call(cameraClose_url, cameraClose_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera close] " + JSON.stringify(msg.payload));
                resolve(msg.payload.returnValue);
            } else {
                console.log("error!");
                reject("[camera close] " + JSON.stringify(msg.payload));
            }
        });
    });
}

async function cameraEnd(){
    let stopR = await stopRecord(mediaId).then((result) => {console.log(result)}).catch((error) => {console.log(error)});
    let mediaUn = await mediaUnload(mediaId).then((result) => {console.log(result)}).catch((error) => {console.log(error)});
    let camStop = await cameraPreviewstop(handle).then((result) => {console.log(result)}).catch((error) => {console.log(error)});
    let camClose = await cameraClose(handle).then((result) => {console.log(result)}).catch((error) => {console.log(error)});
}

function cameraCapture(path){
    return new Promise((resolve, reject) => {
        let cameraCapture_url = "luna://com.webos.service.camera2/startCapture";
        let cameraCapture_params = {
            "handle": handle,
            "params":
                {
                    "width": 1920,
                    "height": 1080,
                    "format": "JPEG",
                    "mode":"MODE_ONESHOT"
                },
            "path": path
        }
        ls2.call(cameraCapture_url, cameraCapture_params, (msg) => {
            if (msg.payload.returnValue) {
                console.log("[camera capture] " + JSON.stringify(msg.payload));
                resolve(msg.payload.returnValue);
            } else {
                console.log("error!");
                reject("[camera capture] " + JSON.stringify(msg.payload));
            }
        });
    });
}

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.launchApp = launchApp;
exports.cameraReady = cameraReady;
exports.startRecord = startRecord;
exports.cameraEnd = cameraEnd;
exports.cameraCapture = cameraCapture;
