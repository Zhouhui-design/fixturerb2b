const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/sardenesy/fixturerb2b/public/images';

// Helper function to generate random number in range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Helper function to draw gradient
function drawGradient(ctx, x1, y1, x2, y2, colors) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Helper function to add subtle noise texture
function addNoise(ctx, width, height, intensity = 0.03) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * intensity;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);
}

// Generate Hero Image: Modern Women's Clothing Boutique
function generateHeroImage() {
  console.log('Generating hero boutique image...');
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');

  // Background - warm cream/beige wall
  drawGradient(ctx, 0, 0, 0, 1080, ['#f5f0e8', '#ebe5d8']);

  // Floor - polished wood/concrete
  ctx.fillStyle = '#d4cfc4';
  ctx.fillRect(0, 700, 1920, 380);

  // Add floor perspective lines
  ctx.strokeStyle = 'rgba(160, 150, 135, 0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1920; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 700);
    ctx.lineTo(i - 100, 1080);
    ctx.stroke();
  }

  // Left side - Elegant clothing rack with garments
  // Rack structure
  ctx.fillStyle = '#2c2c2c';
  ctx.fillRect(150, 200, 8, 500); // Vertical pole
  ctx.fillRect(100, 200, 200, 6); // Top bar
  ctx.fillRect(100, 695, 200, 6); // Bottom bar

  // Hangers and clothes on left rack
  const clothesColors = ['#8b7355', '#a0826d', '#c9b8a0', '#d4c4a8', '#9e8b73'];
  for (let i = 0; i < 8; i++) {
    const x = 120 + i * 22;
    // Hanger hook
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, 200, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Garment silhouette
    ctx.fillStyle = clothesColors[i % clothesColors.length];
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(x - 12, 210);
    ctx.quadraticCurveTo(x - 15, 350, x - 10, 480);
    ctx.lineTo(x + 10, 480);
    ctx.quadraticCurveTo(x + 15, 350, x + 12, 210);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Center display table
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(700, 550, 520, 150); // Table top
  ctx.fillStyle = '#d0c8b8';
  ctx.fillRect(720, 700, 20, 150); // Leg
  ctx.fillRect(1180, 700, 20, 150); // Leg

  // Items on table
  // Mannequin torso
  ctx.fillStyle = '#f0e8d8';
  ctx.beginPath();
  ctx.ellipse(950, 500, 60, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // Jewelry/display items
  ctx.fillStyle = '#c9a96e';
  ctx.beginPath();
  ctx.arc(850, 560, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1050, 555, 12, 0, Math.PI * 2);
  ctx.fill();

  // Right side - Wall shelving unit
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(1400, 150, 10, 550); // Vertical support
  ctx.fillRect(1350, 150, 150, 8); // Shelf 1
  ctx.fillRect(1350, 300, 150, 8); // Shelf 2
  ctx.fillRect(1350, 450, 150, 8); // Shelf 3
  ctx.fillRect(1350, 600, 150, 8); // Shelf 4

  // Items on shelves
  const shelfItems = [
    { x: 1370, y: 130, w: 30, h: 20, color: '#8b6f4e' },
    { x: 1410, y: 125, w: 25, h: 25, color: '#a08060' },
    { x: 1450, y: 128, w: 35, h: 22, color: '#7a5f45' },
    { x: 1370, y: 280, w: 28, h: 20, color: '#9e7f5f' },
    { x: 1415, y: 275, w: 32, h: 25, color: '#b89878' },
    { x: 1375, y: 430, w: 30, h: 20, color: '#8a6e52' },
    { x: 1420, y: 428, w: 28, h: 22, color: '#a88868' },
  ];

  shelfItems.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.w, item.h);
  });

  // Ceiling lights - warm pendant lighting
  const lights = [
    { x: 400, y: 50 },
    { x: 960, y: 40 },
    { x: 1500, y: 55 }
  ];

  lights.forEach(light => {
    // Light cord
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(light.x, 0);
    ctx.lineTo(light.x, light.y);
    ctx.stroke();

    // Light fixture
    ctx.fillStyle = '#2c2c2c';
    ctx.beginPath();
    ctx.arc(light.x, light.y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Light glow
    const glowGradient = ctx.createRadialGradient(light.x, light.y + 25, 0, light.x, light.y + 25, 200);
    glowGradient.addColorStop(0, 'rgba(255, 230, 180, 0.4)');
    glowGradient.addColorStop(0.5, 'rgba(255, 220, 160, 0.15)');
    glowGradient.addColorStop(1, 'rgba(255, 210, 140, 0)');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(light.x - 200, light.y, 400, 400);
  });

  // Warm ambient lighting overlay
  const ambientGradient = ctx.createRadialGradient(960, 540, 100, 960, 540, 800);
  ambientGradient.addColorStop(0, 'rgba(255, 240, 200, 0.15)');
  ambientGradient.addColorStop(1, 'rgba(255, 230, 180, 0)');
  ctx.fillStyle = ambientGradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Subtle vignette
  const vignetteGradient = ctx.createRadialGradient(960, 540, 400, 960, 540, 1000);
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add subtle noise for photorealistic texture
  addNoise(ctx, 1920, 1080, 0.02);

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'hero-boutique.jpg'), buffer);
  console.log('Hero boutique image saved!');
}

// Generate Factory/Workshop Image
function generateFactoryImage() {
  console.log('Generating factory workshop image...');
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');

  // Background - industrial gray walls
  drawGradient(ctx, 0, 0, 0, 1080, ['#5a5a5a', '#4a4a4a']);

  // Floor - concrete
  ctx.fillStyle = '#6b6b6b';
  ctx.fillRect(0, 650, 1920, 430);

  // Floor texture lines
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1920; i += 120) {
    ctx.beginPath();
    ctx.moveTo(i, 650);
    ctx.lineTo(i + 50, 1080);
    ctx.stroke();
  }

  // Workbench in center
  ctx.fillStyle = '#8b7355';
  ctx.fillRect(500, 580, 920, 20); // Workbench top
  ctx.fillStyle = '#6b5335';
  ctx.fillRect(520, 600, 30, 200); // Leg
  ctx.fillRect(1370, 600, 30, 200); // Leg
  ctx.fillRect(700, 600, 20, 180); // Support
  ctx.fillRect(1200, 600, 20, 180); // Support

  // Metal frame being worked on (center of workbench)
  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 8;
  ctx.strokeRect(750, 450, 420, 130);

  // Welding sparks effect
  for (let i = 0; i < 30; i++) {
    const sparkX = 850 + Math.random() * 100;
    const sparkY = 500 + Math.random() * 50;
    const size = random(2, 6);

    ctx.fillStyle = `rgba(255, ${random(150, 255)}, ${random(0, 100)}, ${random(0.6, 1)})`;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright welding light
  const weldGlow = ctx.createRadialGradient(900, 520, 0, 900, 520, 150);
  weldGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
  weldGlow.addColorStop(0.3, 'rgba(255, 200, 100, 0.4)');
  weldGlow.addColorStop(1, 'rgba(255, 150, 50, 0)');
  ctx.fillStyle = weldGlow;
  ctx.fillRect(750, 370, 300, 300);

  // Worker silhouette (simplified)
  ctx.fillStyle = '#2a2a2a';
  // Body
  ctx.fillRect(950, 380, 80, 200);
  // Head
  ctx.beginPath();
  ctx.arc(990, 360, 30, 0, Math.PI * 2);
  ctx.fill();
  // Arm reaching toward work
  ctx.fillRect(920, 450, 100, 25);

  // Safety helmet
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.ellipse(990, 345, 35, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tools on workbench
  // Hammer
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(600, 565, 60, 8);
  ctx.fillStyle = '#8b4513';
  ctx.fillRect(600, 560, 20, 18);

  // Wrench
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(1300, 560, 80, 10);
  ctx.beginPath();
  ctx.arc(1300, 565, 12, 0, Math.PI * 2);
  ctx.fill();

  // Wood pieces stacked (left side)
  ctx.fillStyle = '#a08060';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(150, 520 - i * 25, 200, 20);
  }

  // Metal sheets leaning (right side)
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(1550, 400, 15, 250);
  ctx.fillRect(1570, 420, 15, 230);
  ctx.fillRect(1590, 410, 15, 240);

  // Industrial shelving unit (background left)
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(100, 200, 10, 400);
  ctx.fillRect(80, 200, 120, 8);
  ctx.fillRect(80, 320, 120, 8);
  ctx.fillRect(80, 440, 120, 8);
  ctx.fillRect(80, 560, 120, 8);

  // Boxes on shelves
  ctx.fillStyle = '#8b6f4e';
  ctx.fillRect(90, 280, 40, 35);
  ctx.fillRect(140, 275, 35, 40);
  ctx.fillStyle = '#7a5f45';
  ctx.fillRect(95, 400, 45, 35);
  ctx.fillRect(150, 395, 35, 40);

  // Overhead industrial lighting
  const industrialLights = [
    { x: 300, y: 80 },
    { x: 960, y: 60 },
    { x: 1600, y: 75 }
  ];

  industrialLights.forEach(light => {
    // Light fixture housing
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(light.x - 40, light.y - 10, 80, 20);

    // Light beam
    const beamGradient = ctx.createLinearGradient(light.x, light.y + 10, light.x, 650);
    beamGradient.addColorStop(0, 'rgba(255, 255, 220, 0.3)');
    beamGradient.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = beamGradient;
    ctx.beginPath();
    ctx.moveTo(light.x - 40, light.y + 10);
    ctx.lineTo(light.x + 40, light.y + 10);
    ctx.lineTo(light.x + 150, 650);
    ctx.lineTo(light.x - 150, 650);
    ctx.closePath();
    ctx.fill();
  });

  // Ambient workshop lighting
  const ambientOverlay = ctx.createRadialGradient(960, 540, 200, 960, 540, 900);
  ambientOverlay.addColorStop(0, 'rgba(255, 250, 220, 0.1)');
  ambientOverlay.addColorStop(1, 'rgba(255, 240, 200, 0)');
  ctx.fillStyle = ambientOverlay;
  ctx.fillRect(0, 0, 1920, 1080);

  // Subtle dust particles in air
  for (let i = 0; i < 50; i++) {
    const px = random(0, 1920);
    const py = random(100, 600);
    const size = random(1, 3);
    ctx.fillStyle = `rgba(255, 255, 255, ${random(0.1, 0.3)})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vignette
  const vignetteGradient = ctx.createRadialGradient(960, 540, 500, 960, 540, 1100);
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add noise for industrial texture
  addNoise(ctx, 1920, 1080, 0.03);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'factory-workshop.jpg'), buffer);
  console.log('Factory workshop image saved!');
}

// Generate Product Showcase Image
function generateProductShowcase() {
  console.log('Generating product showcase image...');
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');

  // Clean white background with subtle gradient
  drawGradient(ctx, 0, 0, 0, 1080, ['#ffffff', '#fafafa']);

  // Soft shadow underneath product
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.beginPath();
  ctx.ellipse(960, 850, 500, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // === Modular Shelving System ===

  // Main vertical supports (metal)
  const metalColor = '#4a4a4a';
  const woodColor = '#c4a882';
  const woodDarkColor = '#a88862';

  // Left vertical post
  ctx.fillStyle = metalColor;
  ctx.fillRect(450, 200, 25, 600);

  // Right vertical post
  ctx.fillRect(1445, 200, 25, 600);

  // Middle vertical post
  ctx.fillRect(947, 200, 25, 600);

  // Horizontal shelves (wood)
  const shelves = [
    { y: 280, width: 1020 },
    { y: 420, width: 1020 },
    { y: 560, width: 1020 },
    { y: 700, width: 1020 }
  ];

  shelves.forEach((shelf, index) => {
    // Wood grain effect
    const shelfGradient = ctx.createLinearGradient(450, shelf.y, 450, shelf.y + 20);
    shelfGradient.addColorStop(0, woodColor);
    shelfGradient.addColorStop(0.5, woodDarkColor);
    shelfGradient.addColorStop(1, woodColor);

    ctx.fillStyle = shelfGradient;
    ctx.fillRect(450, shelf.y, shelf.width, 20);

    // Wood grain lines
    ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
      const lineY = shelf.y + random(2, 18);
      ctx.beginPath();
      ctx.moveTo(450, lineY);
      ctx.lineTo(1470, lineY + random(-2, 2));
      ctx.stroke();
    }

    // Shelf edge highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(450, shelf.y, shelf.width, 2);
  });

  // Cross braces (metal)
  ctx.strokeStyle = '#5a5a5a';
  ctx.lineWidth = 6;

  // Left section diagonal brace
  ctx.beginPath();
  ctx.moveTo(475, 280);
  ctx.lineTo(947, 420);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(947, 280);
  ctx.lineTo(475, 420);
  ctx.stroke();

  // Right section diagonal brace
  ctx.beginPath();
  ctx.moveTo(972, 280);
  ctx.lineTo(1445, 420);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1445, 280);
  ctx.lineTo(972, 420);
  ctx.stroke();

  // Repeat for other levels
  for (let level = 1; level < 3; level++) {
    const startY = 280 + level * 140;
    const endY = startY + 140;

    // Left section
    ctx.beginPath();
    ctx.moveTo(475, startY);
    ctx.lineTo(947, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(947, startY);
    ctx.lineTo(475, endY);
    ctx.stroke();

    // Right section
    ctx.beginPath();
    ctx.moveTo(972, startY);
    ctx.lineTo(1445, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1445, startY);
    ctx.lineTo(972, endY);
    ctx.stroke();
  }

  // Decorative items on shelves (to show usage)

  // Top shelf - small boxes/products
  ctx.fillStyle = '#8b7355';
  ctx.fillRect(520, 250, 60, 30);
  ctx.fillStyle = '#a0826d';
  ctx.fillRect(600, 248, 50, 32);
  ctx.fillStyle = '#7a5f45';
  ctx.fillRect(670, 252, 55, 28);

  // Second shelf - books/catalogs standing
  const bookColors = ['#6b4e3d', '#8b6f4e', '#a08060', '#7a5f45', '#9e7f5f'];
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = bookColors[i];
    ctx.fillRect(550 + i * 25, 385, 20, 35);
  }

  // Third shelf - decorative objects
  ctx.fillStyle = '#c9a96e';
  ctx.beginPath();
  ctx.arc(700, 545, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8b7355';
  ctx.fillRect(850, 530, 40, 30);

  ctx.fillStyle = '#a0826d';
  ctx.beginPath();
  ctx.ellipse(1100, 545, 25, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bottom shelf - larger items
  ctx.fillStyle = '#6b5335';
  ctx.fillRect(550, 665, 120, 35);
  ctx.fillStyle = '#8b6f4e';
  ctx.fillRect(700, 660, 100, 40);
  ctx.fillStyle = '#a08060';
  ctx.fillRect(830, 668, 90, 32);

  // Metal connectors/joints detail
  ctx.fillStyle = '#3a3a3a';
  // Joint at top-left
  ctx.beginPath();
  ctx.arc(462, 280, 12, 0, Math.PI * 2);
  ctx.fill();
  // Joint at top-middle
  ctx.beginPath();
  ctx.arc(960, 280, 12, 0, Math.PI * 2);
  ctx.fill();
  // Joint at top-right
  ctx.beginPath();
  ctx.arc(1457, 280, 12, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle reflections on metal parts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(455, 205, 5, 590);
  ctx.fillRect(952, 205, 5, 590);
  ctx.fillRect(1450, 205, 5, 590);

  // Professional studio lighting effect
  const lightGradient = ctx.createRadialGradient(960, 400, 100, 960, 540, 700);
  lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = lightGradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Subtle reflection on floor
  const reflectionGradient = ctx.createLinearGradient(0, 800, 0, 1080);
  reflectionGradient.addColorStop(0, 'rgba(200, 180, 150, 0.05)');
  reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = reflectionGradient;
  ctx.fillRect(0, 800, 1920, 280);

  // Very subtle noise for realism
  addNoise(ctx, 1920, 1080, 0.015);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.98 });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'product-showcase.jpg'), buffer);
  console.log('Product showcase image saved!');
}

// Generate all images
console.log('Starting image generation...\n');
generateHeroImage();
generateFactoryImage();
generateProductShowcase();
console.log('\nAll images generated successfully!');
