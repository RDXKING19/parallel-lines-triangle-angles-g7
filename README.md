# Angle Detective Quest — Parallel Lines & Triangle Angles (Grade 7)

Built from the same architecture, layout, colour system, and phase flow
(Wonder → Story → Simulate → Practice → Reflect) as your Circumference for
Grade 6 module — content, questions, station activities, and story
illustrations are new and specific to this topic.

## Setup

```bash
npm install
npm run dev        # local dev server
npm run build       # production build (outputs to dist/)
```

## Topic Coverage

- Parallel lines cut by a transversal: corresponding, alternate, co-interior
  (allied), and vertically opposite angles
- Triangle Angle Sum Property (∠A + ∠B + ∠C = 180°)
- Exterior Angle Theorem
- Isosceles triangle base angles
- Simple algebraic angle equations
- 10 themed Practice worlds, each procedurally generating unlimited unique
  questions (Railway Track Yard, Window Blinds Lab, Zebra Crossing City,
  Ladder & Wall Workshop, Sailboat Cove, Roof Truss Site, Kite Flying Park,
  Traffic Sign Foundry, Bridge Truss Bay, Skyline Architect Studio)
- 3 new Simulation stations, each with 3 interactive real-world activities
  (Transversal Explorer, Triangle Angle Lab, Inverse Angle Solver)

## Audio Pipeline — IMPORTANT

This project's `src/audio.js` architecture is unchanged from your original
module: fixed narration lines are looked up in `src/audioMap.js` and played
as pre-generated `.mp3` files from `public/assets/audio/`. If a file is
missing, the app automatically falls back to the browser's built-in Web
Speech voice, so narration is **never silent** — but to get the real
ElevenLabs "Alice" voice, you need to generate the files yourself:

```bash
export ELEVENLABS_API_KEY="sk_..."     # your key (recommended over hardcoding)
npm run generate-audio
```

This runs `scripts/generate_audio.js`, which is pre-loaded with:
- Your voice ID (`Xb7hH8MSUJpSbSDYk0k2`, "Alice")
- The `eleven_multilingual_v2` model
- Every fixed narration line (Wonder, all 8 Story slides, all 3 Simulate
  station intros, Reflect prompt, and all 7 archetype Hint lines) with the
  exact same per-style voice settings table from your original pipeline doc

It saves each file as `public/assets/audio/<key>.mp3`, matching the `file`
paths already wired into `audioMap.js` — no further code changes needed.

**Why aren't the 100 Practice questions pre-generated as audio too?**
Practice questions are generated procedurally (see `src/angleData.js`), so
there are effectively unlimited exact question strings — they can't all be
pre-baked into static files. This mirrors your own pipeline doc's "Dynamic
Fallback" design: only fixed paragraph/explanation text is pre-generated;
on-screen question text is read aloud live via the same Web Speech engine
that already backs this app. Fixed *rule* explanations (the Hint button)
are pre-generated per angle-relationship type instead, so hints always use
the ElevenLabs voice once you've run the script.

**No audio overlap / no narrating skipped phases:** `narrate()` always calls
`stopNarration()` before starting a new segment, and every phase component
also calls `stopNarration()` in its cleanup (`useEffect` return / phase
navigation in `App.jsx`), so switching or skipping a phase immediately kills
any in-flight narration rather than letting it bleed into the next screen.

**Security note:** An API key was supplied for this build and is used only
as a fallback default in `scripts/generate_audio.js`. Rotate/regenerate this
key in your ElevenLabs dashboard before pushing this project to any public
repository, and prefer the `ELEVENLABS_API_KEY` environment variable so the
key never lives in source control.

## Story Illustrations

The 8 story slides (`public/assets/images/slide1.svg` … `slide8.svg`) are
original vector illustrations built specifically for this topic (railway
tracks, transversal diagrams, F/Z/C angle-pair shapes, triangle angle sum,
exterior angle theorem, and the simulation-lab portal), matching the app's
dark purple / gold / cyan visual style.
