import GUI from "lil-gui";
import _CustomMap from "./common/CustomMap";

export default function (gui: GUI) {
  const f = gui.addFolder("地图工具");
  _CustomMap(f);
}
