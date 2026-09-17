import { useEffect, useRef } from "react";

type NetworkWebProps = { progress: number; reducedMotion: boolean };

type Node = { x: number; y: number; vx: number; vy: number; radius: number };

const baseNodes = [
  [0.08, 0.2], [0.2, 0.11], [0.32, 0.23], [0.47, 0.12], [0.62, 0.2], [0.78, 0.12], [0.9, 0.25],
  [0.14, 0.43], [0.29, 0.38], [0.45, 0.48], [0.62, 0.4], [0.79, 0.5], [0.92, 0.43],
  [0.1, 0.68], [0.25, 0.8], [0.42, 0.68], [0.58, 0.79], [0.74, 0.66], [0.9, 0.78],
  [0.18, 0.93], [0.38, 0.88], [0.61, 0.91], [0.82, 0.9],
];

export default function NetworkWeb({ progress, reducedMotion }: NetworkWebProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const reducedRef = useRef(reducedMotion);

  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { reducedRef.current = reducedMotion; }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const pointer = { x: -10_000, y: -10_000 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    const nodes: Node[] = baseNodes.map(([x, y], index) => ({ x, y, vx: (index % 2 ? -1 : 1) * 0.00006, vy: (index % 3 ? 1 : -1) * 0.00004, radius: index % 4 === 0 ? 1.8 : 1.2 }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onPointerMove = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    const onPointerLeave = () => { pointer.x = -10_000; pointer.y = -10_000; };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);

    const draw = (time: number) => {
      const progressValue = progressRef.current;
      const chapter = Math.min(3, Math.max(0, progressValue));
      const sparse = width < 600;
      const visibleCount = sparse ? 13 : 23;
      const structured = chapter > 1.7 ? 1 : chapter / 1.7;
      const crystalX = width * (0.77 - Math.sin(chapter * 0.9) * 0.18);
      const crystalY = height * (0.48 + Math.cos(chapter * 0.7) * 0.08);
      context.clearRect(0, 0, width, height);
      context.lineWidth = 0.65;
      context.strokeStyle = "rgba(188, 239, 235, 0.12)";
      context.fillStyle = "rgba(188, 239, 235, 0.38)";

      for (let index = 0; index < visibleCount; index += 1) {
        const node = nodes[index];
        if (!reducedRef.current) {
          node.x += node.vx * (1 + structured * 1.2);
          node.y += node.vy * (1 + structured * 1.2);
          if (node.x < 0.04 || node.x > 0.96) node.vx *= -1;
          if (node.y < 0.06 || node.y > 0.95) node.vy *= -1;
        }
        const restX = node.x * width;
        const restY = node.y * height;
        const distanceToPointer = Math.hypot(pointer.x - restX, pointer.y - restY);
        const pointerPull = Math.max(0, 1 - distanceToPointer / 190);
        const mouseX = pointerPull * (pointer.x - restX) * 0.06;
        const mouseY = pointerPull * (pointer.y - restY) * 0.06;
        const driftX = Math.sin(time * 0.00018 + index) * (reducedRef.current ? 0 : 2.4);
        const driftY = Math.cos(time * 0.00015 + index * 0.7) * (reducedRef.current ? 0 : 1.8);
        const x = restX + mouseX + driftX + (crystalX - width * 0.72) * pointerPull * 0.04;
        const y = restY + mouseY + driftY + (crystalY - height * 0.5) * pointerPull * 0.025;
        (node as Node & { renderX?: number; renderY?: number }).renderX = x;
        (node as Node & { renderX?: number; renderY?: number }).renderY = y;
      }

      for (let first = 0; first < visibleCount; first += 1) {
        const a = nodes[first] as Node & { renderX?: number; renderY?: number };
        for (let second = first + 1; second < visibleCount; second += 1) {
          const b = nodes[second] as Node & { renderX?: number; renderY?: number };
          const distance = Math.hypot((a.renderX ?? 0) - (b.renderX ?? 0), (a.renderY ?? 0) - (b.renderY ?? 0));
          const maxDistance = 142 - structured * 12;
          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * (0.16 + structured * 0.04);
            context.strokeStyle = `rgba(188, 239, 235, ${alpha})`;
            context.beginPath();
            context.moveTo(a.renderX ?? 0, a.renderY ?? 0);
            context.lineTo(b.renderX ?? 0, b.renderY ?? 0);
            context.stroke();
          }
        }
      }

      for (let index = 0; index < visibleCount; index += 1) {
        const node = nodes[index] as Node & { renderX?: number; renderY?: number };
        context.beginPath();
        context.arc(node.renderX ?? 0, node.renderY ?? 0, node.radius, 0, Math.PI * 2);
        context.fill();
      }
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onPointerMove); window.removeEventListener("blur", onPointerLeave); };
  }, []);

  return <canvas ref={canvasRef} className="network-stage" aria-hidden="true" />;
}
