/* tutor/sets/numbers/letters.js: the NUMBERS 1-10 build's item set, in tutor/letters.js's shape. The numbers site is
 * the letter app with this file in tutor/letters.js's place (and this folder's model.json, ghost-hands.json and
 * ghost-pictures.json in tutor/'s; tools/build-mobile-site.sh --set numbers), so every module that asks "which items,
 * what do they look like, what to say" gets numbers without a branch of its own. The letter app never loads this file.
 *
 * WHAT IS TAUGHT. ASL's numbers 1-10 as a class counts them (Lifeprint; Handspeak). 1-9 are handshapes held still and
 * graded by this folder's model.json, fitted on 92 Deaf signers' fingerspelled phone numbers (FSboard, Google, CC BY
 * 4.0; research/numbers-2026-10-24/). 10 is a thumbs-up with a small twist, a movement, graded by tutor/motion.js as J
 * and Z are in the letter app.
 *
 * WHICH WAY THE PALM FACES. FSboard's signers show every number palm out, and so do the pictures. Classes often teach
 * 1-5 palm toward yourself, the way you count: the grader takes 1-5 either way (the model was fitted on both), so the
 * words for 1-5 never ask for one or the other. 6-9 face out.
 *
 * Every sentence is categorical, second person, one short sentence (tutor/letters.js's rule: no numbers of degrees). */
// No imports: this file is read here (tests/numbers-set.test.js) and from tutor/letters.js's place on the site, so a
// relative import would be right in only one of them. The blocks a hint may name are GENERIC_HINTS' own keys, which
// the test keeps equal to tutor/features.js's BLOCKS.

export const NOUN = "number";
export const NOUN_PLURAL = "numbers";
export const LETTERS = Object.freeze(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
const MOTION_LETTERS = Object.freeze(["10"]);
export const STATIC_LETTERS = Object.freeze(LETTERS.filter((l) => !MOTION_LETTERS.includes(l)));
/* A numbers session practises all ten, in order, unless the link says otherwise (?letters=). */
export const DEFAULT_ITEMS = LETTERS;
/* OpenFS (the letter app's second opinion) reads letters only. */
export const USES_OPENFS = false;

/** The items in a link's ?letters=: "10" first, then single digits; anything else is ignored. */
export function parseItems(raw) {
  return (String(raw).match(/10|[1-9]/g) ?? []).filter((c) => LETTERS.includes(c));
}

// the numbers a learner mixes each one up with (model.json's `confusions`, copied; tests/numbers-set.test.js keeps
// the two equal): the thumb in or out (2/3, 4/5), the thumb on the next finger (6-9)
export const CONFUSIONS = Object.freeze({
  1: "", 2: "3", 3: "2", 4: "5", 5: "4", 6: "789", 7: "689", 8: "679", 9: "678", 10: "",
});

export const GENERIC_HINTS = Object.freeze({
  thumb: "Adjust your thumb to match the picture.",
  index: "Adjust your index finger to match the picture.",
  middle: "Adjust your middle finger to match the picture.",
  ring: "Adjust your ring finger to match the picture.",
  pinky: "Adjust your pinky to match the picture.",
  spread: "Adjust how far apart your fingers are to match the picture.",
  orientation: "Turn your hand to match the picture.",
});

const FINGER_BLOCKS = Object.freeze(["index", "middle", "ring", "pinky", "spread"]);
const EITHER_WAY = "Palm toward you or toward the camera, fingers up.";
const OUT = "Palm faces the camera, fingers up.";
const TABLE = {
  1: { motion: false, describe: "Index finger straight up; the other fingers curled, thumb over them.", thumb: "Fold your thumb over your curled fingers.", fingers: "Only your index finger is straight up.", orientation: EITHER_WAY },
  2: { motion: false, describe: "Index and middle fingers up and apart, the others curled under your thumb.", thumb: "Fold your thumb over your ring finger and pinky.", fingers: "Index and middle fingers straight and apart.", orientation: EITHER_WAY },
  3: { motion: false, describe: "Thumb, index and middle fingers out; ring finger and pinky curled.", thumb: "Stick your thumb out to the side.", fingers: "Index and middle fingers straight and apart; ring finger and pinky curled.", orientation: EITHER_WAY },
  4: { motion: false, describe: "Four fingers straight up and apart; thumb folded into the palm.", thumb: "Fold your thumb into your palm.", fingers: "All four fingers straight and apart.", orientation: EITHER_WAY },
  5: { motion: false, describe: "An open hand: all five fingers spread wide.", thumb: "Stick your thumb out too.", fingers: "All four fingers straight and spread wide.", orientation: EITHER_WAY },
  6: { motion: false, describe: "Thumb tip on the pinky tip; the other three fingers up and apart.", thumb: "Touch your thumb tip to your pinky tip.", fingers: "Index, middle and ring fingers straight and apart.", orientation: OUT },
  7: { motion: false, describe: "Thumb tip on the ring fingertip; index, middle and pinky up.", thumb: "Touch your thumb tip to your ring fingertip.", fingers: "Index, middle and pinky straight; ring finger bent down to your thumb.", orientation: OUT },
  8: { motion: false, describe: "Thumb tip on the middle fingertip; index, ring and pinky up.", thumb: "Touch your thumb tip to your middle fingertip.", fingers: "Index, ring and pinky straight; middle finger bent down to your thumb.", orientation: OUT },
  9: { motion: false, describe: "Thumb tip on the index fingertip; middle, ring and pinky up.", thumb: "Touch your thumb tip to your index fingertip.", fingers: "Middle, ring and pinky straight; index finger bent down to your thumb.", orientation: OUT },
  10: { motion: true, describe: "A thumbs-up, given a small twist.", thumb: "Point your thumb straight up.", fingers: "Curl all four fingers into a fist.", orientation: "Thumb up, then twist it side to side." },
};

function buildSpec(letter) {
  const row = TABLE[letter];
  const blocks = { thumb: row.thumb, orientation: row.orientation };
  for (const block of FINGER_BLOCKS) blocks[block] = row.fingers;
  return Object.freeze({ letter, motion: row.motion, describe: row.describe, blocks: Object.freeze(blocks), confusions: CONFUSIONS[letter] });
}
const SPECS = Object.freeze(Object.fromEntries(LETTERS.map((l) => [l, buildSpec(l)])));

export function letterSpec(letter) {
  const spec = SPECS[letter];
  if (!spec) throw new Error(`letterSpec: unknown number "${letter}"`);
  return spec;
}

export function resolveHint(blocks, block) {
  return blocks[block] ?? GENERIC_HINTS[block];
}

export function hintFor(letter, block) {
  const spec = letterSpec(letter);
  if (!(block in GENERIC_HINTS)) throw new Error(`hintFor: unknown block "${block}"`);
  return resolveHint(spec.blocks, block);
}

/* FROM THE NUMBER MADE TO THE NUMBER ASKED FOR (tutor/feedback.js's CONTRAST, which takes these as well): target
 * first, "45" is "asked for 4, made 5". `parts`: the blocks the sentence is about. */
const pair = (text, ...parts) => Object.freeze({ text, parts: Object.freeze(parts) });
export const SET_CONTRAST = Object.freeze({
  23: pair("For 2, fold your thumb down over your ring finger and pinky.", "thumb"),
  32: pair("For 3, stick your thumb out as well.", "thumb"),
  45: pair("For 4, fold your thumb into your palm.", "thumb"),
  54: pair("For 5, stick your thumb out as well.", "thumb"),
  67: pair("For 6, your thumb touches your pinky, not your ring finger.", "thumb", "ring", "pinky"),
  68: pair("For 6, your thumb touches your pinky, not your middle finger.", "thumb", "middle", "pinky"),
  69: pair("For 6, your thumb touches your pinky, not your index finger.", "thumb", "index", "pinky"),
  76: pair("For 7, your thumb touches your ring finger, not your pinky.", "thumb", "ring", "pinky"),
  78: pair("For 7, your thumb touches your ring finger, not your middle finger.", "thumb", "middle", "ring"),
  79: pair("For 7, your thumb touches your ring finger, not your index finger.", "thumb", "index", "ring"),
  86: pair("For 8, your thumb touches your middle finger, not your pinky.", "thumb", "middle", "pinky"),
  87: pair("For 8, your thumb touches your middle finger, not your ring finger.", "thumb", "middle", "ring"),
  89: pair("For 8, your thumb touches your middle finger, not your index finger.", "thumb", "index", "middle"),
  96: pair("For 9, your thumb touches your index finger, not your pinky.", "thumb", "index", "pinky"),
  97: pair("For 9, your thumb touches your index finger, not your ring finger.", "thumb", "index", "ring"),
  98: pair("For 9, your thumb touches your index finger, not your middle finger.", "thumb", "index", "middle"),
});

/* 2 is a V and 10 a thumbs-up: both set off iOS's camera Reactions (mobile/app.js says how to turn them off). */
export const REACTION_ITEMS = Object.freeze(["2", "10"]);
export const WARM_ITEM = "5";
export const WARM_URL = null;   // no hand render in this build: the tracker warms up on the first camera frame instead
/* No glove on the camera: the number's picture beside it, to copy (the owner, 24 Oct: "we do not need the glove
 * pictures ... just want the sign shown like the no-glove version"). ?look=glove still puts the glove on. */
export const DEFAULT_LOOK = "plain";
export const HOLD_NOTE = " For 10, give your thumbs-up a small twist.";
export const SHARE = Object.freeze({ title: "ASL numbers practice", text: "Practice ASL numbers 1 to 10 with your phone's camera." });

/* The pictures (assets/numbers/LICENSES.md): Wikimedia Commons' line drawings of 1-9 (CC BY-SA 4.0, credited on the
 * page), and for 10 the letter app's A (public domain), whose handshape it is. All are drawn as the other person sees a
 * right hand, so all are shown flipped (tutor/letters.js says why). */
export const PICTURE_LETTERS = LETTERS;
export const PICTURES_DRAWN_FROM_VIEWER = LETTERS;
export const PICTURE_CAPTION = "How it looks on your screen.";
export function pictureMirrored(letter, hand = "right") {
  const viewer = PICTURES_DRAWN_FROM_VIEWER.includes(letter);
  return hand === "left" ? !viewer : viewer;
}
export function pictureUrl(letter) {
  return PICTURE_LETTERS.includes(letter) ? `assets/numbers/${letter}.${letter === "10" ? "svg" : "jpg"}` : null;
}
