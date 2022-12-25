import GUI from "lil-gui";
import Swal from "sweetalert2";
import {
  addFunctionButton,
  getSetting,
  reloadSettings,
  resetSettings,
  saveSettings,
  setSetting,
  settings,
} from "../../lib/utils";
function updateUIProperty() {
  const element = document.querySelector(".lil-gui.root") as HTMLDivElement;
  element.style.opacity = settings["ui.opacity"].toString();
  element.style.width = settings["ui.width"].toString() + "px";
  element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
  element.style.setProperty(
    "--border-radius",
    settings["ui.borderRound"] ? "5px" : "0"
  );
  element.style.setProperty("--blur", settings["ui.blur"].toString() + "px");
  element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
  element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
}
export default function Box3SharpConfig(gui: GUI) {
  updateUIProperty();
  const f = gui.addFolder("Box3#设置");
  f.close();
  let enableHackClickCount = 0;

  if (!getSetting("flag.hackMode"))
    f.add(
      {
        async f() {
          enableHackClickCount++;
          if (enableHackClickCount == 10) {
            if (
              (
                await Swal.fire({
                  title: "Enable Hack Mode",
                  text: "启用后所造成的一切后果均需要自行承担",
                  icon: "warning",
                  showConfirmButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Enable and reload",
                  cancelButtonText: "取消",
                })
              ).isConfirmed
            ) {
              setSetting("flag.hackMode", true);
              location.reload();
            } else enableHackClickCount = 0;
          }
        },
      },
      "f"
    ).name("▰▰▰ Box3 Sharp ▰▰▰");
  else
    f.add(
      {
        f() {
          setSetting("flag.hackMode", false);
          location.reload();
        },
      },
      "f"
    ).name("Disable Hack Mode");
  f.add(settings, "ui.opacity", 0.1, 1)
    .name("UI透明度")
    .onChange(updateUIProperty);
  f.add(settings, "ui.width", 200, 800)
    .name("UI宽度")
    .onFinishChange(updateUIProperty);
  f.addColor(settings, "ui.primaryColor")
    .name("主题颜色")
    .onChange(updateUIProperty);
  f.add(settings, "ui.blur", 0, 10)
    .name("背景模糊度")
    .onChange(updateUIProperty);
  f.add(settings, "ui.borderRound")
    .name("控件圆角")
    .onFinishChange(updateUIProperty);
  const mcf = f.addFolder("鼠标特效");
  mcf.add(settings, "magicCursor.enable").name("启用鼠标特效（需要刷新）");
  mcf.addColor(settings, "magicCursor.color").name("光标拖尾颜色");
  mcf.addColor(settings, "magicCursor.rippleColor").name("波纹颜色");
  mcf.add(settings, "magicCursor.opacity", 0.1, 1).name("图层透明度");
  addFunctionButton(
    f,
    async () => {
      saveSettings();
      location.reload();
    },
    "保存并刷新"
  );
  addFunctionButton(
    f,
    async () => {
      reloadSettings();
      location.reload();
    },
    "不保存并刷新"
  );
  addFunctionButton(
    f,
    async () => {
      resetSettings();
    },
    "还原为默认值"
  );
}
