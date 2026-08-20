/**
 * WHAT'S IN IT? — page content.
 *
 * Lifted from the 10X content brief (Science page, topics 1–10): the seven
 * actives, the synergy map, the zero-sugar rationale, the dosing science and
 * the safety certifications. Layout lives in page.tsx.
 */

export type Reference = {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  locator?: string;
  href?: string;
};

export const REFERENCES: Reference[] = [
  // Taurine
  { id: 'ripps-2012', authors: 'Ripps, H. & Shen, W.', year: '2012', title: "Review: Taurine — a 'very essential' amino acid", source: 'Molecular Vision', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3501277/' },
  { id: 'olive-2002', authors: 'Olive, M.F.', year: '2002', title: 'Interactions between taurine and ethanol in the central nervous system', source: 'Amino Acids', locator: 'DOI: 10.1007/s007260200017' },
  { id: 'elidrissi-1999', authors: 'El Idrissi, A. & Trenkner, E.', year: '1999', title: 'Growth factors and taurine protect against excitotoxicity by stabilizing calcium homeostasis and energy metabolism', source: 'Journal of Neuroscience', href: 'https://www.jneurosci.org/content/19/21/9459' },
  // ALCAR
  { id: 'montgomery-2003', authors: 'Montgomery, S.A. et al.', year: '2003', title: 'Meta-analysis of double blind randomized controlled clinical trials of acetyl-L-carnitine versus placebo in mild cognitive impairment and mild Alzheimer’s disease', source: 'International Clinical Psychopharmacology', locator: 'PMID: 12545235' },
  { id: 'ando-2001', authors: 'Ando, S. et al.', year: '2001', title: 'Enhancement of learning capacity and cholinergic synaptic function by carnitine in aging rats', source: 'Journal of Neuroscience Research', locator: 'DOI: 10.1002/jnr.1107' },
  { id: 'pennisi-2020', authors: 'Pennisi, M. et al.', year: '2020', title: 'Acetyl-L-carnitine in dementia and other cognitive disorders', source: 'Nutrients', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7352347/' },
  // L-Tyrosine
  { id: 'deijen-1994', authors: 'Deijen, J.B. & Orlebeke, J.F.', year: '1994', title: 'Effect of tyrosine on cognitive function and blood pressure under stress', source: 'Brain Research Bulletin', locator: 'DOI: 10.1016/0361-9230(94)90065-5' },
  { id: 'shurtleff-1994', authors: 'Shurtleff, D. et al.', year: '1994', title: 'Tyrosine reverses a cold stress-induced working memory deficit in humans', source: 'Pharmacology Biochemistry and Behavior', locator: 'DOI: 10.1016/0091-3057(94)90268-2' },
  { id: 'neri-1995', authors: 'Neri, D.F. et al.', year: '1995', title: 'The effects of tyrosine on cognitive performance during extended wakefulness', source: 'Aviation, Space, and Environmental Medicine', locator: 'PMID: 7794222' },
  // Caffeine
  { id: 'nehlig-1992', authors: 'Nehlig, A. et al.', year: '1992', title: 'Caffeine and the central nervous system: mechanisms of action, biochemical, metabolic and psychostimulant effects', source: 'Brain Research Reviews', locator: 'DOI: 10.1016/0165-0173(92)90012-B' },
  { id: 'smith-2002', authors: 'Smith, A.', year: '2002', title: 'Effects of caffeine on human behavior', source: 'Food and Chemical Toxicology', locator: 'DOI: 10.1016/S0278-6915(02)00096-0' },
  { id: 'lieberman-2002', authors: 'Lieberman, H.R. et al.', year: '2002', title: 'The effects of low doses of caffeine on human performance and mood', source: 'Psychopharmacology', locator: 'DOI: 10.1007/s00213-002-1035-2' },
  // Green tea
  { id: 'haskell-2008', authors: 'Haskell, C.F. et al.', year: '2008', title: 'The effects of L-theanine, caffeine and their combination on cognition and mood', source: 'Biological Psychology', locator: 'DOI: 10.1016/j.biopsycho.2007.09.008' },
  { id: 'kuriyama-2006', authors: 'Kuriyama, S. et al.', year: '2006', title: 'Green tea consumption and cognitive function: a cross-sectional study from the Tsurugaya Project', source: 'American Journal of Clinical Nutrition', locator: 'DOI: 10.1093/ajcn/83.2.355' },
  { id: 'scholey-2012', authors: 'Scholey, A. et al.', year: '2012', title: 'Acute neurocognitive effects of epigallocatechin gallate (EGCG)', source: 'Appetite', locator: 'DOI: 10.1016/j.appet.2011.06.016' },
  // B-complex
  { id: 'kennedy-2016', authors: 'Kennedy, D.O.', year: '2016', title: 'B vitamins and the brain: mechanisms, dose and efficacy — a review', source: 'Nutrients', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4772032/' },
  { id: 'smith-2010', authors: 'Smith, A.D. et al.', year: '2010', title: 'Homocysteine-lowering by B vitamins slows the rate of accelerated brain atrophy in mild cognitive impairment', source: 'PLOS ONE', href: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0012244' },
  { id: 'bourre-2006', authors: 'Bourre, J.M.', year: '2006', title: 'Effects of nutrients (in food) on the structure and function of the nervous system', source: 'Journal of Nutrition, Health and Aging', locator: 'PMID: 17066209' },
  // Electrolytes
  { id: 'adan-2012', authors: 'Adan, A.', year: '2012', title: 'Cognitive performance and dehydration', source: 'Journal of the American College of Nutrition', locator: 'DOI: 10.1080/07315724.2012.10720022' },
  { id: 'ganio-2011', authors: 'Ganio, M.S. et al.', year: '2011', title: 'Mild dehydration impairs cognitive performance and mood of men', source: 'British Journal of Nutrition', locator: 'DOI: 10.1017/S0007114511003373' },
  { id: 'popkin-2010', authors: 'Popkin, B.M. et al.', year: '2010', title: 'Water, hydration and health', source: 'Nutrition Reviews', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2908954/' },
  // Synergy
  { id: 'owen-2008', authors: 'Owen, G.N. et al.', year: '2008', title: 'The combined effects of L-theanine and caffeine on cognitive performance and mood', source: 'Nutritional Neuroscience', locator: 'DOI: 10.1179/147683008X301513' },
  { id: 'parnetti-1992', authors: 'Parnetti, L. et al.', year: '1992', title: 'Pharmacokinetics of acetyl-L-carnitine', source: 'European Journal of Clinical Pharmacology', locator: 'DOI: 10.1007/BF00315586' },
  // Sugar / sweetener
  { id: 'gomez-pinilla-2012', authors: 'Gomez-Pinilla, F.', year: '2012', title: 'Brain foods: the effects of nutrients on brain function', source: 'Nature Reviews Neuroscience', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2805706/' },
  { id: 'aeberli-2011', authors: 'Aeberli, I. et al.', year: '2011', title: 'Low to moderate sugar-sweetened beverage consumption impairs glucose and lipid metabolism and promotes inflammation in healthy young men', source: 'American Journal of Clinical Nutrition', locator: 'DOI: 10.3945/ajcn.111.014001' },
  { id: 'tandel-2011', authors: 'Tandel, K.R.', year: '2011', title: 'Sugar substitutes: health controversy over perceived benefits', source: 'Journal of Pharmacology and Pharmacotherapeutics', href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3198517/' },
  // Dosing / safety
  { id: 'drake-2013', authors: 'Drake, C. et al.', year: '2013', title: 'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed', source: 'Journal of Clinical Sleep Medicine', locator: 'DOI: 10.5664/jcsm.3170' },
  { id: 'efsa-2015', authors: 'EFSA Panel on Dietetic Products', year: '2015', title: 'Scientific opinion on the safety of caffeine', source: 'EFSA Journal', locator: 'DOI: 10.2903/j.efsa.2015.4102' },
  { id: 'iom-2001', authors: 'Institute of Medicine (US)', year: '2001', title: 'Caffeine for the sustainment of mental task performance', source: 'National Academies Press', href: 'https://www.ncbi.nlm.nih.gov/books/NBK223808/' },
];

/* ------------------------------------------------------------------ */
/* The pack, in numbers                                                */
/* ------------------------------------------------------------------ */

export const SPEC = [
  { k: 'Sachet', v: '4.5', unit: 'g' },
  { k: 'Water', v: '200', unit: 'ml' },
  { k: 'Caffeine', v: '80', unit: 'mg' },
  { k: 'Sodium', v: '172', unit: 'mg' },
  { k: 'Sugar', v: '0', unit: 'g' },
  { k: 'Calories', v: '0', unit: 'kcal' },
];

/* ------------------------------------------------------------------ */
/* The seven actives                                                   */
/* ------------------------------------------------------------------ */

export type Active = {
  id: string;
  n: string;
  name: string;
  /** Short form for the index rail. */
  short: string;
  role: string;
  whatItIs: string;
  does: string[];
  dose: { label: string; value: string };
  refIds: string[];
};

export const ACTIVES: Active[] = [
  {
    id: 'taurine',
    n: '01',
    name: 'Taurine',
    short: 'Taurine',
    role: 'Neuroprotection & cellular health',
    whatItIs:
      'A sulfonic amino acid found naturally in the brain, heart and muscles. Unlike other amino acids it is not used to build proteins — it regulates cellular osmosis, calcium signalling and neuroinhibitory activity.',
    does: [
      'Modulates GABA receptors — reduces anxiety, promotes calm focus',
      'Acts as an antioxidant — protects neurons from oxidative stress',
      'Supports cardiovascular efficiency — better blood flow, more oxygen to the brain',
      'Regulates calcium homeostasis in neurons — reduces excitotoxicity',
    ],
    dose: { label: 'Clinical range', value: '500mg – 3g / day' },
    refIds: ['ripps-2012', 'olive-2002', 'elidrissi-1999'],
  },
  {
    id: 'alcar',
    n: '02',
    name: 'Acetyl-L-Carnitine',
    short: 'ALCAR',
    role: 'Memory, mental energy & neuroprotection',
    whatItIs:
      'The acetylated form of L-Carnitine. The acetyl group is the point: it lets ALCAR cross the blood–brain barrier, which plain L-Carnitine does not, making it dramatically more useful for cognition.',
    does: [
      'Supplies acetyl groups for acetylcholine synthesis — fuels memory and learning',
      'Enhances mitochondrial fatty acid oxidation in neurons — sustained energy, no stimulant crash',
      'Increases nerve growth factor (NGF) expression — supports long-term brain health',
      'Reduces mental fatigue through efficient cellular ATP production',
    ],
    dose: { label: 'Studied range', value: '500mg – 2g / day' },
    refIds: ['montgomery-2003', 'ando-2001', 'pennisi-2020'],
  },
  {
    id: 'l-tyrosine',
    n: '03',
    name: 'L-Tyrosine',
    short: 'L-Tyrosine',
    role: 'Stress resilience & sustained focus',
    whatItIs:
      'An amino acid and direct precursor to the catecholamines — dopamine, norepinephrine and adrenaline. Under stress your brain burns through these fast. L-Tyrosine replenishes the raw material.',
    does: [
      'Replenishes dopamine and norepinephrine depleted by stress and cognitive effort',
      'Maintains working memory and task-switching under high cognitive load',
      'Counteracts the performance degradation caused by sleep deprivation',
      'Supports thyroid hormone production — stable metabolic energy',
    ],
    dose: { label: 'Effective range', value: '100mg – 300mg' },
    refIds: ['deijen-1994', 'shurtleff-1994', 'neri-1995'],
  },
  {
    id: 'caffeine',
    n: '04',
    name: 'Caffeine',
    short: 'Caffeine 80mg',
    role: 'Alertness, reaction time & metabolic activation',
    whatItIs:
      'A methylxanthine alkaloid that blocks adenosine receptors. Adenosine is a byproduct of neural activity that accumulates through the day and progressively increases your sense of fatigue. Block it, and alertness returns.',
    does: [
      '80mg per sachet — roughly one cup of coffee, the cognitive sweet spot',
      'Not a standalone stimulant — it works with L-Tyrosine, ALCAR and Taurine',
      'Partly green-tea sourced — naturally paired with EGCG for a smoother curve',
      'Research puts peak cognitive effect at 40–80mg; past 200mg you buy cortisol, not output',
    ],
    dose: { label: 'Per sachet', value: '80mg' },
    refIds: ['nehlig-1992', 'smith-2002', 'lieberman-2002'],
  },
  {
    id: 'green-tea',
    n: '05',
    name: 'Green Tea Extract',
    short: 'Green Tea',
    role: 'Alpha-wave focus & antioxidant neuroprotection',
    whatItIs:
      'Carries two bioactives that matter here: EGCG, the most potent catechin antioxidant found in nature, and naturally occurring L-Theanine, the amino acid behind alpha brain-wave states.',
    does: [
      'EGCG crosses the blood–brain barrier and protects neurons from oxidative damage',
      'L-Theanine + caffeine — the most clinically validated focus pairing there is',
      'Promotes alpha brain waves: relaxed alertness, without the meditation',
      'Enhances BDNF — supports neuroplasticity and learning',
    ],
    dose: { label: 'Contributes to', value: 'the 80mg caffeine figure' },
    refIds: ['haskell-2008', 'kuriyama-2006', 'scholey-2012'],
  },
  {
    id: 'b-complex',
    n: '06',
    name: 'B-Complex',
    short: 'B-Complex',
    role: 'Neurotransmitter synthesis, energy metabolism, myelin',
    whatItIs:
      'B vitamins are not energy themselves — they are the co-enzymes that make energy reactions possible. Without them mitochondria cannot produce ATP efficiently, neurons cannot fire cleanly, and neurotransmitters cannot be synthesised.',
    does: [
      'B1 (thiamine): converts glucose into usable brain energy',
      'B2 (riboflavin): critical to the electron transport chain',
      'B6 (pyridoxine): cofactor for serotonin, dopamine and GABA synthesis',
      'B9 (folate): DNA synthesis and methylation; low folate raises homocysteine',
      'B12 (cobalamin): myelin sheath synthesis — nerve insulation',
    ],
    dose: { label: 'Blend', value: 'B1 · B2 · B6 · B9 · B12' },
    refIds: ['kennedy-2016', 'smith-2010', 'bourre-2006'],
  },
  {
    id: 'electrolytes',
    n: '07',
    name: 'Electrolytes',
    short: 'Electrolytes',
    role: 'Neural signalling, hydration & cognitive voltage',
    whatItIs:
      'Minerals that carry electrical charge. Every thought is an electrical signal, and every signal needs a precise electrochemical gradient held by sodium outside the cell and potassium inside it.',
    does: [
      'Sodium and potassium create the voltage differential neurons fire across',
      'Maintain cellular fluid balance — critical in hot, demanding Indian conditions',
      'Sodium at 172mg per sachet replenishes sweat loss and supports neural conduction',
      'Potassium prevents neural hyperexcitability — the overworked-brain jitteriness',
    ],
    dose: { label: 'Sodium', value: '172mg / sachet' },
    refIds: ['adan-2012', 'ganio-2011', 'popkin-2010'],
  },
];

/* ------------------------------------------------------------------ */
/* The synergy map                                                     */
/* ------------------------------------------------------------------ */

export const SYNERGY: { combination: string; effect: string }[] = [
  { combination: 'Caffeine + L-Theanine (via green tea)', effect: 'Calm, jitter-free alertness' },
  { combination: 'Caffeine + L-Tyrosine', effect: 'Sustained focus without dopamine depletion' },
  { combination: 'ALCAR + B-Complex', effect: 'Mitochondrial ATP production for brain energy' },
  { combination: 'Taurine + ALCAR', effect: 'Neuroprotection with mitochondrial efficiency' },
  { combination: 'B6 + L-Tyrosine', effect: 'Enhanced dopamine synthesis' },
  { combination: 'Electrolytes + all actives', effect: 'Optimal neural conduction, so the rest can work' },
];

export const SYNERGY_REFS = ['haskell-2008', 'owen-2008', 'parnetti-1992'];

/* ------------------------------------------------------------------ */
/* What we left out                                                    */
/* ------------------------------------------------------------------ */

export const SUGAR_COST = [
  'Blood glucose spike → insulin surge → reactive hypoglycaemia → the crash',
  'Advanced glycation end-products damage blood–brain barrier integrity',
  'Fructose specifically suppresses BDNF — your brain’s growth hormone',
];

export const SWEETENER = [
  'Sucralose: FDA-approved, FSSAI-compliant, non-nutritive',
  'Does not raise blood glucose or insulin levels',
  'No negative cognitive effects at dietary doses',
];

export const LEFT_OUT_REFS = ['gomez-pinilla-2012', 'aeberli-2011', 'tandel-2011'];

/* ------------------------------------------------------------------ */
/* How to use it                                                       */
/* ------------------------------------------------------------------ */

export const DOSING = [
  {
    n: '01',
    title: 'Morning, 9–10 AM',
    body: 'Adenosine is at its daily low, so caffeine is at its most effective. Cortisol peaks around 8–9 AM — taking the sachet just after works with that rhythm rather than against it, and L-Tyrosine does more while dopamine is still intact.',
  },
  {
    n: '02',
    title: 'Twice, on demanding days',
    body: 'Caffeine’s half-life is roughly 5–6 hours, so an early sachet is largely metabolised by mid-afternoon and the L-Tyrosine and ALCAR taper with it. Two sachets is 160mg of caffeine total — well inside the 400mg/day limit set by EFSA and the FDA.',
  },
  {
    n: '03',
    title: 'Not within 6 hours of sleep',
    body: 'Caffeine blocks adenosine, which is the molecule you need in order to feel sleepy. Taken within six hours of bed it measurably reduces total sleep time and REM quality — the fastest way to manufacture tomorrow’s brain fog.',
  },
];

export const DOSING_REFS = ['drake-2013', 'efsa-2015', 'iom-2001'];

export const CERTIFICATIONS = [
  { k: 'FSSAI licence', v: '13624999000622' },
  { k: 'Manufacturing', v: 'GMP conditions, Tenex Formulas Pvt. Ltd., Hyderabad' },
  { k: 'Ingredient status', v: 'All GRAS per FDA standards' },
  { k: 'Classification', v: 'Nutraceutical — not a drug, not a replacement for medical treatment' },
];

/* ------------------------------------------------------------------ */
/* FAQ — one entry per topic in the brief                              */
/* ------------------------------------------------------------------ */

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is taurine safe for daily use?',
    a: 'Yes. The WHO and EFSA have both reviewed taurine at doses up to 3g/day as safe for healthy adults. It is an FSSAI-compliant ingredient.',
  },
  {
    q: 'What makes ALCAR different from regular L-Carnitine?',
    a: 'The acetyl group. It crosses the blood–brain barrier; regular L-Carnitine does not. That is the entire reason 10X uses ALCAR specifically.',
  },
  {
    q: 'Will L-Tyrosine make me feel wired?',
    a: 'No. It adds no stimulant energy. It maintains the quality of your focus by keeping neurotransmitter levels from dropping off a cliff during demanding work.',
  },
  {
    q: 'Is 80mg of caffeine enough to feel the effect?',
    a: 'Clinically, yes. Studies put peak cognitive effect at 40–80mg. Higher doses add anxiety, not output.',
  },
  {
    q: 'Does green tea extract contain caffeine?',
    a: 'Yes, partially — the 80mg figure includes the caffeine from green tea extract. The EGCG and L-Theanine that come with it are what make the caffeine in 10X work so cleanly.',
  },
  {
    q: 'I already eat well — do I need extra B vitamins?',
    a: 'India’s NNMB surveys show B12 deficiency in over 70% of urban vegetarians, and B6 insufficiency is widespread because common cooking methods destroy water-soluble vitamins. A targeted daily dose matters.',
  },
  {
    q: 'Isn’t 172mg of sodium too much?',
    a: 'No. Recommended adequate intake for adults is 1,500mg/day. 172mg per sachet is targeted electrolyte replenishment, not a high-sodium concern.',
  },
  {
    q: 'Why not just take each ingredient separately?',
    a: 'You could — roughly ₹3,000 a month across seven supplements, plus working out each dose and mixing them yourself. Or one 4.5g sachet in 200ml of water. The ratio matters as much as the ingredients.',
  },
  {
    q: 'Is sucralose safe? I’ve heard artificial sweeteners are bad.',
    a: 'The concern is dose-dependent. At the single-sachet dose (4.5g total product) sucralose sits well inside FSSAI, FDA and EFSA thresholds. It buys the palatability of a clean drink without the cognitive penalty of sugar.',
  },
  {
    q: 'Can I take two sachets every day?',
    a: '10X is designed for daily use at one sachet. Two on demanding days is fine — 160mg total caffeine is within safe limits. We do not recommend exceeding two in 24 hours, or any sachet within 6 hours of sleep.',
  },
];
