import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { PRACTICE_WORLDS, makeQuestion, HINT_AUDIO_KEYS } from '../angleData.js';
import { AngleDiagram } from '../components/AngleDiagram.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { cheer, instruct, narrate, stopNarration } from '../audio.js';

/* =========================================================================
   PRACTICE WORLD SELECT GRID (ONLY SHOW REFLECT BUTTON WHEN ALL 10 WORLDS COMPLETED)
   ========================================================================= */
export function PracticeWorldSelect({ worldResults, onPlay, onGoReflect }) {
  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allWorldsCompleted = worldResults.length === 10 && worldResults.every(r => r != null && r > 0);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-5xl max-h-[94vh] glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto py-5 px-6 overflow-hidden">
        <div className="phase-band phase-band--play mb-2 shrink-0" />

        <div className="w-full flex items-center justify-between mb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🎮</span>
            <div className="text-left">
              <h2 className="text-section-heading text-emerald-200 text-2xl sm:text-3xl font-900">
                Angle Detective Game Worlds
              </h2>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-300">
                10 Themed Worlds · Need 4/10 Correct to Unlock Next World
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#14082c]/90 border-2 border-emerald-400/40 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
              <span className="text-amber-400 text-lg">⭐</span>
              <span className="font-display font-900 text-white text-base sm:text-lg">
                {totalStars} / 30
              </span>
            </div>

            {allWorldsCompleted && (
              <button
                onClick={onGoReflect}
                className="btn-gold text-base font-900 px-6 py-2.5 shadow-lg cursor-pointer animate-bounce"
              >
                Go to Reflect 📝
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full my-auto flex-1 min-h-0 overflow-y-auto p-1">
          {PRACTICE_WORLDS.map((w, idx) => {
            const isUnlocked = idx === 0 || (worldResults[idx - 1] != null && worldResults[idx - 1] > 0);
            const stars = worldResults[idx];

            return (
              <div
                key={w.id}
                onClick={() => isUnlocked && onPlay(idx)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all duration-300 h-36 sm:h-44 ${
                  isUnlocked
                    ? 'bg-[#14082c]/95 border-emerald-400/50 hover:border-emerald-300 hover:scale-105 cursor-pointer shadow-xl'
                    : 'bg-[#100724]/40 border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-slate-300">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md">W{idx + 1}</span>
                  <span className="text-emerald-300 font-mono font-bold">{w.range}</span>
                </div>

                <span className="text-4xl sm:text-6xl my-1 drop-shadow-md">{isUnlocked ? w.icon : "🔒"}</span>

                <span className="font-display font-900 text-white text-base sm:text-lg leading-tight line-clamp-1">
                  {w.name}
                </span>

                <div className="mt-1">
                  {isUnlocked ? (
                    stars != null && stars > 0 ? (
                      <span className="text-amber-400 text-base tracking-widest font-black">
                        {"★".repeat(stars)}{"☆".repeat(3 - stars)}
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs sm:text-sm font-900">Play →</span>
                    )
                  ) : (
                    <span className="text-slate-400 text-xs font-extrabold">Locked (Need 4/10)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PRACTICE QUIZ COMPONENT
   ========================================================================= */
export function PracticeQuiz({ worldIndex, muted, addXp, onFinish }) {
  const world = PRACTICE_WORLDS[worldIndex];
  const [qIndex, setQIndex] = useState(0);
  const [qData, setQData] = useState(() => makeQuestion(worldIndex));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [popupState, setPopupState] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    setQData(makeQuestion(worldIndex));
    setSelectedIdx(null);
    setPopupState(null);
    setShowHint(false);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopNarration();
    };
  }, [qIndex, worldIndex]);

  const restartQuiz = () => {
    setQIndex(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setSelectedIdx(null);
    setPopupState(null);
    setShowHint(false);
    setQData(makeQuestion(worldIndex));
  };

  const playHint = () => {
    setShowHint(true);
    const key = HINT_AUDIO_KEYS[qData.archetype];
    if (key && AUDIO_MAP[key]) {
      stopNarration();
      narrate(AUDIO_MAP[key], !muted);
    }
  };

  const handleOptionClick = (idx) => {
    if (selectedIdx != null || lives <= 0 || popupState != null) return;

    stopNarration();
    setSelectedIdx(idx);
    const isCorrect = idx === qData.correctIndex;

    let updatedLives = lives;
    let updatedCorrectCount = correctCount;

    if (isCorrect) {
      updatedCorrectCount = correctCount + 1;
      setCorrectCount(updatedCorrectCount);
      setStreak(s => s + 1);
      addXp(10);
      narrate(AUDIO_MAP.correct_feedback, !muted);
      setPopupState({
        type: 'correct',
        title: 'Correct! 🎉',
        text: qData.explanation
      });
    } else {
      updatedLives = lives - 1;
      setLives(updatedLives);
      setStreak(0);
      narrate(AUDIO_MAP.incorrect_feedback, !muted);
      setPopupState({
        type: 'incorrect',
        title: 'Not quite!',
        text: `Rule: ${qData.explanation}`
      });
    }

    timerRef.current = setTimeout(() => {
      setPopupState(null);
      if (updatedLives > 0) {
        if (qIndex < 9) {
          setQIndex(i => i + 1);
        } else {
          let stars = 0;
          if (updatedCorrectCount >= 8) stars = 3;
          else if (updatedCorrectCount >= 6) stars = 2;
          else if (updatedCorrectCount >= 4) stars = 1;
          onFinish(worldIndex, stars);
        }
      }
    }, 1200);
  };

  const isGameOver = lives <= 0;
  const progressPercent = Math.round(((qIndex + 1) / 10) * 100);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {popupState && !isGameOver && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in-up">
          <div className={`w-88 sm:w-[420px] rounded-3xl p-7 sm:p-8 shadow-2xl flex flex-col items-center text-center border-4 border-white/20 scale-105 transition-all duration-300 ${
            popupState.type === 'correct'
              ? 'bg-gradient-to-b from-emerald-500 via-green-600 to-emerald-700 text-white shadow-[0_0_50px_rgba(52,211,153,0.7)]'
              : 'bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 text-white shadow-[0_0_50px_rgba(244,63,94,0.7)]'
          }`}>
            <span className="text-7xl sm:text-8xl mb-3 drop-shadow-lg animate-bounce">
              {popupState.type === 'correct' ? '🎉' : '🥺'}
            </span>
            <h3 className="font-display font-900 text-3xl sm:text-4xl text-white mb-2 leading-tight">
              {popupState.title}
            </h3>
            <p className="font-extrabold text-base sm:text-lg text-slate-100 leading-relaxed max-w-sm">
              {popupState.text}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl max-h-[94vh] flex flex-col items-center text-center fade-in-up z-20 my-auto overflow-y-auto pr-1">
        <div className="w-full flex items-center justify-between mb-1.5 shrink-0">
          <button
            onClick={() => onFinish(worldIndex, null)}
            className="bg-[#1c0e3a]/90 hover:bg-[#2e175c] border border-purple-400/40 text-slate-200 font-display font-900 text-xs sm:text-sm px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition"
          >
            <span>← Worlds</span>
          </button>

          {!isGameOver && selectedIdx == null && (
            <button
              onClick={playHint}
              className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5"
            >
              <span>💡</span><span>Hint</span>
            </button>
          )}
        </div>

        <div className="w-full bg-[#150a36]/95 border-2 border-purple-400/40 rounded-3xl p-3.5 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col items-center relative">

          {/* World Name Badge */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-display font-900 text-sm sm:text-base px-5 py-1 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.7)] mb-2 flex items-center gap-2 shrink-0">
            <span>⭐</span>
            <span>{world.name}</span>
          </div>

          {/* Stats Bar */}
          <div className="w-full flex items-center justify-between px-2 sm:px-8 mb-2 shrink-0">
            <div className="bg-[#10072a] border border-purple-400/30 rounded-full px-4 py-1 flex items-center gap-1.5 shadow-inner">
              <span className="text-amber-400 text-sm">⭐</span>
              <span className="font-display font-900 text-white text-xs sm:text-sm">{correctCount * 10} XP</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(h => (
                <span key={h} className="text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.75)]">
                  {h <= lives ? "❤️" : "🖤"}
                </span>
              ))}
            </div>

            <div className="bg-[#10072a] border border-purple-400/30 rounded-full px-4 py-1 flex items-center gap-1.5 shadow-inner">
              <span className="text-amber-400 text-sm">🔥</span>
              <span className="font-display font-900 text-amber-300 text-xs sm:text-sm">{streak}x</span>
            </div>
          </div>

          {/* Question Counter & Progress Bar */}
          <div className="w-full flex items-center justify-between text-xs font-display font-900 text-slate-300 px-1 mb-1 shrink-0">
            <span>Question {qIndex + 1}/10</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="w-full h-2 bg-purple-950/80 rounded-full mb-3 overflow-hidden border border-purple-500/20 shrink-0">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.85)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {isGameOver ? (
            <div className="w-full my-auto flex flex-col items-center justify-center gap-4 py-6 shrink-0 fade-in-up">
              <span className="text-5xl sm:text-6xl drop-shadow-lg">🥺</span>
              <h3 className="font-display font-900 text-rose-500 text-2xl sm:text-3xl">Out of Hearts!</h3>
              <p className="font-extrabold text-slate-200 text-xs sm:text-sm max-w-lg text-center leading-relaxed">
                Owlbert says: "No worries! Let's practice some more. Try again to master this world!"
              </p>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={restartQuiz}
                  className="btn-gold font-display font-900 text-xs sm:text-sm px-5 py-2 rounded-full flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <span>🔁</span>
                  <span>Retry World</span>
                </button>
                <button
                  onClick={() => onFinish(worldIndex, 0)}
                  className="bg-[#1c0d3a] hover:bg-[#2e175c] border border-purple-400/40 text-slate-200 font-display font-900 text-xs sm:text-sm px-5 py-2 rounded-full flex items-center gap-2 shadow-md cursor-pointer transition"
                >
                  <span>🚪</span>
                  <span>Quit World</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-3">
              {/* Question Box: Side-by-Side Diagram & Prompt */}
              <div className="w-full bg-[#0c0520] border-2 border-purple-400/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 relative shadow-inner">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-display font-900 text-[10px] sm:text-xs px-4 py-0.5 rounded-full shadow-[0_0_14px_rgba(250,204,21,0.7)] absolute -top-3 tracking-wider uppercase">
                  ✦ ANGLE RULE
                </div>

                {/* Scaled Diagram */}
                <div className="shrink-0 flex items-center justify-center">
                  <AngleDiagram diagramData={qData.diagramData} size={135} />
                </div>

                {/* Prompt Text */}
                <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
                  <p className="font-display font-900 text-white text-base sm:text-lg leading-snug">
                    {qData.prompt}
                  </p>

                  {showHint && (
                    <div className="mt-2 p-2 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-lg text-xs font-bold w-full text-center fade-in-up">
                      💡 {qData.hint}
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Answer Options Grid: ALWAYS VISIBLE */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                {qData.options.map((opt, idx) => {
                  let btnStyle = "bg-[#14082e]/95 border-2 border-purple-400/30 text-white hover:border-cyan-400 hover:bg-[#1f0f45]";
                  if (selectedIdx != null) {
                    if (idx === qData.correctIndex) {
                      btnStyle = "bg-emerald-600 text-white border-2 border-emerald-300 font-900 shadow-[0_0_18px_rgba(52,211,153,0.65)] scale-[1.02]";
                    } else if (idx === selectedIdx) {
                      btnStyle = "bg-rose-600 text-white border-2 border-rose-300 font-900 animate-shake";
                    } else {
                      btnStyle = "bg-[#100724]/40 border-2 border-white/10 text-slate-400 opacity-40";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedIdx != null}
                      onClick={() => handleOptionClick(idx)}
                      className={`py-3 sm:py-3.5 px-4 rounded-xl font-display font-900 text-base sm:text-lg transition-all duration-200 cursor-pointer text-center shadow-md flex items-center justify-center ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
