/**
 * scripts/generate_audio.js
 * ---------------------------------------------------------------------------
 * Pre-generates every FIXED narration line (Wonder, Story x8, Simulate station
 * intros, Reflect, and all Hint lines) as real ElevenLabs "Alice" audio files,
 * saved into public/assets/audio/<key>.mp3 — matching the `file` paths already
 * wired up in src/audioMap.js.
 *
 * WHY ONLY FIXED LINES? Practice-phase questions are procedurally generated
 * (see src/angleData.js) so there are effectively infinite exact question
 * strings — they can't all be pre-baked. In the app, question text is read
 * aloud live via the browser's built-in Web Speech API instead (see
 * src/audio.js), exactly like the "Dynamic Fallback" behaviour described in
 * your original pipeline doc. Only paragraph/explanation-style text (never
 * titles) is pre-generated here, matching your Content Policy.
 *
 * USAGE:
 *   1. npm install node-fetch@3   (only needed on Node < 18; Node 18+ has fetch built in)
 *   2. Set your key as an environment variable (recommended) OR use the
 *      fallback hardcoded below:
 *        export ELEVENLABS_API_KEY="sk_..."
 *   3. node scripts/generate_audio.js
 *
 * This script needs outbound internet access to api.elevenlabs.io — it will
 * NOT run inside a sandboxed/offline environment. Run it on your own machine
 * or CI where the ElevenLabs API is reachable.
 *
 * SECURITY NOTE: An API key was supplied in chat for this build. It is used
 * here only as a fallback default. Before committing this project to any
 * public repository, rotate/regenerate this key in your ElevenLabs dashboard
 * and instead rely on the ELEVENLABS_API_KEY environment variable so the key
 * never lives in source control.
 * ---------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────────
const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice (Clear, Engaging Educator)
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const RATE_LIMIT_MS = 500;

// Per-style voice settings — copied 1:1 from the source module's pipeline doc
const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

// ── Phrases: every key MUST match src/audioMap.js exactly ─────────────────
const phrases = [
  { key: 'wonder_1', style: 'question', text: "Ever wondered why railway tracks never meet, no matter how far they travel? Or why the three angles inside ANY triangle, from a tiny paper clip to a giant bridge truss, always add up to exactly the same number? Let's find out!" },

  { key: 'story_1', style: 'statement', text: "Look around! Fences, railway tracks, window blinds, and road markings are full of straight lines that never cross. We call these parallel lines. But what happens when a third line cuts straight across them?" },
  { key: 'story_2', style: 'emphasis', text: "That third crossing line is called a transversal. Where it crosses each parallel line, it creates eight angles in total, four at each intersection, and these angles are secretly connected to each other!" },
  { key: 'story_3', style: 'emphasis', text: "Corresponding angles sit in the exact same corner position at each crossing point, like two F shapes stacked on top of each other. Corresponding angles are always EQUAL." },
  { key: 'story_4', style: 'emphasis', text: "Alternate angles sit on opposite sides of the transversal, forming a Z shape between the two parallel lines. Alternate interior angles are always EQUAL too." },
  { key: 'story_5', style: 'emphasis', text: "Co-interior angles, also called allied angles, sit on the same side of the transversal, forming a C shape. Unlike the others, co-interior angles are NOT equal, instead they always ADD UP TO 180 degrees." },
  { key: 'story_6', style: 'celebration', text: "Now let's turn to triangles. No matter how big, small, thin, or wide a triangle is, its three interior angles ALWAYS add up to exactly 180 degrees. This is called the Angle Sum Property of a Triangle." },
  { key: 'story_7', style: 'encouragement', text: "There is a bonus shortcut too! If you extend one side of a triangle, the exterior angle you create is always equal to the SUM of the two angles furthest away from it. That's the Exterior Angle Theorem." },
  { key: 'story_8', style: 'celebration', text: "Amazing work! You've discovered how parallel lines, transversals, and triangle angles are all connected. Now step into the simulation lab to explore, measure, and test these rules for yourself!" },

  { key: 'sim_1', style: 'encouragement', text: "Welcome to the Transversal Explorer! Drag the angle slider to rotate the crossing line, and watch how the corresponding, alternate, and co-interior angle pairs change together instantly!" },
  { key: 'sim_2', style: 'statement', text: "Welcome to the Triangle Angle Lab! Enter two known angles of each triangle and use the Angle Sum Property to calculate the missing third angle!" },
  { key: 'sim_3', style: 'question', text: "Welcome to the Inverse Angle Solver! You'll be given clues like an exterior angle or an isosceles triangle's apex angle. Work backwards to find the missing angle!" },

  { key: 'reflect_1', style: 'thinking', text: "Great work completing the module! In your own words, explain how you can find a missing angle when two parallel lines are cut by a transversal, or inside a triangle." },

  { key: 'hint_corresponding', style: 'thinking', text: "Hint: Corresponding angles sit in the exact same corner at each intersection. They are always equal." },
  { key: 'hint_alternate', style: 'thinking', text: "Hint: Alternate interior angles form a Z shape between the parallel lines. They are always equal." },
  { key: 'hint_cointerior', style: 'thinking', text: "Hint: Co-interior angles lie on the same side of the transversal, forming a C shape, and always add up to 180 degrees." },
  { key: 'hint_vertical', style: 'thinking', text: "Hint: Vertically opposite angles are formed across an X crossing. They are always equal." },
  { key: 'hint_trianglesum', style: 'thinking', text: "Hint: The three angles inside any triangle always add up to exactly 180 degrees. Subtract the two known angles from 180." },
  { key: 'hint_exterior', style: 'thinking', text: "Hint: The Exterior Angle Theorem says an exterior angle of a triangle equals the sum of the two remote interior angles." },
  { key: 'hint_isosceles', style: 'thinking', text: "Hint: In an isosceles triangle, the two base angles are equal. Subtract the apex angle from 180, then divide by 2." },

  { key: 'correct_feedback', style: 'celebration', text: "Correct! Excellent angle detective work!" },
  { key: 'incorrect_feedback', style: 'encouragement', text: "Not quite! Let's check the rule and try the next one." },
  { key: 'unroll_feedback', style: 'celebration', text: "Great! Watch how the paired angle updates automatically!" },
  { key: 'reverse_success', style: 'celebration', text: "Awesome reverse angle engineering!" }
];

// ── Helpers ────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateOne({ key, text, style }) {
  const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: settings
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ElevenLabs API error ${res.status} for "${key}": ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, `${key}.mp3`);
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
  return filePath;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`🎙️  Generating ${phrases.length} narration files with voice Alice (${VOICE_ID})...`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  let ok = 0;
  let failed = 0;

  for (const phrase of phrases) {
    try {
      const filePath = await generateOne(phrase);
      console.log(`✅ ${phrase.key} → ${path.basename(filePath)}`);
      ok++;
    } catch (err) {
      console.error(`❌ ${phrase.key}: ${err.message}`);
      failed++;
    }
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nDone. ${ok} succeeded, ${failed} failed.`);
  if (failed > 0) {
    console.log('Re-run this script to retry — it will simply overwrite any missing/failed files.');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
