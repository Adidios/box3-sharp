import { GM_info, GM_openInTab } from "$";
import GUI from "lil-gui";
import setupMagicCursor from "./lib/MagicCursor";
import {
  addFunctionButton,
  addLabel,
  saveSettings,
  settings,
} from "./lib/utils";
import HashTools from "./modules/common/HashTools";
import Box3SharpConfig from "./modules/common/Settings";
import "./styles/global.css";
import "./styles/gui-override.css";
import "./styles/swal-override.css";
let gui: GUI;
let containerWindowElement = document.createElement("div");
document.body.append(containerWindowElement);
let dragHandle = document.createElement("div");
let windowPos: [number, number] = [...settings["ui.windowPos"]];
containerWindowElement.append(dragHandle);
let isPlaneDragging = false;
containerWindowElement.classList.add("container-window");
dragHandle.classList.add("handle");
dragHandle.textContent = "拖动以移动窗口";
dragHandle.addEventListener("mousedown", () => (isPlaneDragging = true));
function updateWindowPosition() {
  containerWindowElement.style.left = ~~windowPos[0] + "px";
  containerWindowElement.style.top = ~~windowPos[1] + "px";
}
updateWindowPosition();
addEventListener("mousemove", ({ movementX, movementY }) => {
  if (isPlaneDragging) {
    windowPos[0] += movementX;
    windowPos[1] += movementY;
    updateWindowPosition();
  }
});
addEventListener("mouseup", () => {
  isPlaneDragging = false;
  if (windowPos[1] < 0) windowPos[1] = 0;
  if (windowPos[0] < 0) windowPos[0] = 0;
  if (windowPos[1] > innerHeight - 50) windowPos[1] = innerHeight - 50;
  if (windowPos[0] > innerWidth - settings["ui.width"])
    windowPos[0] = innerWidth - settings["ui.width"];
  settings["ui.windowPos"] = [...windowPos];
  saveSettings();
  updateWindowPosition();
});
function main() {
  gui = new GUI({ width: 400, autoPlace: false });
  containerWindowElement.append(gui.domElement);
  gui.title(`Box3# v${GM_info.script.version} by AlanBestHacker`);
  console.log(GM_info);
  if (GM_info.scriptWillUpdate) {
    addFunctionButton(
      gui,
      async () => {
        GM_openInTab(
          GM_info.scriptUpdateURL ||
            "https://greasyfork.org/zh-CN/scripts/456978-box3-sharp"
        );
      },
      "🎉更新到最新版本"
    );
  }
  async function matchModule() {
    const matches: { [index: string]: string } = {
      "box3.fun": "Box3Fun",
      "/me/content($|.+map)": "MapContent",
      "/p/": "Play",
      "/e/": "Editor",
      "box3.codemao.cn/": "Home",
    };
    for (let r of Object.keys(matches)) {
      if (new RegExp(r).test(location.href)) {
        try {
          const func = (await import(`./modules/${matches[r]}.ts`)).default;
          func(gui);
        } catch (e) {
          addLabel(gui, `❌ 模块 ${matches[r]} 加载失败`);
          console.error(e);
        }
      }
    }
  }
  matchModule();
  HashTools(gui);
  Box3SharpConfig(gui);
}
let lastHref = "";
setInterval(() => {
  if (location.href != lastHref) {
    lastHref = location.href;
    if (gui) gui.destroy();
    main();
  }
}, 100);
export {};
if (settings["magicCursor.enable"]) setupMagicCursor();
