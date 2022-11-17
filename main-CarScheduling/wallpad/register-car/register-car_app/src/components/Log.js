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
        remove: Proptypes.func,
    },

    handlers: {
        // remove함수가 실행되면 children이라는 변수를 넘겨받고, 해당 변수를 parsing하여 carNumber를 추출하고, 해당 carNumber를 갖고 있는 데이터를 데이터베이스에서 삭제하기 위해 서비스로 정보를 전달한다.
        remove: (children) => {
            console.log(children + " : remove");
            let data = children.split(" | ");
            let car = data[0];
            let start = data[1];
            let end = data[2];
            console.log("car : " + car);
            let lsRequest = {
                service: "luna://com.registercar.app.service",
                method: "deleteCarData",
                parameters: { carNumber: car },
                onSuccess: (msg) => {
                    console.log(msg);
                },
                onFailure: (msg) => {
                    console.log(msg);
                },
            };
            bridge.send(lsRequest);
        },
        //--------------------------------------------------------
    },

    render: ({ children, remove, ...rest }) => {
        return (
            <div {...rest}>
                <div className={css.log}>
                    <span>{children}</span>
                    <Button
                        onClick={() => {
                            remove(children);
                        }}
                        className={css.button}
                    >
                        remove
                    </Button>
                </div>
            </div>
        );
    },
});

const Log = LogBase;

export default LogBase;
export { Log, LogBase };
