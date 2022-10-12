import kind from "@enact/core/kind";
import { Panels, Routable, Route } from "@enact/sandstone/Panels";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import { SlideLeftArranger } from "@enact/ui/ViewManager";
import PropTypes from "prop-types";

import LogPanel from "../views/log-app/LogPanel";
import VideoPanel from "../views/video-app/VideoPanel";

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

  render: ({ onFirstPanel, onNavigate, onSecondPanel, path, ...rest }) => {
    return (
      <RoutablePanels
        {...rest}
        arranger={SlideLeftArranger}
        onBack={onNavigate}
        path={path}
      >
        <Route
          component={LogPanel}
          onClick={onSecondPanel}
          next="second"
          path="first"
        >
          <Route
            component={VideoPanel}
            onClick={onFirstPanel}
            next="first"
            path="second"
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
