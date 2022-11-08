const exec = require("child_process").exec;
var ls2 = undefined;
const EC2_IP = "3.34.50.139:8000";

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
    console.log("[tts] called : " + text);
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
    console.log("[Toast] called : " + msg);
  };
  ls2.call(toast_url, toast_params, callback);
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

/**
 *
 * @param {string} app_id
 * 설치할 파일의 아이디
 * @param {string} app_name
 * 설치할 파일의 이름
 * @param {string} path
 * ipk 파일이 저장되는 경로
 */
async function appDownload(app_id, path) {
  exec(
    'wget -P ./apps/ "http://' +
      EC2_IP +
      "/apps/" +
      app_id +
      "_1.0.0_all.ipk" +
      '"',
    (err) => {
      if (err) {
        console.log(err);
      }
      let appDownload_url = "luna://com.webos.appInstallService/dev/install";
      let appDownload_params = {
        id: app_id,
        ipkUrl: path,
        subscribe: true,
      };
      var callback = (m) => {
        console.log("[app install] called : " + app_id);
      };
      ls2.call(appDownload_url, appDownload_params, callback);
    }
  );
}
/**
 * 앱 아이디를 입력하면 해당 앱 삭제
 * @param {string} app_id
 *
 */
function appRemove(app_id) {
  let appRemove_url = "luna://com.webos.appInstallService/dev/remove";
  let appRemove_params = {
    id: app_id,
    subscribe: true,
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
