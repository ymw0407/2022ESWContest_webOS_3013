import kind from "@enact/core/kind";
import { Panels, Routable, Route } from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { SlideLeftArranger } from "@enact/ui/ViewManager";
import PropTypes from "prop-types";

import MainPanel from "../views/MainPanel";
import RegisterPanel from "../views/RegisterPanel";

import css from "./App.module.less";
// import css from "./App.module.less"
import AppStateDecorator from "./AppStateDecorator";

const RoutablePanels = Routable({ navigate: "onBack" }, Panels);

const Sample = kind({
  name: "App",

  propTypes: {
    onNavigate: PropTypes.func,
    path: PropTypes.string,
  },

  handlers: {
    onFirstPanel: (ev, { onNavigate }) => onNavigate({ path: "/first" }),
    onSecondPanel: (ev, { onNavigate }) =>
      onNavigate({ path: "/first/second" }),
  },

  render: ({ onNavigate, onSecondPanel, path, ...rest }) => {
    return (
      <RoutablePanels className={css.custom}
        {...rest}
        arranger={SlideLeftArranger}
        onBack={onNavigate}
        path={path}
      >
        <Route className={css.custom}
          component={MainPanel}
          onClick={onSecondPanel}
          next="second"
          path="first"
          title="차량 등록 조회"
        >
          <Route className={css.custom}
            component={RegisterPanel}
            next="first"
            path="second"
            title="차량 등록"
          />
        </Route>
      </RoutablePanels>
    );
  },
});


const AppBase = AppStateDecorator(Sample);
const App = ThemeDecorator(AppBase);

export default App;
export { App, AppBase };
