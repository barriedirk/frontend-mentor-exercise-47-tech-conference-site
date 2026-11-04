import { Talk } from '../types.ts';

export const SCHEDULE_DATA: Talk[] = [
  // DAY 01 (matches the screenshots)
  {
    id: 'talk-1',
    day: 1,
    track: 'KEYNOTE',
    trackLabel: 'KEYNOTE',
    trackColor: {
      bg: '#9fe4fa', // Soft Sky Cyan
      text: '#06151a',
      subtext: '#0d323c',
    },
    title: 'the next frontier of web development',
    speaker: 'ELENA VASQUEZ',
    company: 'BYTECRAFT',
    description:
      "The opening keynote. Elena takes the audience on a tour of the web platform's most transformative recent additions — from WebGPU to View Transitions to baseline support for container queries. She live-demos a full-stack application running entirely in the browser and makes the case that the gap between native and web has never been smaller.",
    location: 'ROOM A',
    timeStart: '9:00',
    timeEnd: '10:00',
    isKeynote: true,
  },
  {
    id: 'talk-2',
    day: 1,
    track: 'PERFORMANCE',
    trackLabel: 'PERFORMANCE',
    trackColor: {
      bg: '#fbbdb7', // Soft Coral Salmon
      text: '#06151a',
      subtext: '#3c1815',
    },
    title: 'profiling react renders at 120fps',
    speaker: "RYAN O'SULLIVAN",
    company: 'COBALT',
    description:
      'Learn advanced profiling techniques with React DevTools and Chrome Performance panel. Pinpoint costly re-renders, master memoization strategies, and architect 120fps smooth animations without dropping a single frame.',
    location: 'STAGE 1',
    timeStart: '10:00',
    timeEnd: '11:00',
  },
  {
    id: 'talk-3',
    day: 1,
    track: 'PERFORMANCE',
    trackLabel: 'PERFORMANCE',
    trackColor: {
      bg: '#fbbdb7', // Soft Coral Salmon
      text: '#06151a',
      subtext: '#3c1815',
    },
    title: 'video compression for the web: the middle-out approach',
    speaker: 'DINESH CHUGTAI',
    company: 'PIED PIPER',
    description:
      'An algorithmic deep-dive into multi-tier stream compression, reducing bandwidth consumption by 40% while preserving ultra-low latency playback for interactive web video.',
    location: 'AUDITORIUM',
    timeStart: '11:00',
    timeEnd: '12:00',
  },
  {
    id: 'talk-4',
    day: 1,
    track: 'TOOLING',
    trackLabel: 'TOOLING',
    trackColor: {
      bg: '#cabffa', // Soft Lavender Periwinkle
      text: '#06151a',
      subtext: '#22193e',
    },
    title: 'monorepos at scale: lessons from 500 packages',
    speaker: 'JAMES OKONKWO',
    company: 'CARTWELL',
    description:
      'How Cartwell transformed developer experience across 500+ micro-packages with remote caching, atomic releases, and intelligent dependency graphs.',
    location: 'ROOM B',
    timeStart: '12:00',
    timeEnd: '13:00',
  },
  {
    id: 'talk-5',
    day: 1,
    track: 'FRONTEND',
    trackLabel: 'FRONTEND',
    trackColor: {
      bg: '#fbd89a', // Soft Warm Pastel Yellow
      text: '#06151a',
      subtext: '#3d2d0b',
    },
    title: 'css container queries in production',
    speaker: 'MEI-LIN ZHANG',
    company: 'ROAMLY',
    description:
      'Moving past viewport queries. Real-world patterns for building truly modular component design systems that adapt fluidly to any parent container dimension.',
    location: 'STAGE 2',
    timeStart: '12:00',
    timeEnd: '14:00',
  },
  {
    id: 'talk-6',
    day: 1,
    track: 'ACCESSIBILITY',
    trackLabel: 'ACCESSIBILITY',
    trackColor: {
      bg: '#9ec4f8', // Soft Cornflower Blue
      text: '#06151a',
      subtext: '#11223b',
    },
    title: "aria patterns you're probably using wrong",
    speaker: 'PRIYA SHARMA',
    company: 'COBALT',
    description:
      'Common ARIA antipatterns that degrade screen-reader experiences and how to build fully accessible, tested interactive patterns using semantic HTML first.',
    location: 'ROOM A',
    timeStart: '15:00',
    timeEnd: '16:00',
  },
  {
    id: 'talk-7',
    day: 1,
    track: 'TOOLING',
    trackLabel: 'TOOLING',
    trackColor: {
      bg: '#cabffa', // Soft Lavender Periwinkle
      text: '#06151a',
      subtext: '#22193e',
    },
    title: 'ai-powered developer tools: hype vs. reality',
    speaker: 'KWAME ASANTE',
    company: 'TRACKWISE',
    description:
      'A realistic breakdown of agentic workflows, LLM code assistants, and automated testing pipelines in enterprise environments — what works and what falls apart.',
    location: 'MAIN HALL',
    timeStart: '16:00',
    timeEnd: '17:00',
  },

  // DAY 02
  {
    id: 'talk-8',
    day: 2,
    track: 'KEYNOTE',
    trackLabel: 'KEYNOTE',
    trackColor: {
      bg: '#9fe4fa',
      text: '#06151a',
      subtext: '#0d323c',
    },
    title: 'building zero-latency collaborative systems',
    speaker: 'SARA CHEN',
    company: 'HYPERSYNC',
    description:
      'Exploration of CRDTs, optimistic UI updates, and WebSockets at scale. How to keep thousands of concurrent editors synchronized with sub-10ms perceived latency.',
    location: 'ROOM A',
    timeStart: '9:00',
    timeEnd: '10:00',
    isKeynote: true,
  },
  {
    id: 'talk-9',
    day: 2,
    track: 'FRONTEND',
    trackLabel: 'FRONTEND',
    trackColor: {
      bg: '#fbd89a',
      text: '#06151a',
      subtext: '#3d2d0b',
    },
    title: 'subgrid and modern css layout algorithms',
    speaker: 'MARCUS VANCE',
    company: 'LAYERFLOW',
    description:
      'Mastering nested grids, subgrid alignment, intrinsic sizing, and dynamic aspect-ratio mathematics for robust editorial layouts.',
    location: 'STAGE 1',
    timeStart: '10:00',
    timeEnd: '11:00',
  },
  {
    id: 'talk-10',
    day: 2,
    track: 'PERFORMANCE',
    trackLabel: 'PERFORMANCE',
    trackColor: {
      bg: '#fbbdb7',
      text: '#06151a',
      subtext: '#3c1815',
    },
    title: 'optimizing client-side sqlite and wasm',
    speaker: 'ANIKA PATEL',
    company: 'TURBODATABASE',
    description:
      'Running full SQL query engines directly in browser workers using WebAssembly and OPFS (Origin Private File System) for instant local-first data access.',
    location: 'AUDITORIUM',
    timeStart: '11:00',
    timeEnd: '12:00',
  },
  {
    id: 'talk-11',
    day: 2,
    track: 'TOOLING',
    trackLabel: 'TOOLING',
    trackColor: {
      bg: '#cabffa',
      text: '#06151a',
      subtext: '#22193e',
    },
    title: 'rust in the frontend toolchain: five years later',
    speaker: 'FELIX BERG',
    company: 'VORTEX',
    description:
      'A candid post-mortem on migrating bundlers, minifiers, and linters to native Rust. What worked, what failed, and the true cost of compilation speed.',
    location: 'ROOM B',
    timeStart: '13:00',
    timeEnd: '14:00',
  },
  {
    id: 'talk-12',
    day: 2,
    track: 'ACCESSIBILITY',
    trackLabel: 'ACCESSIBILITY',
    trackColor: {
      bg: '#9ec4f8',
      text: '#06151a',
      subtext: '#11223b',
    },
    title: 'focus management in complex multi-window web apps',
    speaker: 'TARIQ MANSOOR',
    company: 'ACCESSIBILITY LABS',
    description:
      'Deep dive into roving tabindexes, focus trap techniques, modal portal ordering, and screen reader announcements for modern browser software.',
    location: 'ROOM A',
    timeStart: '15:00',
    timeEnd: '16:00',
  },

  // DAY 03
  {
    id: 'talk-13',
    day: 3,
    track: 'KEYNOTE',
    trackLabel: 'KEYNOTE',
    trackColor: {
      bg: '#9fe4fa',
      text: '#06151a',
      subtext: '#0d323c',
    },
    title: 'the next decade of client-side architecture',
    speaker: 'ALEXIS MOREAU',
    company: 'SYSTEMIC',
    description:
      'Where does the browser runtime go from here? Sandboxed isolated origins, WebGPU shader compute, local AI pipelines, and the evolution of reactive primitives.',
    location: 'ROOM A',
    timeStart: '9:00',
    timeEnd: '10:00',
    isKeynote: true,
  },
  {
    id: 'talk-14',
    day: 3,
    track: 'FRONTEND',
    trackLabel: 'FRONTEND',
    trackColor: {
      bg: '#fbd89a',
      text: '#06151a',
      subtext: '#3d2d0b',
    },
    title: 'micro-frontends that actually work: module federation 2.0',
    speaker: 'CHLOE NGUYEN',
    company: 'ENTERPRISE LABS',
    description:
      'How large distributed organizations deploy decoupled micro-apps without duplicated shared dependencies or CSS namespace collisions.',
    location: 'STAGE 2',
    timeStart: '10:00',
    timeEnd: '11:00',
  },
  {
    id: 'talk-15',
    day: 3,
    track: 'PERFORMANCE',
    trackLabel: 'PERFORMANCE',
    trackColor: {
      bg: '#fbbdb7',
      text: '#06151a',
      subtext: '#3c1815',
    },
    title: 'measuring interaction to next paint (inp) in the wild',
    speaker: 'ZACHARY TANG',
    company: 'VELOCITY CORP',
    description:
      'Real-user monitoring (RUM) strategies for measuring and diagnosing real input delay, processing time, and presentation delay across millions of devices.',
    location: 'AUDITORIUM',
    timeStart: '13:00',
    timeEnd: '14:00',
  },
  {
    id: 'talk-16',
    day: 3,
    track: 'TOOLING',
    trackLabel: 'TOOLING',
    trackColor: {
      bg: '#cabffa',
      text: '#06151a',
      subtext: '#22193e',
    },
    title: 'typesafe fullstack boundaries without code generation',
    speaker: 'DEVON REID',
    company: 'PRISMA TECH',
    description:
      'Achieving end-to-end type safety between client components and edge API handlers with zero build-time boilerplate or out-of-sync schemas.',
    location: 'MAIN HALL',
    timeStart: '15:00',
    timeEnd: '16:00',
  },
];
