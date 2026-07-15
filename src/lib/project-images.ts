/**
 * Real project photography — sourced from Creative Commons / Flickr.
 * See public/assets/ATTRIBUTIONS.md for credits.
 */

const BASE = "/assets";
const ASSET_VERSION = "2";

export const projectImage = {
  dachshund: `${BASE}/projects/dachshund-plushie.jpg?v=${ASSET_VERSION}`,
  sunflower: `${BASE}/projects/sunflower-bag.jpg`,
  sunflowerCoasters: `${BASE}/projects/sunflower-coasters.jpg`,
  granny: `${BASE}/projects/granny-blanket.jpg`,
  sweater: `${BASE}/projects/cozy-sweater.jpg`,
  dino: `${BASE}/projects/dino-plushie.jpg`,
  frog: `${BASE}/projects/frog-prince.jpg`,
  colorStudio: `${BASE}/projects/color-studio.jpg`,
  patternFromPhoto: `${BASE}/projects/pattern-from-photo.jpg`,
  plushieBuilder: `${BASE}/projects/plushie-builder.jpg`,
} as const;

export const yarnImage = {
  coral: `${BASE}/yarn/yarn-coral.jpg`,
  teal: `${BASE}/yarn/yarn-teal.jpg`,
  gold: `${BASE}/yarn/yarn-gold.jpg`,
  lavender: `${BASE}/yarn/yarn-lavender.jpg`,
  cream: `${BASE}/yarn/yarn-cream.jpg`,
  skeins: `${BASE}/yarn/yarn-skeins.jpg`,
} as const;

export const lessonImage = {
  magicRing: `${BASE}/lessons/magic-ring.jpg`,
  singleCrochet: `${BASE}/lessons/single-crochet.jpg`,
  increasing: `${BASE}/lessons/increasing.jpg`,
  decreasing: `${BASE}/lessons/decreasing.jpg`,
  workingInRound: `${BASE}/lessons/working-in-round.jpg`,
} as const;

export const scanImage = {
  dachshund: `${BASE}/scans/scan-dachshund-wip.jpg?v=${ASSET_VERSION}`,
  sunflower: `${BASE}/scans/scan-sunflower-wip.jpg`,
  granny: `${BASE}/scans/scan-granny-wip.jpg`,
} as const;

/** Learn pattern kit photography — unique to /learn (not used elsewhere on site). */
export const learnImage = {
  jellyfish: `${BASE}/learn/jellyfish-amigurumi.jpg`,
  rippleBlanket: `${BASE}/learn/ripple-baby-blanket.jpg`,
  bucketHat: `${BASE}/learn/bucket-hat.jpg`,
  hexagonCoasters: `${BASE}/learn/hexagon-coasters.jpg`,
  grannySquareHoodie: `${BASE}/learn/womens-granny-square-hoodie.png`,
} as const;
