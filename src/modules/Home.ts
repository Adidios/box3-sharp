import GUI from "lil-gui";
import { saveSettings, settings } from "../lib/utils";

export default function Home(gui: GUI) {
  const f = gui.addFolder("首页优化");
  const overrideStyle = document.createElement("style");
  document.body.append(overrideStyle);
  function updateConfig() {
    overrideStyle.textContent = `
    ._2p590X3xza5oTJJZ3ToFcx ._1yZ6NeMjfGScb4F10xmspg{
      width: calc(${100 / settings["home.showcaseCols"]}% - 16px)
    }
    ${
      settings["home.hideCarousel"]
        ? `
    main > div._2PcVy2PEDRfz4Up6wcJEyU > div > div > div._12-esTLCDOtIXa8nIbuTtV{
      display: none
    }
    `
        : ""
    }
    
    `;
  }
  updateConfig();

  f.add(settings, "home.showcaseCols", 2, 10, 1).name("每行展示作品个数");
  f.add(settings, "home.hideCarousel").name("隐藏轮播图");

  // 配置设置响应
  f.children.forEach((child) =>
    child.onFinishChange(saveSettings).onChange(updateConfig)
  );
}
