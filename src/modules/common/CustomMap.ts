import GUI from "lil-gui";
import Swal from "sweetalert2";
import { addFunctionButton, uploadHash } from "../../lib/utils";

export default function (gui: GUI) {
  const f = gui.addFolder("自定义地图参数");
  const shapeFolder = f.addFolder("地图尺寸");
  const emptyChunk = "QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU";
  const config = {
    shape: {
      x: 128,
      y: 128,
      z: 128,
    },
    enableTriggerAPI: false,
    storageMode: "sqlite",
    scriptIndex: "index.js",
    name: "空白自定义地图",
  };

  const create = async () => {
    const errors = [];
    const V = config.shape.x * config.shape.y * config.shape.z;
    if (V >= 67108864) {
      errors.push("地图总体积不得超过67108864");
    }
    if (!/^.+\.js$/.test(config.scriptIndex)) {
      errors.push("脚本入口错误");
    }
    if (errors.length > 0) {
      return Swal.fire({
        title: `输入有误`,
        html:
          "您输入的参数存在以下问题<br/>" +
          errors.map((i) => "⚠ " + i).join("<br/>"),
        icon: "error",
      });
    }
    try {
      function buildVoxelChunks() {
        var chunks: string[] = [],
          xx = config.shape.x / 32,
          yy = config.shape.y / 32,
          zz = config.shape.z / 32;
        for (let i = 1; i < zz; i++) {
          chunks = chunks.concat(
            new Array(xx - 1).fill(
              "QmY4M7B58dARVAJyYf7aonuGjNnaUFUusCQXq9tmifLEKY"
            )
          );
          chunks.push("Qmcoad9FnMdKGbxn5ifLdCaivVi6T7E2bmDVAdJbwuRD2a");
          chunks = chunks.concat(new Array((yy - 1) * xx).fill(emptyChunk));
        }
        chunks = chunks.concat(
          new Array(xx - 1).fill(
            "QmaCUNCe7XDEnXJqprgikquGk6H5nkMegxi77h2aaRyc2b"
          )
        );
        chunks.push("QmX49DZMGEY9ANyzfbrWhiEKk1hkz9SRpFn2NTKMRUjQzj");
        chunks = chunks.concat(new Array((yy - 1) * xx).fill(emptyChunk));
        return chunks;
      }
      const voxelsHash = (
        await uploadHash(
          JSON.stringify({
            chunks: buildVoxelChunks(),
            shape: config.shape,
          })
        )
      ).Key;
      console.log("Voxels Hash", voxelsHash);
      const projectHash = (
        await uploadHash(
          JSON.stringify({
            ambientSound: "QmcNbLSSQfVcDpH9jSX38RSVrL1SZK3vNMZwaP7cMkKqvY",
            assets: "QmQ7F5ee4rxLn5UQgjKrrtaX1Qif1P48NxYiSv3damw5G3",
            collisionFilter: [],
            committerId: 0,
            deleteAssets: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
            editRoot: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
            entities: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
            environment: "QmSnYEH7wPftKcr8qDaBWf5PrbHrqKbqEhTUthQsDuhPqV",
            features: { enableTriggerAPI: config.enableTriggerAPI },
            folders: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
            info: "QmbpXhRWRMdN4y6CZ4VsPXkkuNfvFSPoSkKn86BVzYh26w",
            physics: "QmTzt6Z6Mm11NQjTeXspDMJtddzDadzwhgwfWUtNG5XCrD",
            player: "QmUMttRLjZYCpW6gLBiLZsCq3VNjWCnK4NtqYaBYJ1GCyh",
            prevHash: "QmcfC4xGX69j1dcgUb3gZS9a9qjCR8aVah1PjQspUVNYvH",
            scriptAssets: "Qmcv3WHWrFohnJXxk2qdV2hk6CE6vQ4BzWMVsE2qFVXV9j",
            scriptIndex: config.scriptIndex,
            storageMode: config.storageMode,
            timestamp: new Date().toISOString(),
            type: "project",
            version: "0.3.11",
            voxels: voxelsHash,
            zones: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
          })
        )
      ).Key;
      console.log("Project Hash", projectHash);
      const containerName: string = await (
        document.querySelector(".app")! as any
      )._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.rpc.container.api.createGameEdit(
        { hash: projectHash, name: config.name }
      );
      console.log("Edit container", containerName);
      const editHref = `https://box3.codemao.cn/e/${containerName.slice(5)}`;
      console.log("Edit href", editHref);
      if (
        (
          await Swal.fire({
            title: "创建完成",
            text: "已使用自定义参数创建地图",
            icon: "success",
            confirmButtonText: "进入地图",
          })
        ).isConfirmed
      ) {
        location.href = editHref;
      }
    } catch (e) {
      Swal.fire("创建失败", String(e), "error");
    }
    return;
  };
  shapeFolder.add(config.shape, "x", 32, 1024, 32);
  shapeFolder.add(config.shape, "y", 32, 1024, 32);
  shapeFolder.add(config.shape, "z", 32, 1024, 32);
  f.add(config, "enableTriggerAPI").name("启用TriggerAPI");
  f.add(config, "scriptIndex").name("脚本入口文件");
  f.add(config, "storageMode", ["sqlite", "pg"]).name("数据库引擎");
  f.add(config, "name").name("地图名称");
  addFunctionButton(f, create, "创建自定义地图");
}
