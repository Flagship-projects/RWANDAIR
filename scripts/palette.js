const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const file = path.join(__dirname, "..", "public/assets/brand/logotype.png");
const png = PNG.sync.read(fs.readFileSync(file));
const { width, height, data } = png;

const counts = {};
for (let i = 0; i < data.length; i += 4) {
  const a = data[i + 3];
  if (a < 200) continue;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  // skip near-white / near-black
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max > 235 && min > 220) continue;
  if (max < 30) continue;
  const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
  counts[key] = (counts[key] || 0) + 1;
}

const top = Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([k, v]) => {
    const [r, g, b] = k.split(",").map(Number);
    const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
    return `${hex}  (${v})`;
  });

console.log("Logotype dominant colors:");
console.log(top.join("\n"));
