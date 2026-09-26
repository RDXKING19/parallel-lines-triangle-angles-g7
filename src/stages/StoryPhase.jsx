import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

const resolveImg = (src) => {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  return `${cleanBase}${cleanSrc}`;
};

const STORY_SLIDES = [
  {
    id: 1,
    title: "Lines That Never Meet",
    audioKey: "story_1",
    image: "/assets/images/slide1.jpg",
    body: "Look around! Fences, railway tracks, window blinds, and road markings are full of straight lines that never cross. We call these parallel lines. But what happens when a third line cuts straight across them?",
    quote: "Parallel lines (∥) always stay the same distance apart.",
    bubble: "Let's cut across them with a transversal and see what happens!"
  },
  {
    id: 2,
    title: "Meet the Transversal",
    audioKey: "story_2",
    image: "/assets/images/slide2.jpg",
    body: "That third crossing line is called a transversal. Where it crosses each parallel line, it creates eight angles in total, four at each intersection, and these angles are secretly connected to each other!",
    quote: "1 Transversal × 2 Parallel Lines = 8 Connected Angles.",
    bubble: "Eight angles, one big secret pattern — let's decode it!"
  },
  {
    id: 3,
    title: "Corresponding Angles: The 'F' Shape",
    audioKey: "story_3",
    image: "/assets/images/slide3.jpg",
    body: "Corresponding angles sit in the exact same corner position at each crossing point, like two F shapes stacked on top of each other.",
    quote: "Corresponding Angles are always EQUAL.",
    bubble: "Spot the F shape, and you've found a corresponding pair!"
  },
  {
    id: 4,
    title: "Alternate Angles: The 'Z' Shape",
    audioKey: "story_4",
    image: "/assets/images/slide4.jpg",
    body: "Alternate angles sit on opposite sides of the transversal, forming a Z shape between the two parallel lines.",
    quote: "Alternate Interior Angles are always EQUAL.",
    bubble: "Trace the Z, and both corners match perfectly!"
  },
  {
    id: 5,
    title: "Co-Interior Angles: The 'C' Shape",
    audioKey: "story_5",
    image: "/assets/images/slide5.jpg",
    body: "Co-interior angles, also called allied angles, sit on the same side of the transversal, forming a C shape. Unlike the others, they are NOT equal.",
    quote: "Co-Interior Angles always ADD UP TO 180°.",
    bubble: "C for co-interior, C for 'combine to 180'!"
  },
  {
    id: 6,
    title: "Every Triangle's Big Secret",
    audioKey: "story_6",
    image: "/assets/images/slide6.jpg",
    body: "No matter how big, small, thin, or wide a triangle is, its three interior angles ALWAYS add up to exactly 180 degrees. This is the Angle Sum Property of a Triangle.",
    quote: "∠A + ∠B + ∠C = 180°  (always, for every triangle!)",
    bubble: "Know two angles? Just subtract from 180 to find the third!"
  },
  {
    id: 7,
    title: "The Exterior Angle Shortcut",
    audioKey: "story_7",
    image: "/assets/images/slide7.jpg",
    body: "If you extend one side of a triangle, the exterior angle you create is always equal to the SUM of the two angles furthest away from it. That's the Exterior Angle Theorem.",
    quote: "Exterior Angle = Sum of the Two Remote Interior Angles.",
    bubble: "One shortcut, no subtraction needed — just add the far two!"
  },
  {
    id: 8,
    title: "Step Into the Simulation Lab!",
    audioKey: "story_8",
    image: "/assets/images/slide8.jpg",
    body: "Amazing work! You've discovered how parallel lines, transversals, and triangle angles are all connected. Now step into the lab to explore, measure, and test these rules for yourself!",
    quote: "Ready to test your hands-on angle-hunting skills?",
    bubble: "Click below to enter the interactive lab!"
  }
];

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(slideIdx + 1, STORY_SLIDES.length);
    }
  }, [slideIdx, onSlideChange]);

  useEffect(() => {
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    stopNarration();
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    stopNarration();
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Story Card with Maximum Legibility & Scaled Image */}
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Extra Large Image Illustration */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 h-80 sm:h-[420px] md:h-[450px] w-full bg-black/40 flex items-center justify-center shrink-0">
          <img
            src={resolveImg(slide.image)}
            alt={slide.title}
            className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Column: Extra Large Typography & Callout Pills */}
        <div className="flex flex-col items-start text-left justify-center gap-4.5 overflow-y-auto max-h-full py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-xl sm:text-2xl leading-relaxed font-extrabold drop-shadow-sm">
            {slide.body}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-2xl px-6 py-3.5 text-center text-amber-300 font-display font-900 text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg">
            <span className="shrink-0 text-2xl">✨</span>
            <span className="leading-snug">"{slide.quote}"</span>
            <span className="shrink-0 text-2xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-4 w-full mt-1">
            <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-4xl shadow-lg shrink-0">
              🦉
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-7 py-3.5 font-display font-900 text-lg sm:text-xl shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-3 z-20 shrink-0">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-xl sm:text-2xl px-10 py-4 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-3.5">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-4.5 h-4.5 bg-amber-400 shadow-[0_0_18px_rgba(250,204,21,0.9)]'
                  : 'w-3.5 h-3.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xl sm:text-2xl px-11 py-4 font-900 flex items-center gap-2 shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
