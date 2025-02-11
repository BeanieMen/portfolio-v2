<template>
  <canvas ref="canvasRef" class="absolute inset-0 z-0"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let canvas, ctx;

let boxes = [];

let gridInfo = {
  columns: 0,
  boxSize: 0,
  rows: 0,
  gridHeight: 0
};

let isAnimating = false;
let lastTimestamp = 0;


function calculateGrid() {
  if (!canvas) return;
  
  const w = window.innerWidth;
  // Make sure the grid covers at least the viewport (or the document, if longer)
  const docHeight = Math.max(document.body.scrollHeight, window.innerHeight);
  gridInfo.gridHeight = docHeight;
  
  // Use 10 columns if the width is less than 768px, otherwise 12.
  gridInfo.columns = (w < 768) ? 10 : 12;
  gridInfo.boxSize = w / gridInfo.columns;
  gridInfo.rows = Math.ceil(docHeight / gridInfo.boxSize);
  
  // Set up the canvas’s display size and internal resolution for HiDPI devices.
  const dpr = window.devicePixelRatio || 1;
  canvas.style.width = w + 'px';
  canvas.style.height = docHeight + 'px';
  canvas.width = w * dpr;
  canvas.height = docHeight * dpr;
  // Reset any existing transforms before scaling.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  
  boxes = [];
  for (let r = 0; r < gridInfo.rows; r++) {
    for (let c = 0; c < gridInfo.columns; c++) {
      boxes.push({
        x: c * gridInfo.boxSize,
        y: r * gridInfo.boxSize,
        size: gridInfo.boxSize,
        t: 0,       // current animation progress (0 means “normal”, 1 means “hovered”)
        target: 0   // the desired value (set to 1 for hover, then back to 0)
      });
    }
  }
  // Draw an initial frame.
  draw();
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, gridInfo.gridHeight);
  
  boxes.forEach(box => {
    // Linear interpolation: when t==0 we want 22, when t==1 we want 51.
    const base = 22;
    const diff = 29; // 51 - 22 = 29
    const colorVal = Math.round(base + diff * box.t);
    const fillColor = `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(box.x, box.y, box.size, box.size);
    
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    ctx.strokeRect(box.x, box.y, box.size, box.size);
  });
}

function animate(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  
  let needsRedraw = false;
  boxes.forEach(box => {
    if (box.t < box.target) {
      // Fade in quickly (75ms).
      box.t = Math.min(box.target, box.t + dt / 75);
      needsRedraw = true;
    } else if (box.t > box.target) {
      // Fade out more slowly (700ms).
      box.t = Math.max(box.target, box.t - dt / 700);
      needsRedraw = true;
    }
  });
  
  draw();
  
  if (needsRedraw) {
    isAnimating = true;
    requestAnimationFrame(animate);
  } else {
    isAnimating = false;
    lastTimestamp = 0;
  }
}

function startAnimation() {
  if (!isAnimating) {
    requestAnimationFrame(animate);
    isAnimating = true;
  }
}

function handleMouseMove(e) {
  const mouseX = e.pageX;
  const mouseY = e.pageY;
  
  const { boxSize, columns, rows, gridHeight } = gridInfo;
  
  if (mouseX < 0 || mouseX > window.innerWidth || mouseY < 0 || mouseY > gridHeight) {
    boxes.forEach(box => box.target = 0);
  } else {
    const col = Math.floor(mouseX / boxSize);
    const row = Math.floor(mouseY / boxSize);
    const hoveredIndex = row * columns + col;
    boxes.forEach((box, index) => {
      box.target = (index === hoveredIndex) ? 1 : 0;
    });
  }
  startAnimation();
}

function handleMouseLeave() {
  boxes.forEach(box => box.target = 0);
  startAnimation();
}

let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    calculateGrid();
    startAnimation();
  }, 100);
}

onMounted(() => {
  canvas = canvasRef.value;
  ctx = canvas.getContext('2d');
  
  calculateGrid();
  
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (canvas) {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  }
  window.removeEventListener('resize', handleResize);
});
</script>
