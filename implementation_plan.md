# Implement Light & Dark Mode Toggle for Gyansthali Website

We will add a theme toggle feature allowing users to switch between Light and Dark mode. This will be implemented using CSS variables, a Tailwind theme extension, and a navbar toggle button with state persisted in `localStorage`.

## User Review Required

> [!IMPORTANT]
> The website's styling is currently built with dark background utilities (e.g. `bg-[#020617]`, `text-white`, `border-white/5`).
> We propose using CSS variables coupled with extended Tailwind color classes (`bg-themeBg`, `text-themeText`, etc.) to dynamically switch themes at the root level without breaking existing layout designs.

## Open Questions

> [!IMPORTANT]
> 1. Do you prefer a custom toggle switch (e.g., sliding pill) or a single-button icon (Sun/Moon)? We propose a premium, smooth rotating Sun/Moon icon button in the header next to the navigation links.

---

## Proposed Changes

### Configuration & Base Styles

#### [MODIFY] [tailwind.config.js](file:///d:/GitHub/guruConnect/school-website/tailwind.config.js)
- Extend theme colors:
  - `themeBg` -> `var(--bg-primary)`
  - `themeBgSec` -> `var(--bg-secondary)`
  - `themeBgTert` -> `var(--bg-tertiary)`
  - `themeText` -> `var(--text-primary)`
  - `themeTextSec` -> `var(--text-secondary)`
  - `themeBorder` -> `var(--border-color)`
  - `themeCard` -> `var(--card-bg)`

#### [MODIFY] [index.css](file:///d:/GitHub/guruConnect/school-website/src/index.css)
- Define base CSS variables for `:root` (light mode defaults) and `.dark` (dark mode theme matching the current dark theme).
- Standardize transition times for backgrounds and texts so that switching modes feels smooth and animated.

### Layout & Theme Controller

#### [MODIFY] [SchoolWebLayout.tsx](file:///d:/GitHub/guruConnect/school-website/src/layouts/SchoolWebLayout.tsx)
- Add theme state (`theme` initialized from `localStorage` or preferred system settings).
- Toggle `.dark` class on `document.documentElement`.
- Place a theme toggle button in the Header (both desktop and mobile view) using `Sun` and `Moon` icons from `lucide-react`.

### Page Modifications

We will update the page wrapper and key container classes to use the extended theme colors.

#### [MODIFY] [SchoolLanding.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolLanding.tsx)
#### [MODIFY] [SchoolAbout.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolAbout.tsx)
#### [MODIFY] [SchoolContact.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolContact.tsx)
#### [MODIFY] [SchoolAchievements.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolAchievements.tsx)
#### [MODIFY] [SchoolAcademics.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolAcademics.tsx)
#### [MODIFY] [SchoolGallery.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolGallery.tsx)
#### [MODIFY] [SchoolAdmissions.tsx](file:///d:/GitHub/guruConnect/school-website/src/pages/SchoolAdmissions.tsx)

- Update outer divs from `bg-[#020617] text-white` to `bg-themeBg text-themeText transition-colors duration-500`.
- Swap fixed text colors (`text-slate-400`, `text-slate-500`) to `text-themeTextSec`.
- Swap fixed border/card backgrounds (`bg-white/5`, `border-white/5`, etc.) to `bg-themeCard border-themeBorder`.

---

## Verification Plan

### Automated/Local Tests
- Run `npm run dev` to verify compilation.
- Open `http://localhost:5174/` inside the browser subagent.
- Perform click actions on the toggle button to test transition states.
- Verify that `localStorage` correctly updates and maintains the theme state across refreshes.

### Manual Verification
- Visually check contrast and text readability in both Light and Dark modes.
