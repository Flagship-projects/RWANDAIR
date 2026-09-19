/**
 * Produces WebP versions of the heavy /journey assets, next to the originals.
 *
 * The originals are untouched (the home page still references a few of them);
 * the journey components point at the .webp siblings. Re-run after swapping
 * any source image:  node scripts/optimize-journey-images.js
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const root = path.join(__dirname, "..", "public/assets");

// [relative path, max width in px, quality]
const jobs = [
  ["sky/cloudscape-aerial.png", 1600, 78],
  ["sky/cloud-real.png", 1376, 80],
  ["aircraft/rwandair-transparent.png", 2000, 82],
  ["aircraft/takeoff-cutout.png", 900, 82],
  ["Rwandair new assets/rwandair topview.png", 1100, 82],
  ["Rwandair new assets/Rwandair topview wireframe.png", 1100, 82],
  ["Rwandair new assets/images (2).jpg", 700, 78],
  ["Rwandair new assets/Serving In Business class.jpg", 601, 78],
  ["Rwandair new assets/rwandair premium inside.jpg", 1024, 78],
  ["Rwandair new assets/rwandair premium inside..jpg", 678, 78],
  ["Rwandair new assets/Rwandair Inside.png", 702, 80],
  ["Rwandair new assets/RWANDAIR economy.jpg", 1600, 78],
  ["aircraft/crew-service.jpg", 857, 78],
  ["aircraft/press-cabin.jpg", 1600, 78],
  ["destinations/kigali.jpg", 1600, 76],
  ["destinations/nairobi.jpg", 1600, 76],
  ["destinations/lagos.jpg", 1600, 76],
  ["destinations/accra.jpg", 1600, 76],
  ["destinations/johannesburg.jpg", 1600, 76],
];

(async () => {
  let before = 0;
  let after = 0;
  for (const [rel, width, quality] of jobs) {
    const src = path.join(root, rel);
    const out = src.replace(/\.(png|jpe?g)$/i, ".webp");
    const inSize = fs.statSync(src).size;
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out);
    const outSize = fs.statSync(out).size;
    before += inSize;
    after += outSize;
    console.log(
      `${(inSize / 1024).toFixed(0).padStart(6)} KB -> ${(outSize / 1024).toFixed(0).padStart(5)} KB  ${rel}`
    );
  }
  console.log(`\ntotal ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB`);
})();
