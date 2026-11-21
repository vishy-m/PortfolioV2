export type Slug = 'toyyo' | 'assistant' | 'ratemyclub' | 'tidepool' | 'naugh' | 'bastion';

export type Project = {
  slug: Slug;
  name: string;
  summary: string;
  // What the figure in the home scene is, in plain words.
  figure: string;
  // `hot` marks the one fact worth a second look; it is drawn in the accent colour.
  facts: { k: string; v: string; hot?: boolean }[];
  // The short version, next to the facts.
  body: string[];
  // The long version: one titled part per idea, with an optional diagram drawn in characters.
  sections: { title: string; body: string[]; diagram?: string }[];
  links: { label: string; href: string }[];
  // The first image leads the page; the rest make up the gallery. `alt` is also the caption.
  // Gallery images start in colour; set `dither: true` to start one dithered instead.
  images: { src: string; alt: string; w: number; h: number; dither?: boolean }[];
  // Used for the hero when there is no image yet.
  scene?: 'constellation' | 'contour' | 'ripple' | 'mesh';
};

export const projects: Project[] = [
  {
    slug: 'toyyo',
    name: 'Toyyo',
    summary:
      'Shows a Toyota owner what their car really costs each month and the smartest next move: keep it, buy it out, refinance, repair or replace.',
    figure: 'The car on the road',
    facts: [
      { k: 'Result', v: '3rd place, Toyota track, HackUTD 26', hot: true },
      { k: 'Kind', v: 'Team hackathon build, one weekend in November 2026' },
      { k: 'Built with', v: 'Next.js, TypeScript, React Three Fiber, MapLibre, Zustand' },
      { k: 'Models', v: 'Grok, Gemma or Claude, with a calculated fallback' },
    ],
    body: [
      'Toyyo answers one question for an owner: given my situation today, what should I do with my Toyota? We built it for the Toyota Financial Services challenge at HackUTD, where it placed third on the Toyota track.',
      'It puts the lease or loan, insurance, fuel, driving habits and repairs in one place, ranks the options and shows the assumptions behind each one. Every customer, contract and price in it is synthetic: it is a prototype, not a Toyota product.',
    ],
    sections: [
      {
        title: 'A garage, not a form',
        body: [
          'The app opens on seven Toyotas drifting across a black stage as 3D models, from a 2025 Camry Hybrid to a 2007 Hilux. Pick one and the others fade out. The car turns top-down, slides to the left and keeps driving down a looping country lane while its details fill the right side of the screen.',
          'Each car carries a different ownership problem: a lease about to run over its mileage, a loan with a rate worth refinancing, a sports car whose insurance is the real cost.',
        ],
      },
      {
        title: 'A dashboard that reads like a car',
        body: [
          'A car page shows the odometer, a row of warning lights and what the car costs every month, split into payment, insurance and fuel. The lights work like the ones on a real dash: they come on only for something worth acting on, such as lease mileage, fuel use against a typical driver, the loan rate, the payment date, coverage that is about to end, or the driving score.',
          'The Corolla Cross in the demo is on pace to finish about 13,500 miles over its lease allowance, roughly $3,375 in fees. Toyyo compares returning it with buying it out and shows that the buyout comes out about $1,930 ahead.',
        ],
      },
      {
        title: 'Calculated first, explained second',
        body: [
          'The figures come from plain TypeScript calculators for lease end, payments, insurance and repairs, not from a language model. Each option lists its upfront cost, its trade-off and the assumptions it rests on, and the sliders for miles per month or driving score recompute the result as you move them.',
          'The assistant explains those results in plain language, using tool calls to fetch the calculated options. Every dollar amount, percentage and mileage in its reply is checked against the calculated data before it is shown. When no model can be reached, it answers from a fixed template built on the same calculations.',
        ],
      },
      {
        title: 'Driving and repairs',
        body: [
          'The driving page lists recent trips with a score, shows what is pulling the score down, and replays any drive on a 3D map with a small car following the route.',
          'For repairs, you describe what is wrong. Toyyo answers with the likely part, how urgent it is, a cost range and whether the repair is worth doing, then shows nearby shops on a map.',
        ],
      },
      {
        title: 'It texts you first',
        body: [
          'Toyyo also works over iMessage. When a lease is projected to run at least 1,000 miles over, the owner gets a text before the fee becomes expensive. They can reply with a question, or step through the options and confirm one by text.',
          'A confirmation only creates a simulated packet for the dealer. A customer text can never approve the dealer side, and replying STOP ends the conversation.',
        ],
      },
      {
        title: 'My part',
        body: [
          'I built the 3D opening and the car pages, and the text-message copilot: the messaging integration, the lease conversation and running the assistant on Grok with tool calls. My teammates built the repair research, the recommendation system and the repair-planning agent.',
        ],
      },
    ],
    links: [
      { label: 'Source on GitHub', href: 'https://github.com/vishy-m/Toyyo' },
      { label: 'Devpost entry', href: 'https://devpost.com/software/toyo-zxjwfe' },
    ],
    images: [
      { src: '/work/toyyo/garage.jpg', alt: 'The opening screen: seven Toyotas drift across a black stage as 3D models', w: 1600, h: 1000 },
      { src: '/work/toyyo/dashboard.jpg', alt: 'A leased Corolla Cross: two warning lights are on, for mileage and fuel, next to the monthly cost', w: 1600, h: 1000 , dither: true },
      { src: '/work/toyyo/finances.jpg', alt: 'Finances: the lease terms, the best next move and a slider to try a different mileage', w: 1600, h: 1000 , dither: true },
      { src: '/work/toyyo/driving.jpg', alt: 'Driving: the score, what moves it, recent trips and a replay of one drive on a 3D map', w: 1600, h: 1000 , dither: true },
      { src: '/work/toyyo/supra.jpg', alt: 'A financed GR Supra, where the lights point at the payment date, coverage and driving score', w: 1600, h: 1000 , dither: true },
    ],
  },
  {
    slug: 'assistant',
    name: 'Assistant',
    summary:
      'A native macOS second brain for students: a command bar one hotkey away, wired into your calendar, your classes and your grades.',
    figure: 'The constellation',
    facts: [
      { k: 'Size', v: 'About 16,700 lines of Swift, 279 tests', hot: true },
      { k: 'Built with', v: 'Swift, SwiftUI and AppKit, SQLite (GRDB), XPC' },
      { k: 'Talks to', v: 'Google Calendar, and Claude with three fallbacks' },
      { k: 'When', v: 'May 2026 onward, solo. macOS 13 and later' },
    ],
    body: [
      'Assistant is a menu-bar app for a student juggling classes, clubs and deadlines. Its main surface is not a dashboard. It is a command bar at the bottom of the screen that you summon with a hotkey and type to in plain English: “add PS 5 for data structures due wednesday at midnight”, or “what do I have today?”',
      'A language model carries out the request against a local database and Google Calendar. Around that bar are full windows for the week, each class, grades and tasks. The screenshots here use a demo database, so the courses, grades and people in them are made up.',
    ],
    sections: [
      {
        title: 'Talk to it from anywhere',
        body: [
          'Press Control and Space in any app and a panel slides up from the bottom of the screen. Ask one thing and dismiss it, or keep going: the panel grows into a conversation, and a second hotkey reopens the last one where you left off.',
          'You can also drag a rectangle over any part of the screen, such as a syllabus, an email or a flyer, and attach it to the prompt: “add every due date in this to my calendar.” Each prompt carries the current date, time and time zone, so “next Thursday at 5” becomes an exact time before anything is saved.',
          'The model works through eight typed tools. It can read today’s plan, list, create and complete tasks, read the calendar and add events, and compute or record a grade. It may take up to eight steps per request, seeing the result of each one, errors included, before it answers.',
        ],
      },
      {
        title: 'It speaks first',
        body: [
          'The app also starts the conversation. A morning briefing covers today’s events and tasks, and an evening one covers what is still open and what is due tomorrow. Reminders arrive ahead of each event, with lead times that depend on what it is: a day and an hour before an exam, ten minutes before a class.',
          'It also watches for trouble. If three or more deadlines land in the next 48 hours and no study time is blocked, it says so. Briefings wait while a macOS Focus mode is on and are delivered when it ends.',
        ],
      },
      {
        title: 'The week in one window',
        body: [
          'The dashboard puts the whole week in one place. On the left are the GPA, which stays hidden until you click it, a card for each class, and a to-do list with a progress ring. On the right is the same assistant, with its history saved.',
          'In the middle is a seven-day calendar of your Google Calendar events, coloured by type: class, office hours, discussion, exam. Task deadlines are drawn as lines at their due time, so you can see work piling up next to the schedule. Click an event to edit it, including how it repeats.',
        ],
      },
      {
        title: 'A workspace for every class',
        body: [
          'Opening a class gives you four resizable panels: its files, a board, its tasks and its week. Their sizes are remembered for each class.',
          'The board is an infinite whiteboard you can pan and zoom from 25% to 400%. Pin a file to it and it becomes a live card; a pinned PDF scrolls and reads right on the board. On top of that are a pen, an eraser, sticky notes, text and shapes. Drag a box around several things to move or delete them together, and one undo history covers all of it.',
        ],
      },
      {
        title: 'Grades that answer “what if”',
        body: [
          'Each class has weighted categories, such as problem sets at 30%, that can drop the lowest or highest scores. The breakdown shows the current grade, from graded work only, next to a projected grade that fills in the work still to come, and marks where both stand against the grade you are aiming for.',
          'The GPA is weighted by credit hours and leaves out any class with no graded work yet, so the number stays honest. The assistant can do this too: “I got 47/50 on HW 4 in linear algebra.”',
        ],
      },
      {
        title: 'Two programs, one app',
        body: [
          'The part you see holds no data of its own. Every read and write is a message to a background helper that macOS keeps running even after the app quits. The helper owns the database, the calendar sync, the model calls and the briefing timers, and the two talk over XPC, the system’s channel for messages between processes, through 67 typed calls.',
          'The helper checks the code signature of whatever connects to it, so another program cannot pose as the app. For briefings the direction reverses: the helper calls back into the app to bring up the command bar.',
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
        title: 'A calendar that stays in step',
        body: [
          'Everything the app creates goes to its own calendar, named Assistant, in your Google account, so it also shows up on your phone and in any other calendar app. Events are mirrored into the local database every five minutes.',
          'Edits made offline wait in a queue and are sent on the next sync. A failed write is retried with longer and longer waits, up to an hour. A daily cap on calendar requests keeps the app inside Google’s limits.',
        ],
      },
      {
        title: 'It keeps answering',
        body: [
          'The assistant asks Claude first, then OpenAI, then a hosted Gemma model, then a Gemma model running on the laptop, so it still answers with no connection. A rate limit, an overloaded server or a timeout moves to the next one in line. An error that means the request itself is wrong stops the chain, since asking another model would not help.',
          'Every reply shows which model wrote it. API keys and the Google sign-in are kept in the macOS Keychain, never in the database.',
        ],
      },
      {
        title: 'How it was built',
        body: [
          'I wrote a design spec and a phased plan for each feature before the code. The logic that can be tested without a screen lives in six Swift packages shared by both programs, covered by 279 tests: grade math, the fallback rules, calendar sync and its offline queue, briefing timing, and the geometry behind the board.',
          'Still in progress: drop a syllabus into a class folder and its exams, assignments and recurring sessions are offered as events and tasks, with nothing created until you approve it.',
        ],
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/vishy-m/assistant' }],
    images: [
      { src: '/work/assistant/dashboard.jpg', alt: 'The dashboard: classes and to-dos on the left, the week in the middle and the assistant on the right', w: 1800, h: 1168 },
      { src: '/work/assistant/board.jpg', alt: 'A class workspace: files, a board with a pinned PDF, sticky notes and ink, tasks, and the class week', w: 1600, h: 1189 },
      { src: '/work/assistant/grades.jpg', alt: 'Grades: weighted categories with a dropped score, and the current grade next to the projected one', w: 1600, h: 1229 },
      { src: '/work/assistant/briefing.jpg', alt: 'A morning briefing delivered in the command bar', w: 1540, h: 471 },
      { src: '/work/assistant/classes.jpg', alt: 'One card per class, with its tasks and sessions this week', w: 1600, h: 452 },
      { src: '/work/assistant/overlay.jpg', alt: 'The command bar in a conversation: it adds a task, then offers to block study time', w: 1540, h: 780 },
      { src: '/work/assistant/tasks.jpg', alt: 'Tasks: a progress ring, to-dos tagged by class, and a notes scratchpad', w: 1600, h: 1190 },
    ],
    scene: 'constellation',
  },
  {
    slug: 'ratemyclub',
    name: 'Rate My Club',
    summary:
      'Reviews and discovery for UT Austin student organizations, so you can find out what a club is like before you join.',
    figure: 'The longhorn',
    facts: [
      { k: 'Live at', v: 'ratemyclub.info', hot: true },
      { k: 'Directory', v: '1,038 UT organizations in 27 categories' },
      { k: 'Built with', v: 'Flask, React, Supabase, Vercel' },
      { k: 'When', v: 'March to April 2026, team of four' },
    ],
    body: [
      'UT Austin has more than a thousand student organizations, and the official directory tells you what each one says about itself. Rate My Club adds what members say.',
      'Students sign in, review the clubs they have been part of and rate each one. Anyone can search the directory, filter it and read the reviews.',
    ],
    sections: [
      {
        title: 'Find a club',
        body: [
          'The home page is a single search box. Behind it is the full directory: 1,038 organizations pulled from HornsLink, the university’s own listing, each with a short description written for the card.',
          'You can narrow the list by 27 categories, from Engineering & Robotics to Music, Dance & Performance, and by three sliders that set how strong a club should be on professional, academic and social value.',
        ],
      },
      {
        title: 'Three ratings, not one',
        body: [
          'A single star rating hides why people join clubs. A review here scores a club separately on academic, social and professional value, with an overall score beside them.',
          'A club’s page shows those averages and the review feed next to its official details: the overview, who can join, what members do, and its links. When someone edits a review, the earlier version is kept as a revision instead of being overwritten.',
        ],
      },
      {
        title: 'Summaries on a budget',
        body: [
          'Once a club has ten reviews, a short AI-written summary appears at the top of its page. It is rewritten only after ten more reviews arrive, not on every visit, and the model is sent at most forty reviews, each trimmed to a few sentences. That keeps the summary current while the model bill stays close to nothing.',
        ],
      },
      {
        title: 'The unglamorous parts',
        body: [
          'A good share of the work went into things nobody sees. Sign-in uses a cookie that scripts on the page cannot read, and every write is checked to come from the site itself. Requests are rate limited per visitor. Public pages read from a separate table that holds only the columns that are safe to show, so private details never leave the server.',
        ],
      },
      {
        title: 'My part',
        body: [
          'I built the front end and its dot-matrix look, connected it to the Flask backend, set up the deployment, added the AI summaries and did the security pass and the phone layout. My teammates wrote the first review and sign-in endpoints.',
        ],
      },
    ],
    links: [{ label: 'Visit ratemyclub.info', href: 'https://ratemyclub.info' }],
    images: [
      { src: '/work/ratemyclub/home.jpg', alt: 'The home page: one search box and a longhorn drawn in dots', w: 1600, h: 1000 },
      { src: '/work/ratemyclub/directory.jpg', alt: 'The directory, with sliders for professional, academic and social fit on the left', w: 1600, h: 900 },
      { src: '/work/ratemyclub/club.jpg', alt: 'A club’s page: its three ratings, the review feed and the official overview', w: 1600, h: 900 },
    ],
    scene: 'contour',
  },
  {
    slug: 'tidepool',
    name: 'Tidepool',
    summary:
      'A macOS menu-bar app that puts a live, interactive web page behind your desktop icons, with ASCII animals that react to your cursor.',
    figure: 'The koi pond',
    facts: [
      { k: 'Ships with', v: 'Nine wallpapers, seven kinds of animal', hot: true },
      { k: 'Built with', v: 'Swift, WKWebView, JavaScript, HTML canvas' },
      { k: 'Runs on', v: 'macOS 14 and later' },
      { k: 'When', v: 'November 2026, solo' },
    ],
    body: [
      'Tidepool replaces a still wallpaper with a web page that keeps running behind your icons. It ships with a set of animals drawn entirely in characters: koi, jellyfish, frogs, dragonflies, crabs, cranes and butterflies, each with its own way of moving.',
      'They notice you. Click the pond and the koi come for food. Click near the jellyfish and they jet away. This site borrows its look from that project.',
    ],
    sections: [
      {
        title: 'A page where the wallpaper goes',
        body: [
          'Each screen gets a borderless window that sits above the system wallpaper and below the Finder’s icons. The window holds a web view, so a wallpaper is an ordinary HTML page.',
        ],
      },
      {
        title: 'Clicks that reach the desktop',
        body: [
          'A window at that level never receives the mouse, so the app does the listening itself. It follows the cursor and watches for clicks across the whole system, and passes one to the wallpaper only when no app window covers that spot. The animals react when you click the bare desktop, not when you click a button in another app.',
          'Drawing stops while the wallpaper is paused or completely hidden behind other windows, so it costs nothing when you cannot see it.',
        ],
      },
      {
        title: 'Animals with habits',
        body: [
          'Every creature is one small script on top of a shared engine. The engine owns the character grid, the backdrop, the ripples and the frame loop; the script says how its animals move and stamps their shapes into the grid.',
          'Frogs sit, then leap. Dragonflies hover, then dart. Crabs bolt when you click, and butterflies scatter. Each wallpaper has settings for how many animals there are, how they move, their colour, and whether they follow, flee from or ignore the cursor.',
        ],
      },
      {
        title: 'One drifting world',
        body: [
          'The ASCII Ecosystem wallpaper puts all of them in one place. The view drifts slowly from open sea past a koi pond, lily-pad shallows, a beach and a meadow to a lake, then back again.',
        ],
      },
      {
        title: 'Make your own',
        body: [
          'A wallpaper is a folder with an HTML page and a short manifest that lists its settings. The settings panel in the app is generated from that list, and the page is handed the cursor position, clicks on the desktop and pause events, so anyone who can write a web page can write a wallpaper.',
        ],
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/vishy-m/Tidepool' }],
    images: [
      { src: '/work/tidepool/eco-shallows.png', alt: 'The shallows of the ASCII Ecosystem wallpaper: koi, frogs and dragonflies among lily pads', w: 1440, h: 810 },
      { src: '/work/tidepool/pond.png', alt: 'ASCII Pond: koi drawn in characters; click to drop food', w: 1440, h: 810 },
      { src: '/work/tidepool/jellyfish.png', alt: 'ASCII Jellyfish: click near them and they jet away', w: 1440, h: 810 },
      { src: '/work/tidepool/frogs.png', alt: 'ASCII Frogs: they sit, then leap', w: 1440, h: 810 },
      { src: '/work/tidepool/cranes.png', alt: 'ASCII Cranes: a flock of paper cranes', w: 1440, h: 810 },
      { src: '/work/tidepool/eco-beach.png', alt: 'The beach in the Ecosystem wallpaper, with crabs at the waterline', w: 1440, h: 810 },
      { src: '/work/tidepool/eco-lake.png', alt: 'The lake at the far end of the Ecosystem, with cranes', w: 1440, h: 810 },
    ],
  },
  {
    slug: 'naugh',
    name: 'The Island of Naugh',
    summary:
      'A top-down action game: escape a demon’s castle dungeon in five minutes. We built it in C# for a class; I ported it to the browser, so you can play all of it here.',
    figure: 'The tower on the hill',
    facts: [
      { k: 'Play it', v: 'In the browser, all three floors', hot: true },
      { k: 'Kind', v: 'Class project, team of four; ported to the web in November 2026' },
      { k: 'Built with', v: 'C# and XNA, then TypeScript, Canvas 2D and Web Audio' },
      { k: 'Controls', v: 'Keyboard or gamepad, so not on a phone' },
    ],
    body: [
      'The Island of Naugh began as a team project for a Video Game Programming class, written in C# with Microsoft’s XNA framework. Lightning splits your boat in a storm, and you wake in the castle dungeon of the demon Chax with five minutes to fight your way out.',
      'XNA runs only on Windows and Microsoft stopped developing it in 2013, so the original is hard to run today. I ported it to TypeScript so it runs in any browser, keeping every sprite, sound, level map and line of dialogue from the original.',
    ],
    sections: [
      {
        title: 'Three floors, one clock',
        body: [
          'The dungeon comes first. The bars of your cell shock you only while you move, so you wait for them to go dark and slip out. Keys bounce around the room and only one opens the gate. It starts out tinted red, then turns white like the decoys a second after you leave the cell, and every decoy you grab spawns another. Past the gate are a sword and twenty husks.',
          'The forest is a maze full of red spirits that drift through its walls. At the end waits Chax. He charges from a distance, opens a giant eye under you up close, and after five attacks summons knights and cannot be hurt until they are gone. One five-minute clock covers all three floors; it stops only while Chax is talking.',
        ],
      },
      {
        title: 'A port, not a remake',
        body: [
          'Each TypeScript module stands in for one or more of the original C# classes, and the game logic was carried over line by line: the same speeds, damage numbers, timers and animation frames. It runs at a fixed 60 updates a second, as XNA did, so it plays at the same speed on any screen.',
          'The levels are the original text-file tile maps, loaded unchanged. The art was scaled down and the sounds converted from WAV to MP3, so the whole game is a download of under 4 MB.',
        ],
      },
      {
        title: 'What the browser needed',
        body: [
          'Browsers will not play sound until the visitor presses something, so the game now opens on a title screen. It pauses when its tab loses focus, a gamepad works through the browser’s Gamepad API, and the flashing cutscene backgrounds hold still for anyone who has turned on reduced motion.',
        ],
      },
      {
        title: 'Fixed on the way',
        body: [
          'Some of the original’s bugs did not make the move. Walls used direction-tagged tiles that let you sink in and get stuck; they now use a slightly smaller hitbox that slides you around corners. A dash no longer freezes when you let go of the keys. Chax’s first charge used to rush at the top-left corner of the map; now it winds up like the rest, and his charge and slam are telegraphed by a red line and a red square.',
          'The dialogue is untouched, typos and all. It only types faster, and a line that arrives while another is showing now waits its turn instead of being dropped.',
        ],
      },
    ],
    links: [{ label: 'Play the game', href: '/play/island-of-naugh/index.html' }],
    images: [
      { src: '/work/naugh/title.jpg', alt: 'The title screen: Chax looms over the boat that carries you to the island', w: 1600, h: 1000 },
      { src: '/work/naugh/dungeon.jpg', alt: 'The cell you start in: its bars shock you only while you move', w: 1600, h: 1000 },
      { src: '/work/naugh/forest.jpg', alt: 'The forest, a maze where red spirits drift through the walls', w: 1600, h: 1000 },
      { src: '/work/naugh/boss.jpg', alt: 'Chax, with his eye opening under the player', w: 1600, h: 1000 },
    ],
  },
  {
    slug: 'bastion',
    name: 'Bastion of the Artifact',
    summary:
      'A base-building tower-defense game in Unreal Engine 5: a runaway knight guards a stolen artifact from the kingdom that wants it back. I built the movement, the animation and most of the weapons.',
    figure: 'The orb behind the wall',
    facts: [
      { k: 'My part', v: 'All of the movement and animation, most of the weapons', hot: true },
      { k: 'Kind', v: 'Class project for Video Game Programming 2, team of ten' },
      { k: 'Built with', v: 'Unreal Engine 5, in Blueprints' },
      { k: 'Plays on', v: 'PC, with keyboard and mouse' },
    ],
    body: [
      'Bastion of the Artifact was the team project for a Video Game Programming 2 class: ten of us building one game in Unreal Engine 5, all in Blueprints, the engine’s visual scripting. You play a knight who deserted an evil kingdom and took the artifact it runs on, and the kingdom wants it back.',
      'You chop trees and mine ore, smelt bars in a furnace, build a fort around the artifact and set turrets on its walls, then fight off the soldiers sent to take it. My part was the knight himself: how he moves, how he animates and how he fights.',
    ],
    sections: [
      {
        title: 'Moving like a knight',
        body: [
          'The knight walks, sprints, crouches, slides, dodges with a short roll and double jumps. Sprinting doubles his speed and drains a stamina bar that refills once he slows down, and C swaps the camera between first and third person at any time.',
          'Movement lives in its own component on the character, with a named state for each kind of move, and sliding has a component of its own.',
        ],
      },
      {
        title: 'An animation layer per weapon',
        body: [
          'The knight has one base animation blueprint for moving, plus a separate animation layer for each weapon. Equip the sword and its layer supplies the idle, walk, run and jump; switch to the bow and the bow’s layer takes over. A new weapon brings its own layer instead of growing one huge graph.',
          'The two emotes use the same layering, so adding a third is one more animation.',
        ],
      },
      {
        title: 'Weapons that share one blueprint',
        body: [
          'Every weapon is a child of one base weapon, which holds what they all need: where it rests on the body, where it sits in the hand, its animations, its basic stats and its attack. Picking one up attaches it at its resting spot; equipping plays a draw animation, and the weapon moves to the hand partway through it.',
          'The sword attacks in a chain of three slashes. The bow draws, aims at a crosshair and fires arrows. The swords also come in fire, wind and lightning, each leaving its own trail.',
        ],
      },
      {
        title: 'My part',
        body: [
          'I built all of the movement and the animation behind it, and most of the weapons system. The rest of the team made the character and weapon models, the enemies, base building and the turrets, and the map with its day and night cycle.',
        ],
      },
    ],
    links: [],
    images: [
      { src: '/work/bastion/fire-sword.jpg', alt: 'A fire sword mid-swing, leaving a trail of flame', w: 1384, h: 745 },
      { src: '/work/bastion/wind-sword.jpg', alt: 'The wind sword’s trail, with the hotbar below', w: 1409, h: 846 },
      { src: '/work/bastion/lightning-sword.jpg', alt: 'The lightning sword and its purple trail', w: 1415, h: 710 },
      { src: '/work/bastion/bow.jpg', alt: 'The bow: draw, aim at the crosshair, loose', w: 720, h: 586 },
      { src: '/work/bastion/running.jpg', alt: 'The knight at a run', w: 1318, h: 1318 },
      { src: '/work/bastion/artifact.jpg', alt: 'The artifact on its pedestal, the thing the whole game defends', w: 666, h: 374 },
      { src: '/work/bastion/base.jpg', alt: 'An example base from the team’s building system: palisade, stone keep and stairs', w: 1205, h: 844 },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
