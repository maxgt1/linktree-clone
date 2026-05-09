---
name: Vibrant Link System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#484554'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#797586'
  outline-variant: '#c9c4d7'
  surface-tint: '#6042d6'
  primary: '#451ebb'
  on-primary: '#ffffff'
  primary-container: '#5d3fd3'
  on-primary-container: '#d8ceff'
  inverse-primary: '#cabeff'
  secondary: '#00677e'
  on-secondary: '#ffffff'
  secondary-container: '#00d2fd'
  on-secondary-container: '#005669'
  tertiary: '#424546'
  on-tertiary: '#ffffff'
  tertiary-container: '#5a5c5d'
  on-tertiary-container: '#d3d5d6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6deff'
  primary-fixed-dim: '#cabeff'
  on-primary-fixed: '#1c0062'
  on-primary-fixed-variant: '#4723be'
  secondary-fixed: '#b4ebff'
  secondary-fixed-dim: '#3cd7ff'
  on-secondary-fixed: '#001f27'
  on-secondary-fixed-variant: '#004e5f'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  container-margin: 1.25rem
  gutter: 1rem
---

## Brand & Style

This design system is built for high-impact personal branding within a mobile-first context. It merges **Minimalism** with **Modern Corporate** sensibilities, utilizing expansive white space to let user content breathe while employing a singular, high-energy accent color to drive action.

The aesthetic is "Professional-Creative"—it maintains the reliability of a fintech app with the expressive energy of a social media platform. The UI feels "touch-friendly" and approachable, using soft depth and organic shapes to encourage interaction. The goal is to provide a neutral yet sophisticated stage where the user’s personal brand remains the protagonist.

## Colors

The palette is anchored by **Deep Violet (#5D3FD3)**, a color that represents both stability and creativity. This is used exclusively for primary actions, active states, and brand-critical elements. 

- **Primary:** Deep Violet for main CTAs and branding.
- **Surface:** Pure White (#FFFFFF) for the primary card and page backgrounds to ensure maximum clarity.
- **Background:** Soft Grey (#F2F4F7) for page-level backgrounds to create a subtle contrast with white content cards.
- **Text:** High-contrast Off-Black (#1A1A1A) for readability, with a Mid-Grey (#667085) for secondary metadata.
- **Success/Error:** Vibrant Green and Red are used sparingly, maintaining the system's clean look.

## Typography

This design system utilizes **Plus Jakarta Sans** for headlines to provide a modern, slightly geometric, and friendly character. Its bold weights are particularly effective for mobile "link-in-bio" headers. **Inter** is used for all body text and labels to ensure maximum legibility and a clean, utilitarian feel at smaller sizes.

For mobile-specific optimization:
- Use `display-lg` only for short, punchy hero text.
- Headlines use a tighter letter-spacing to feel more cohesive and "bold."
- Body text maintains a generous line height to prevent the UI from feeling cluttered on small screens.

## Layout & Spacing

The system follows a **Fluid Grid** model optimized for mobile viewport widths. 

- **Margins:** A standard 20px (1.25rem) margin is applied to the left and right of the main container.
- **Vertical Rhythm:** Elements are stacked using an 8px base grid. Sections are separated by `xl` spacing, while related items within a card use `sm` or `md` spacing.
- **Safe Areas:** Design components to respect the top notch and bottom home indicator on modern mobile devices.
- **Alignment:** Content is primarily center-aligned for "link-tree" style profiles, but shifts to left-aligned for administrative or settings views.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. 

1. **Base Layer:** The background uses the Tertiary Soft Grey (#F2F4F7).
2. **Surface Layer:** Interactive links and content modules sit on Pure White cards.
3. **Shadows:** Surfaces use a custom "Soft Touch" shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`. This creates a sense of lift without the UI feeling heavy or dated.
4. **Active State:** When pressed, buttons and cards should slightly scale down (to 0.98) and the shadow should diminish, simulating a physical "press."

## Shapes

The shape language is consistently **Rounded**, reflecting a modern and friendly vibe. 

- **Standard Buttons & Cards:** Use a 16px (1rem) corner radius.
- **Input Fields:** Follow the same 16px radius for visual consistency.
- **Avatars:** Profile images should always be circular (pill-shaped) to differentiate them from interactive link cards.
- **Icon Enclosures:** Small utility icons should be placed within soft-rounded squares (8px radius).

## Components

### Buttons
Primary buttons use the Deep Violet background with White text. They feature a 16px corner radius and a subtle shadow. Secondary buttons use a transparent background with a 1px border of the Primary color or a soft grey.

### Link Cards
The core of the app. These are white, full-width containers with 16px padding. They should include a leading slot for an icon or thumbnail and a trailing slot for an arrow or "share" indicator.

### Chips
Used for categories or tags (e.g., "New", "Video", "Music"). These are pill-shaped with a light tint of the primary color (10% opacity) and bold text in the primary color.

### Input Fields
Clean, minimal fields with a light grey border. Upon focus, the border transitions to Deep Violet with a 2px thickness. Labels are placed above the field in `label-sm`.

### Social Icons
A dedicated tray at the bottom or top of the profile. Icons are monochromatic (Mid-Grey) to avoid clashing with the user's primary link content, shifting to the Primary color on hover/tap.

### Progress Indicators
Thin, vibrant bars using the secondary accent color (#00D4FF) to indicate loading or profile completion stats.