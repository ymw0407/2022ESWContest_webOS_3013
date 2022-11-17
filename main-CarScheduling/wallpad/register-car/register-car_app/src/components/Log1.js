import kind from "@enact/core/kind";
import Proptypes from "prop-types";
import Button from "@enact/sandstone/Button";
import LS2Request from "@enact/webos/LS2Request";
import css from "./Log.module.less";
//-------------------------------------------------------------------
const bridge = new LS2Request(); // LS2 서비스 요청 인스턴스 생성
//-------------------------------------------------------------------
const LogBase = kind({
    // enact kind
    name: "LogBase",

    styles: {
        css,
        className: "log-box",
    },

    propTypes: {
        children: Proptypes.string,
        index: Proptypes.number,
    },

    render: ({ children, remove, ...rest }) => {
        return (
            <div {...rest}>
                <div className={css.log}>
                    <span>{children}</span>
                </div>
            </div>
        );
    },
});

const Log = LogBase;

export default LogBase;
export { Log, LogBase };
