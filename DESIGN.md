---
name: Elite Performance Track
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e5'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fe'
  surface-container: '#ecedf9'
  surface-container-high: '#e6e8f3'
  surface-container-highest: '#e0e2ed'
  on-surface: '#181c23'
  on-surface-variant: '#414755'
  inverse-surface: '#2d3039'
  inverse-on-surface: '#eef0fc'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb595'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f9f9ff'
  on-background: '#181c23'
  surface-variant: '#e0e2ed'
  atletica-blue: '#007AFF'
  track-navy: '#0F172A'
  finish-white: '#FFFFFF'
  split-gray: '#64748B'
  velocity-cyan: '#00E5FF'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: ui-monospace
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1.5rem
  stack-lg: 3rem
---

## Brand & Style

The design system for Marco Guglielmino is built on the intersection of technical precision and athletic momentum. It embodies the "Azzurro" spirit—passionate yet disciplined. The personality is elite, performance-driven, and transparent, mirroring the data-rich world of middle-distance running.

The aesthetic follows a **Corporate / Modern** style with heavy influence from high-performance SaaS dashboards (Nuxt UI). It utilizes a high-contrast layout, intentional whitespace, and subtle technical accents to evoke a sense of professional track and field data management. The interface must feel fast, responsive, and authoritative.

## Colors

The palette is anchored by "Atletica Blue," a vibrant, high-energy azzurro that represents the Italian national athletic identity. This is paired with "Track Navy" to provide depth and professional weight.

- **Primary (Atletica Blue):** Used for primary actions, progress indicators, and key data highlights.
- **Secondary (Track Navy):** Used for navigation backgrounds, heavy headings, and card strokes.
- **Neutral:** A range of grays derived from Nuxt UI's palette to handle metadata and borders without competing with the brand colors.
- **Velocity Cyan:** A specialized accent color reserved for "Personal Best" indicators or record-breaking data points.

## Typography

Typography is used to convey speed. All headline levels utilize **Montserrat** in heavy weights with a mandatory **italic** slant to simulate forward motion. 

**Inter** provides the functional counterbalance for long-form blog content and race reports, ensuring high legibility. A specialized "Data Mono" role is defined for race times and split calculations, ensuring numbers align perfectly in vertical data tables, reminiscent of a track timer.

## Layout & Spacing

The system uses a **Fixed Grid** on desktop (12 columns) and a fluid single-column layout on mobile. The rhythm is dense but organized, similar to a dashboard.

- **Grid:** 12-column layout with 24px gutters.
- **Data Density:** Information-heavy cards (like Strava-style splits) should use a compact 8px padding system to keep technical data visible without excessive scrolling.
- **Responsive Behavior:** On tablet, the 12-column grid collapses to 6 columns. On mobile, all cards become full-width with 16px side margins.

## Elevation & Depth

To maintain the clean "Nuxt UI" feel, the system avoids heavy shadows. Instead, it uses **Low-contrast outlines** and **Tonal layers**.

- **Cards:** White surfaces with a 1px solid border in `split-gray` at 20% opacity. 
- **Active States:** Subtle 4px "Atletica Blue" shadow with high diffusion (0% spread) to indicate focus without feeling heavy.
- **Layering:** Use primary navy backgrounds for the global header to ground the page, while the main content area lives on a light gray (#F8FAFC) background to make white data cards "pop."

## Shapes

The shape language is "Soft" (0.25rem). This choice maintains a technical, "engineered" look while avoiding the harshness of sharp corners. This level of roundedness is applied to buttons, input fields, and data cards. Large featured images or "Shoe of the Day" cards may use `rounded-lg` (0.5rem) to provide a slightly more editorial feel.

## Components

### Athletic Data Cards (Strava-style)
Cards featuring an activity map and key metrics (Distance, Pace, Time). The Pace should always be displayed in the "Data Mono" font style. Backgrounds for metric sections should use a very faint blue tint to group data visually.

### Blog Metadata (Shoes Worn)
A specialized chip component for blog posts. It should include a small thumbnail of the shoe and the model name in `label-bold` style. Use a high-contrast navy background with white text to make it stand out as a "technical spec."

### Buttons
- **Primary:** Solid "Atletica Blue" with white Montserrat Italic text.
- **Secondary:** Outlined "Track Navy" with a subtle hover fill.
- **Ghost:** Transparent with Navy text, used for social sharing or "View More" actions.

### Social Sharing
A compact horizontal bar containing icon-only buttons. Use brand-specific colors for the icons (e.g., Strava Orange, Instagram Gradient) but keep the container styles consistent with the overall system's roundedness and stroke weight.

### Performance Indicators
Small, circular badges or "tags" used to denote "PB" (Personal Best), "Course Record," or "Season Best." These should use the `velocity-cyan` color to draw immediate visual attention.