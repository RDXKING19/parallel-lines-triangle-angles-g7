import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration, cheer } from '../audio.js';

// 3 Real-World Interactive Activities per Station (Grade 7 friendly)
const STATION_ACTIVITIES = {
  1: [
    {
      id: 1,
      title: "Activity 1: Railway Track Crossing",
      desc: "A transversal crosses two parallel railway tracks. Drag the slider to rotate the crossing angle and watch the paired angles update instantly!",
      startAngle: 60,
      unit: "°",
      icon: "🚆",
      type: "transversal",
      hint: "Corresponding angles are equal, alternate angles are equal, and co-interior angles add up to 180°!"
    },
    {
      id: 2,
      title: "Activity 2: Venetian Window Blinds",
      desc: "The slats of a window blind are parallel. A sunbeam cuts across them like a transversal. Adjust the angle to reveal the angle pairs!",
      startAngle: 45,
      unit: "°",
      icon: "🪟",
      type: "transversal",
      hint: "Look for the F, Z, and C shapes to spot corresponding, alternate, and co-interior angle pairs!"
    },
    {
      id: 3,
      title: "Activity 3: Zebra Crossing Stripes",
      desc: "The white stripes of a zebra crossing are parallel. A curb line crosses them at an angle. Explore how the angles relate!",
      startAngle: 75,
      unit: "°",
      icon: "🚸",
      type: "transversal",
      hint: "Same corner = corresponding (equal). Opposite sides, inside = alternate (equal). Same side, inside = co-interior (sum to 180°)."
    }
  ],
  2: [
    {
      id: 1,
      title: "Activity 1: Roof Truss Triangle",
      desc: "A carpenter needs the peak angle of a roof truss. Two base angles are known — use the Angle Sum Property to find the missing peak angle!",
      a: 65,
      b: 65,
      unit: "°",
      icon: "🏠",
      type: "triangle",
      hint: "Angle Sum of a Triangle: all three angles always add up to 180°."
    },
    {
      id: 2,
      title: "Activity 2: Sailboat Sail",
      desc: "A triangular sail has two known corner angles. Find the third angle so the sailmaker can cut the fabric perfectly!",
      a: 40,
      b: 95,
      unit: "°",
      icon: "⛵",
      type: "triangle",
      hint: "Add the two known angles, then subtract the total from 180°."
    },
    {
      id: 3,
      title: "Activity 3: Kite Frame",
      desc: "A kite maker crosses two sticks to form a triangular frame section. Two angles are known — calculate the third!",
      a: 100,
      b: 35,
      unit: "°",
      icon: "🪁",
      type: "triangle",
      hint: "180° − (angle 1 + angle 2) = the missing third angle."
    }
  ],
  3: [
    {
      id: 1,
      title: "Activity 1: Traffic Warning Sign",
      desc: "A triangular warning sign is isosceles, with an apex angle of 40°. Work backwards to find each equal base angle!",
      apex: 40,
      targetVal: 70,
      ask: "each base angle",
      unit: "°",
      icon: "⚠️",
      type: "isosceles",
      hint: "180° − apex angle = sum of both base angles. Divide that by 2 since the base angles are equal: (180 − 40) ÷ 2 = 70°!"
    },
    {
      id: 2,
      title: "Activity 2: Bridge Truss Beam",
      desc: "A bridge truss triangle has an exterior angle of 110°, with one remote interior angle of 45°. Find the other remote interior angle!",
      exteriorVal: 110,
      knownRemote: 45,
      targetVal: 65,
      ask: "the missing remote interior angle",
      unit: "°",
      icon: "🌉",
      type: "exteriorSolve",
      hint: "Exterior Angle Theorem: exterior angle = sum of the two remote interior angles. So 110° − 45° = 65°!"
    },
    {
      id: 3,
      title: "Activity 3: Rooftop Framework",
      desc: "Two parallel roof beams are crossed by a support strut. One co-interior angle is 118°. Find the other co-interior angle!",
      givenVal: 118,
      targetVal: 62,
      ask: "the other co-interior angle",
      unit: "°",
      icon: "🏙️",
      type: "cointeriorSolve",
      hint: "Co-interior angles always add up to 180°. So 180° − 118° = 62°!"
    }
  ]
};

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  // Station 1 State
  const [transAngle, setTransAngle] = useState(60);
  const [revealed, setRevealed] = useState(false);

  // Station 3 State
  const [reverseAnswer, setReverseAnswer] = useState('');
  const [reverseFeedback, setReverseFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const currentActivity = STATION_ACTIVITIES[station][actIdx];

  useEffect(() => {
    setRevealed(false);
    setReverseAnswer('');
    setReverseFeedback(null);
    setShowHint(false);
    if (station === 1) setTransAngle(currentActivity.startAngle);
    const key = `sim_${station}`;
    if (AUDIO_MAP[key]) narrate(AUDIO_MAP[key], !muted);
    return () => stopNarration();
  }, [station, actIdx, muted]);

  const handleReveal = () => {
    setRevealed(true);
    if (AUDIO_MAP.unroll_feedback) {
      narrate(AUDIO_MAP.unroll_feedback, !muted);
    } else {
      narrate(cheer("Great! Watch how the paired angle updates automatically!"), !muted);
    }
  };

  const handleReverseCheck = () => {
    const num = parseFloat(reverseAnswer);
    if (num === currentActivity.targetVal) {
      setReverseFeedback({
        success: true,
        text: `🎉 Amazing job! ${currentActivity.ask} = ${currentActivity.targetVal}${currentActivity.unit}!`
      });
      cheer_success();
    } else {
      setReverseFeedback({
        success: false,
        text: `Try again! Hint: ${currentActivity.ask} = ${currentActivity.targetVal}${currentActivity.unit}`
      });
    }
  };

  function cheer_success() {
    if (AUDIO_MAP.reverse_success) {
      narrate(AUDIO_MAP.reverse_success, !muted);
    } else {
      narrate(cheer("Awesome reverse angle engineering!"), !muted);
    }
  }

  const nextActivity = () => {
    stopNarration();
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    stopNarration();
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  // Station 1 computed angle pairs from the transversal slider
  const corresponding = transAngle;
  const alternate = transAngle;
  const coInterior = 180 - transAngle;
  const vertical = transAngle;

  // Station 2 computed third triangle angle
  const computedC = 180 - currentActivity.a - currentActivity.b;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="w-full max-w-6xl max-h-[94vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-24 h-2 bg-cyan-400 rounded-full mb-2.5 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="font-display font-900 text-2xl sm:text-3xl text-white flex items-center gap-3 mb-3.5 shrink-0">
          <span className="text-3xl sm:text-4xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-3.5">
              {/* Station 1 Card Tab */}
              <button
                onClick={() => { setStation(1); setActIdx(0); }}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 1
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                    station === 1 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    📐
                  </div>
                  <div>
                    <p className="font-display font-900 text-base sm:text-lg leading-tight">Station 1: Transversal Explorer</p>
                    <p className="text-xs font-extrabold text-slate-300 mt-0.5">Drag to reveal angle pairs</p>
                  </div>
                </div>
                <span className="text-base">🔓</span>
              </button>

              {/* Station 2 Card Tab */}
              <button
                onClick={() => { setStation(2); setActIdx(0); }}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 2
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                    station === 2 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    🔺
                  </div>
                  <div>
                    <p className="font-display font-900 text-base sm:text-lg leading-tight">Station 2: Triangle Angle Lab</p>
                    <p className="text-xs font-extrabold text-slate-300 mt-0.5">Angle Sum = 180°</p>
                  </div>
                </div>
                <span className="text-base">🔓</span>
              </button>

              {/* Station 3 Card Tab */}
              <button
                onClick={() => { setStation(3); setActIdx(0); }}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  station === 3
                    ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                    : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                    station === 3 ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                  }`}>
                    🧩
                  </div>
                  <div>
                    <p className="font-display font-900 text-base sm:text-lg leading-tight">Station 3: Inverse Angle Solver</p>
                    <p className="text-xs font-extrabold text-slate-300 mt-0.5">Work backwards from a clue</p>
                  </div>
                </div>
                <span className="text-base">🔓</span>
              </button>
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-base sm:text-lg py-4 px-6 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-2 w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Real-World Simulation Box */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto pr-1 gap-2">
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5 shrink-0">
                <h3 className="font-display font-900 text-xl sm:text-2xl text-cyan-300 flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-xs sm:text-sm text-slate-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
                  Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-extrabold shrink-0">
                {currentActivity.desc}
              </p>

              {/* STATION 1: TRANSVERSAL EXPLORER */}
              {station === 1 && (
                <div className="flex flex-col items-center gap-3 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 justify-between">
                  <div className="flex items-center gap-3 bg-[#14082c] px-3.5 py-1.5 rounded-xl border border-cyan-400/30 w-full justify-center shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-200">Transversal Angle:</span>
                    <input
                      type="range"
                      min="20"
                      max="160"
                      value={transAngle}
                      onChange={e => setTransAngle(Number(e.target.value))}
                      className="w-40 sm:w-60 accent-cyan-400 cursor-pointer"
                    />
                    <span className="font-display font-900 text-cyan-300 text-base sm:text-lg w-14">{transAngle}°</span>
                  </div>

                  {/* Live SVG Diagram */}
                  <svg width="240" height="160" viewBox="0 0 260 200" className="drop-shadow-[0_0_20px_rgba(56,189,248,0.5)] shrink-0 max-h-[160px]">
                    <line x1="15" y1="60" x2="245" y2="60" stroke="#38bdf8" strokeWidth="5" />
                    <line x1="15" y1="150" x2="245" y2="150" stroke="#38bdf8" strokeWidth="5" />
                    <line
                      x1={130 - 80 * Math.cos((transAngle * Math.PI) / 180)}
                      y1={105 - 80 * Math.sin((transAngle * Math.PI) / 180)}
                      x2={130 + 80 * Math.cos((transAngle * Math.PI) / 180)}
                      y2={105 + 80 * Math.sin((transAngle * Math.PI) / 180)}
                      stroke="#facc15" strokeWidth="5"
                    />
                    <circle cx="130" cy="60" r="4" fill="#fff" />
                    <circle cx="130" cy="150" r="4" fill="#fff" />
                    {revealed && (
                      <>
                        <text x="165" y="45" fill="#4ade80" fontSize="15" fontWeight="900">{corresponding}°</text>
                        <text x="90" y="125" fill="#f472b6" fontSize="15" fontWeight="900">{alternate}°</text>
                        <text x="165" y="135" fill="#fb923c" fontSize="15" fontWeight="900">{coInterior}°</text>
                        <text x="95" y="45" fill="#a78bfa" fontSize="15" fontWeight="900">{vertical}°</text>
                      </>
                    )}
                  </svg>

                  <button
                    onClick={handleReveal}
                    className="btn-gold text-xs sm:text-sm font-900 px-6 py-2 shadow-lg hover:scale-105 transition cursor-pointer shrink-0"
                  >
                    Reveal Angle Pairs ✨
                  </button>

                  {revealed && (
                    <div className="w-full bg-[#14082c]/90 border-2 border-amber-400/40 p-2.5 sm:p-3 rounded-2xl text-left font-mono text-xs sm:text-sm text-slate-100 grid grid-cols-2 gap-2 shadow-inner shrink-0">
                      <p><span className="text-emerald-400 font-bold">Corresponding:</span> {corresponding}°</p>
                      <p><span className="text-pink-400 font-bold">Alternate:</span> {alternate}°</p>
                      <p><span className="text-orange-400 font-bold">Co-Interior:</span> {coInterior}°</p>
                      <p><span className="text-purple-300 font-bold">Vertical:</span> {vertical}°</p>
                    </div>
                  )}
                </div>
              )}

              {/* STATION 2: TRIANGLE ANGLE LAB */}
              {station === 2 && (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 sm:p-4 shadow-xl flex-1 min-h-0 w-full overflow-hidden">
                  <div className="flex flex-col items-center shrink-0">
                    <svg width="180" height="145" viewBox="0 0 220 180" className="drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">
                      <polygon points="110,20 25,160 195,160" fill="rgba(139,92,246,0.18)" stroke="#a78bfa" strokeWidth="5" />
                      <text x="110" y="45" fill="#38bdf8" fontSize="17" fontWeight="900" textAnchor="middle">{currentActivity.a}°</text>
                      <text x="55" y="150" fill="#4ade80" fontSize="17" fontWeight="900" textAnchor="middle">{currentActivity.b}°</text>
                      <text x="165" y="150" fill="#facc15" fontSize="17" fontWeight="900" textAnchor="middle">{computedC}°</text>
                    </svg>
                    <span className="text-xs text-amber-300 font-bold mt-1">Sum = 180°</span>
                  </div>

                  <div className="flex-1 min-w-0 bg-[#14082c]/90 border border-amber-400/40 p-3 sm:p-4 rounded-xl text-left font-mono text-xs sm:text-sm text-slate-100 flex flex-col gap-1.5 shadow-inner">
                    <p className="text-amber-300 font-sans font-900 text-xs sm:text-sm">Step-by-Step Math Helper:</p>
                    <p className="leading-snug">1. Known: <span className="text-cyan-300 font-bold">∠A = {currentActivity.a}°</span>, <span className="text-emerald-300 font-bold">∠B = {currentActivity.b}°</span></p>
                    <p className="leading-snug">2. Rule: <span className="text-purple-300 font-bold">∠C = 180° − (∠A + ∠B)</span></p>
                    <div className="bg-amber-400/20 border-2 border-amber-400/60 py-2 px-3 rounded-lg text-amber-300 font-900 text-sm sm:text-base text-center shadow-md">
                      C = 180 − ({currentActivity.a} + {currentActivity.b}) = {computedC}°
                    </div>
                  </div>
                </div>
              )}

              {/* STATION 3: INVERSE ANGLE SOLVER */}
              {station === 3 && (
                <div className="flex flex-col items-center gap-4 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-4 sm:p-5 shadow-xl flex-1 min-h-0 justify-between">
                  <div className="flex items-center justify-center gap-7 w-full flex-1 min-h-0">
                    {/* Activity 1: Isosceles Traffic Sign */}
                    {currentActivity.type === 'isosceles' && (
                      <svg width="185" height="185" viewBox="0 0 180 180" className="drop-shadow-[0_0_24px_rgba(217,119,6,0.65)] shrink-0">
                        <polygon points="90,20 25,160 155,160" fill="#7c2d12" stroke="#f59e0b" strokeWidth="5" />
                        <text x="90" y="45" fill="#facc15" fontSize="16" fontWeight="900" textAnchor="middle">{currentActivity.apex}°</text>
                        <text x="55" y="150" fill="#f43f5e" fontSize="16" fontWeight="900" textAnchor="middle">?</text>
                        <text x="125" y="150" fill="#f43f5e" fontSize="16" fontWeight="900" textAnchor="middle">?</text>
                        <text x="90" y="175" fill="#facc15" fontSize="12" fontWeight="700" textAnchor="middle">⚠ WARNING</text>
                      </svg>
                    )}

                    {/* Activity 2: Exterior Angle Bridge Truss */}
                    {currentActivity.type === 'exteriorSolve' && (
                      <svg width="185" height="185" viewBox="0 0 180 180" className="drop-shadow-[0_0_24px_rgba(14,165,233,0.65)] shrink-0">
                        <polygon points="100,20 40,150 150,150" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="5" />
                        <line x1="150" y1="150" x2="175" y2="150" stroke="#f43f5e" strokeWidth="4" strokeDasharray="5 3" />
                        <text x="163" y="130" fill="#f43f5e" fontSize="14" fontWeight="900" textAnchor="middle">{currentActivity.exteriorVal}°</text>
                        <text x="100" y="45" fill="#4ade80" fontSize="14" fontWeight="900" textAnchor="middle">{currentActivity.knownRemote}°</text>
                        <text x="55" y="140" fill="#f43f5e" fontSize="14" fontWeight="900" textAnchor="middle">?</text>
                      </svg>
                    )}

                    {/* Activity 3: Co-interior Rooftop */}
                    {currentActivity.type === 'cointeriorSolve' && (
                      <svg width="185" height="185" viewBox="0 0 180 180" className="drop-shadow-[0_0_24px_rgba(245,158,11,0.65)] shrink-0">
                        <line x1="15" y1="60" x2="165" y2="60" stroke="#38bdf8" strokeWidth="5" />
                        <line x1="15" y1="120" x2="165" y2="120" stroke="#38bdf8" strokeWidth="5" />
                        <line x1="60" y1="20" x2="120" y2="160" stroke="#facc15" strokeWidth="5" />
                        <text x="100" y="50" fill="#fb923c" fontSize="15" fontWeight="900">{currentActivity.givenVal}°</text>
                        <text x="70" y="140" fill="#f43f5e" fontSize="15" fontWeight="900">?</text>
                      </svg>
                    )}

                    <div className="text-left text-sm sm:text-base font-extrabold text-slate-100 flex flex-col gap-2 shrink-0">
                      {currentActivity.type === 'isosceles' && (
                        <p>• Apex angle = <span className="text-amber-300 font-900">{currentActivity.apex}°</span></p>
                      )}
                      {currentActivity.type === 'exteriorSolve' && (
                        <>
                          <p>• Exterior angle = <span className="text-amber-300 font-900">{currentActivity.exteriorVal}°</span></p>
                          <p>• Known remote angle = <span className="text-cyan-300 font-900">{currentActivity.knownRemote}°</span></p>
                        </>
                      )}
                      {currentActivity.type === 'cointeriorSolve' && (
                        <p>• Given co-interior angle = <span className="text-amber-300 font-900">{currentActivity.givenVal}°</span></p>
                      )}
                      <p>• Solve for: <span className="text-white font-900">{currentActivity.ask}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 w-full justify-center shrink-0">
                    <input
                      type="number"
                      placeholder={`Enter ${currentActivity.ask}`}
                      value={reverseAnswer}
                      onChange={e => setReverseAnswer(e.target.value)}
                      className="bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-5 py-3 text-white font-display font-900 text-base sm:text-lg text-center outline-none focus:border-amber-400 w-56 shadow-inner"
                    />
                    <button
                      onClick={handleReverseCheck}
                      className="btn-gold text-sm sm:text-base font-900 px-7 py-3 shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      Check Answer ✨
                    </button>
                    <button
                      onClick={() => setShowHint(h => !h)}
                      className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-3 rounded-xl transition cursor-pointer"
                    >
                      💡 Hint
                    </button>
                  </div>

                  {showHint && (
                    <div className="p-3.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
                      💡 {currentActivity.hint}
                    </div>
                  )}

                  {reverseFeedback && (
                    <div className={`p-4 rounded-2xl text-sm sm:text-base font-900 w-full text-center shadow-xl shrink-0 ${
                      reverseFeedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
                    }`}>
                      {reverseFeedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="flex items-center justify-between border-t border-white/15 pt-4 mt-3 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-sm sm:text-base px-6 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-sm sm:text-base font-900 px-8 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
