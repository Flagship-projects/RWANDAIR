// Nano Banana (Gemini 2.5 Flash Image) generator.
// Usage:
//   node scripts/gen-images.mjs test              -> validate key with one small image
//   node scripts/gen-images.mjs <name>            -> generate one named asset
//   node scripts/gen-images.mjs all               -> generate every named asset
// Reads GEMINI_API_KEY from the environment or .env.local (never printed).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  try {
    const env = fs.readFileSync(path.join(root, ".env.local"), "utf8");
    const m = env.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim();
  } catch {}
  return "";
}

const MODEL = "gemini-2.5-flash-image";

// name -> { prompt, out (relative to project), aspect }
const ASSETS = {
  "hero-ramp": {
    aspect: "16:9",
    out: "public/assets/cargo/hero-ramp.jpg",
    prompt:
      "Cinematic night photograph of a wide-body cargo aircraft parked on an airport ramp at blue hour, forward cargo door open with a scissor cargo loader lifting an aluminium pallet, warm ramp floodlights, wet tarmac with reflections, dramatic deep-blue sky, shallow depth of field, photoreal, no visible airline branding or logos.",
  },
  freighter: {
    aspect: "16:9",
    out: "public/assets/cargo/freighter.jpg",
    prompt:
      "A Boeing 737-800 converted freighter on the apron in bright daylight, ground crew loading cargo containers via a belt loader, African airport backdrop with green hills, clean modern white and deep blue livery, photoreal wide shot, no readable logos.",
  },
  "cold-chain": {
    aspect: "16:9",
    out: "public/assets/cargo/cold-chain.jpg",
    prompt:
      "Fresh-cut roses and green vegetables being packed into air-freight cartons inside a bright cold-chain facility, gloved hands, crisp refrigerated light, condensation, Rwanda export produce, photoreal, close cinematic depth of field, centered composition.",
  },
  "kigali-terminal": {
    aspect: "16:9",
    out: "public/assets/cargo/kigali-terminal.jpg",
    prompt:
      "Aerial view of a modern air-cargo terminal at dusk with a parked wide-body aircraft and stacked aluminium ULD containers on the apron, warm terminal lights, green hills on the horizon, photoreal, cinematic.",
  },
  test: {
    aspect: "1:1",
    out: "public/assets/cargo/_keytest.png",
    prompt: "A single small blue paper airplane on a plain white background, minimal, soft studio light.",
  },
};

async function generate(ai, name) {
  const spec = ASSETS[name];
  if (!spec) throw new Error(`Unknown asset "${name}". Known: ${Object.keys(ASSETS).join(", ")}`);
  process.stdout.write(`• ${name} … `);
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: spec.prompt,
    config: { responseModalities: ["Image"], imageConfig: { aspectRatio: spec.aspect } },
  });
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    const txt = parts.find((p) => p.text)?.text ?? "no image in response";
    throw new Error(`no image returned (${txt.slice(0, 120)})`);
  }
  const outPath = path.join(root, spec.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(img.inlineData.data, "base64"));
  console.log(`saved ${spec.out} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
}

async function main() {
  const key = loadKey();
  if (!key) {
    console.error("GEMINI_API_KEY is empty. Add it to .env.local.");
    process.exit(1);
  }
  const arg = process.argv[2] || "test";
  const ai = new GoogleGenAI({ apiKey: key });
  const names = arg === "all" ? Object.keys(ASSETS).filter((n) => n !== "test") : [arg];
  for (const n of names) {
    try {
      await generate(ai, n);
    } catch (e) {
      console.error(`\n  ✗ ${n}: ${e.message}`);
      process.exitCode = 1;
    }
  }
}

main();
