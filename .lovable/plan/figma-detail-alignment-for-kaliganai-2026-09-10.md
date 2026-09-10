# Figma-detail alignment for KaliGanAI

## Goal
Bring the existing workspace screens into close visual alignment with the supplied Figma references without rebuilding working pages or embedding screenshots.

## Changes
- Refine the shared workspace shell to match the Figma sidebar width, logo lockup, grouped navigation, active rows, account pill, page gutters, and full-height behavior.
- Add the subtle pale-violet lower-page wash visible across the supplied designs while keeping content areas white and readable.
- Align the AI Employees page and Create AI Employee dialog: header spacing, count/status pills, search and action controls, employee card dimensions, borders, typography, and footer actions.
- Align Marketplace and Employee Studio: exact header/action ordering, dark marketplace banner composition, filters and tags, card density, Studio sidebar, central prompt area, and composer placement.
- Align Knowledge Base, Integration Directory, Phone Numbers, Executive Analytics, and Documentation to their references by adjusting only visible differences in dimensions, spacing, typography, border radii, controls, and section backgrounds.
- Preserve all current interactions, data loading, filters, navigation, dialogs, and responsive behavior.

## Technical details
- Consolidate repeated Figma colors, borders, shadows, radii, and violet background treatment into semantic tokens/utilities in the global stylesheet.
- Reuse existing icons, logos, data, and UI components; uploaded screenshots remain design references only.
- Keep page-specific edits focused in the existing shell and page files, with no backend or data-model changes.
- Add complete route metadata only where touched routes are missing required tags.

## Verification
- Check the modified pages at the reference desktop viewport and a mobile viewport.
- Compare fresh screenshots against the supplied Figma images, verify dialogs and controls still work, and confirm the latest preview build has no errors.
- After this pass, request only the remaining missing Figma assets or screen references needed for exact matching of pages not yet supplied.
