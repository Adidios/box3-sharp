import { addFunctionButton, startLoading } from "../lib/utils";

export default function (gui: any) {
  addFunctionButton(
    gui,
    async () => {
      startLoading();
      location.href = "https://box3.codemao.cn";
    },
    "跳转到box3.codemao.cn"
  );
  addFunctionButton(
    gui,
    async () => {
      location.href = "/admin";
    },
    "进入后台（仅限官方）"
  );
}
