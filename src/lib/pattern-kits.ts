import { learnImage } from "@/lib/project-images";

export type PatternKitMaterial = {
  item: string;
  amount: string;
};

export type PatternKit = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  durationMinutes: number;
  finishedSize: string;
  illustrationUrl: string;
  href: string;
  progressPercent: number;
  hookSize: string;
  yarnSummary: string;
  materials: PatternKitMaterial[];
  overview: string[];
  steps: string[];
  tip: string;
};

export const PATTERN_KITS: PatternKit[] = [
  {
    id: "kit-driftwood-jellyfish",
    slug: "driftwood-jellyfish-plushie",
    title: "Driftwood Jellyfish Plushie Kit",
    subtitle: "Sculpted bell dome with flowing spiral tentacles",
    category: "Amigurumi Pattern Kit",
    skillLevel: "intermediate",
    durationMinutes: 300,
    finishedSize: 'Approx. 9" tall (23 cm) including tentacles',
    illustrationUrl: learnImage.jellyfish,
    href: "/learn/driftwood-jellyfish-plushie",
    progressPercent: 0,
    hookSize: "3.25 mm (D/3) — or 3.5 mm for a slightly looser drape",
    yarnSummary:
      "280 yards total sport-weight (#2) cotton or acrylic blend in 2–3 colors",
    materials: [
      { item: "Main color (bell dome)", amount: "120 yards / 110 m" },
      { item: "Accent color (tentacle tips)", amount: "80 yards / 73 m" },
      { item: "Optional third color (oral arms)", amount: "40 yards / 37 m" },
      { item: "Polyester fiberfill stuffing", amount: "2 oz / 55 g" },
      { item: "12 mm safety eyes", amount: "1 pair (optional — can embroider instead)" },
      { item: "Pipe cleaner or floral wire", amount: "1 piece for hanging loop (optional)" },
      { item: "Tapestry needle", amount: "1" },
      { item: "Stitch markers", amount: "2" },
    ],
    overview: [
      "You will crochet the bell (head) first, then make 12 separate tentacles and sew them on.",
      "Work in continuous rounds — place a stitch marker in the first stitch of each round.",
      "Stuff the bell firmly before the opening gets too small.",
      "Tentacles are simple chains with slip stitches — great for beginners who know the basics.",
    ],
    steps: [
      "Gather materials and make a gauge swatch: with main color, ch 10, sc in 2nd ch and across for 5 rows. Adjust hook if fabric is too loose or tight.",
      "Bell — Round 1: Make a magic ring with main color. Crochet 6 single crochet (sc) into the ring. Pull the tail tight to close the hole. Place a stitch marker in the first stitch. (6 stitches)",
      "Round 2: Work 2 sc in every stitch around (this is an increase). Move the marker up. (12 stitches)",
      "Round 3: *Sc in the next stitch, then 2 sc in the following stitch (increase)* — repeat from * 6 times total. (18 stitches)",
      "Rounds 4–10: Continue the same increase pattern, adding one more plain sc before each increase each round: Round 4 is *2 sc, inc* ×6 (24 sts), Round 5 is *3 sc, inc* ×6 (30 sts), and so on until Round 10 gives you 60 stitches.",
      "Rounds 11–16: Sc in every stitch around with no increases. The bell should look like a smooth dome. Mark Round 13 with a second marker or piece of yarn.",
      "Add the eyes: between Rounds 14 and 15, insert safety eyes about 8 stitches apart, centered on the front of the dome. If using embroidered eyes, skip this and add them later with black yarn.",
      "Round 17: Begin decreasing. *Sc in next 8 stitches, then sc2tog (single crochet two together)* — repeat 6 times. (54 stitches) Start adding stuffing now.",
      "Round 18: *Sc in next 7 stitches, sc2tog* — repeat 6 times. (48 stitches) Keep stuffing as the opening shrinks.",
      "Round 19: *Sc in next 6 stitches, sc2tog* — repeat 6 times. (42 stitches)",
      "Round 20: *Sc in next 5 stitches, sc2tog* — repeat 6 times. (36 stitches) The bell should feel firm but not rock-hard.",
      "Round 21: *Sc in next 4 stitches, sc2tog* — repeat 6 times. (30 stitches)",
      "Round 22: *Sc in next 3 stitches, sc2tog* — repeat 6 times. (24 stitches) Finish stuffing through the opening.",
      "Round 23: *Sc in next 2 stitches, sc2tog* — repeat 6 times. (18 stitches)",
      "Round 24: *Sc in next stitch, sc2tog* — repeat 6 times. (12 stitches) Cut yarn, leaving a 10-inch tail. Thread the tail through the remaining 12 loops and pull tight to close the top.",
      "Tentacles (make 12 with accent color): Chain 45. Starting in the 2nd chain from the hook, work a slip stitch in each chain all the way back. Cut yarn and pull through. Repeat until you have 12 tentacles the same length.",
      "Optional oral arms (make 4 with third color): Chain 12. Slip stitch back across the chain. These short curly arms go under the eyes.",
      "Attach tentacles: Pin all 12 tentacles evenly around the bottom rim of the bell (the open edge from your decrease rounds). Sew each tentacle base securely through both layers of the rim using the tapestry needle.",
      "Attach oral arms (if using): Sew the 4 short arms in a small ring just below the eyes.",
      "Optional hanging loop: Fold a pipe cleaner into a U, poke it through the closed top center, and crochet a small cap over it (magic ring, 6 sc, pull tight) to hide the wire.",
      "Finishing: Weave in all yarn ends inside the bell. Gently curl each tentacle by wrapping it around your finger. Your jellyfish is ready!",
    ],
    tip: "Curl tentacles by running the flat side of your hook along each chain strand after finishing — cotton yarn holds the spiral beautifully.",
  },
  {
    id: "kit-rainbow-ripple-blanket",
    slug: "rainbow-ripple-crib-blanket",
    title: "Rainbow Ripple Crib Blanket Kit",
    subtitle: "Chevron waves in six colors — machine-washable baby gift",
    category: "Home Pattern Kit",
    skillLevel: "beginner",
    durationMinutes: 840,
    finishedSize: '34" × 38" (86 × 97 cm) — crib / stroller size',
    illustrationUrl: learnImage.rippleBlanket,
    href: "/learn/rainbow-ripple-crib-blanket",
    progressPercent: 0,
    hookSize: "5.0 mm (H/8)",
    yarnSummary:
      "2,400 yards total light worsted (#4) machine-washable acrylic or cotton blend in 6 colors",
    materials: [
      { item: "Color A (ripple valley)", amount: "600 yards / 550 m" },
      { item: "Colors B, C, D (mid tones)", amount: "400 yards each / 365 m each" },
      { item: "Colors E & F (peak highlights)", amount: "300 yards each / 275 m each" },
      { item: "Tapestry needle", amount: "1" },
      { item: "Stitch markers", amount: "2" },
      { item: "Blocking pins & mats", amount: "recommended" },
    ],
    overview: [
      "This blanket is one flat piece — you crochet back and forth in rows, no joining squares.",
      "The ripple (chevron) shape comes from increasing at peaks and skipping stitches at valleys.",
      "Each color is worked for 4 rows before switching to the next color.",
      "Make a small swatch first to check that your ripple width feels right.",
    ],
    steps: [
      "Make a practice swatch with Color A: Chain 27 stitches (this is a small version of the ripple). Row 1: Double crochet (dc) in the 4th chain from the hook, dc in the next 3 chains. At the peak: work 2 dc, chain 2, 2 dc all in the next chain. Dc in the next 4 chains, skip 2 chains, dc in the next 4 chains. Repeat the peak and valley once more, then end with 4 dc in the last 4 chains. Your swatch should ripple — block it and measure the width.",
      "Start the full blanket: With Color A, chain 195. This is your foundation — do not twist the chain. The width will be about 34 inches.",
      "Row 1 (setup row): Dc in the 4th chain from the hook (the turning chain counts as your first dc). Dc in the next 3 chains. Now work the ripple repeat across: at each peak, work (2 dc, ch 2, 2 dc) in one stitch; at each valley, skip 2 stitches and work 4 dc. End the row with 4 dc in the last 4 chains. Turn your work.",
      "Row 2: Chain 3 (this counts as your first dc). Dc in the next 3 stitches. Continue the ripple pattern — peaks get (2 dc, ch 2, 2 dc), valleys skip 2 stitches. Place a stitch marker in each ch-2 peak space so you can see the wave shape.",
      "Rows 3–4: Repeat Row 2 exactly. At the end of Row 4, cut Color A and fasten off.",
      "Color B — Rows 5–8: Join Color B at any peak (the ch-2 space). Chain 3 and work the same ripple pattern for 4 rows. Carry the unused yarn up the side by twisting it with the working yarn at the start of each row — this saves weaving in dozens of ends.",
      "Colors C, D, E, F: Repeat the same 4-row color block for each new color. One full rainbow rotation = 24 rows.",
      "Keep going: Continue color rotations until the blanket measures 38 inches long (about 6 full rotations = 144 rows). End on a valley row so the top edge is flat, not pointed.",
      "Weave in any loose ends from color changes before adding the border.",
      "Border Round 1: With Color A, join yarn at any corner. Work single crochet (sc) evenly around all four sides. Put 3 sc in each corner stitch so the border turns smoothly. Aim for about 3 sc per row along the short ends.",
      "Border Round 2 (picot edge): *Sc in the next 3 stitches, chain 3, slip stitch in the first chain of that ch-3 (this makes a small picot bump)* — repeat all the way around. Adjust at corners so picots stay even.",
      "Blocking: Lay the blanket flat on blocking mats. Pin the corners to the finished measurements. Mist lightly with water and let dry completely. The waves will open up and look crisp.",
    ],
    tip: "When changing colors, always join new yarn at a peak (ch-2 space) — the join hides inside the wave crest.",
  },
  {
    id: "kit-natural-fiber-bucket-hat",
    slug: "natural-fiber-bucket-hat",
    title: "Natural Fiber Bucket Hat Kit",
    subtitle: "Structured crown, relaxed brim — summer-weight cotton",
    category: "Accessory Pattern Kit",
    skillLevel: "intermediate",
    durationMinutes: 240,
    finishedSize: 'Adult medium — 22"–23" head circumference, 3" brim',
    illustrationUrl: learnImage.bucketHat,
    href: "/learn/natural-fiber-bucket-hat",
    progressPercent: 0,
    hookSize: "4.0 mm (G/6) for crown & body; 4.5 mm (7) for brim",
    yarnSummary:
      "320 yards total DK or light worsted (#3–4) 100% cotton or linen blend",
    materials: [
      { item: "Main color", amount: "280 yards / 255 m" },
      { item: "Contrast color (optional brim stripe)", amount: "40 yards / 37 m" },
      { item: "Stitch markers", amount: "8" },
      { item: "Tapestry needle", amount: "1" },
      { item: "Soft measuring tape", amount: "1" },
    ],
    overview: [
      "This hat is worked from the top of the crown downward — you can try it on as you go.",
      "Each round is joined with a slip stitch (not a continuous spiral).",
      "The crown uses half double crochet (hdc) increases to form a flat circle.",
      "The brim flares out at the end using a larger hook and extra increases.",
    ],
    steps: [
      "Measure your head: wrap a soft tape around your forehead where the hat will sit. Medium adult is 22–23 inches. Write this number down.",
      "Crown — Round 1: Make a magic ring with main color and 4.0 mm hook. Chain 2, work 8 hdc into the ring, join with sl st to the top of the first hdc. (8 stitches)",
      "Round 2: Chain 2, work 2 hdc in every stitch around, join. (16 stitches) Place a marker in the first stitch of each round.",
      "Round 3: Chain 2, *hdc in next stitch, 2 hdc in next stitch (increase)* — repeat 8 times, join. (24 stitches)",
      "Rounds 4–8: Keep increasing 8 stitches per round. Each round adds one more hdc before the increase: Round 4 is *2 hdc, inc* ×8 (32 sts), Round 5 is *3 hdc, inc* ×8 (40 sts), continuing until Round 8 gives you 64 stitches.",
      "Check the crown: Lay the circle flat. It should measure about 6.5 inches across. If it cups upward, your stitches are too tight — go up one hook size. If it ruffles, go down one hook size or skip the last increase round.",
      "Body — Rounds 9–20: Chain 2, hdc in every stitch around, join. No increases — this builds the sides of the hat. After Round 20, try the hat on: it should cover your ears. Add 2–3 more even rounds if you want a deeper fit.",
      "Brim increase — Round 21: Chain 2, *hdc in next 6 stitches, 2 hdc in next stitch* — repeat 8 times, join. (72 stitches) This begins the brim flare.",
      "Switch to the 4.5 mm hook for a looser, floppier brim.",
      "Brim — Rounds 22–24: Chain 2, hdc in every stitch around, join. The brim should start to curl outward.",
      "Optional contrast stripe: Switch to contrast color for Rounds 25–26, then switch back to main color.",
      "Brim — Rounds 27–28: Continue hdc in each stitch around with the 4.5 mm hook. The brim should measure about 3 inches wide from the body seam.",
      "Brim edge — Round 29: Chain 1, work reverse single crochet (crab stitch): insert hook into the previous stitch (to the right if right-handed), sc. This creates a clean rolled edge. Join and fasten off.",
      "Finishing: Weave in all ends. Steam block the brim: pin the edge flat, hold steam 2 inches above the fabric for 3 seconds, and let cool before unpinning.",
    ],
    tip: "Try the hat on after Round 20 — the body should cover your ears. Add 2–3 more even rounds if you prefer a slouchier fit.",
  },
  {
    id: "kit-hexagon-bobble-coasters",
    slug: "hexagon-bobble-coasters",
    title: "Hexagon Bobble Coaster Set Kit",
    subtitle: "Set of 6 — textured motifs with non-slip cotton",
    category: "Quick Gift Pattern Kit",
    skillLevel: "beginner",
    durationMinutes: 120,
    finishedSize: '4" (10 cm) point-to-point — fits mugs and wine glasses',
    illustrationUrl: learnImage.hexagonCoasters,
    href: "/learn/hexagon-bobble-coasters",
    progressPercent: 0,
    hookSize: "4.0 mm (G/6)",
    yarnSummary:
      "180 yards total 100% cotton worsted (#4) in 3 colors (60 yards each)",
    materials: [
      { item: "Color A (hexagon body)", amount: "60 yards / 55 m" },
      { item: "Color B (bobble center)", amount: "60 yards / 55 m" },
      { item: "Color C (border)", amount: "60 yards / 55 m" },
      { item: "Tapestry needle", amount: "1" },
      { item: "Blocking mat or towel", amount: "1" },
    ],
    overview: [
      "Each coaster is a flat hexagon — six sides, six corners.",
      "You start at the bobble center and grow outward round by round.",
      "Cotton yarn absorbs condensation and the bobbles grip the table.",
      "Make all 6 coasters, rotating which color is the body, center, and border.",
    ],
    steps: [
      "Practice the bobble stitch first: yarn over, insert hook in stitch, pull up a loop, yarn over, pull through 2 loops — repeat that 5 times in the SAME stitch (6 loops on hook). Yarn over, pull through all 6 loops. Chain 1 to lock the bobble.",
      "Coaster 1 — Center (Color B): Make a magic ring. Round 1: Chain 1, 6 sc in ring, join with sl st. (6 stitches)",
      "Round 2: Chain 1, bobble in first stitch, *chain 2, bobble in next stitch* — repeat 5 more times, chain 2, join to the top of the first bobble. You should see 6 bobbles with chain-2 spaces between them.",
      "Round 3 (switch to Color A): Join Color A in any chain-2 space. Chain 3 (counts as dc), 2 dc in the same space, chain 1. *In the next chain-2 space: 3 dc, chain 1* — repeat 5 times. Finish with 3 dc in the starting space, chain 1, join. You now have 6 sides.",
      "Round 4: Slip stitch into the next chain-1 corner space. Chain 3, 2 dc, chain 1, 3 dc in the same corner (this forms one point of the hexagon). Dc in each stitch along the side, then work (3 dc, ch 1, 3 dc) in the next corner. Repeat around all 6 sides. Join.",
      "Round 5: Repeat Round 4 — each side grows by 3 more dc stitches, and each corner still gets (3 dc, ch 1, 3 dc). Measure point-to-point — it should be about 3.5 inches.",
      "Border (Color C): Join in any corner chain-1 space. Chain 1, sc in the same space and in every stitch around. Work 3 sc in each corner space so edges stay flat. Join.",
      "Final edge round: Work reverse sc (crab stitch) in each sc around for a tidy, non-fraying edge. Fasten off and weave in ends with the tapestry needle.",
      "Coaster 2: Repeat all rounds but rotate colors — Color B for body, Color C for center, Color A for border.",
      "Coasters 3–6: Keep rotating the three colors so each coaster looks different but the set feels coordinated.",
      "Blocking: Pin each hexagon on a towel with one point at top and one at bottom. Mist with water, let dry flat. This opens the bobbles and keeps coasters from curling under hot mugs.",
      "Gift wrap: Stack all 6 coasters, wrap with twine or ribbon, and they're ready to give.",
    ],
    tip: "Keep bobbles on the back side of the coaster (the side that touches the table) — they grip better and the front stays smooth for display.",
  },
  {
    id: "kit-womens-granny-square-hoodie",
    slug: "womens-granny-square-hoodie",
    title: "Women's Granny Square Hoodie Kit",
    subtitle: "Boho handmade granny square pullover — relaxed size small fit",
    category: "Wearable Pattern Kit",
    skillLevel: "intermediate",
    durationMinutes: 2400,
    finishedSize:
      'Women\'s size small — bust 38–40", length 22–24", sleeves 22–23" (approx. 2–4" positive ease)',
    illustrationUrl: learnImage.grannySquareHoodie,
    href: "/learn/womens-granny-square-hoodie",
    progressPercent: 0,
    hookSize: "5.0 mm (H/8) for granny squares; 4.0 mm (G/6) for cuffs and ribbing",
    yarnSummary:
      "2,000–2,400 yards total worsted-weight (#4) in 6 colors — warm cream, dusty rose, terracotta, sage green, muted mustard, soft cocoa brown",
    materials: [
      { item: "Warm cream (joining, border, hood, cuffs, waistband)", amount: "800–1,000 yards / 730–915 m" },
      { item: "Dusty rose", amount: "200–300 yards / 180–275 m" },
      { item: "Terracotta", amount: "200–300 yards / 180–275 m" },
      { item: "Sage green", amount: "200–300 yards / 180–275 m" },
      { item: "Muted mustard", amount: "200–300 yards / 180–275 m" },
      { item: "Soft cocoa brown", amount: "200–300 yards / 180–275 m" },
      { item: "Yarn needle", amount: "1" },
      { item: "Scissors", amount: "1" },
      { item: "Stitch markers", amount: "8–12" },
      { item: "Measuring tape", amount: "1" },
      { item: "Blocking mats and pins", amount: "recommended" },
    ],
    overview: [
      "Designed for women's size small with a relaxed fit — always check your square size before making all the pieces.",
      "Abbreviations: ch = chain, sl st = slip stitch, sc = single crochet, hdc = half double crochet, dc = double crochet, st = stitch, sp = space, rnd = round, sk = skip, rep = repeat.",
      "Use cream as the main joining, border, hood, cuff, and waistband color for a clean, coordinated look.",
      "Construction order: test square → crochet all squares → block → arrange panels → join → sew body → attach sleeves → ribbing → cuffs → hood → neckline → weave ends → block.",
    ],
    steps: [
      "Gather supplies: worsted-weight yarn (size 4), approximately 2,000–2,400 yards total, 5 mm crochet hook, 4 mm hook for cuffs and ribbing, yarn needle, scissors, stitch markers, measuring tape, and blocking mats. Suggested colors: warm cream, dusty rose, terracotta, sage green, muted mustard, and soft cocoa brown.",
      "Step 1 — Make a test granny square: Before making the hoodie, crochet one complete square. The finished blocked square should measure approximately 5 inches × 5 inches. If the square is too small, use a larger hook; if too large, use a smaller hook. Do not begin the full hoodie until your blocked square is close to 5 inches.",
      "Step 2 — Round 1 (center color): Make a magic ring. Chain 3 (counts as first dc). Work 2 dc into the ring, ch 2, then work 3 dc into the ring, ch 2. Repeat until you have four groups of 3 dc. Ch 2 and sl st into the top of the beginning ch 3. Fasten off. You should have four clusters and four corner spaces.",
      "Step 2 — Round 2: Join the next color in any corner space. Ch 3, work 2 dc in the same corner, ch 2, work 3 dc in the same corner, ch 1. In the next corner, work 3 dc, ch 2, 3 dc, ch 1. Repeat around, sl st to close, and fasten off.",
      "Step 2 — Rounds 3 & 4: Join the next color in a corner. Work 3 dc, ch 2, 3 dc in every corner. Work 3 dc into every ch-1 space along the sides, ch 1 between each cluster. Join and fasten off. Repeat Round 3 using another accent color for Round 4.",
      "Step 2 — Final border round: Join cream yarn. Work a standard granny-square round — 3 dc, ch 2, 3 dc in every corner and 3 dc in each side space. Fasten off. Block the square to exactly 5 inches.",
      "Step 3 — Make the granny squares: Crochet approximately 64 squares total. Breakdown: front body 16 squares, back body 20 squares, left sleeve 12 squares, right sleeve 12 squares, plus 4 extra for fit adjustments or hood details. Use a mixture of the six colors so the hoodie feels coordinated — spread colors evenly and avoid clustering too many dark squares together.",
      "Step 4 — Arrange the back panel: Lay out back squares in a rectangle — 4 squares across × 5 squares down. This creates a panel approximately 20 inches wide × 25 inches long before ribbing. Move squares until colors look balanced, then take a photo of the layout before joining.",
      "Step 5 — Arrange the front panel: For the pullover hoodie shown, create one front panel — 4 squares across × 4 squares down. Leave room at the top center for the neckline. The front should be slightly shorter than the back before adding the waistband. For a deeper neckline, remove upper center squares or shape the neckline with cream crochet rows.",
      "Step 6 — Join the squares: Use cream yarn. The easiest visible method is a single-crochet join. Place two squares with wrong sides together, insert hook through matching edge stitches of both squares, sc through both layers evenly across the edge, and fasten off. Join squares into rows first, then join completed rows together. Keep all joins facing the same direction.",
      "Step 7 — Make the sleeves: Each sleeve uses approximately 12 squares in a 3 × 4 layout. Join squares into a large rectangle, wrap around your arm to check width, then join the long edges to form a tube. Leave the upper edge open for attaching to the body. The sleeve should fit loosely — the cuff will pull the wrist area inward.",
      "Step 8 — Join the front and back: Place front and back panels with right sides facing. Shoulders: join shoulder edges but leave the center open for the head and neckline — try the body on before continuing. Side seams: begin at the bottom edge, join upward, and stop where the armhole should begin. Repeat on the opposite side. Make sure both armholes are the same size.",
      "Step 9 — Attach the sleeves: Turn the body inside out, keep the sleeve right side out, and slide the sleeve inside the armhole. Match the sleeve seam with the body's side seam. Pin or mark the sleeve evenly around the armhole. Join using sc or mattress stitch. Repeat for the second sleeve. Check that both sleeves point downward naturally before fastening off.",
      "Step 10 — Add the bottom ribbing: Use cream yarn and the 4 mm hook. Join yarn at the bottom edge and sc evenly around the entire bottom, joining the round. Ch 10–12, sc in the 2nd ch from hook and across, sl st into the next two stitches along the hoodie's bottom edge, turn, skip the sl sts, work sc through the back loop only across the ribbing row, ch 1 and turn. Continue around the entire bottom edge and join the first and last ribbing rows. The ribbing should gently pull the lower edge inward.",
      "Step 11 — Add the sleeve cuffs: Use cream yarn and the 4 mm hook. Sc evenly around each wrist opening, decreasing stitches when the opening is too wide. Create ribbing using the same method as the waistband. Make each cuff approximately 3–4 inches long. Count the cuff rows so both cuffs match.",
      "Step 12 — Make the hood: Use cream yarn. Join yarn at the front neckline and hdc evenly around the neckline without closing the front opening. Ch 1 and turn, continuing rows back and forth. Increase slightly near the back center during the first few rows when more room is needed. Continue until the hood measures approximately 13–14 inches tall. Fold the hood in half and join the upper back seam. Try the hood on before sewing the top closed — it should cover the head without pulling the neckline backward.",
      "Step 13 — Finish the neckline: Work one or two rows of sc around the hood and neckline opening. For a drawstring channel: work one row of dc around the hood opening, alternate ch 1 and sk 1 st to create small openings, then work one final row of sc. Make a long crochet chain or twisted cord, thread it through the openings, and add yarn tassels or pom-poms to the ends.",
      "Step 14 — Weave in all ends: Using a yarn needle, weave each yarn tail through several stitches, change direction, weave through additional stitches, then trim. Do not simply cut yarn close to the knot — granny-square projects contain many ends, so weave them in securely.",
      "Step 15 — Block the finished hoodie: Soak or lightly spray according to yarn instructions, gently remove excess water, lay flat, and shape the body, sleeves, hood, cuffs, and hem. Make sure both sides are even and allow to dry completely. Do not hang the wet hoodie — the weight may stretch it.",
      "Final fit check: The neckline fits comfortably, both sleeves are equal, cuffs fit without feeling tight, the hood has enough depth, side seams are even, the hem sits comfortably at the hips, square joins are secure, and all yarn ends are hidden.",
    ],
    tip: "Block every square before joining, arrange all squares before sewing, and take a photo of every final layout. Try the hoodie on during construction and add or remove rows when the fit needs adjusting.",
  },
];

export function getPatternKit(slug: string): PatternKit | undefined {
  return PATTERN_KITS.find((kit) => kit.slug === slug || kit.id === slug);
}
