---
name: MyMobileApp
description: Calm, efficient, distraction-free task tracking for daily commuters and students
colors:
  # Primary accent (near-black in light, white in dark)
  ink: "#18181B"
  ink-foreground: "#FAFAFA"

  # Destructive accent
  coral: "#EF4444"
  coral-foreground: "#FAFAFA"
  coral-deep: "#7F1D1D"

  # Neutral / Surface tokens (light / dark handled by CSS vars; these are the light-mode canonicals)
  paper: "#FFFFFF"
  text: "#09090B"
  muted-text: "#71717A"
  surface: "#F4F4F5"
  surface-foreground: "#18181B"
  border: "#E4E4E7"
  input-border: "#E4E4E7"
  focus-ring: "#18181B"

typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0em"

rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"

spacing:
  base: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "oklch(12% 0.01 240)"
    textColor: "{colors.ink-foreground}"
  button-primary-active:
    backgroundColor: "oklch(10% 0.01 240)"
  button-destructive:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.coral-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  button-destructive-hover:
    backgroundColor: "oklch(55% 0.25 20)"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
    border: "1px solid {colors.border}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.surface-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "48px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "48px"
    border: "1px solid {colors.input-border}"
  input-field-focus:
    border: "1px solid {colors.focus-ring}"
    boxShadow: "0 0 0 3px {colors.focus-ring}/0.5"
  checkbox:
    backgroundColor: "{colors.paper}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.sm}"
    size: "16px"
  checkbox-checked:
    backgroundColor: "{colors.ink}"
    border: "1px solid {colors.ink}"
    indicatorColor: "{colors.ink-foreground}"
---

# Design System: MyMobileApp

## Overview

**Creative North Star: "The Daily Slate"**

A quiet, near-monochrome system for capturing tasks and browsing a small storefront prototype on iOS and Android. The palette is intentionally restrained: slate neutrals, one decisive ink accent, and one coral destructive/error accent. No gradients or decorative glass effects. Surfaces rely on clear borders and subtle ambient depth. Typography uses the platform system font and respects system text scaling. The experience should feel direct, legible, and at home on both platforms.

**Key Characteristics:**
- Near-monochrome slate scale with one ink accent and one coral destructive
- Subtle ambient shadow only where it helps separate a control from the page
- Platform system font stack — instant, native, no layout shift
- 8px radius (`rounded-md`) as the single corner language
- Dark mode is a first-class inversion, not an afterthought

## Colors

The palette is a two-tone slate system (light / dark) with two semantic accents: **Ink** for primary actions and **Coral** for destructive ones. Every surface token exists in both themes via CSS custom properties; the frontmatter lists light-mode canonicals.

### Primary (Ink)
- **Ink** (#18181B): Primary action color — buttons, checkboxes when checked, focus rings. In dark mode this inverts to white (#FAFAFA). Used sparingly: ≤10% of any screen.
- **Ink Foreground** (#FAFAFA): Text on ink surfaces. In dark mode this becomes near-black (#18181B).

### Destructive (Coral)
- **Coral** (#EF4444): Delete buttons, error states, destructive confirmations. In dark mode deepens to **Coral Deep** (#7F1D1D) for reduced glare.
- **Coral Foreground** (#FAFAFA): Text on coral surfaces.

### Neutral
- **Paper** (#FFFFFF / #09090B): Base background. Pure white in light, near-black slate in dark.
- **Text** (#09090B / #FAFAFA): Primary body text. Maximum contrast in both themes.
- **Muted Text** (#71717A / #A1A1AA): Placeholders, secondary labels, empty-state copy.
- **Surface** (#F4F4F5 / #27272A): Secondary backgrounds (input fields, card rests, hover overlays).
- **Surface Foreground** (#18181B / #FAFAFA): Text on surface backgrounds.
- **Border** (#E4E4E7 / #27272A): Dividers, input strokes, card outlines.
- **Focus Ring** (#18181B / #D4D4D8): Visible focus indicator on all interactive elements.

### Named Rules

**The One Voice Rule.** Ink appears on ≤10% of any given screen. Its rarity is the signal.

**The Coral Ceiling Rule.** Coral is used only for destructive actions and error states. Never for decoration, never for secondary actions.

**The Pure Theme Rule.** No custom accent colors are introduced. The system has exactly two semantic accents.

## Typography

**Display Font:** System UI stack (system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
**Body Font:** Same system UI stack
**Label/Mono Font:** Same system UI stack at label size (0.875rem, 500 weight)

**Character:** The system font is the brand. It loads instantly, respects user accessibility settings, and feels native on every platform. No flash, no fallback shuffle, no licensing friction.

### Hierarchy
- **Display** (800 weight, 2.25rem/36px, 1.1 line-height, -0.02em tracking): Hero headlines only — the app title on the home screen.
- **Headline** (600 weight, 1.875rem/30px, 1.2 line-height, -0.01em tracking): Section headers in lists, screen titles.
- **Title** (600 weight, 1.5rem/24px, 1.3 line-height): Card titles, todo item text (when not completed).
- **Body** (400 weight, 1rem/16px, 1.5 line-height): All paragraph copy, form labels, helper text. Max measure 65–75ch.
- **Label** (500 weight, 0.875rem/14px, 1 line-height): Button text, input placeholders, chip labels, metadata.

### Named Rules

**The System Stack Rule.** No custom fonts. The platform stack is the design decision.

**The Weight Discipline Rule.** Only three weights ship: 400 (body), 500 (labels/buttons), 600 (headings), 800 (display). No 300, no 700.

**The Tracking Floor Rule.** Body and label tracking never go below 0em. Display and headlines may tighten to -0.02em/-0.01em respectively.

## Layout

Single-column mobile-first. A 16px (`px-4` / `px-6`) horizontal gutter frames all content. Vertical rhythm follows an 8px base unit: `gap-2` (8px) between tight groups, `gap-3` (12px) between form fields, and 16–24px above headings. Keep product, cart, order, and profile content in readable single-column rows.

**Container behavior:** Full-width on mobile (<640px), max-width 480px centered on tablet/desktop. No multi-column grids in this app.

**Density:** Compact but touch-friendly. Interactive controls have at least 48dp height/width to meet Android touch guidance and exceed the 44pt iOS minimum. Content rows may be shorter when the row itself is not interactive. No spacious desktop density variant; the app is mobile-native first.

**Responsive changes:** Only the container max-width and horizontal padding shift. Typography scale, spacing rhythm, and component sizes stay identical.

## Elevation & Depth

Flat by default. Only one shadow role:

### Shadow Vocabulary
- **Ambient Low** (`0 1px 2px rgba(0,0,0,0.05)` / `shadow-sm shadow-black/5`): Resting state on buttons, inputs, checkboxes, todo items. Gives surfaces a paper-like weight without lifting them.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus) or to distinguish an interactive element from the page background.

**The Single Shadow Rule.** One ambient shadow token. No elevation scale, no `shadow-md`, no `shadow-lg`. All interactive surfaces sit at the same plane, with only subtle ambient depth.

**The No-Structural-Offset Rule.** This system does not use hard offset shadows (`4px 4px 0`). Surfaces are not lifted; they remain visually flat regardless of touch state or task hierarchy.

## Shapes

One corner language: **8px radius** (`rounded-md`, `--radius: 0.5rem`). Applied to buttons, inputs, cards, checkboxes (4px), and any future container.

**Border treatment:** 1px solid `border` token on inputs, checkboxes, and outline-variant buttons. No borders on primary/ghost/destructive buttons.

**Clipping:** None. No geometric masks, no radial-gradient cutouts.

### Named Rules

**The Single Radius Rule.** 8px everywhere. Checkboxes use 4px (half-radius) for visual harmony with their 16px size.

**The Stroke Weight Rule.** Borders are 1px. No 2px, no hairlines.

## Components

### Buttons
- **Shape:** 8px radius. Default, compact, and icon buttons preserve a 48dp minimum touch target; larger actions may grow to 52dp. Let labels wrap or scale with system text settings.
- **Primary:** Ink background, ink-foreground text, ambient shadow. Hover/active: 10% darker ink.
- **Destructive:** Coral background, coral-foreground text, ambient shadow. Hover: 10% darker coral.
- **Outline:** Transparent background, surface-foreground text, 1px border stroke. Hover: surface background.
- **Ghost:** Transparent background, surface-foreground text. Hover: surface background.
- **Link:** No background, ink text, underline on hover/active.
- **Focus:** 3px ring at `focus-ring` token with 50% opacity.
- **Disabled:** 50% opacity, pointer-events-none.

### Inputs / Fields
- **Style:** 8px radius, 48dp minimum height, 1px border stroke, 12px horizontal padding, ambient shadow.
- **Focus:** Border shifts to focus-ring; 3px ring at 50% opacity.
- **Error:** Border + ring shift to coral.
- **Disabled:** 50% opacity, not-allowed cursor.
- **Placeholder:** Muted text color.

### Checkboxes
- **Shape:** 16px square, 4px radius, 1px border stroke, ambient shadow.
  - **Checked:** Ink background + border, white check icon (12px, native stroke weight).
- **Focus:** 3px ring at focus-ring 50% opacity.
- **Hit slop:** Extend the 16px visual control to at least a 48dp touch target.

### Lists / Todo Items
- **Shape:** Full-width row, 12px vertical padding, 16px horizontal padding, 1px border stroke, Paper background, Ambient Low shadow.
- **Content:** Checkbox (left), title text (flex-1, line-through when completed), Destructive Delete button (right, sm size).
- **Empty state:** Centered muted text "No todos yet. Add one above." with loading spinner when fetching.

### Shop, Cart, Orders, and Profile
- **Data:** These screens fetch seeded, read-only sample data from the backend; do not imply live inventory, payment, order processing, or account services.
- **Shop:** Search and category controls sit above a single-column product list with clear product name, category, and price hierarchy.
- **Cart:** Keep item rows scannable and the mock subtotal/summary visually distinct from the item list.
- **Orders:** Group sample order details and status so each record can be scanned quickly.
- **Profile:** Use concise settings rows with clear labels and consistent icon alignment.
- **Navigation:** Keep the five top-level destinations visible in the native tab bar. Preserve platform safe areas and native tab behavior.

### Typography Components (from Text primitive)
- **Display (h1):** Centered, 36px, 800 weight, tight tracking.
- **Headline (h2):** Border-bottom, 30px, 600 weight.
- **Title (h3/h4):** 24px/20px, 600 weight.
- **Body (p):** 16px, 400 weight, 1.5 line-height, mt-3/mt-6 spacing.
- **Muted:** 14px, 400 weight, muted-text color.
- **Code:** Mono, surface background, 13px, 600 weight.

## Do's and Don'ts

### Do:
- **Do** use Ink for exactly one primary action per screen.
- **Do** use subtle ambient depth sparingly and consistently.
- **Do** keep all radii at 8px (4px for checkboxes).
- **Do** use the system font stack at every size.
- **Do** maintain 48dp Android and 44pt iOS minimum touch targets.
- **Do** provide 3px focus rings on every interactive element.
- **Do** invert the full token set for dark mode via CSS custom properties.

### Don't:
- **Don't** introduce a third accent color (no blue, green, purple, amber).
- **Don't** use gradients — not on text, not on backgrounds, not on borders.
- **Don't** use glass/blur effects (`backdrop-filter`, `bg-opacity`).
- **Don't** use colored left/right borders on cards or list items.
- **Don't** use soft shadows (`box-shadow: 0 4px 12px...`) outside the ambient token.
- **Don't** use monospace for anything except code snippets.
- **Don't** use emoji or Unicode glyphs as icons — use `@rn-primitives/checkbox` Check SVG or Lucide.
- **Don't** use geometric masks to approximate organic shapes.
- **Don't** add a second radius value (no `rounded-lg`, no `rounded-full` except icon buttons).
- **Don't** exceed 10% Ink coverage on any screen.
