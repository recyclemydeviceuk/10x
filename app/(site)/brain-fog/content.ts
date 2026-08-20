/**
 * BRAIN FOG — page content.
 *
 * Lifted from the 10X content brief (Brain Fog page, topics 1–10). Kept out of
 * page.tsx so the layout file stays readable; every claim here has a citation
 * attached to it in `refs`, and every `refId` must exist in REFERENCES below.
 */

export type Reference = {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  /** DOI/PMID/ISBN shown as plain text when there's no open link. */
  locator?: string;
  href?: string;
};

/** Every study cited on this page, in the order they are first referenced. */
export const REFERENCES: Reference[] = [
  {
    id: 'theoharides-2015',
    authors: 'Theoharides, T.C. et al.',
    year: '2015',
    title: 'Brain fog, inflammation and obesity: key aspects of neuropsychiatric disorders improved by luteolin',
    source: 'Frontiers in Neuroscience',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4609958/',
  },
  {
    id: 'mikkelsen-2017',
    authors: 'Mikkelsen, K. et al.',
    year: '2017',
    title: 'The effects of vitamin B in depression',
    source: 'Current Medicinal Chemistry',
    locator: 'DOI: 10.2174/0929867323666160920122339',
  },
  {
    id: 'spencer-2017',
    authors: 'Spencer, S.J. et al.',
    year: '2017',
    title: 'Food for thought: how nutrition impacts cognition and emotion',
    source: 'npj Science of Food',
    href: 'https://www.nature.com/articles/s41538-017-0008-y',
  },
  {
    id: 'fasano-2012',
    authors: 'Fasano, A.',
    year: '2012',
    title: 'Leaky gut and autoimmune diseases',
    source: 'Clinical Reviews in Allergy & Immunology',
    locator: 'DOI: 10.1007/s12016-011-8291-x',
  },
  {
    id: 'gomez-pinilla-2008',
    authors: 'Gomez-Pinilla, F.',
    year: '2008',
    title: 'Brain foods: the effects of nutrients on brain function',
    source: 'Nature Reviews Neuroscience',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2805706/',
  },
  {
    id: 'harrison-2000',
    authors: 'Harrison, Y. & Horne, J.A.',
    year: '2000',
    title: 'The impact of sleep deprivation on decision making: a review',
    source: 'Journal of Experimental Psychology: Applied',
    locator: 'DOI: 10.1037/1076-898X.6.3.236',
  },
  {
    id: 'lim-dinges-2010',
    authors: 'Lim, J. & Dinges, D.F.',
    year: '2010',
    title: 'A meta-analysis of the impact of short-term sleep deprivation on cognitive variables',
    source: 'Psychological Bulletin',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2862072/',
  },
  {
    id: 'walker-2017',
    authors: 'Walker, M.P.',
    year: '2017',
    title: 'Why We Sleep',
    source: 'Penguin Press',
  },
  {
    id: 'kennedy-2016',
    authors: 'Kennedy, D.O.',
    year: '2016',
    title: 'B vitamins and the brain: mechanisms, dose and efficacy — a review',
    source: 'Nutrients',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4772032/',
  },
  {
    id: 'smith-2010',
    authors: 'Smith, A.D. et al.',
    year: '2010',
    title: 'Homocysteine-lowering by B vitamins slows the rate of accelerated brain atrophy in mild cognitive impairment',
    source: 'PLOS ONE',
    href: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0012244',
  },
  {
    id: 'selhub-2002',
    authors: 'Selhub, J.',
    year: '2002',
    title: 'Folate, vitamin B12 and vitamin B6 and one carbon metabolism',
    source: 'Journal of Nutrition, Health and Aging',
    locator: 'PMID: 12166527',
  },
  {
    id: 'haskell-2008',
    authors: 'Haskell, C.F. et al.',
    year: '2008',
    title: 'The effects of L-theanine, caffeine and their combination on cognition and mood',
    source: 'Biological Psychology',
    locator: 'DOI: 10.1016/j.biopsycho.2007.09.008',
  },
  {
    id: 'deijen-1994',
    authors: 'Deijen, J.B. & Orlebeke, J.F.',
    year: '1994',
    title: 'Effect of tyrosine on cognitive function and blood pressure under stress',
    source: 'Brain Research Bulletin',
    locator: 'DOI: 10.1016/0361-9230(94)90065-5',
  },
  {
    id: 'parnetti-1992',
    authors: 'Parnetti, L. et al.',
    year: '1992',
    title: 'Pharmacokinetics of IV and oral acetyl-L-carnitine in a multiple dose regimen',
    source: 'European Journal of Clinical Pharmacology',
    locator: 'DOI: 10.1007/BF00315586',
  },
  {
    id: 'sapolsky-2000',
    authors: 'Sapolsky, R.M.',
    year: '2000',
    title: 'Glucocorticoids and hippocampal atrophy in neuropsychiatric disorders',
    source: 'Archives of General Psychiatry',
    locator: 'DOI: 10.1001/archpsyc.57.10.925',
  },
  {
    id: 'arnsten-2009',
    authors: 'Arnsten, A.F.T.',
    year: '2009',
    title: 'Stress signalling pathways that impair prefrontal cortex structure and function',
    source: 'Nature Reviews Neuroscience',
    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2728098/',
  },
  {
    id: 'shurtleff-1994',
    authors: 'Shurtleff, D. et al.',
    year: '1994',
    title: 'Tyrosine reverses a cold stress-induced working memory deficit in humans',
    source: 'Pharmacology Biochemistry and Behavior',
    locator: 'DOI: 10.1016/0091-3057(94)90268-2',
  },
  {
    id: 'ganio-2011',
    authors: 'Ganio, M.S. et al.',
    year: '2011',
    title: 'Mild dehydration impairs cognitive performance and mood of men',
    source: 'British Journal of Nutrition',
    locator: 'DOI: 10.1017/S0007114511003373',
  },
  {
    id: 'masento-2014',
    authors: 'Masento, N.A. et al.',
    year: '2014',
    title: 'Effects of hydration status on cognitive performance and mood',
    source: 'British Journal of Nutrition',
    locator: 'DOI: 10.1017/S0007114513004455',
  },
  {
    id: 'adan-2012',
    authors: 'Adan, A.',
    year: '2012',
    title: 'Cognitive performance and dehydration',
    source: 'Journal of the American College of Nutrition',
    locator: 'DOI: 10.1080/07315724.2012.10720022',
  },
  {
    id: 'cryan-2019',
    authors: 'Cryan, J.F. et al.',
    year: '2019',
    title: 'The microbiota-gut-brain axis',
    source: 'Physiological Reviews',
    href: 'https://journals.physiology.org/doi/10.1152/physrev.00018.2018',
  },
  {
    id: 'mayer-2011',
    authors: 'Mayer, E.A.',
    year: '2011',
    title: 'Gut feelings: the emerging biology of gut–brain communication',
    source: 'Nature Reviews Neuroscience',
    locator: 'DOI: 10.1038/nrn3071',
  },
  {
    id: 'forsythe-2010',
    authors: 'Forsythe, P. & Bienenstock, J.',
    year: '2010',
    title: 'Immunomodulation by commensal and probiotic bacteria',
    source: 'Immunological Investigations',
    locator: 'DOI: 10.3109/08820130903623660',
  },
  {
    id: 'monk-2005',
    authors: 'Monk, T.H.',
    year: '2005',
    title: 'The post-lunch dip in performance',
    source: 'Clinics in Sports Medicine',
    locator: 'DOI: 10.1016/j.csm.2004.12.002',
  },
  {
    id: 'benton-2003',
    authors: 'Benton, D. & Nabb, S.',
    year: '2003',
    title: 'Carbohydrate, memory, and mood',
    source: 'Nutrition Reviews',
    locator: 'DOI: 10.1301/nr.2003.jun.S61-S67',
  },
  {
    id: 'lahl-2008',
    authors: 'Lahl, O. et al.',
    year: '2008',
    title: 'An ultra short episode of sleep is sufficient to promote declarative memory performance',
    source: 'Journal of Sleep Research',
    locator: 'DOI: 10.1111/j.1365-2869.2007.00622.x',
  },
  {
    id: 'figueiro-2010',
    authors: 'Figueiro, M.G. & Rea, M.S.',
    year: '2010',
    title: 'Circadian rhythm entrainment by short-wavelength light',
    source: 'Chronobiology International',
  },
  {
    id: 'perlis',
    authors: 'Perlis, M. et al.',
    year: '—',
    title: 'Ultradian rhythms and the timing of cognitive work',
    source: 'Journal of Sleep Research',
  },
  {
    id: 'nehlig-1992',
    authors: 'Nehlig, A. et al.',
    year: '1992',
    title: 'Caffeine and the central nervous system: mechanisms of action, biochemical, metabolic and psychostimulant effects',
    source: 'Brain Research Reviews',
    locator: 'DOI: 10.1016/0165-0173(92)90012-B',
  },
];

/* ------------------------------------------------------------------ */
/* 1 — What brain fog is, against what it is usually mistaken for      */
/* ------------------------------------------------------------------ */

export const DEFINITION = {
  isNot: [
    'A character flaw, or a discipline problem',
    'Ordinary tiredness that a nap resolves',
    'Something you can push through by trying harder',
  ],
  is: [
    'Impaired neurotransmitter signalling — the chemistry of focus running thin',
    'Inflammatory cytokines interfering with how neurons talk to each other',
    'A measurable drop in working memory, recall and task-switching',
  ],
};

export const FATIGUE_VS_FOG = [
  {
    label: 'Mental fatigue',
    body: 'Effort-driven and self-correcting. It arrives after sustained work, it is proportional to what you spent, and rest clears it.',
  },
  {
    label: 'Brain fog',
    body: 'Input-driven and persistent. It is there at 10am with a full night behind you, and no amount of rest resolves it, because rest was never the missing input.',
  },
];

/* ------------------------------------------------------------------ */
/* 2 — Enemy identification: seven causes                              */
/* ------------------------------------------------------------------ */

export type Cause = {
  n: string;
  title: string;
  hook: string;
  body: string;
  mechanism: string[];
  refIds: string[];
};

export const CAUSES: Cause[] = [
  {
    n: '01',
    title: 'Inflammation',
    hook: 'Every sugar spike is a tax on your thinking.',
    body: 'Ultra-processed food, repeated glucose spikes and gut dysfunction raise inflammatory signalling. Those signals do not stay in the gut — they reach the brain and degrade the quality of thought.',
    mechanism: [
      'Neuroinflammation disrupts blood–brain barrier integrity',
      'Cytokines (IL-6, TNF-alpha) interfere with neurotransmission',
      'Processed foods trigger the inflammatory cascade',
    ],
    refIds: ['spencer-2017', 'fasano-2012', 'gomez-pinilla-2008', 'theoharides-2015'],
  },
  {
    n: '02',
    title: 'Sleep debt',
    hook: 'CEOs sleep eight hours. You are pulling five and calling it hustle.',
    body: 'Short sleep has a measurable cost in working memory and decision quality, and it compounds quietly. Caffeine alone does not repay it — it defers the bill.',
    mechanism: [
      'Working memory and decision-making degrade measurably',
      'Adenosine accumulates and produces the "foggy" feeling',
      'Caffeine without amino acids and B-vitamins only delays the crash',
    ],
    refIds: ['harrison-2000', 'lim-dinges-2010', 'walker-2017'],
  },
  {
    n: '03',
    title: 'B-vitamin deficiency',
    hook: 'Your brain is running on an empty tank — and no one told you.',
    body: 'B-vitamin insufficiency is heavily underdiagnosed in India, B12 especially among vegetarians. It is one of the few causes of fog that is both invisible and straightforwardly correctable.',
    mechanism: [
      'B1 (thiamine): energy metabolism in neurons',
      'B6 (pyridoxine): serotonin and dopamine synthesis',
      'B9 (folate): myelin sheath maintenance',
      'B12 (cobalamin): nerve function, memory, mood',
    ],
    refIds: ['kennedy-2016', 'smith-2010', 'selhub-2002', 'mikkelsen-2017'],
  },
  {
    n: '04',
    title: 'Chronic stress',
    hook: 'Chronic stress does not just make you anxious. It rewires the room you think in.',
    body: 'Sustained cortisol remodels the prefrontal cortex — the decision-making and focus hub. Which is why the harder the week, the worse the judgement, exactly when you need it most.',
    mechanism: [
      'Sustained cortisol impairs hippocampal neurogenesis',
      'Prefrontal cortex function drops under load — poor decisions under pressure',
      'L-Tyrosine and Taurine act as natural cortisol modulators',
    ],
    refIds: ['sapolsky-2000', 'arnsten-2009', 'shurtleff-1994'],
  },
  {
    n: '05',
    title: 'Mild dehydration',
    hook: 'You are not unfocused. You are thirsty.',
    body: 'Most urban professionals are mildly dehydrated for most of the working day. The cognitive cost shows up long before you register thirst.',
    mechanism: [
      'Neurons need a precise electrolyte balance to fire',
      'Even mild fluid loss carries a measurable cognitive cost',
      'Plain water is not enough — sodium and potassium do the work',
    ],
    refIds: ['ganio-2011', 'masento-2014', 'adan-2012'],
  },
  {
    n: '06',
    title: 'The gut–brain axis',
    hook: 'Your gut has more neurons than your spinal cord. It has been running your brain without permission.',
    body: 'The enteric nervous system talks to the brain continuously along the vagus nerve. Digestive stress reliably arrives upstairs as mental fog.',
    mechanism: [
      'The enteric nervous system — the "second brain"',
      'Microbiome dysbiosis produces inflammatory signals that reach the brain',
      'The vagus nerve as the gut–brain communication highway',
    ],
    refIds: ['cryan-2019', 'mayer-2011', 'forsythe-2010'],
  },
  {
    n: '07',
    title: 'The post-lunch dip',
    hook: 'The 2pm slump is not your fault. Staying in it is.',
    body: 'A carb-heavy lunch lands on top of a circadian trough. The brain deprioritises focus during digestion, and the afternoon you had planned quietly disappears.',
    mechanism: [
      'The post-prandial dip: circadian biology of the afternoon slump',
      'Blood glucose spike and crash from carb-heavy lunches',
      'The brain deprioritises focus during the digestive phase',
    ],
    refIds: ['monk-2005', 'benton-2003', 'lahl-2008'],
  },
];

/* ------------------------------------------------------------------ */
/* 3 — Coffee alone vs the full stack                                  */
/* ------------------------------------------------------------------ */

export const COFFEE_VS_STACK = {
  coffee: [
    'Blocks adenosine — restores the feeling of alertness',
    'Adrenal spike with no amino acid buffer behind it',
    'Dopamine keeps depleting while you work',
    'The debt comes due in the afternoon',
  ],
  stack: [
    'Caffeine blocks adenosine — same mechanism, same alertness',
    'L-Tyrosine replenishes the dopamine the work is spending',
    'ALCAR supplies mitochondrial energy rather than a stimulant push',
    'L-Theanine from green tea holds it in an alpha-wave calm',
  ],
  refIds: ['haskell-2008', 'deijen-1994', 'parnetti-1992', 'nehlig-1992'],
};

/* ------------------------------------------------------------------ */
/* 4 — Five things before 9am                                          */
/* ------------------------------------------------------------------ */

export type Hack = { n: string; title: string; body: string; refId: string };

export const HACKS: Hack[] = [
  {
    n: '1',
    title: 'Hydrate with electrolytes on waking',
    body: 'You wake mildly dehydrated after seven hours without fluid. Plain water rehydrates slowly; water with sodium and potassium restores the gradient neurons fire across.',
    refId: 'ganio-2011',
  },
  {
    n: '2',
    title: 'Get ten minutes of sunlight',
    body: 'Morning light entrains the circadian clock, which sets the timing of alertness for the whole day. Ten minutes outdoors beats an hour of indoor lighting.',
    refId: 'figueiro-2010',
  },
  {
    n: '3',
    title: 'Skip the high-carb breakfast',
    body: 'A glucose spike at 8am buys a crash at 11am. The glycaemic response of the first meal is measurable in the cognitive performance that follows it.',
    refId: 'benton-2003',
  },
  {
    n: '4',
    title: 'Take your sachet before the first task',
    body: 'Adenosine is at its lowest in the morning, so caffeine is at its most effective — and L-Tyrosine works best while dopamine is still intact.',
    refId: 'haskell-2008',
  },
  {
    n: '5',
    title: 'Do the hardest thing in the first 90 minutes',
    body: 'Attention runs in ultradian cycles of roughly 90 minutes. Spend the first one on the work that actually matters, not on the inbox.',
    refId: 'perlis',
  },
];
