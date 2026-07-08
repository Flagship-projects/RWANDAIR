// Convert white-on-black cloud plates into white RGBA with alpha = luminance,
// so they composite with normal blending (no mix-blend-mode fragility).
const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const dir = path.join(__dirname, "..", "public/assets/sky");

["clouds-1.png", "clouds-2.png"].forEach((name) => {
  const png = PNG.sync.read(fs.readFileSync(path.join(dir, name)));
  const { width, height, data } = png;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
    // white cloud body, alpha follows luminance (soft feathered edges)
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = Math.round(Math.min(255, lum * 1.05));
  }
  const out = name.replace(".png", "-a.png");
  fs.writeFileSync(path.join(dir, out), PNG.sync.write(png));
  console.log("wrote", out, `${width}x${height}`);
});
