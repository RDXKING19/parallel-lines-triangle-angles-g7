/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates unbounded non-repeating Grade 7 questions on
   Parallel Lines cut by a Transversal, and Triangle Angle Sum / Exterior Angle
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

// 10 themed worlds — early worlds unlock the "parallel line" angle-pair
// archetypes, later worlds layer in triangle angle-sum and exterior-angle
// archetypes, matching how the Story/Simulate phases build up the ideas.
export const PRACTICE_WORLDS = [
  { id: 0, name: "Railway Track Yard", icon: "🚆", range: "Q1–10", difficulty: 1, object: "railway track crossing", unit: "°" },
  { id: 1, name: "Window Blinds Lab", icon: "🪟", range: "Q11–20", difficulty: 1, object: "window blind slats", unit: "°" },
  { id: 2, name: "Zebra Crossing City", icon: "🚸", range: "Q21–30", difficulty: 2, object: "road crossing", unit: "°" },
  { id: 3, name: "Ladder & Wall Workshop", icon: "🪜", range: "Q31–40", difficulty: 2, object: "leaning ladder", unit: "°" },
  { id: 4, name: "Sailboat Cove", icon: "⛵", range: "Q41–50", difficulty: 2, object: "triangular sail", unit: "°" },
  { id: 5, name: "Roof Truss Site", icon: "🏠", range: "Q51–60", difficulty: 3, object: "roof truss", unit: "°" },
  { id: 6, name: "Kite Flying Park", icon: "🪁", range: "Q61–70", difficulty: 3, object: "kite frame", unit: "°" },
  { id: 7, name: "Traffic Sign Foundry", icon: "⚠️", range: "Q71–80", difficulty: 3, object: "warning-sign triangle", unit: "°" },
  { id: 8, name: "Bridge Truss Bay", icon: "🌉", range: "Q81–90", difficulty: 4, object: "bridge truss triangle", unit: "°" },
  { id: 9, name: "Skyline Architect Studio", icon: "🏙️", range: "Q91–100", difficulty: 4, object: "rooftop framework", unit: "°" }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(val) {
  if (Number.isInteger(val)) return val.toString();
  return Number(val.toFixed(1)).toString();
}

/**
 * Generate a procedural question for a given world.
 * Archetypes unlock progressively with world difficulty, exactly like a
 * skill tree: parallel-line angle pairs first, then triangle angle sum,
 * then exterior angle / isosceles / algebraic combined problems.
 */
export function makeQuestion(worldIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const name = pick(WESTERN_NAMES);
  const diff = world.difficulty;
  const unit = world.unit;

  const allowedArchetypes = ['corresponding', 'alternate'];
  if (diff >= 2) allowedArchetypes.push('coInterior', 'vertical');
  if (diff >= 2) allowedArchetypes.push('triangleSum');
  if (diff >= 3) allowedArchetypes.push('exterior', 'isosceles');
  if (diff >= 4) allowedArchetypes.push('algebraic', 'mixed');

  const archetype = pick(allowedArchetypes);

  let prompt = "";
  let correctAnswer = 0;
  let correctLabel = "";
  let distractors = [];
  let diagramData = { mode: 'corresponding', given: 60 };
  let hint = "";

  switch (archetype) {
    case 'corresponding': {
      const given = randInt(4, 17) * 5; // clean multiples of 5, 20-85
      prompt = `${name} looks at two parallel lines cut by a transversal at the ${world.object}. One angle measures ${given}°. What is the measure of its CORRESPONDING angle on the other parallel line?`;
      correctAnswer = given;
      correctLabel = `${given}${unit}`;
      diagramData = { mode: 'corresponding', given };
      hint = "Corresponding angles sit in the exact same corner at each intersection — they are always EQUAL.";
      distractors.push(180 - given);
      distractors.push(given / 2);
      distractors.push(90 - given >= 0 ? 90 - given : given + 10);
      break;
    }

    case 'alternate': {
      const given = randInt(4, 17) * 5;
      prompt = `Two parallel lines are cut by a transversal at the ${world.object}. One interior angle is ${given}°. Find its ALTERNATE interior angle on the opposite side of the transversal.`;
      correctAnswer = given;
      correctLabel = `${given}${unit}`;
      diagramData = { mode: 'alternate', given };
      hint = "Alternate interior angles form a 'Z' shape between the parallel lines — they are always EQUAL.";
      distractors.push(180 - given);
      distractors.push(given + 10);
      distractors.push(given - 10 > 0 ? given - 10 : given + 20);
      break;
    }

    case 'coInterior': {
      const given = randInt(4, 17) * 5;
      const answer = 180 - given;
      prompt = `At the ${world.object}, two parallel lines are cut by a transversal. One co-interior (allied) angle is ${given}°. What is the other co-interior angle on the same side of the transversal?`;
      correctAnswer = answer;
      correctLabel = `${formatNum(answer)}${unit}`;
      diagramData = { mode: 'coInterior', given };
      hint = "Co-interior (allied) angles lie on the same side of the transversal, inside a 'C' shape, and always ADD UP TO 180°.";
      distractors.push(given);
      distractors.push(90 - (given % 90 || 10));
      distractors.push(answer + 10);
      break;
    }

    case 'vertical': {
      const given = randInt(4, 17) * 5;
      prompt = `Two lines cross to form an X at the ${world.object}. One angle is ${given}°. What is the size of the angle VERTICALLY OPPOSITE to it?`;
      correctAnswer = given;
      correctLabel = `${given}${unit}`;
      diagramData = { mode: 'vertical', given };
      hint = "Vertically opposite angles are formed across an X-crossing — they are always EQUAL.";
      distractors.push(180 - given);
      distractors.push(given + 15);
      distractors.push(given - 15 > 0 ? given - 15 : given + 25);
      break;
    }

    case 'triangleSum': {
      const a = randInt(3, 15) * 10; // 30-150
      let b = randInt(3, 15) * 10;
      while (a + b >= 170) b = randInt(3, 15) * 10;
      const c = 180 - a - b;
      prompt = `A triangular ${world.object} has two known angles: ${a}° and ${b}°. What is the size of the third angle?`;
      correctAnswer = c;
      correctLabel = `${c}${unit}`;
      diagramData = { mode: 'triangle', a, b, c: '?' };
      hint = "The three angles inside ANY triangle always add up to exactly 180°. Subtract the two known angles from 180°.";
      distractors.push(a + b);
      distractors.push(180 - a);
      distractors.push(c + 10 <= 170 ? c + 10 : c - 10);
      break;
    }

    case 'exterior': {
      const a = randInt(3, 12) * 10;
      const b = randInt(3, 12) * 10;
      const ext = a + b;
      prompt = `In a triangular ${world.object}, one side is extended to form an exterior angle. The two remote interior angles are ${a}° and ${b}°. What is the exterior angle?`;
      correctAnswer = ext;
      correctLabel = `${ext}${unit}`;
      diagramData = { mode: 'exterior', a, b, ext: '?' };
      hint = "The Exterior Angle Theorem: an exterior angle of a triangle equals the SUM of the two remote (non-adjacent) interior angles.";
      distractors.push(180 - ext);
      distractors.push(a * 2);
      distractors.push(ext - 20 > 0 ? ext - 20 : ext + 20);
      break;
    }

    case 'isosceles': {
      const apex = randInt(2, 16) * 10;
      const base = (180 - apex) / 2;
      prompt = `An isosceles triangular ${world.object} has an apex angle of ${apex}°. Since the two base angles are equal, what is the size of EACH base angle?`;
      correctAnswer = base;
      correctLabel = `${formatNum(base)}${unit}`;
      diagramData = { mode: 'isosceles', apex, base };
      hint = "In an isosceles triangle, the two base angles are equal. Subtract the apex angle from 180°, then divide by 2.";
      distractors.push(apex);
      distractors.push(180 - apex);
      distractors.push(base + 10);
      break;
    }

    case 'algebraic': {
      const x = randInt(5, 40);
      const given = 3 * x + randInt(2, 10);
      prompt = `At a parallel-line crossing in the ${world.object}, one angle is (3x + ${given - 3 * x})° and its corresponding angle is ${given}°. Solve for x.`;
      correctAnswer = x;
      correctLabel = `x = ${x}`;
      diagramData = { mode: 'corresponding', given };
      hint = "Corresponding angles are equal, so set the algebraic expression equal to the given angle and solve for x.";
      distractors.push(`x = ${x + 3}`);
      distractors.push(`x = ${x - 3 > 0 ? x - 3 : x + 5}`);
      distractors.push(`x = ${given - x}`);
      break;
    }

    case 'mixed': {
      const given = randInt(4, 17) * 5;
      const coInt = 180 - given;
      const b = randInt(3, 12) * 10;
      const thirdAngle = 180 - given - b > 0 ? 180 - given - b : 10;
      prompt = `A transversal crosses parallel lines forming a ${given}° angle, which is also the base angle of a triangular ${world.object}. If another triangle angle is ${b}°, find the third triangle angle.`;
      correctAnswer = thirdAngle;
      correctLabel = `${formatNum(correctAnswer)}${unit}`;
      diagramData = { mode: 'triangle', a: given, b, c: '?' };
      hint = "First use the parallel-line rule to find the triangle's base angle, then use Angle Sum of a Triangle = 180° to finish.";
      distractors.push(`${formatNum(coInt)}${unit}`);
      distractors.push(`${given}${unit}`);
      distractors.push(`${formatNum(correctAnswer + 10)}${unit}`);
      break;
    }
  }

  // Deduplicate and build 4 distractor choices
  const uniqueDistractors = [];
  const correctValFormatted = correctLabel;

  for (const dVal of distractors) {
    const formatted = typeof dVal === 'string' && dVal.includes('°') || (typeof dVal === 'string' && dVal.includes('x'))
      ? dVal
      : `${formatNum(dVal)}${unit}`;
    const numeric = parseFloat(formatted.replace('x = ', ''));
    if (
      formatted !== correctValFormatted &&
      !uniqueDistractors.includes(formatted) &&
      numeric > 0 && (formatted.includes('x') || numeric < 180)
    ) {
      uniqueDistractors.push(formatted);
    }
  }

  const isAlgebra = correctLabel.startsWith('x =');
  const base = isAlgebra ? parseFloat(correctLabel.replace('x = ', '')) : parseFloat(correctLabel);
  let fallbacks = isAlgebra
    ? [`x = ${base + 4}`, `x = ${Math.max(base - 4, 1)}`, `x = ${base + 8}`, `x = ${Math.max(base - 8, 1)}`]
    : [
        `${formatNum(base + 20)}${unit}`,
        `${formatNum(Math.max(base - 20, 5))}${unit}`,
        `${formatNum(180 - base)}${unit}`,
        `${formatNum(base + 35)}${unit}`
      ];
  for (const fb of fallbacks) {
    if (uniqueDistractors.length >= 3) break;
    if (fb !== correctValFormatted && !uniqueDistractors.includes(fb)) {
      uniqueDistractors.push(fb);
    }
  }

  const rawOptions = [correctLabel, uniqueDistractors[0], uniqueDistractors[1], uniqueDistractors[2]];

  // Fisher-Yates Shuffle options
  const shuffledOptions = [...rawOptions];
  const targetOption = rawOptions[0];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  const correctIndex = shuffledOptions.indexOf(targetOption);

  return {
    world,
    name,
    prompt,
    correctIndex,
    options: shuffledOptions,
    diagramData,
    archetype,
    hint,
    explanation: hint
  };
}

// Fixed, pre-generatable hint narration keyed by archetype (used by the
// Practice phase Hint button so hints can be voiced with pre-generated
// ElevenLabs audio instead of relying on live TTS for every combination).
export const HINT_AUDIO_KEYS = {
  corresponding: 'hint_corresponding',
  alternate: 'hint_alternate',
  coInterior: 'hint_cointerior',
  vertical: 'hint_vertical',
  triangleSum: 'hint_trianglesum',
  exterior: 'hint_exterior',
  isosceles: 'hint_isosceles',
  algebraic: 'hint_corresponding',
  mixed: 'hint_trianglesum'
};
