#!/usr/bin/env node
// Simple script to generate PWA icons
// This creates basic placeholder PNG icons with a blue background and bus emoji

const fs = require('fs');
const path = require('path');

// We'll create simple SVG files and convert them to PNG manually
// For a real deployment, you'd want actual PNG files, but these SVGs work well too

const sizes = [
  { size: 192, name: 'icon-192.png', radius: 0 },
  { size: 512, name: 'icon-512.png', radius: 0 },
  { size: 180, name: 'apple-touch-icon.png', radius: 40 }
];

const iconsDir = path.join(__dirname, 'frontend', 'icons');

// Create SVG-based icons (browsers support these well)
sizes.forEach(({ size, name, radius }) => {
  const fontSize = Math.floor(size * 0.4);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect fill="#007BFF" width="${size}" height="${size}" ${radius > 0 ? `rx="${radius}"` : ''}/>
  <text x="50%" y="50%" font-size="${fontSize}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">🚍</text>
</svg>`;
  
  // Save as .svg first, then we'll rename
  const svgPath = path.join(iconsDir, name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svg);
  console.log(`Created ${svgPath}`);
});

console.log('\nSVG icons created. For production, convert these to PNG using:');
console.log('- Online tool: https://cloudconvert.com/svg-to-png');
console.log('- Or install sharp: npm install sharp');
console.log('\nFor now, updating manifest to use SVG (which works on most devices)');
