/* =========================================================================
   AUDIO MAP — Mapping fixed text keys to audio files or speech text
   Module: Parallel Lines & Triangle Angles — Grade 7
   Every key here has an exact-text counterpart baked into scripts/generate_audio.js
   Run `node scripts/generate_audio.js` (with your ElevenLabs API key set) to
   produce the real .mp3 files into public/assets/audio/ — until then this
   app plays every line through the browser's built-in speech voice instead,
   so nothing is ever silent.
   ========================================================================= */
export const AUDIO_MAP = {
  wonder_1: {
    text: "Ever wondered why railway tracks never meet, no matter how far they travel? Or why the three angles inside ANY triangle, from a tiny paper clip to a giant bridge truss, always add up to exactly the same number? Let's find out!",
    style: "question",
    file: "/assets/audio/wonder_1.mp3"
  },
  story_1: {
    text: "Look around! Fences, railway tracks, window blinds, and road markings are full of straight lines that never cross. We call these parallel lines. But what happens when a third line cuts straight across them?",
    style: "statement",
    file: "/assets/audio/story_1.mp3"
  },
  story_2: {
    text: "That third crossing line is called a transversal. Where it crosses each parallel line, it creates eight angles in total, four at each intersection, and these angles are secretly connected to each other!",
    style: "emphasis",
    file: "/assets/audio/story_2.mp3"
  },
  story_3: {
    text: "Corresponding angles sit in the exact same corner position at each crossing point, like two F shapes stacked on top of each other. Corresponding angles are always EQUAL.",
    style: "emphasis",
    file: "/assets/audio/story_3.mp3"
  },
  story_4: {
    text: "Alternate angles sit on opposite sides of the transversal, forming a Z shape between the two parallel lines. Alternate interior angles are always EQUAL too.",
    style: "emphasis",
    file: "/assets/audio/story_4.mp3"
  },
  story_5: {
    text: "Co-interior angles, also called allied angles, sit on the same side of the transversal, forming a C shape. Unlike the others, co-interior angles are NOT equal, instead they always ADD UP TO 180 degrees.",
    style: "emphasis",
    file: "/assets/audio/story_5.mp3"
  },
  story_6: {
    text: "Now let's turn to triangles. No matter how big, small, thin, or wide a triangle is, its three interior angles ALWAYS add up to exactly 180 degrees. This is called the Angle Sum Property of a Triangle.",
    style: "celebration",
    file: "/assets/audio/story_6.mp3"
  },
  story_7: {
    text: "There is a bonus shortcut too! If you extend one side of a triangle, the exterior angle you create is always equal to the SUM of the two angles furthest away from it. That's the Exterior Angle Theorem.",
    style: "encouragement",
    file: "/assets/audio/story_7.mp3"
  },
  story_8: {
    text: "Amazing work! You've discovered how parallel lines, transversals, and triangle angles are all connected. Now step into the simulation lab to explore, measure, and test these rules for yourself!",
    style: "celebration",
    file: "/assets/audio/story_8.mp3"
  },
  sim_1: {
    text: "Welcome to the Transversal Explorer! Drag the angle slider to rotate the crossing line, and watch how the corresponding, alternate, and co-interior angle pairs change together instantly!",
    style: "encouragement",
    file: "/assets/audio/sim_1.mp3"
  },
  sim_2: {
    text: "Welcome to the Triangle Angle Lab! Enter two known angles of each triangle and use the Angle Sum Property to calculate the missing third angle!",
    style: "statement",
    file: "/assets/audio/sim_2.mp3"
  },
  sim_3: {
    text: "Welcome to the Inverse Angle Solver! You'll be given clues like an exterior angle or an isosceles triangle's apex angle. Work backwards to find the missing angle!",
    style: "question",
    file: "/assets/audio/sim_3.mp3"
  },
  reflect_1: {
    text: "Great work completing the module! In your own words, explain how you can find a missing angle when two parallel lines are cut by a transversal, or inside a triangle.",
    style: "thinking",
    file: "/assets/audio/reflect_1.mp3"
  },
  hint_corresponding: {
    text: "Hint: Corresponding angles sit in the exact same corner at each intersection. They are always equal.",
    style: "thinking",
    file: "/assets/audio/hint_corresponding.mp3"
  },
  hint_alternate: {
    text: "Hint: Alternate interior angles form a Z shape between the parallel lines. They are always equal.",
    style: "thinking",
    file: "/assets/audio/hint_alternate.mp3"
  },
  hint_cointerior: {
    text: "Hint: Co-interior angles lie on the same side of the transversal, forming a C shape, and always add up to 180 degrees.",
    style: "thinking",
    file: "/assets/audio/hint_cointerior.mp3"
  },
  hint_vertical: {
    text: "Hint: Vertically opposite angles are formed across an X crossing. They are always equal.",
    style: "thinking",
    file: "/assets/audio/hint_vertical.mp3"
  },
  hint_trianglesum: {
    text: "Hint: The three angles inside any triangle always add up to exactly 180 degrees. Subtract the two known angles from 180.",
    style: "thinking",
    file: "/assets/audio/hint_trianglesum.mp3"
  },
  hint_exterior: {
    text: "Hint: The Exterior Angle Theorem says an exterior angle of a triangle equals the sum of the two remote interior angles.",
    style: "thinking",
    file: "/assets/audio/hint_exterior.mp3"
  },
  hint_isosceles: {
    text: "Hint: In an isosceles triangle, the two base angles are equal. Subtract the apex angle from 180, then divide by 2.",
    style: "thinking",
    file: "/assets/audio/hint_isosceles.mp3"
  },
  correct_feedback: {
    text: "Correct! Excellent angle detective work!",
    style: "celebration",
    file: "/assets/audio/correct_feedback.mp3"
  },
  incorrect_feedback: {
    text: "Not quite! Let's check the rule and try the next one.",
    style: "encouragement",
    file: "/assets/audio/incorrect_feedback.mp3"
  },
  unroll_feedback: {
    text: "Great! Watch how the paired angle updates automatically!",
    style: "celebration",
    file: "/assets/audio/unroll_feedback.mp3"
  },
  reverse_success: {
    text: "Awesome reverse angle engineering!",
    style: "celebration",
    file: "/assets/audio/reverse_success.mp3"
  }
};
