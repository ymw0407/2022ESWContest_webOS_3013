import kind from "@enact/core/kind";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import Panels from "@enact/sandstone/Panels";

import Tiles from "../views/Tiles";
import css from "./App.module.less";

const apps = ["배달", "차량", "cctv", "가전제어", "운동보조"];

const AppBase = kind({
  name: "App",

  styles: {
    css,
    className: "app",
  },

  render: ({ ...rest }) => (
    <div {...rest}>
      <Panels>
        <Tiles>{apps}</Tiles>
      </Panels>
    </div>
  ),
});

const App = ThemeDecorator(AppBase);

export default App;
export { App, AppBase };
