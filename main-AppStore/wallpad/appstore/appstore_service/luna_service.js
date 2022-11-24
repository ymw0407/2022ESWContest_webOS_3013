const exec = require("child_process").exec;
var ls2 = undefined;
const EC2_IP = "3.34.50.139:8000";

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

// /**
//  * 기기 내 ipk 파일을 설치
//  * @param {string} app_id 설치할 파일의 아이디
//  * @param {string} path ipk 파일이 저장되는 경로
//  */
// function appDownload(app_id, path) {
//   // ipk 파일 다운로드
//   exec(
//     'wget -P ./apps/ "http://' +
//       EC2_IP +
//       "/apps/" +
//       app_id +
//       "_1.0.0_all.ipk" +
//       '"',
//     (err) => {
//       if (err) {
//         console.log(err);
//       }
//       let appDownload_url = "luna://com.webos.appInstallService/install";
//       let appDownload_params = {
//         id: app_id,
//         ipkUrl: path,
//         subscribe: true,
//       };
//       var callback = (m) => {
//         console.log("[app install] called : " + app_id);
//       };
//       ls2.call(appDownload_url, appDownload_params, (m) => {
//         console.log("" + m)
//       });
//     }
//   );
// }

/**
 * 해당 앱을 삭제
 * @param {string} app_id 삭제할 앱 아이디
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
exports.closeApp = closeApp;
exports.appDownload = appDownload;
exports.appRemove = appRemove;
