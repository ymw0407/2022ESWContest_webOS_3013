import React, { useEffect, useState } from "react";
import Panel from "@enact/sandstone/Panels";
import styled, { css } from "styled-components";
import "./Final.css";

const Final = () => {
  return <Panel className="final" onClose={() => console.log("close")}></Panel>;
};

export default Final;
