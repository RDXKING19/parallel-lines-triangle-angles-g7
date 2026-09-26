/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Module: Parallel Lines & Triangle Angles — Grade 7
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2
   Architecture: static pre-generated .mp3 files are looked up in
   AUDIO_MAP first (see audioMap.js); if a segment has no `file` or if
   playback fails, playback falls back gracefully to the browser's built-in
   Web Speech API so narration never silently breaks.
   ========================================================================= */
export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";

export const STYLE_SETTINGS = {
  celebration: {
    stability: 0.12,
    similarity_boost: 0.45,
    style: 0.75,
    rate: 1.06,
    pitch: 1.2
  },
  encouragement: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.65,
    rate: 1.0,
    pitch: 1.1
  },
  question: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.55,
    rate: 0.98,
    pitch: 1.08
  },
  emphasis: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.60,
    rate: 0.95,
    pitch: 1.05
  },
  thinking: {
    stability: 0.24,
    similarity_boost: 0.60,
    style: 0.35,
    rate: 0.90,
    pitch: 0.95
  },
  statement: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.50,
    rate: 1.0,
    pitch: 1.0
  }
};

export let audioMuted = false;
let ttsVoice = null;
let currentAudioElement = null;
let currentQueue = 0;
let audioUnlocked = false;

export function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      try {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }
  }
}

if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    unlockAudio();
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
    window.removeEventListener('touchstart', handleFirstInteraction);
  };
  window.addEventListener('click', handleFirstInteraction, { passive: true });
  window.addEventListener('keydown', handleFirstInteraction, { passive: true });
  window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
}

function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    ttsVoice = pickVoice();
  };
  ttsVoice = pickVoice();
}

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

function resolveAudioUrl(file) {
  if (!file) return '';
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('blob:')) {
    return file;
  }
  const basePath = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const cleanFile = file.startsWith('/') ? file.slice(1) : file;
  return `${cleanBase}${cleanFile}`;
}

export function speakSegment(seg, expectedQueue) {
  return new Promise((resolve) => {
    if (audioMuted || !seg || !seg.text) return resolve();
    if (expectedQueue !== undefined && expectedQueue !== currentQueue) return resolve();

    // Check if seg has an audio file associated and try HTML5 Audio
    if (seg.file) {
      try {
        if (currentAudioElement) {
          try {
            currentAudioElement.onended = null;
            currentAudioElement.onerror = null;
            currentAudioElement.pause();
          } catch (e) {}
          currentAudioElement = null;
        }

        const audio = new Audio();
        audio.src = resolveAudioUrl(seg.file);
        audio.preload = 'auto';
        currentAudioElement = audio;

        let handled = false;
        const finish = () => {
          if (!handled) {
            handled = true;
            if (currentAudioElement === audio) {
              currentAudioElement = null;
            }
            resolve();
          }
        };

        const tryFallback = () => {
          if (handled) return;
          handled = true;
          if (expectedQueue !== undefined && expectedQueue !== currentQueue) return resolve();
          if (audioMuted) return resolve();
          fallbackSpeech(seg, expectedQueue).then(resolve);
        };

        audio.onended = finish;

        audio.onerror = () => {
          tryFallback();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // AbortError happens when audio is intentionally stopped/switched — do NOT fallback
            if (err && err.name === 'AbortError') {
              finish();
              return;
            }
            if (expectedQueue !== undefined && expectedQueue !== currentQueue) {
              finish();
              return;
            }
            tryFallback();
          });
        }
        return;
      } catch (e) {
        console.warn('HTML5 Audio playback error:', e);
      }
    }

    fallbackSpeech(seg, expectedQueue).then(resolve);
  });
}

function fallbackSpeech(seg, expectedQueue) {
  return new Promise((resolve) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) {
      return resolve();
    }
    if (expectedQueue !== undefined && expectedQueue !== currentQueue) {
      return resolve();
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (!ttsVoice) ttsVoice = pickVoice();
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;

    let finished = false;
    const done = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };

    // Safety timeout in case speechSynthesis.onend is suppressed by browser bug
    const wordCount = (seg.text || '').split(/\s+/).length;
    const timeoutMs = Math.max(3500, (wordCount / 2.2) * 1000 + 2500);
    const timer = setTimeout(done, timeoutMs);

    utter.onend = () => {
      clearTimeout(timer);
      done();
    };
    utter.onerror = () => {
      clearTimeout(timer);
      done();
    };

    try {
      window.speechSynthesis.speak(utter);
    } catch (e) {
      clearTimeout(timer);
      done();
    }
  });
}

export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = ++currentQueue;
  const segList = Array.isArray(segments) ? segments : [segments];
  for (const seg of segList) {
    if (myQueue !== currentQueue || audioMuted) return;
    await speakSegment(seg, myQueue);
  }
}

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    try {
      currentAudioElement.onended = null;
      currentAudioElement.onerror = null;
      currentAudioElement.pause();
      currentAudioElement.src = '';
    } catch (e) {}
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'encouragement' });
