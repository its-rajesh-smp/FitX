// Generates the landing page images with OpenAI (billed per call).
// Usage: node scripts/generate-images.mjs [hero|cta|lake|studio|step1|step2|step3|meadow|card_swap|card_memory|card_gear|card_ask ...]
// Reads OPENAI_API_KEY from the environment or the repo-root .env (git-ignored).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT_ENV = resolve(import.meta.dirname, "../../.env");
const OUT_DIR = resolve(import.meta.dirname, "../src/assets/images");

function readKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  if (!existsSync(ROOT_ENV)) return null;
  const line = readFileSync(ROOT_ENV, "utf8")
    .split("\n")
    .find((row) => row.startsWith("OPENAI_API_KEY="));
  return line?.slice("OPENAI_API_KEY=".length).trim().replace(/^["']|["']$/g, "") ?? null;
}

const PROMPTS = {
  hero: `Wide 3:2 website hero background behind dark headline text, for a clean minimal white website. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. The top 70% is open sky, very pale near the top, centre empty and smooth with no detailed clouds. The horizon is at about 70% from the top; landscape fills only the bottom 30%. A calm mountain valley at first light: a very pale lilac sky with the faintest rose glow near the horizon, layered soft mountain ranges in blue-violet and grey-lilac fading into mist, a gentle meadow along the bottom edge, small clusters of slender pines and birches only at the far left and right edges. No people, animals, buildings, text, logos or watermark.`,
  cta: `Wide 3:2 background image for a call-to-action card on a clean minimal white website, with dark text placed over the LEFT half. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid. A pale evening sky in soft lilac and periwinkle with a few large soft sculpted cumulus clouds on the RIGHT side, catching a faint warm rose light. The left half of the image is open, smooth, very pale sky with no detail. Small foliage only in the bottom corners: a few delicate hanging wisteria branches with pale violet blossoms entering from the bottom-left corner, and the soft rounded canopy of a tree in the bottom-right corner. No ground, no horizon line, no buildings, people, animals, text, logos or watermark. Smooth gradients, sharp, no noise.`,
  lake: `Wide 3:2 background image for a feature card on a clean minimal white website; a white UI panel will float over the lower two-thirds. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. A still misty lake at dawn with distant soft lilac-grey hills dissolving into mist, a pale lilac sky, glassy water with faint reflections, a few slender reeds only at the bottom-left edge. No people, animals, buildings, text, logos or watermark.`,
  studio: `Wide 3:2 illustration for a card on a clean minimal white website. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. A serene sunlit room: a pale lilac yoga mat rolled up on a light wooden floor beside a pair of small white dumbbells and a glass water bottle, a tall window with sheer white curtains and soft light pooling on the floor, plenty of empty pale wall. Muted lavender and warm white. No people, animals, buildings, text, logos or watermark.`,
  step1: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. Delicate wild grass and tiny flowers at the bottom edge fading into pale morning mist, faint lilac and warm white. No people, animals, buildings, text, logos or watermark.`,
  step2: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. Gentle rolling sand dunes in soft light, faint lilac and pearl tones. No people, animals, buildings, text, logos or watermark.`,
  step3: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. A calm sea horizon in morning mist with a soft glassy shoreline, faint periwinkle and pearl tones. No people, animals, buildings, text, logos or watermark.`,
  meadow: `Square background illustration, no frames, no panels, no shapes. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Light and airy with a pale lilac haze, no glare. Sparse, delicate grass stems with feathery lilac seed heads rise from the bottom edge to about 80% of the height, with lots of soft pale air between them; nothing dense or dark. The top strip is a soft pale lilac sky with a few gentle clouds. No people, animals, buildings, text, logos or watermark.`,
  card_swap: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. Soft lilac fog over a still pond with a few pale water lilies at the bottom edge. No people, animals, buildings, text, logos or watermark.`,
  card_memory: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. Smooth pale river pebbles under shallow clear water at the bottom edge, gentle ripples, faint lilac and pearl. No people, animals, buildings, text, logos or watermark.`,
  card_gear: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. A few lavender sprigs on pale soft linen in the bottom-right corner, gentle window light, faint lilac and warm white. No people, animals, buildings, text, logos or watermark.`,
  card_ask: `Small 3:2 background for a light UI card. Hand-painted anime feature-film background, soft brushwork, restrained pastel palette, LOW SATURATION, calm, airy, high-key, nothing vivid, smooth gradients, clean, no noise. Very pale and washed-out, almost white, minimal detail; small UI will sit on top, so most of the frame stays calm and empty. Soft dappled light and a few pale blossom petals drifting through the air near the left edge, faint lilac and rose. No people, animals, buildings, text, logos or watermark.`,
};

// Small slots don't need the full size.
const SIZES = { step1: "1536x1024", step2: "1536x1024", step3: "1536x1024", meadow: "2816x2816", card_swap: "1536x1024", card_memory: "1536x1024", card_gear: "1536x1024", card_ask: "1536x1024" };

const key = readKey();
if (!key) {
  console.error("OPENAI_API_KEY not found");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const slots = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PROMPTS);

await Promise.all(
  slots.map(async (slot) => {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: PROMPTS[slot],
        size: SIZES[slot] ?? "3456x2304",
        quality: "high",
        n: 1,
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      console.error(slot, "failed:", json.error?.message ?? response.status);
      return;
    }
    const file = resolve(OUT_DIR, `${slot}.png`);
    writeFileSync(file, Buffer.from(json.data[0].b64_json, "base64"));
    console.log(slot, "saved", file);
  }),
);
