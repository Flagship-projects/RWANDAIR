// Chroma-key the green-screen RwandAir plane into a transparent PNG cutout,
// with feathered edges and green-spill removal.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const src = path.join(__dirname, "..", "public/assets/sequence/frame-06.png");
const out = path.join(__dirname, "..", "public/assets/aircraft/plane.png");

const png = PNG.sync.read(fs.readFileSync(src));
const { data } = png;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const greenness = g - Math.max(r, b); // how far into "green screen" territory
  if (greenness > 45) {
    data[i + 3] = 0; // clearly background
  } else if (greenness > 8) {
    // feathered edge: fade alpha + pull green spill toward neutral
    data[i + 3] = Math.round(255 * (1 - (greenness - 8) / 37));
    const m = (r + b) / 2;
    if (g > m) data[i + 1] = m;
  }
}

// crop to the plane's bounding box (trim transparent margins) for easier layout
let minX = png.width, minY = png.height, maxX = 0, maxY = 0;
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    if (data[(y * png.width + x) * 4 + 3] > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const pad = 8;
minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
maxX = Math.min(png.width - 1, maxX + pad); maxY = Math.min(png.height - 1, maxY + pad);
const cw = maxX - minX + 1, ch = maxY - minY + 1;

const cropped = new PNG({ width: cw, height: ch });
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const s = ((minY + y) * png.width + (minX + x)) * 4;
    const d = (y * cw + x) * 4;
    cropped.data[d] = data[s];
    cropped.data[d + 1] = data[s + 1];
    cropped.data[d + 2] = data[s + 2];
    cropped.data[d + 3] = data[s + 3];
  }
}

fs.writeFileSync(out, PNG.sync.write(cropped));
console.log(`wrote ${out} — ${cw}x${ch} (cropped from ${png.width}x${png.height})`);
