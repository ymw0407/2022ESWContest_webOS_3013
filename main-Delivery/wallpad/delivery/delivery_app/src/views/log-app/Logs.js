import kind from "@enact/core/kind";
import Repeater from "@enact/ui/Repeater";
import Proptypes from "prop-types";

import Log from "../../components/log-app/Log";
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
      <div className={css.list}>
        <Repeater childComponent={Log} itemProp="index">
          {children}
        </Repeater>
      </div>
    </div>
  ),
});

export default Logs;
