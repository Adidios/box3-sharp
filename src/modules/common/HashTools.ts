import GUI from "lil-gui";
import Swal from "sweetalert2";
import { addFunctionButton, uploadHash } from "../../lib/utils";

export default function (gui: GUI) {
  const f = gui.addFolder("Hash工具");
  f.close();
  addFunctionButton(
    f,
    async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.style.opacity = "0";
      document.body.append(input);
      input.click();

      input.addEventListener("change", async () => {
        const file = input.files![0];
        input.remove();
        if (!file) return;
        try {
          const obj = await uploadHash(file);
          navigator.clipboard.writeText(obj.Key);
          if (
            (
              await Swal.fire({
                title: "上传完成",
                html: `HashKey: ${obj.Key}<br/>大小: ${obj.Size}<br/>已将Hash复制到剪贴板`,
                cancelButtonText: "关闭",
                confirmButtonText: "打开Hash链接",
                showCancelButton: true,
                icon: "info",
              })
            ).isConfirmed
          )
            open(`https://static.box3.codemao.cn/block/${obj.Key}`);
        } catch (e) {
          const res = e as Response;
          Swal.fire(
            `上传失败`,
            `${res.status} ${res.statusText}\n${await res.text()}`,
            "error"
          );
        }
      });
    },
    "上传文件"
  );
  const f2 = f.addFolder("打开Hash");
  addFunctionButton(
    f2,
    async () => {
      const text = (await navigator.clipboard.readText()).trim();
      if (!/^Qm[a-zA-Z0-9]+$/.test(text))
        return Swal.fire(
          "Hash无效",
          `剪贴板中的内容并不是一个有效的hash`,
          "error"
        );
      open(`https://static.box3.codemao.cn/block/${text}`);
      return;
    },
    "打开剪贴板中的hash"
  );
}
