import React, { useState, useEffect } from "react";
import spinner from '../gif/spinner.gif';
import './Loading.css';
import { useHistory } from "react-router-dom";
import LS2Request from "@enact/webos/LS2Request";

const Loading = (props) => {
  //const [loading, setLoading] = useState(true);
  const history = useHistory();
  const bridge = new LS2Request();
  var res, obj;
  useEffect(() => {
    console.log("effect");
    let params = {subscribe:true};
    let lsRequest = {
      service: "luna://com.exercisedemo.app.service",
      method: "child",
      parameters: params,
      onSuccess: (msg) => {
        res = msg.reply;
        console.log(res);
        if(res == "nextPage"){
          nextPage();
        }
        else{
          obj = JSON.parse(res);
        }
      },
      onFailure: (err) => {
        console.log(err)
      }
    };
    bridge.send(lsRequest);
  }, []);

  const nextPage = () => {
    history.push({pathname: '/main', state: obj});
    //history.push('/main');
  }

  return (
    <div className="load">
      { <img src={spinner} style={{"width":"200px", "display":"flex"}} />}
    </div>
  )
}

export default Loading;