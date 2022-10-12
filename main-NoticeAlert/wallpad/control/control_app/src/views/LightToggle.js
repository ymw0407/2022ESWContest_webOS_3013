import React, { useState, useEffect } from "react";
import styled, {css} from 'styled-components';
import img_lf from '../img/light_off.png';
import img_ln from '../img/light_on.png';
import './Light.css';
import LS2Request from '@enact/webos/LS2Request';

const bridge = new LS2Request();
const ToggleBtn = styled.button`
  width: 80px;
  height: 40px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (!props.toggle ? "gray" : "rgb(226, 93, 69)")};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
`;
const Circle = styled.div`
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  position: absolute;
  left: 5%;
  transition: all 0.5s ease-in-out;
  ${(props) =>
    props.toggle &&
    css`
      transform: translate(40px, 0);
      transition: all 0.5s ease-in-out;
    `}
`;

const LightToggle = () => {
  const [ledState, setLedState] = useState({ledState1: 0, ledState2: 0, ledState3: 0}); // 1, 0

  useEffect(() => {
		console.log("first rendering");
		initServiceStart();
	},[]);

  function initServiceStart(){
		var lsRequest = {
			service:"luna://com.control.app.service",
			method:"init",
			parameters: {},
			onSuccess: (msg) => {
				console.log(msg);
				let parsedMsg = msg.reply
				if (parsedMsg.control == "led") {
					setLedState(parsedMsg.led);
				}
				console.log("end");
			},
			onFailure: (msg) => {console.log(msg);},
		}
		bridge.send(lsRequest);
	}

  function ledSubscribeService(){
		console.log("subscribe");
		var lsRequest = {
			service:"luna://com.control.app.service",
			method:"subscribe",
			parameters: {subscribe:true},
			onSuccess: (msg) => {
				console.log(msg);
				let parsedMsg = msg.reply
				if (parsedMsg.control == "led") {
					setLedState(parsedMsg.led);
				}
			},
			onFailure: (msg) => {console.log(msg);},
		}
		bridge.send(lsRequest);
	}

  function ledPublishService(ledStateAll){
		let led = {control: "led", led: ledStateAll}
		console.log(led);
		var lsRequest = {
			service:"luna://com.control.app.service",
			method:"led",
			parameters: {"led" : led},
			onSuccess: (msg) => {
				console.log(msg.message);
				ledSubscribeService();
			},
			onFailure: (msg) => {console.log(msg);console.log("error");},
		}
		bridge.send(lsRequest);
	}

  const Light1 = () => {
    return (
      <div>
		    {  ledState.ledState1 === 1
			    ? <img src={img_ln} style={{ width: '130px', height: '130px'}}/>
          : <img src={img_lf} style={{ width: '130px', height: '130px' }}/>
		    }
        <div style={{marginBottom:'80px'}} />
	    </div>
    )
  }

  const Light2 = () => {
    return (
      <div>
		    <span>
		    {  ledState.ledState2 === 1
			    ? <img src={img_ln} style={{ width: '130px', height: '130px'}}/>
          : <img src={img_lf} style={{ width: '130px', height: '130px' }}/>
		    }
		    </span>
        <div style={{marginBottom:'80px'}} />
	    </div>
    )
  }

  const Light3 = () => {
    return (
      <div>
		    <span>
		    {  ledState.ledState3 === 1
			    ? <img src={img_ln} style={{ width: '130px', height: '130px'}}/>
          : <img src={img_lf} style={{ width: '130px', height: '130px' }}/>
		    }
		    </span>
        <div style={{marginBottom:'80px'}} />
	    </div>
    )
  }

  const clickedToggle1 = () => {
		let ledStateAll = {ledState1: 1 - ledState.ledState1, ledState2: ledState.ledState2, ledState3: ledState.ledState3}
		ledPublishService(ledStateAll);
		setLedState(ledStateAll);
		console.log(ledStateAll)
  };
  const clickedToggle2 = () => {
		let ledStateAll = {ledState1: ledState.ledState1, ledState2: 1 - ledState.ledState2, ledState3: ledState.ledState3}
		ledPublishService(ledStateAll);
		setLedState(ledStateAll);
		console.log(ledStateAll)
  };
  const clickedToggle3 = () => {
		let ledStateAll = {ledState1: ledState.ledState1, ledState2: ledState.ledState2, ledState3: 1 - ledState.ledState3}
		ledPublishService(ledStateAll);
		setLedState(ledStateAll);
		console.log(ledStateAll)
  };

  return (
    <div className="toggle">
      <div className="list">
        <div className="tem1">
          <p>거실</p>
          <Light1 />
          <ToggleBtn onClick={clickedToggle1} toggle={ledState.ledState1} style={{marginLeft:'25px'}}>
            <Circle toggle={ledState.ledState1} />
          </ToggleBtn>
        </div>
        <div className="tem2">
          <p>방1</p>
          <Light2 />
          <ToggleBtn onClick={clickedToggle2} toggle={ledState.ledState2} style={{marginLeft:'25px'}}>
            <Circle toggle={ledState.ledState2} />
          </ToggleBtn>
        </div>
        <div className="tem3">
          <p>방3</p>
          <Light3 />
          <ToggleBtn onClick={clickedToggle3} toggle={ledState.ledState3} style={{marginLeft:'25px'}}>
            <Circle toggle={ledState.ledState3} />
          </ToggleBtn>
        </div>
      </div>
    </div>

  )
}

export default LightToggle;