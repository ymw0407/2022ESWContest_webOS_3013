const execSync = require("child_process").execSync;
var ls2 = undefined;

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

async function appDownload(app_id, app_name, path){
    execSync("wget -P ./app/ \"http://3.34.50.139:8000/apps/" + app_name + "\"");
    let appDownload_url = "luna://com.webos.appInstallService/dev/install";
    let appDownload_params = {
        id: app_id,
        ipkUrl: path,
        subscribe: true
    };
    var callback = (m) => {
        console.log("[app install] called : " + app_id);
    };
    ls2.call(appDownload_url, appDownload_params, callback);
}

function appRemove(app_id){
    let appRemove_url = "luna://com.webos.appInstallService/dev/remove";
    let appRemove_params = {
        id: app_id,
        subscribe: true
    };
    var callback = (m) => {
        console.log("[app remove] called : " + app_id);
    };
    ls2.call(appRemove_url, appRemove_params, callback);
}

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.launchApp = launchApp;
exports.appDownload = appDownload;
exports.appRemove = appRemove;