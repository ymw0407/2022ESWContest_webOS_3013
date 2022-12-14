import kind from "@enact/core/kind";
import Repeater from "@enact/ui/Repeater";
import Proptypes from "prop-types";

import Tile from "../../components/video-app/Tile";
import css from "./Tiles.module.less";

const Tiles = kind({
  name: "Tiles",

  styles: {
    css,
    className: "Tiles",
  },

  propTypes: {
    children: Proptypes.array,
    onSelectVid: Proptypes.func,
  },

  render: ({ children, onSelectVid, ...rest }) => (
    <div {...rest}>
      <Repeater
        className={css.tiles}
        childComponent={Tile}
        indexProp="index"
        itemProps={{ onSelect: onSelectVid }}
      >
        {children}
      </Repeater>
    </div>
  ),
});

export default Tiles;
