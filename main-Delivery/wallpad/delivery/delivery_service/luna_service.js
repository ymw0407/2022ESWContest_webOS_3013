var ls2 = undefined;
var handle = undefined;
var key = undefined;
var check = undefined;
const exec = require("child_process").exec;

function init(service) {
    ls2 = service;
}

function tts(text) {
    let tts_url = "luna://com.webos.service.tts/speak";
    let tts_params = {
        text: text,
        language: "ko-KR",
        clear: true,
    };
    var callback = (m) => {
        console.log("[luna] TTS : " + text);
    };
    ls2.call(tts_url, tts_params, callback);
}

function toast(msg) {
    let toast_url = "luna://com.webos.notification/createToast";
    let toast_params = {
        message: msg,
        persistent: true,
    };
    let callback = (m) => {
        console.log("[luna] Toast : " + msg);
    };
    ls2.call(toast_url, toast_params, callback);
}

/**
 * 해당 앱을 실행
 * @param {string} app_id 실행시킬 앱 아이디
 */
 function launchApp(app_id) {
    let launchApp_url = "luna://com.webos.service.applicationmanager/launch";
    let launchApp_params = {
      id: app_id,
    };
    let callback = (m) => {
      console.log("[launch app] called : " + app_id);
    };
    ls2.call(launchApp_url, launchApp_params, callback);
  }
  
  /**
   * 해당 앱을 종료
   * @param {string} app_id 종료시킬 앱 아이디
   */
  function closeApp(app_id) {
    let closeApp_url = "luna://com.webos.service.applicationmanager/close";
    let closeApp_params = {
      id: app_id,
    };
    let callback = (m) => {
      console.log("[close app] called : " + app_id);
    };
    ls2.call(closeApp_url, closeApp_params, callback);
  }

function alert(params) {
    var string_ = `luna-send -n 1 -f -a com.webos.surfacemanager luna://com.webos.notification/createAlert '${params}'`;
    console.log("[luna] alert : " + string_);
    var alert = exec(string_);
}

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.launchApp = launchApp;
exports.closeApp = closeApp;
exports.alert = alert;
