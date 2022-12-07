var ls2 = undefined;

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
  };
  let callback = (m) => {
    console.log("[Luna] Toast : " + msg);
  };
  ls2.call(toast_url, toast_params, callback);
}

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

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.closeApp = closeApp;
exports.launchApp = launchApp;
