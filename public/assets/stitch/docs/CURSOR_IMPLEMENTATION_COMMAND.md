# CURSOR COMMAND — Stitch by Nuvio Production Build

Use this entire asset pack to recreate the supplied Stitch dashboard as a real responsive application at `stitch.nuviobridge.com`.

## Rules
- Do not use the reference screenshot as a page background.
- Build every card, navigation item, button, progress bar, panel, modal, and mobile state as real React components.
- Use SVG assets for all icons and brand marks.
- Use PNG illustrations only for project imagery and decorative content.
- No dead controls. Every button must navigate, open a working modal, or trigger a real action.
- Use Supabase for auth, projects, yarn inventory, patterns, tutor history, lessons, and vision scans.
- Use the included `code/components`, `code/styles`, and `code/data` as scaffolding, then productionize them.

## Routes
/ /create /workspace/[projectId] /vision /tutor /yarn /projects /learn /patterns /settings

## Responsive behavior
Desktop: 272px sidebar, flexible main content, 300px insight rail.
Tablet: collapse insight rail under main content.
Mobile: compact header and fixed five-item bottom navigation.

## Asset root
Copy this folder into `public/assets/stitch/` and update paths consistently.

## Required checks
- npm run lint
- npm run typecheck
- npm run build
- 390px, 768px, 1180px, and 1440px viewport review
- No broken image paths
- No clipped icons
- No layout shift
- Keyboard accessible controls
- WCAG AA contrast
- Reduced-motion support
