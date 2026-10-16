# Prashant Kumar Pandey | Portfolio

React + Vite portfolio with GSAP animations, Lenis smooth scroll and a React Three Fiber 3D background.

## Run
```
npm install
npm run dev        # local preview
npm run build      # production build in /dist
```

## Edit content
Everything (name, projects, skills, education, email) lives in `src/data.js`.
- Add your email: set `EMAIL` in `src/data.js` (hidden while empty).
- Add a source link to a project: add `source: 'https://github.com/prashant9430/REPO'` only for a real repo, then render it in `App.jsx`.
- Photo: replace `public/photo.jpg`.

## Deploy (free)
- **Netlify**: import the GitHub repo. Build command `npm run build`, publish directory `dist`.
- **Vercel**: import the repo, Vite is auto-detected.

## Structure
```
src/App.jsx     sections, GSAP + Lenis setup, tilt and magnetic components
src/Scene.jsx   3D wireframe core + particles (react-three-fiber)
src/data.js     all content
src/styles.css  dark theme, glass cards, responsive layout
```
Animations turn off automatically when the device asks for reduced motion.
