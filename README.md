# Portfolio

A night scene drawn in characters. Five figures in it are projects; select one to go in.

    npm install
    npm run dev

## Where things are

- `lib/site.ts`: name, links. Empty values are not shown.
- `lib/projects.ts`: project text, facts, links and images.
- `public/portrait.jpg`: add it and the About page draws it in characters.
- `public/resume.pdf`: add it and a Resume link appears.
- `public/play/island-of-naugh/`: the built Island of Naugh game, served as it is. To update it, run
  `npm run build -- --outDir <this repo>/public/play/island-of-naugh --emptyOutDir` in the game's folder.
- `components/World.tsx`: the home scene. Figures are drawn on a small canvas, then
  asciify-engine turns that canvas into characters. Vanta's fog is the sky.
- `components/FlutedImage.tsx`: 1-bit dither behind fluted glass.
- `components/Transition.tsx`: the glass-rib page transition (GSAP).

Add `?soft` to a URL to force the character fields on a machine without a GPU.
