# Akshat Jain — Portfolio

A premium interactive developer portfolio featuring immersive animations, 3D visual elements, project showcases, and a modern editorial interface.

## Live Website

https://akshatfolio-ejjg7gwj.manus.space/

## About

Personal portfolio website for Akshat Jain, showcasing projects, technical work, experimentation, and development interests.

## Featured Projects

### The Aurora Dream

An interactive travel planning experience for exploring the Northern & Southern Lights, comparing destinations, seasons, and estimated trip costs.

GitHub: https://github.com/akshatjain-cyber/TRAVEL-GUIDE-FOR-AURORA

Live Demo: https://pixel-perfect-snap-662.lovable.app/

### Meghdoot AI

Weather intelligence and disaster-response project featuring conversational insight, alerts, geofencing, and rescue-oriented tools.

GitHub: https://github.com/akshatjain-cyber/MEGHDOOT-AI--WEATHER-GPT-KARNAVATI-UNIVERSITY-COLLEGE-HACKATHON-SIH-2026-PSID-26068

Live Demo: https://meghrescue-mb3dogk3.manus.space/

### SETS

GitHub: https://github.com/akshatjain-cyber/SETS

### Odoo Hackathon 2026

GitHub: https://github.com/akshatjain-cyber/ODOO-HACKATHON-2026

## Technologies

The portfolio uses React 19, TypeScript, Vite, Three.js, React Three Fiber, Tailwind CSS 4, Lucide React, and pnpm. The 3D crystal is implemented with Three.js and React Three Fiber; the connected network is a custom interactive Canvas component; styling and responsive behavior are authored in CSS with Tailwind support from the existing Vite template.

## Running Locally

Requirements: Node.js 20 or newer and pnpm 10 or newer.

```bash
pnpm install
pnpm dev
```

The Vite development server will print the local URL. The project is configured to bind to the host for previewing from another device on the same network.

## Build

The production build command defined in `package.json` is:

```bash
pnpm run build
```

Additional validation commands:

```bash
pnpm run check
pnpm run preview
```

## Project Structure

- `client/src/pages/Home.tsx` — portfolio layout, navigation, chapter scroll logic, project data, and the one-project-at-a-time viewer.
- `client/src/components/CrystalScene.tsx` — persistent React Three Fiber crystal scene.
- `client/src/components/NetworkWeb.tsx` — subtle interactive connected-line network.
- `client/src/components/ui/` — reusable UI primitives from the template.
- `client/src/index.css` — visual system, layout, responsive styles, and motion.
- `client/index.html` — document metadata and font loading.
- `server/index.ts` — static production server used by the template build.
- `shared/` — shared template compatibility constants.
- `package.json` and `pnpm-lock.yaml` — dependency and script definitions.

## License

MIT License. This portfolio is provided as a personal project; retain attribution when reusing the source.
