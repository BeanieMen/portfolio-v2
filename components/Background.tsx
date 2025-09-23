"use client";
import { useState, useEffect, useRef } from "react";

const BOX_SIZE = 80;
const HIGHLIGHT_RADIUS_MULT = 2.5;

export default function Background() {
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });
  const cursorRef = useRef({ x: -1000, y: -1000 });
  const [, setFrame] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setGrid({
        cols: Math.ceil(window.innerWidth / BOX_SIZE),
        rows: Math.ceil(window.innerHeight / BOX_SIZE),
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      setFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const boxes = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const x = col * BOX_SIZE + BOX_SIZE / 2;
      const y = row * BOX_SIZE + BOX_SIZE / 2;
      const dx = cursorRef.current.x - x;
      const dy = cursorRef.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = BOX_SIZE * HIGHLIGHT_RADIUS_MULT;
      const intensity = Math.max(0, 1 - dist / maxDist);

      boxes.push(
        <div
          key={`${row}-${col}`}
          className="border border-neutral-800 transition-colors duration-150"
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            backgroundColor: `rgba(139, 92, 246, ${intensity * 0.15})`,
            boxShadow:
              intensity > 0
                ? `0 0 ${20 * intensity}px rgba(139,92,246,${0.6 * intensity})`
                : "none",
          }}
        />
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-0 grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${BOX_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${BOX_SIZE}px)`,
      }}
    >
      {boxes}
    </div>
  );
}
