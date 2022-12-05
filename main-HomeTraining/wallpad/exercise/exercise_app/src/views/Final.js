import React, { useEffect, useState } from "react";
import { Panel, Header } from "@enact/sandstone/Panels";
import styled, { css } from "styled-components";
import LS2Request from "@enact/webos/LS2Request";
import "./Final.css";

const Final = () => {
  const bridge = new LS2Request();
  const closeApp = (app_id) => {
    var lsRequest = {
      service: "luna://com.exercise.app.service",
      method: "close",
      parameters: {
        app_id: app_id,
        subscribe: true,
      },
      onSuccess: (msg) => {
        console.log(msg);
      },
      onFailure: (msg) => {
        console.log(msg);
      },
    };
    bridge.send(lsRequest);
  };

  return (
    <Panel className="final" onClose={() => closeApp("com.exercise.app")}>
      <Header />
    </Panel>
  );
};

export default Final;
