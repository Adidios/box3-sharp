import { settings } from "./utils";

export default function setupMagicCursor() {
  import("../styles/magic-cursor-style.css");
  function addStyle() {
    const style = document.createElement("style");
    style.textContent = "*{cursor:none !important;}";
    document.body.appendChild(style);
  }
  addStyle();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  let mousePos: [number, number] = [0, 0];
  let pos: [number, number] = [0, 0];
  const MAX_LENGTH = 30;
  let points: [number, number][] = [];
  const ripples: [number, number, number][] = [];
  function resize() {
    canvas.height = innerHeight * devicePixelRatio;
    canvas.width = innerWidth * devicePixelRatio;
  }
  addEventListener("resize", resize);
  document.body.addEventListener("mousemove", ({ clientX, clientY }) => {
    mousePos = [clientX * devicePixelRatio, clientY * devicePixelRatio];
  });
  addEventListener("mousedown", () => {
    ripples.push([...mousePos, 0]);
  });
  addEventListener("wheel", ({ deltaY }) => {
    pos[1] -= deltaY * 0.1;
  });
  resize();
  canvas.classList.add("magic-cursor-canvas");
  document.body.append(canvas);
  let isPointerLock = false;
  function frame() {
    if (document.pointerLockElement) {
      if (!isPointerLock) {
        isPointerLock = true;
      }

      canvas.style.opacity = "0";
      mousePos = [
        (innerWidth * devicePixelRatio) / 2,
        (innerHeight * devicePixelRatio) / 2,
      ];
    } else {
      if (isPointerLock) {
        isPointerLock = false;
      }
      canvas.style.opacity = settings["magicCursor.opacity"].toString();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(frame);
    pos[0] += (mousePos[0] - pos[0]) / 5;
    pos[1] += (mousePos[1] - pos[1]) / 5;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < points.length; i++) {
      const a = i / MAX_LENGTH;
      ctx.beginPath();
      if (i > 0) ctx.moveTo(points[i - 1][0], points[i - 1][1]);
      ctx.lineTo(points[i][0], points[i][1]);
      ctx.strokeStyle = `${settings["magicCursor.color"]}${Math.round(a * 255)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.lineWidth = a * 20;
      ctx.closePath();
      ctx.stroke();
    }
    for (let r of ripples) {
      ctx.beginPath();
      ctx.arc(r[0], r[1], r[2] * 30, 0, Math.PI * 2);
      ctx.fillStyle = `${settings["magicCursor.rippleColor"]}${Math.round(
        (1 - r[2]) * 255
      )
        .toString(16)
        .padStart(2, "0")}`;
      ctx.closePath();
      ctx.fill();
      r[2] += (1 - r[2]) / 10;
    }
    for (let i = 0; i < ripples.length; i++) {
      if (ripples[i][2] >= 0.999) ripples.splice(i, 1);
    }
    ctx.closePath();

    points.push([...pos]);
    ctx.beginPath();
    ctx.arc(mousePos[0], mousePos[1], 3, 0, Math.PI * 2);
    ctx.fillStyle = settings["magicCursor.rippleColor"];
    ctx.closePath();
    ctx.fill();
    while (points.length > MAX_LENGTH) {
      points.splice(0, 1);
    }
  }
  frame();
}
