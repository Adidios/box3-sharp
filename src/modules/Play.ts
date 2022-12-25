import { unsafeWindow } from "$";
import GUI from "lil-gui";
import Swal from "sweetalert2";
import {
  addFunctionButton,
  addLabel,
  settings,
  startLoading,
  waitElement,
  waitUntil,
} from "../lib/utils";
import GraphicSettings from "./common/GraphicSettings";

export default async function (gui: GUI) {
  const f = gui.addFolder("游玩模式");
  const rootElement = (await waitElement("#react-container")) as any;
  function getCore() {
    return rootElement._reactRootContainer._internalRoot.current.updateQueue
      .baseState.element.props.children.props.children.props;
  }
  await waitUntil(() => getCore() && getCore().state);
  const state = getCore().state;
  await waitUntil(() => state.box3.state.appState === 2);

  const waitLabel = addLabel(f, "等待进入地图");

  Object.assign(unsafeWindow, { core: getCore(), state });
  waitLabel.destroy();
  addFunctionButton(
    f,
    async () => {
      state.box3.state.chat.log = [];
    },
    "清空聊天"
  );
  if (settings["flag.hackMode"]) {
    console.log("PlayMode Hack Enabled.");
    Object.assign(unsafeWindow, {
      async getAllSkin() {
        const stop = startLoading();
        state.box3.state.secret.availableSkin = (
          await getCore().brpc.skin.api.getAll()
        ).map((e: any) => e.name);
        stop();
        Swal.fire("Got all skins", "", "success");
      },
      async fillWaterWorld() {
        for (let x = 0; x < state.box3.state.voxel.shape[0]; x++)
          for (let y = 0; y < state.box3.state.voxel.shape[1]; y++)
            for (let z = 0; z < state.box3.state.voxel.shape[2]; z++)
              if (state.box3.voxel.getVoxel(x, y, z) === 0)
                state.box3.voxel._setVoxel(x, y, z, 364);
      },
      async clearWater() {
        for (let x = 0; x < state.box3.state.voxel.shape[0]; x++)
          for (let y = 0; y < state.box3.state.voxel.shape[1]; y++)
            for (let z = 0; z < state.box3.state.voxel.shape[2]; z++)
              if (state.box3.voxel.getVoxel(x, y, z) === 364)
                state.box3.voxel._setVoxel(x, y, z, 0);
      },
    });
  }
  GraphicSettings(getCore, state, f);
}
