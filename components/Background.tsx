"use client";
import { useState, useEffect } from "react";

const BOX_SIZE = 80;
const HIGHLIGHT_RADIUS_MULT = 2.5;

function getGridSize() {
  return {
    cols: Math.ceil(window.innerWidth / BOX_SIZE),
    rows: Math.ceil(window.innerHeight / BOX_SIZE),
  };
}

function getIntensity(cursorX: number, cursorY: number, x: number, y: number) {
  const dx = cursorX - x;
  const dy = cursorY - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxDist = BOX_SIZE * HIGHLIGHT_RADIUS_MULT;
  return Math.max(0, 1 - dist / maxDist);
}

export default function Background() {
  const [grid, setGrid] = useState({ rows: 0, cols: 0 });
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleResize = () => setGrid(getGridSize());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const boxes = [];
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      const x = col * BOX_SIZE + BOX_SIZE / 2;
      const y = row * BOX_SIZE + BOX_SIZE / 2;
      const intensity = getIntensity(cursor.x, cursor.y, x, y);

      boxes.push(
        <div
          key={`${row}-${col}`}
          className="border border-neutral-800/20 dark:border-neutral-800 transition-colors duration-150"
          style={{
            width: BOX_SIZE,
            height: BOX_SIZE,
            backgroundColor: `rgba(139, 92, 246, ${intensity * 0.1})`,
            boxShadow: intensity > 0 ? `0 0 ${20 * intensity}px rgba(139,92,246, ${0.4 * intensity})` : "none",
          }}
        />
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-0 grid pointer-events-none opacity-40 dark:opacity-100"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${BOX_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.rows}, ${BOX_SIZE}px)`,
      }}
    >
      {boxes}
    </div>
  );
}
