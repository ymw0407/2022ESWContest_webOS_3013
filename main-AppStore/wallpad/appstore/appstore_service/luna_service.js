const exec = require("child_process").exec;
var ls2 = undefined;

/**
 * luna 서비스 호출 모듈한테 자신을 호출하는 메인 서비스 객체를 등록
 * @param {object} service 등록할 서비스 객체
 */
function init(service) {
  ls2 = service;
}

/**
 * 문구를 입력하면 tts로 출력
 * @param {string} text tts로 내보낼 문구
 */
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

/**
 * 입력한 문구를 toast로 출력
 * @param {string} msg toast할 문구
 */
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

exports.init = init;
exports.toast = toast;
exports.tts = tts;
exports.launchApp = launchApp;
exports.closeApp = closeApp;
