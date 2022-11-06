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
        console.log("[tts] called : " + text);
    };
    ls2.call(tts_url, tts_params, callback);
}

function toast(msg) {
    let toast_url = "luna://com.webos.notification/createToast";
    let toast_params = {
        message: msg,
    };
    let callback = (m) => {
        console.log("[Toast] called : " + msg);
    };
    ls2.call(toast_url, toast_params, callback);
}

exports.init = init;
exports.toast = toast;
exports.tts = tts;
