const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const dir = path.join(__dirname, "..", "public/assets/sequence");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));

function isGreen(r, g, b) {
  return g > 120 && g > r * 1.3 && g > b * 1.15 && r < 150;
}

files.forEach((file) => {
  const filePath = path.join(dir, file);
  const data = fs.readFileSync(filePath);
  const png = PNG.sync.read(data);
  const { width, height } = png;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];
      if (isGreen(r, g, b)) {
        png.data[idx + 3] = 0;
      } else {
        const spill = g - Math.max(r, b);
        if (spill > 15) {
          png.data[idx + 1] = Math.max(r, b);
        }
      }
    }
  }
  fs.writeFileSync(filePath, PNG.sync.write(png));
  console.log("processed", file);
});
