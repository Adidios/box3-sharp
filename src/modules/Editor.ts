import { unsafeWindow } from "$";
import GUI from "lil-gui";
import Swal from "sweetalert2";
import {
  addFunctionButton,
  getSetting,
  settings,
  showUploadFile,
  sleep,
  startLoading,
  waitElement,
  waitUntil,
} from "../lib/utils";
import GraphicSettings from "./common/GraphicSettings";

export default async function (gui: GUI) {
  const f = gui.addFolder("编辑器工具");
  const btn = f
    .add({ a() {} }, "a")
    .name("等待进入地图")
    .disable();
  const rootElement = await waitElement<any>("#edit-react");
  function getCore() {
    return rootElement._reactRootContainer._internalRoot.current.updateQueue
      .baseState.element.props.children.props.children.props;
  }
  await waitUntil(
    () => !getCore().onStart && getCore()?.state?.box3?.state?.appState == 2
  );
  const core = getCore();
  btn.destroy();
  function place(gui: GUI, obj: any) {
    for (let k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === "object") {
        const f = gui.addFolder(k);
        place(f, v);
      } else if (typeof v === "string") {
        addFunctionButton(gui, async () => getCore().scriptEval(v), k);
      }
    }
  }
  if (getSetting("flag.hackMode")) Object.assign(window, { core });
  place(f, {
    编辑器常用控制台代码: {
      移动: {
        所有玩家返回重生点: `world.querySelectorAll("player").forEach(e=>e.player.forceRespawn())`,
        切换幽灵模式: `world.querySelectorAll("player").forEach(e=>e.player.spectator=!e.player.spectator)`,
        切换飞行模式: `world.querySelectorAll("player").forEach(e=>e.player.canFly=!e.player.canFly)`,
        提高飞行速度: `world.querySelectorAll("player").forEach(e=>e.player.flySpeed*=2)`,
        降低飞行速度: `world.querySelectorAll("player").forEach(e=>e.player.flySpeed/=2)`,
      },
    },
  });
  addFunctionButton(
    f,
    async () => {
      const done = startLoading();
      await core.editReplica.stopProject();
      await core.editReplica.startProject();
      done();
    },
    "停止代码并重新开始"
  );
  addFunctionButton(
    f,
    async () => {
      if (
        (
          await Swal.fire({
            title: "重启编辑端",
            text: "重启编辑端将会踢出所有玩家并停止编辑器中所有代码，再次启动需要更长时间。仅应用于编辑器卡住等特殊情况，请勿用于恶意用途（重启编辑器需要大约半分钟）",

            confirmButtonText: "确认重启",
            confirmButtonColor: "red",
            showCancelButton: true,
            cancelButtonText: "取消",
          })
        ).isConfirmed
      ) {
        startLoading("正在重启");
        await sleep(20e3);
        core.editReplica.restart();
        location.reload();
      }
    },
    "重启编辑端"
  );
  addFunctionButton(
    f,
    async () => {
      const fileList = await showUploadFile(true, "text/javascript");
      for (let file of fileList) {
        core.assetController.copyAsset(file.filename, {
          contentId: 0,
          hash: file.Key,
          ownerId: 0,
          previewImage: "",
          size: file.Size,
          type: 1,
        });
      }
      Swal.fire(
        "批量导入完成",
        `已成功导入${fileList.length}个脚本文件`,
        "success"
      );
    },
    "批量上传脚本"
  );
  addFunctionButton(
    f,
    async () => {
      const fileList = await showUploadFile(true, "audio/*");
      for (let file of fileList) {
        core.assetController.copyAsset(file.filename, {
          contentId: 0,
          hash: file.Key,
          ownerId: 0,
          previewImage: "",
          size: file.Size,
          type: 6,
        });
      }
      Swal.fire(
        "批量导入完成",
        `已成功导入${fileList.length}个音频文件`,
        "success"
      );
    },
    "批量上传音频"
  );
  const state = getCore().state;
  GraphicSettings(getCore, state, f, false);
  if (settings["flag.hackMode"]) {
    Object.assign(unsafeWindow, {
      hackContributorPermission() {
        getCore().permissionController.addCollaborator(
          getCore().state.box3.state.secret.userId,
          "contributor"
        );
        Swal.fire(
          "Hack Permission",
          "Got contributor permission (depend on owner's config for contributor group)",
          "success"
        );
      },
    });
  }
}
