import GUI from "lil-gui";

export default function GraphicSettings(
  getCore: () => any,
  state: any,
  gui: GUI,
  needSetSettings = true
) {
  const settingsFolder = gui.addFolder("🎮 高级画质设定").close();
  var VFXSettingsFolder = settingsFolder.addFolder("📈 视觉&性能").close();
  var particleSettingsFolder = settingsFolder
    .addFolder("💻 后处理特效")
    .close();
  var postProcessSettingsFolder = settingsFolder
    .addFolder("🎵 音量合成器")
    .close();
  var cameraSettingsFolder = settingsFolder.addFolder("📷 摄像机控制").close();
  var SFXSettingsFolder = settingsFolder.addFolder("✨ 实体粒子数量").close();

  var graphicSettings = state.box3.state.settings;
  [
    VFXSettingsFolder.add(graphicSettings, "resolutionScale", {
      极低: 0.1,
      非常低: 0.2,
      低: 0.3,
      中: 0.5,
      高: 0.7,
      较高: 0.8,
      全高清: 1,
      "超采样（1.1x）": 1.1,
      "超采样（1.25x）": 1.25,
      "超采样（1.5x）": 1.5,
      "超采样（2.0x）": 2,
      "超采样（2.5x）": 2.5,
      "超采样（3.0x）": 3.0,
      "超采样（4.0x）": 4,
    }).name("清晰度（重进生效）"),
    VFXSettingsFolder.add(
      graphicSettings,
      "animationQuality",
      {
        低: 0,
        中: 100,
        高: 200,
      },
      1
    ).name("动画质量"),
    VFXSettingsFolder.add(graphicSettings, "drawDistance", {
      非常近: 16,
      近: 32,
      中: 64,
      远: 128,
      较远: 256,
      非常远: 512,
      极远: 1024,
      荒唐: 2048,
      疯狂: 4096,
    }).name("视野距离"),
    VFXSettingsFolder.add(
      graphicSettings,
      "cameraSensitivity",
      0.01,
      3,
      0.01
    ).name("视角灵敏度"),
    VFXSettingsFolder.add(graphicSettings, "safeShaders").name(
      "安全光影（追求极致效果请关闭）"
    ),
    VFXSettingsFolder.add(graphicSettings, "shadowResolution", {
      关闭: 0,
      极低: 128,
      低: 512,
      中: 1024,
      高: 2048,
      非常高: 4096,
    }).name("阴影质量"),
    VFXSettingsFolder.add(graphicSettings, "gamma", 0, 2).name("伽马"),
    VFXSettingsFolder.add(graphicSettings, "lowQualityTextures").name(
      "低质量贴图"
    ),
    VFXSettingsFolder.add(graphicSettings, "hdSky").name("高清天空"),
    VFXSettingsFolder.add(graphicSettings, "reflections").name("反射模式"),
    VFXSettingsFolder.add(graphicSettings, "parallaxMap").name("视差贴图"),
    VFXSettingsFolder.add(
      graphicSettings,
      "parallaxDistance",
      1,
      128,
      0.1
    ).name("视差距离"),

    particleSettingsFolder
      .add(graphicSettings, "postprocess")
      .name("启用后处理特效"),
    particleSettingsFolder
      .add(graphicSettings, "depthOfField", {
        关闭: 0,
        低: 16,
        中: 32,
        高: 64,
        散光: 128,
      })
      .name("景深强度"),
    particleSettingsFolder
      .add(graphicSettings, "volumetricScattering")
      .name("体积散射"),
    particleSettingsFolder.add(graphicSettings, "bloom").name("荧光特效"),
    particleSettingsFolder.add(graphicSettings, "fxaa").name("FXAA抗锯齿"),
    postProcessSettingsFolder
      .add(graphicSettings, "masterMute")
      .name("主音量静音"),
    postProcessSettingsFolder
      .add(graphicSettings, "masterVolume", 0, 1, 0.01)
      .name("主音量大小"),
    postProcessSettingsFolder
      .add(graphicSettings, "effectsMute")
      .name("音效静音"),
    postProcessSettingsFolder
      .add(graphicSettings, "effectsVolume", 0, 1)
      .name("音效音量"),
    postProcessSettingsFolder
      .add(graphicSettings, "maxSoundEffects", 0, 100, 1)
      .name("最大音效数量"),
    postProcessSettingsFolder
      .add(graphicSettings, "uiMute")
      .name("界面音效静音"),
    postProcessSettingsFolder
      .add(graphicSettings, "uiVolume", 0, 1, 0.01)
      .name("界面音效音量"),
    postProcessSettingsFolder
      .add(graphicSettings, "musicMute")
      .name("背景音乐静音"),
    postProcessSettingsFolder
      .add(graphicSettings, "musicVolume", 0, 1, 0.01)
      .name("背景音乐音量"),
    SFXSettingsFolder.add(graphicSettings, "maxParticles", 0, 131052, 1).name(
      "最大粒子数量"
    ),
    SFXSettingsFolder.add(
      graphicSettings,
      "maxParticleGroups",
      0,
      1024,
      1
    ).name("最大粒子组数量"),
  ].forEach((i) =>
    i.onChange(() => {
      if (needSetSettings) getCore().setGameSettings(graphicSettings);
    })
  );
  cameraSettingsFolder
    .add(state.box3.state.secret.replica.camera, "distance", 0, 300)
    .name("摄像机距离");
  cameraSettingsFolder
    .add(state.box3.state.secret.replica.camera, "fovY", 0, 1)
    .name("FovY");
  cameraSettingsFolder
    .add(state.box3.state.secret.replica.camera, "mode", {
      "第三人称(FOLLOW)": 0,
      "锁定(FIXED)": 1,
      "第一人称(FPS)": 2,
      固定方向: 3,
    })
    .name("相机模式");
  cameraSettingsFolder
    .add(state.box3.state.secret.replica, "enableCursor")
    .name("启用3D光标");
  cameraSettingsFolder.add(state.box3.state, "hideUI").name("隐藏界面");
  cameraSettingsFolder
    .add({ a: 0 }, "a", { 视角锁定: 0, 右键拖动: 1 })
    .name("相机操作模式")
    .onChange((v: number) => {
      state.box3.input.setCameraBindingMode(v);
    });
}
