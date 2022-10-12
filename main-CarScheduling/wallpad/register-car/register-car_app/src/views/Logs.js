import kind from "@enact/core/kind";
import Repeater from "@enact/ui/Repeater";
import Proptypes from "prop-types";

import Log from "../components/Log";
import css from "./Logs.module.less";

const Logs = kind({
  name: "Logs",

  styles: {
    css,
    className: "Logs",
  },

  propTypes: {
    children: Proptypes.array,
  },

  render: ({ children, ...rest }) => (
    <div {...rest}>
      <div className={css.list} backgroundOpacity="transparent">
        <Repeater childComponent={Log} itemProp="index" backgroundOpacity="transparent">
          {children}
        </Repeater>
      </div>
    </div>
  ),
});

export default Logs;
