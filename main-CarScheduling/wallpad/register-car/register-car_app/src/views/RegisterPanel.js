import kind from "@enact/core/kind";
import Button from "@enact/sandstone/Button";
import { Header, Panel } from "@enact/sandstone/Panels";
import { InputField } from "@enact/sandstone/Input";
import { useState } from "react";
import PropTypes from "prop-types";
import LS2Request from "@enact/webos/LS2Request";
import css from "./RegisterPanel.module.less";
import DatePicker from "@enact/sandstone/DatePicker";
//-------------------------------------------------------------------
const bridge = new LS2Request(); // LS2 서비스 요청 인스턴스 생성
//-------------------------------------------------------------------
const InputCarNum = () => {
  // 리엑트 함수형 컴포넌트 생성
  // useState를 통해 carNumber, start, end 데이터들이 변화하면 다시 렌더링한다
  let [carNumber, setCarNumber] = useState("");
  let [start, setStart] = useState("");
  let [end, setEnd] = useState("");
  //------------------------------------------------------------------
  // submit event 설정
  const onSubmit = () => {
    if (carNumber && start.value <= end.value) {
      // carNumber가 공백이 아니고, 시작날짜가 마지막 날짜보다 작거나 같을때만 올바른 값으로 간주한다.
      console.log(carNumber);
      console.log(start.value);
      console.log(end.value);
      registerCar(carNumber, start.value, end.value); // 데이터를 데이터베이스에 넘기는 함수
      setCarNumber(""); // carNumber 데이터를 초기화한다.
    } else {
      // 올바르지 않은 값이 제출되면 toast와 tts알림으로 반려한다.
      toast("올바른 값을 넣어주세요!");
      tts("올바른 값을 넣어주세요!");
    }
  };
  //------------------------------------------------------------------
  //carNumber와 start, end를 inputCarNum에서 받아내어 해당 정보를 데이터베이스에 저장하는 함수이다.
  function registerCar(car, start, end) {
    console.log("register Car");
    let lsRequest = {
      service: "luna://com.registercar.app.service",
      method: "registerCar",
      parameters: {
        put: {
          carNumber: car,
          startAt: start,
          endAt: end,
        },
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }
  //-----------------------------------------------------------------------------------------
  // createToast 함수 - 올바른 값을 넣지 않았을때 toast, 즉 텍스트로 알림해주는 역할을 한다.
  function toast(text) {
    console.log("toast");
    let lsRequest = {
      service: "luna://com.webos.notification",
      method: "createToast",
      parameters: { message: text },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }

  //tts 함수 - 올바른 값을 넣지 않았을때 음성으로 알림해주는 역할을 한다.
  function tts(text) {
    console.log("tts");
    let lsRequest = {
      service: "luna://com.webos.service.tts",
      method: "speak",
      parameters: {
        text: text,
        language: "ko-KR",
        clear: true,
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  }
  //--------------------------------------------------------
  return (
    <div className={css.content}>
      <div className={css.inputField}>
        <div className={css.inputTitle}>차량번호 입력</div>
        <InputField
          title="차량번호 입력"
          type="text"
          placeholder="Enter the car number"
          onChange={(ev) => {
            setCarNumber(ev.value);
          }}
          value={carNumber}
        />
      </div>
      <div className={css.datepickers}>
        <DatePicker className={css.datepicker} onChange={setStart} />
        <DatePicker className={css.datepicker} onChange={setEnd} />
      </div>
      <div>
        <Button className={css.submitBtn} type="submit" onClick={onSubmit}>
          submit
        </Button>
      </div>
    </div>
  );
};
//----------------------------------------------------------------
const RegisterPanel = kind({
  name: "RegisterPanel",

  propTypes: {
    next: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
  },

  computed: {
    text: ({ next }) => `To ${next} Panel`,
  },

  render: ({ title, ...rest }) => {
    delete rest.next;
    return (
      <Panel className={css.custom} {...rest}>
        <Header className={css.custom} title={title} />
        <InputCarNum />
      </Panel>
    );
  },
});

export default RegisterPanel;
