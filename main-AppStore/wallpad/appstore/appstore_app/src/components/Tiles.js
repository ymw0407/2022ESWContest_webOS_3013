import Proptypes from "prop-types";
import css from "./Tiles.module.less";
import Btn from "./Btn";
import { useState } from "react";

const Tiles = ({ apps, installedApps }) => {
  const [installState, setInstallState] = useState("idle");
  const appList = apps.map((app) => (
    <li key={apps.indexOf(app)}>
      <div className={css.tileBox}>
        <div className={css.tile}>
          <div className={css.icon}>
            <img
              className={css.img}
              src={"data:image/png;base64," + app.icon}
              width={200}
              height={200}
            />
            <div className={css.appName}>{app.name}</div>
          </div>
          <div className={css.desc}>{app.desc}</div>
          <Btn
            className={css.btn}
            app={app}
            installedApps={installedApps}
            installState={installState}
            setInstallState={setInstallState}
          />
        </div>
      </div>
    </li>
  ));
  return (
    <div>
      <div>{installState}</div>
      <div>{appList}</div>
    </div>
  );
};

Tiles.propTypes = {
  apps: Proptypes.array,
  installedApps: Proptypes.array,
};

export default Tiles;
