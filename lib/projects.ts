export type Slug = 'toyyo' | 'assistant' | 'ratemyclub' | 'tidepool' | 'naugh' | 'bastion';

// A picture. `alt` is also its caption.
export type Img = { src: string; alt: string; w: number; h: number };

export type Project = {
  slug: Slug;
  name: string;
  // One sentence for search results and link previews.
  summary: string;
  // What the figure in the home scene is, in plain words. Also labels the hero when there is no cover.
  figure: string;
  // Leads the page. Without one, the hero is drawn in characters from `scene`.
  cover?: Img;
  // The story, one titled section at a time, listed in the index beside it. Pictures sit between
  // paragraphs, and a diagram drawn in characters can close a section.
  sections: { title: string; body: (string | Img)[]; diagram?: string }[];
  links: { label: string; href: string }[];
  scene?: 'constellation' | 'contour' | 'ripple' | 'mesh';
};

export const projects: Project[] = [
  {
    slug: 'toyyo',
    name: 'Toyyo',
    summary:
      'Shows a Toyota owner what their car really costs each month and the smartest next move: keep it, buy it out, refinance, repair or replace.',
    figure: 'The car on the road',
    cover: { src: '/work/toyyo/garage.jpg', alt: 'The opening screen: seven Toyotas drift across a black stage as 3D models', w: 1600, h: 1000 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'Owning a car comes with money decisions that are hard to compare: buy out a lease, refinance a loan, pay for a repair or switch cars. The answer depends on payments, insurance, fuel, mileage and driving habits, and that information is scattered across statements and calculators.',
          'Toyota Financial Services brought this problem to HackUTD 2026 with one question: “Given my situation today, what’s the smartest next move for me and my Toyota?” Toyyo is our team’s answer. Its customers and prices are synthetic: it is a prototype, not a Toyota product.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'Toyyo was meant to give an owner one clear next move. It brings the lease or loan, insurance, fuel, driving and repairs into one place, ranks the options (keep, buy out, refinance, repair or replace) and shows the assumptions behind each one.',
          'We held to one rule: code calculates and the AI only explains. Advice about money has to be backed by numbers, not just sound convincing, so a language model never produces the figures.',
        ],
      },
      {
        title: 'My role',
        body: [
          'We were a team of three. I built the 3D opening and the car pages, and the text-message copilot: the iMessage integration, the lease conversation and running the assistant on Grok with tool calls. My teammates built the logo and branding, the repair research, the recommendation system and the repair-planning agent.',
        ],
      },
      {
        title: 'Process',
        body: [
          'We started from an earlier Next.js and TypeScript prototype, Next Move Copilot, and renamed it Toyyo. Plain TypeScript calculators work out lease-end costs, payments, insurance and repairs from synthetic customer data. Each option lists its upfront cost, trade-off and assumptions, and sliders such as miles per month rerun the numbers.',
          { src: '/work/toyyo/finances.jpg', alt: 'The finances page: lease terms, the best next move and a slider to try a different monthly mileage.', w: 1600, h: 1000 },
          'The assistant explains those results in plain language. It uses tool calls, where the model asks the app to run a function and return the result, to fetch the calculated options. Every number in its reply is checked against that data, and when no model can be reached it answers from a fixed template.',
          'Last, I added texting through Photon’s Spectrum, a service that connects an app to an iMessage line. When a lease is on pace to run at least 1,000 miles over, Toyyo texts the owner numbered options: drive less, buy it out, switch to a new lease or return it. Replying with a number sends that option’s steps, and a confirm reply creates a simulated dealer packet.',
        ],
      },
      {
        title: 'Change in direction',
        body: [
          'Our first interface was a dashboard with a 3D car beside it, and my plan was to turn it into a guided “walkaround”, a camera circling one car through onboarding steps. I wrote a design document for it, then dropped it overnight. We rebuilt the interface from scratch around a moving carousel of 3D Toyotas, each one a case study, because we wanted an opening screen that caught the eye.',
          { src: '/work/toyyo/supra.jpg', alt: 'A financed GR Supra, where the warning lights point at the payment date, coverage and driving score.', w: 1600, h: 1000 },
          'The texting copilot first ran on Google’s Gemma model. Replies took 26 to 38 seconds, and a 45-second limit sometimes cut them off, so the owner got a canned “Live AI is unavailable” text. I moved the copilot to Grok with tool calls, and in tests Grok’s faster model answered a lease question in 8 seconds where its standard model took 36.',
          'The challenge’s data pack came with “golden answers”, the best move the challenge expected for each customer. Our lease-return costs matched the pack exactly, but our ranking put “buy it out” first for all three customers, where the golden answers differed. On those cars we let the golden answer lead.',
        ],
      },
      {
        title: 'Result',
        body: [
          'Toyyo placed 3rd on the Toyota track at HackUTD 2026. The app opens on seven Toyotas, from a 2025 Camry Hybrid to a 2007 Hilux, each with its own ownership problem, such as a lease about to run over its mileage or a loan worth refinancing.',
          { src: '/work/toyyo/dashboard.jpg', alt: 'A leased Corolla Cross with warning lights on for mileage and fuel, next to its monthly cost.', w: 1600, h: 1000 },
          'The demo Corolla Cross is on pace to finish about 13,500 miles over its lease, roughly $3,375 in fees. Toyyo shows that buying it out comes out about $1,930 ahead of returning it.',
          { src: '/work/toyyo/driving.jpg', alt: 'The driving page: the score, what moves it, recent trips and a replay of one drive on a 3D map.', w: 1600, h: 1000 },
          'The driving page scores recent trips and replays any drive on a 3D map. The text conversation runs from the first warning to a simulated dealer packet.',
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'Our main takeaway is that useful AI helps people make a better-informed decision instead of making it for them. Keeping the math in code made that possible: the numbers stayed testable, and when a model timed out the app could still answer from its calculations.',
          'The golden answers showed me that a correct calculation is not always the right advice, because a customer’s plans can matter more than the cheapest option. Personalization means understanding someone’s situation, not just showing their name and car.',
        ],
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/vishy-m/Toyyo' }, { label: 'Devpost entry', href: 'https://devpost.com/software/toyo-zxjwfe' }],
  },
  {
    slug: 'assistant',
    name: 'Assistant',
    summary:
      'A native macOS second brain for students: a command bar one hotkey away, wired into your calendar, your classes and your grades.',
    figure: 'The constellation',
    cover: { src: '/work/assistant/dashboard.jpg', alt: 'The dashboard: classes and to-dos on the left, the week in the middle and the assistant on the right', w: 1800, h: 1168 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'A college student juggles classes, clubs, work and internship deadlines at once, each with its own dates. Assistant is a native macOS app for that student, written in Swift for the Mac rather than as a website in a window. It lives in the menu bar, the row of icons at the top of the screen.',
          'I built it for myself first. It runs on my Mac against my own calendar and classes, so the screenshots on this page use a demo database with made-up courses, grades and people.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'Before any code, on 13 May 2026, I wrote a design spec. Its main rule was that this is not a dashboard app. You press Control and Space in any app, type in plain English, such as “add PS 5 for data structures due wednesday at midnight”, and a language model carries it out against a local database and Google Calendar, so the change also reaches your phone.',
          { src: '/work/assistant/overlay.jpg', alt: 'The command bar adds a task, then offers to block time to study for it', w: 1540, h: 780 },
          'The app also had to speak first, with morning and evening briefings and warnings before deadlines. And it had to keep answering when an AI provider fails, so the spec called for a chain of four models, each standing in for the one before.',
          { src: '/work/assistant/briefing.jpg', alt: 'A morning briefing, delivered in the same command bar', w: 1540, h: 471 },
        ],
      },
      {
        title: 'Process',
        body: [
          'I planned each feature in phases and wrote tests first. The first decision was to split the app in two. The menu-bar app holds no data, and a background helper, which macOS keeps running after the app quits, owns the SQLite database, the calendar sync, the model calls and the briefing timers. The two talk over XPC, the system’s channel for messages between programs.',
          'The core took five days, from 14 to 18 May, in about 170 commits: the database, the model chain, two-way calendar sync with a queue for offline edits, the command bar, briefings, grades and a tasks window. The model works through eight typed tools, such as creating a task or adding an event, and may take up to eight steps per request.',
          { src: '/work/assistant/tasks.jpg', alt: 'The tasks window: a progress ring, to-dos tagged by class, and a notes scratchpad', w: 1600, h: 1190 },
          'In June and July I gave each class its own workspace, with a file library and a board for pinning files. The board became an infinite canvas with PDFs that scroll in place, a pen, sticky notes and one undo history. The math behind it lives in six Swift packages that both programs share, so it can be tested without a screen.',
          { src: '/work/assistant/board.jpg', alt: 'A class workspace: files, a board with a pinned PDF, sticky notes and ink, tasks, and the class week', w: 1600, h: 1189 },
        ],
        diagram: [
          '+------------------------------------------+',
          '|  Assistant (menu bar)                    |',
          '|  command bar, dashboard, classes,        |',
          '|  grades, tasks                           |',
          '+---------------------+--------------------+',
          '       67 XPC calls   |   ^  briefings',
          '                      v   |',
          '+------------------------------------------+',
          '|  Background helper                       |',
          '|                                          |',
          '|  store      SQLite, 14 migrations        |',
          '|  calendar   Google Calendar, both ways   |',
          '|  models     Claude > OpenAI > Gemma      |',
          '|             > Gemma on the laptop        |',
          '|  briefings  timers, rules, Focus queue   |',
          '|  grades     weighted and projected       |',
          '+------------------------------------------+',
        ].join('\n'),
      },
      {
        title: 'Change in direction',
        body: [
          'In November I stopped adding features and audited every system instead. It found real bugs: a rejected Google sign-in was retried every five minutes forever, leaving 22,865 “unauthorized” lines in my log, and a retried calendar write could create the same event twice. I split the confirmed findings into nine workstreams, each fixed on its own branch, then merged them into one branch with 486 passing tests.',
          'On the same branch I also reversed a decision from the spec. API keys had lived in the macOS Keychain, and I moved them to a .env file: a plain list of keys that only my user account can read and that git ignores. I ruled out a hosted store like Supabase, because the helper would still need a local secret and my keys would leave the machine.',
        ],
      },
      {
        title: 'Result',
        body: [
          'The main branch has the command bar, which can also take a cropped screenshot of a syllabus or flyer, plus briefings that wait while a macOS Focus mode is on, the dashboard, class workspaces, grades and tasks. It comes to about 16,700 lines of Swift with 279 tests.',
          { src: '/work/assistant/classes.jpg', alt: 'One card per class, with its open tasks and sessions this week', w: 1600, h: 452 },
          'Grades show a current grade from graded work next to a projected one that fills in the work still to come, and the GPA is weighted by credit hours. The assistant can enter grades too: “I got 47/50 on HW 4 in linear algebra.”',
          { src: '/work/assistant/grades.jpg', alt: 'Grades: weighted categories with a dropped score, and the current grade next to the projected one', w: 1600, h: 1229 },
          'Two branches are pushed to GitHub but not yet merged, because a trial merge hit conflicts: the audit and secrets work above, and syllabus scanning. That one lets you drop a syllabus into a class folder and have the model propose its exams, assignments and recurring sessions, with nothing created until you approve it.',
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'Splitting the app in two meant sync and briefings keep running with the window closed. The cost was that every feature needed a typed call on both sides, and several of the audit’s bugs sat at that boundary, such as late replies landing on the wrong class.',
          'Planning each feature first helped me grow a command bar into class workspaces in about two months. The audit showed me that passing tests are not the same as an app that holds up over weeks of real use.',
        ],
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/vishy-m/assistant' }],
    scene: 'constellation',
  },
  {
    slug: 'ratemyclub',
    name: 'Rate My Club',
    summary:
      'Reviews and discovery for UT Austin student organizations, so you can find out what a club is like before you join.',
    figure: 'The longhorn',
    cover: { src: '/work/ratemyclub/home.jpg', alt: 'The home page: one search box and a longhorn drawn in dots', w: 1600, h: 1000 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'UT Austin has more than a thousand student organizations. The official directory, HornsLink, lists them, but each listing is written by the club itself: it tells you what a club wants to be, not what being a member is like.',
          'For a student choosing where to spend their time, the usual answer is to ask around, which only works if you already know someone in the club. Rate My Club is a review site for these organizations, so what members say sits next to what the club says.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'The goal was to let any student find out what a club is like before joining. Anyone can search the full directory and read reviews, and students who sign in can review the clubs they have been part of.',
          'Each review scores a club on academic, social and professional value, with an overall score beside them. People join clubs for different reasons, and a single star rating hides which of those a club is good at.',
        ],
      },
      {
        title: 'My role',
        body: [
          'We were a team of four. My teammates wrote the first backend endpoints (the URLs the site calls to read or change data) for creating, rating and editing reviews, their tests, and register and login.',
          'I built the front end, the part that runs in the browser, and its dot-matrix look. I connected it to the backend, wrote the script that imports the club directory, set up the deployment, added the AI summaries, and did the security pass and the phone layout.',
        ],
      },
      {
        title: 'Process',
        body: [
          'We started in late March with the backend, a Flask app (Flask is a small Python web framework). The data lives in Supabase, a hosted Postgres database with sign-in built in. When someone edits a review, the old version is kept as a revision instead of being overwritten.',
          'Next came the clubs. I wrote a script that pulls every organization from HornsLink’s public API and retries when a request fails. A second script used a language model running on my own machine to write a short description for each club card, and the backend sorts clubs into categories from their HornsLink labels plus keyword rules.',
          { src: '/work/ratemyclub/directory.jpg', alt: 'The imported directory, with sliders for professional, academic and social fit on the left', w: 1600, h: 900 },
          'In mid-April I connected the React front end to the backend and deployed both on Vercel, then added AI summaries of each club’s reviews. The last week went into security and the phone layout. Sign-in uses a cookie that scripts on the page cannot read, every write must come from the site itself, and each visitor can only send so many requests at a time. Public pages read from a separate table that holds only the columns that are safe to show.',
        ],
      },
      {
        title: 'Change in direction',
        body: [
          'My first front end, added in early April, was built around visuals: video backgrounds, a 3D model of Bevo, the UT longhorn mascot, and images of the UT Tower. It grew out of a prototype I made in late March and was not yet connected to the backend.',
          'When I joined the two in mid-April, I rebuilt the front end around what a student does on the site: search, browse, open a club and write a review. A day later I deleted the old code, videos and 3D models, and over the next week I kept simplifying the club cards and descriptions.',
        ],
      },
      {
        title: 'Result',
        body: [
          'Rate My Club is live at ratemyclub.info. The home page is a single search box over 1,038 UT organizations in 27 categories, and three sliders filter clubs by how strong they should be on professional, academic and social value. Behind it is one Flask file of about 2,500 lines with 16 routes.',
          'A club’s page shows its three averages and the review feed next to its official details: the overview, who can join, what members do, and its links. Once a club has ten reviews, a short AI summary appears at the top. It is rewritten only after ten more arrive, and the model sees at most forty reviews, each cut to 420 characters, so the cost stays close to nothing.',
          { src: '/work/ratemyclub/club.jpg', alt: 'A club’s page: its three ratings, the review feed and the official overview', w: 1600, h: 900 },
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'Once the site was deployed, most of my commits went into fixes, security, the phone layout and how public data is read, not new features. That taught me that the part people see is a small share of a working web app.',
          'It also showed me that cost limits can be simple: a few fixed rules about when to call the model kept the AI summaries affordable. The next problem is getting enough students to write reviews, since every feature here depends on them.',
        ],
      },
    ],
    links: [{ label: 'Visit ratemyclub.info', href: 'https://ratemyclub.info' }],
    scene: 'contour',
  },
  {
    slug: 'tidepool',
    name: 'Tidepool',
    summary:
      'A macOS menu-bar app that puts a live, interactive web page behind your desktop icons, with ASCII animals that react to your cursor.',
    figure: 'The koi pond',
    cover: { src: '/work/tidepool/eco-shallows.png', alt: 'The shallows of the ASCII Ecosystem wallpaper: koi, frogs and dragonflies among lily pads', w: 1440, h: 810 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'Tidepool started with a website: a page of animals drawn in ASCII art, meaning pictures made only from text characters, that react when you tap them. I wanted something like it on my own Mac, behind my desktop icons.',
          { src: '/work/tidepool/cranes.png', alt: 'ASCII Cranes: a flock of paper cranes made only from text characters.', w: 1440, h: 810 },
          'The desktop is the screen I see between every app, but a wallpaper usually just sits there. Tidepool is a small macOS menu-bar app that puts a live web page where the wallpaper goes. I built it on my own over one weekend in November 2026.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'I wanted an interactive wallpaper: one where I could set different things and the wallpaper would respond. That meant the animals had to react to clicks on the bare desktop, each wallpaper needed its own settings, and the app had to stay out of the way while I worked.',
          'I made each wallpaper an ordinary web page. The Mac side then only has to show the page and hand it the cursor, clicks and settings, and anyone who can build a web page can make a new wallpaper.',
        ],
      },
      {
        title: 'Process',
        body: [
          'The Swift app opens a borderless window on each screen, above the system wallpaper and below the Finder’s icons, holding a WKWebView, the part macOS apps use to show web pages. The first wallpaper was ASCII Pond.',
          { src: '/work/tidepool/pond.png', alt: 'ASCII Pond, the first wallpaper: click the desktop and the koi come for food.', w: 1440, h: 810 },
          'That window never receives the mouse, so the app listens for itself: it checks the cursor 60 times a second and passes a click on only when no app window covers that spot. This caused the trickiest bug. macOS lists the pointer as a small window named “Cursor” that covers the spot under the mouse, so while it existed every click was rejected. The fix was to check which window the click was actually sent to.',
          { src: '/work/tidepool/frogs.png', alt: 'ASCII Frogs: each animal has its own habits, and frogs sit, then leap.', w: 1440, h: 810 },
          'Then came six more animals: jellyfish, butterflies, dragonflies, crabs, frogs and paper cranes. They share one engine for the character grid, ripples and frame loop, so each creature is one small script describing how it moves. Each wallpaper’s manifest.json file lists its settings, and the app builds the settings panel from it.',
        ],
      },
      {
        title: 'Change in direction',
        body: [
          'At first the animals reacted to the cursor: koi drifted toward it and the water rippled as it moved. Behind real work that felt like phantom clicks. So I changed the default: now only a real click on the bare desktop scatters animals or drops food, and following or fleeing the cursor became a setting.',
          { src: '/work/tidepool/jellyfish.png', alt: 'ASCII Jellyfish: a click near them makes them jet away.', w: 1440, h: 810 },
          'The bigger change was turning separate wallpapers into one world, a view that drifts from koi in the water to frogs on lily pads to crabs on a beach. That became ASCII Ecosystem. The first version switched places too suddenly, so I added in-between stretches such as a reef, a reed bed and dunes, with rocks, logs and flowers the animals use: frogs catch dragonflies, crabs climb rocks and cranes rest on logs.',
          { src: '/work/tidepool/eco-beach.png', alt: 'The beach in the Ecosystem, where crabs walk the line between water and sand.', w: 1440, h: 810 },
          'Then it felt crowded and restless. I cut the scenery by about 40% and the animals by about a third, and made them rest longer: frogs now sit for 7 to 30 seconds between leaps instead of 1 to 4.',
        ],
      },
      {
        title: 'Result',
        body: [
          'Tidepool runs on macOS 14 and later, and its source is public on GitHub. It ships with nine wallpapers and seven kinds of animal: one wallpaper per animal, a Compass Field whose needles turn toward the cursor, and the Ecosystem, which drifts from open sea to a lake and back. You pick between them in a dashboard of live previews.',
          { src: '/work/tidepool/eco-lake.png', alt: 'The lake at the far end of the Ecosystem, with cranes, before the view drifts back.', w: 1440, h: 810 },
          'It makes no network requests. In tests in a headless browser (one that runs without a window), the Ecosystem held 60 frames per second, and the app used about 0.4% of the CPU while the wallpaper was paused or covered. After the last fixes, a koi simulation with three koi left 0 food pellets uneaten, down from 68. This site borrows its look from Tidepool.',
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'The animals were the fun part, but the real work was deciding what counts as a click on the desktop, a question that only exists because the wallpaper window cannot receive the mouse. Measuring things, like koi feeding in a repeatable simulation, let me show a fix worked instead of guessing.',
          'I also learned to judge motion by living with it. Ideas that sounded good, like animals that follow the cursor, felt wrong once they sat behind my real work, and the calmer, sparser version is the one I kept.',
        ],
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/vishy-m/Tidepool' }],
  },
  {
    slug: 'naugh',
    name: 'The Island of Naugh',
    summary:
      'A top-down action game: escape a demon’s castle dungeon in five minutes. We built it in C# for a class; I ported it to the browser, so you can play all of it here.',
    figure: 'The tower on the hill',
    cover: { src: '/work/naugh/title.jpg', alt: 'The title screen: Chax looms over the boat that carries you to the island', w: 1600, h: 1000 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'The Island of Naugh is a top-down action game that four of us made for a Video Game Programming class. We wrote it in C# with XNA, Microsoft’s framework for making Windows games, in Visual Studio 2019.',
          'Lightning splits your boat in a storm, and you wake in a cell in the castle dungeon of the demon Chax. You have five minutes to get through three floors: the dungeon, a forest maze, and Chax himself.',
          { src: '/work/naugh/dungeon.jpg', alt: 'The cell you start in. Its bars shock you only while you move.', w: 1600, h: 1000 },
          'XNA runs only on Windows, and Microsoft stopped developing it in 2013, so the original is hard to run today. The fix was to move it somewhere everyone already has: the web browser.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'The goal of the game is to escape the island by defeating Chax, who commands the enemies that attack you. The team version had the parts of a finished game: an intro cutscene, three floors, a boss with dialogue, a death scene and one clock over all of it.',
          'My purpose with the port was to make that same game playable in any browser, with nothing to install. I wanted a port, not a remake, so I kept every sprite, sound, level map and line of dialogue.',
        ],
      },
      {
        title: 'My role',
        body: [
          'We built the original as a team of four, and the design, levels, code and dialogue all come from that version. The browser port is mine: I went through the C# code and assets, rewrote the game in TypeScript, tested it and fixed what broke on the way.',
        ],
      },
      {
        title: 'Process',
        body: [
          'I started by reading through the original’s code and assets, then rebuilt the game in TypeScript with Vite, a build tool, drawing to a Canvas 2D element and playing sound through the Web Audio API, with no game engine. Each TypeScript module stands in for one or more of the original C# classes.',
          'The logic was carried over line by line. The port runs at a fixed 60 updates a second, as XNA did, so the original speeds, damage numbers and timers work unchanged on any screen. The levels load from the original text-file maps, and converting the sounds from WAV to MP3 and shrinking oversized images took the assets from about 16 MB to under 3 MB.',
          'I tested it by playing it through in a headless browser, one driven by a script. A second review against the C# found gameplay that had drifted: enemies were about 35% too fast and Chax took half the damage he should. Both came from quirks in the original, which cuts the fraction off each enemy step and updates the sword twice per frame in Chax’s room, so I copied them.',
        ],
      },
      {
        title: 'Change in direction',
        body: [
          'The original was planned as a Windows game, and the browser needed things XNA never did. Browsers block sound until the visitor presses something, so the game now opens on a title screen. It also pauses when its tab loses focus, supports gamepads through the browser’s Gamepad API, and stills the flashing cutscene backgrounds when reduced motion is turned on.',
          'I also fixed bugs from the original. Walls used to let you sink in and get stuck; they now use a slightly smaller hitbox that slides you around corners. A dash no longer freezes when you let go of the keys. Chax’s first charge used to rush at the top-left corner of the map; now it winds up like the rest, and a red line and a red square warn you before his charge and slam.',
          { src: '/work/naugh/boss.jpg', alt: 'Chax’s eye opening under the player. It hurts only once it has opened.', w: 1600, h: 1000 },
          'What I did not change was the writing. Every line of dialogue matches the original character for character, typos included. It only types faster, and a line that arrives during another now waits instead of being dropped.',
        ],
      },
      {
        title: 'Result',
        body: [
          'The whole game is playable on this site, from the intro to the win screen. It needs a keyboard or a gamepad, so it does not work on a phone.',
          { src: '/work/naugh/forest.jpg', alt: 'The forest, a maze where red spirits drift through the walls.', w: 1600, h: 1000 },
          'It is a download of under 4 MB and held a steady 60 frames a second in testing. The win screen now shows the original’s game-complete art, which the team version never displayed.',
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'Porting it taught me that being faithful means keeping some of the accidents. The enemies and the boss fight only matched the original once I copied two of its quirks, while real bugs, like getting stuck in walls, were worth fixing.',
          'It also showed me how much a framework like XNA does for you: the game loop, input, audio and sprite drawing all had to be rebuilt by hand. A class project that had become hard to run is now one link away.',
        ],
      },
    ],
    links: [{ label: 'Play the game', href: '/play/island-of-naugh/index.html' }],
  },
  {
    slug: 'bastion',
    name: 'Bastion of the Artifact',
    summary:
      'A base-building tower-defense game in Unreal Engine 5: a runaway knight guards a stolen artifact from the kingdom that wants it back. I built the movement, the animation and most of the weapons.',
    figure: 'The knight',
    cover: { src: '/work/bastion/fire-sword.jpg', alt: 'A fire sword mid-swing, leaving a trail of flame', w: 1384, h: 745 },
    sections: [
      {
        title: 'Introduction',
        body: [
          'Bastion of the Artifact is a game ten of us built in Unreal Engine 5 for a CTE Video Game Programming 2 class. We made it in Blueprints, the engine’s visual scripting, where you connect nodes instead of typing code.',
          'You play a knight who deserted an evil kingdom and stole the artifact it runs on. The kingdom sends waves of soldiers to take it back, so you gather materials, build a fort around the artifact and defend it with turrets: a mix of base building and tower defense.',
          { src: '/work/bastion/artifact.jpg', alt: 'The artifact on its pedestal: the whole game is about defending it.', w: 666, h: 374 },
          'We designed it for PC, played with a keyboard and mouse. We aimed it at players from thirteen to twenty-five.',
        ],
      },
      {
        title: 'Purpose',
        body: [
          'We planned the story and mechanics on paper first. Our design documents describe a single-player base builder: by day you gather resources and expand your fort, and at night the kingdom raids it.',
          'It was also how we learned Unreal: our first design document says we hoped to figure out animation and modeling in it. The plan was to show the finished game at the class’s showcase event.',
        ],
      },
      {
        title: 'My role',
        body: [
          'My part was the knight: how he moves, animates and fights. I built all of the movement, the animation behind it and most of the weapons system.',
          'The rest of the team made the character and weapon models, the enemies, base building, the turrets, the resources and the map. In our first design document I also wrote the game outline, the first draft of the story.',
        ],
      },
      {
        title: 'Process',
        body: [
          'I started with movement. The knight walks, sprints, crouches, slides, rolls and double jumps, and C toggles first and third person. Sprinting doubles his speed and drains a stamina bar. It all lives in a movement component, a reusable piece of logic attached to the character, with a named state for each kind of move.',
          { src: '/work/bastion/running.jpg', alt: 'The knight at a sprint.', w: 1318, h: 1318 },
          'Next came animation. One base animation blueprint, the graph that picks which animation plays each frame, handles moving, and each weapon adds its own animation layer on top. Equip the bow and its layer supplies the idle, walk and run, so no single graph grows huge.',
          { src: '/work/bastion/bow.jpg', alt: 'The bow’s animation layer at work: draw, aim at the crosshair, release.', w: 720, h: 586 },
          'Then I built the weapons on one shared parent that holds where a weapon rests on the body, where it sits in the hand, its animations, its stats and its attack. Equipping plays a draw animation that moves the weapon into the hand partway through. The sword attacks in a chain of three slashes, and the bow aims at a crosshair and fires arrows.',
        ],
      },
      {
        title: 'Change in direction',
        body: [
          'The game started with no name, was called “Barbanium”, also known as “Fortress Castle”, in the fifty-page design document, and finished as Bastion of the Artifact. The first plan was a first-person base builder; the final game switches between first and third person. The story shrank from a rebellion guarding a magic orb to one runaway knight and the artifact he stole.',
          'The weapon list got smaller too. We planned daggers, hammers, a crossbow with magic arrows and even a pistol, and finished with a bow and three swords: fire, wind and lightning. The design document had planned for this, with free-use animations as the backup if the deadline ran short.',
          { src: '/work/bastion/lightning-sword.jpg', alt: 'The lightning sword and its purple trail.', w: 1415, h: 710 },
          'The first map was, in our own words, cool looking but not practical, so it was replaced with one over four times bigger. The old grass, a single object, lagged and was hard to place, so we switched to planar grass made of flat planes, which animates properly and runs lighter.',
        ],
      },
      {
        title: 'Result',
        body: [
          'The finished knight does everything in the control scheme. He picks up the sword or the bow, equips it from the hotbar and fights with animations that match the weapon in his hand.',
          { src: '/work/bastion/wind-sword.jpg', alt: 'The wind sword’s trail, with the hotbar below.', w: 1409, h: 846 },
          'Around him, the team built the rest of the loop. You chop trees, mine ore, smelt bars at a furnace and build a fort from wood, stone and crystal pieces that snap together. Turrets aim at enemies on their own and have an upgrade tree.',
          { src: '/work/bastion/base.jpg', alt: 'An example base from the team’s building system: palisade, stone keep and stairs.', w: 1205, h: 844 },
          'Four kinds of enemies attack, and a day and night cycle shifts over time to create seasons. We showed all of it in our final presentation.',
        ],
      },
      {
        title: 'Conclusion',
        body: [
          'The main thing I learned was to build for other people. With ten of us in one project, a new weapon had to be one child blueprint and one animation layer, not a rewrite of the knight.',
          'I also learned how a plan meets a deadline. We designed far more than we built, and a smaller set that worked together beat the long list.',
        ],
      },
    ],
    links: [],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
