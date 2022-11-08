import Proptypes from "prop-types";
import css from "./Tile.module.less";
import Btn from "./Btn";

import thumbnail1 from "../../resources/1.png";
import thumbnail2 from "../../resources/2.png";
import thumbnail3 from "../../resources/3.png";
import thumbnail4 from "../../resources/4.png";
import thumbnail5 from "../../resources/5.png";
const icons = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5];

const Tile = ({ apps, installedApps }) => {
  const appList = apps.map((app) => (
    <li key={apps.indexOf(app)}>
      <div className={css.tileBox}>
        <div className={css.tile}>
          <div className={css.icon}>
            <img
              className={css.img}
              src={icons[apps.indexOf(app)]}
              width={200}
              height={200}
            />
            <div className={css.appName}>{app.name}</div>
          </div>
          <div className={css.desc}>{app.desc}</div>
          <Btn app={app} installedApps={installedApps} />
        </div>
      </div>
    </li>
  ));
  return <div>{appList}</div>;
};

Tile.propTypes = {
  apps: Proptypes.array,
  installedApps: Proptypes.array,
};

export default Tile;
