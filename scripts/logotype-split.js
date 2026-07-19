// Derive the dark-background RwandAir lockup from the full-resolution logotype,
// split into its two animatable parts.
//
// The shipped dark-background export (public/assets/brand/mark.png) is only
// 252x55 — far too small for the closing section, which renders it at ~540px and
// upscales it 2x. The master artwork (ASSETS/RwandAir_Logotype.png, 1822x426) is
// the light-background variant: its wordmark and the mark's left arc are brand
// blue (#005498), which disappears against a blue field.
//
// mark.png shows the official dark treatment — the #005498 areas become white
// while the sun's yellow, leaf green and sky cyan are preserved. This reproduces
// that mapping at full resolution, then cuts the lockup at the gap between the
// sun mark and the wordmark so each can be animated on its own.
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const src = path.join(__dirname, "..", "ASSETS/RwandAir_Logotype.png");
const outDir = path.join(__dirname, "..", "public/assets/brand");

// x of the empty column run separating the sun mark from the wordmark.
const SPLIT_X = 586;

// Brand palette, sampled from the master artwork. Every opaque pixel is snapped
// to its nearest entry; only the blue turns white, so antialiased edges between
// the sun's colours keep their own hue instead of being washed out.
const BRAND_BLUE = [0, 84, 152];
const PALETTE = [BRAND_BLUE, [251, 224, 18], [148, 199, 69], [31, 162, 220], [255, 255, 255]];

const png = PNG.sync.read(fs.readFileSync(src));
const { data, width, height } = png;

let recoloured = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] === 0) continue;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  let best = null;
  let bestDist = Infinity;
  for (const p of PALETTE) {
    const d = (r - p[0]) ** 2 + (g - p[1]) ** 2 + (b - p[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  if (best === BRAND_BLUE) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    recoloured++;
  }
}

/** Crops [x0, x1) to its opaque bounding box and writes it out. */
function writePart(name, x0, x1) {
  let minX = x1, minY = height, maxX = x0 - 1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = x0; x < x1; x++) {
      if (data[(y * width + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const part = new PNG({ width: cw, height: ch });
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const s = ((minY + y) * width + (minX + x)) * 4;
      const d = (y * cw + x) * 4;
      part.data[d] = data[s];
      part.data[d + 1] = data[s + 1];
      part.data[d + 2] = data[s + 2];
      part.data[d + 3] = data[s + 3];
    }
  }
  const out = path.join(outDir, name);
  fs.writeFileSync(out, PNG.sync.write(part));
  console.log(`wrote ${name} — ${cw}x${ch} (from x ${minX}-${maxX}, y ${minY}-${maxY})`);
  return { cw, ch, minX, minY, maxX, maxY };
}

console.log(`recoloured ${recoloured} brand-blue px to white`);
writePart("logotype-sun.png", 0, SPLIT_X);
writePart("logotype-word.png", SPLIT_X, width);
