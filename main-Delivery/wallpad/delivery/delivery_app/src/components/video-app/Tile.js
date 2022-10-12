import kind from "@enact/core/kind";
import Proptypes from "prop-types";
import Spottable from "@enact/spotlight/Spottable";

import css from "./Tile.module.less";
import thumbnail from "../../../webos-meta/icon.png";

const SpottableDiv = Spottable("div");

const TileBase = kind({
  name: "TileBase",

  styles: {
    css,
    className: "tile-box",
  },

  propTypes: {
    children: Proptypes.string,
    index: Proptypes.number,
    onSelect: Proptypes.func,
    size: Proptypes.number,
  },

  defaultProps: {
    size: 200,
  },

  handlers: {
    onSelect: (ev, { index, onSelect }) => {
      if (onSelect) {
        onSelect({ index });
      }
    },
  },

  render: ({ children, onSelect, size, ...rest }) => {
    delete rest.index;
    return (
      <SpottableDiv {...rest} onClick={onSelect}>
        <img src={thumbnail} width={size} height={size} />
        <div>{children}</div>
      </SpottableDiv>
    );
  },
});

const Tile = TileBase;

export default TileBase;
export { Tile, TileBase };
