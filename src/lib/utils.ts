import { GM_getValue, GM_setValue } from "$";
import GUI from "lil-gui";
import Swal from "sweetalert2";
import { defaultConfig } from "./defaultConfig";

export function startLoading(text = "Please wait...") {
  Swal.fire({
    titleText: "请稍等",
    allowOutsideClick: false,
    text,
    showConfirmButton: false,
  });
  Swal.showLoading(null);
  // const div = document.createElement("div");
  // div.classList.add("loading");
  // document.body.appendChild(div);
  // div.innerText = text;
  return () => Swal.close();
}
export function showUploadFile(multiple = false, accept = "") {
  return new Promise<any[]>((ok) => {
    const result: any[] = [];
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.opacity = "0";
    document.body.append(input);
    input.click();
    Swal.fire({
      title: "批量上传",
      text: "请选择文件",
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isDismissed) {
        ok([]);
      }
    });
    Swal.showLoading(null);

    input.addEventListener("change", async () => {
      input.remove();
      for (let i = 0; i < input.files!.length; i++) {
        let isRetry = false;
        const file = input.files!.item(i);

        if (!file) return;
        do {
          try {
            result.push({
              ...(await uploadHash(file, file.name)),
              filename: file.name,
            });
            isRetry = false;
          } catch (e) {
            const res = e as Response;
            await Swal.fire({
              title: `上传失败`,
              text: `${res.status} ${
                res.statusText
              }\n${await res.text()} 即将重试`,
              timer: 3e3,
              icon: "error",
            });
            isRetry = true;
          }
        } while (isRetry);
      }
      ok(result);
    });
  });
}
export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
export async function uploadHash(data: any, name = "") {
  const removeLoading = startLoading("正在上传" + name);
  const res = await fetch("https://static.box3.codemao.cn/block", {
    method: "POST",
    body: data,
  });
  removeLoading();
  if (res.ok) return await res.json();
  else throw res;
}
export async function waitElement<T>(query: string) {
  let el: HTMLElement | null;
  while (true) {
    el = document.querySelector(query);
    if (el) return el as T;
    await new Promise(requestAnimationFrame);
  }
}
export async function waitUntil(f: () => boolean) {
  while (!f()) await new Promise(requestAnimationFrame);
}
export let settings = {
  ...defaultConfig,
  ...GM_getValue("settings", {}),
};
export function getSetting<T>(k: string) {
  return { ...settings }[k] as T;
}
export function setSetting(k: string, v: unknown) {
  Object.assign(settings, { [k]: v });
  saveSettings();
}
export function saveSettings() {
  GM_setValue("settings", settings);
}
export function resetSettings() {
  GM_setValue("settings", defaultConfig);
  location.reload();
}
export function reloadSettings() {
  settings = GM_getValue("settings", defaultConfig);
}
export function addFunctionButton(
  gui: GUI,
  func: () => Promise<unknown>,
  name: string
) {
  const btn = gui
    .add(
      {
        func: () => {
          btn.name("⏳ 正在执行操作...");
          btn.disable();
          func().then(() => {
            btn.name(name);
            btn.enable();
          });
        },
      },
      "func"
    )
    .name(name);
}
export function addLabel(gui: GUI, name: string) {
  const btn = gui
    .add(
      {
        func: () => {},
      },
      "func"
    )
    .name(name);
  btn.disable();
  return btn;
}
