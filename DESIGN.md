# Design System

This project uses a **dark terminal / developer aesthetic**. All UI must match these rules — never use light backgrounds or generic Tailwind utility colours for new components.

## Colours

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0f` | Page / panel background |
| Surface | `rgba(255,255,255,0.03)` | Input fields, cards |
| Border | `rgba(255,255,255,0.07)` | Dividers, container borders |
| Border active | `rgba(255,255,255,0.1–0.25)` | Hover / focus borders |
| Accent / primary | `#00e5a0` | CTAs, links, active states, logo |
| Accent muted | `rgba(0,229,160,0.6)` | Secondary accent text |
| Accent bg | `rgba(0,229,160,0.06–0.15)` | Tinted backgrounds |
| Text primary | `#f5f5f0` / `#e8e8e8` | Headings, body copy |
| Text muted | `rgba(255,255,255,0.28–0.45)` | Labels, secondary copy |
| Text subtle | `rgba(255,255,255,0.18–0.25)` | Placeholders, captions |
| Error | `rgba(255,107,107,0.8)` | Validation errors |
| Error border | `rgba(255,107,107,0.5)` | Error input border |

## Typography

| Role | Font | Size | Notes |
|---|---|---|---|
| UI labels / codes | `'Courier New', monospace` | 0.65–0.8rem | UPPERCASE + letter-spacing |
| Body / prose | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | 0.85–0.95rem | |
| Display headings | `'Georgia', 'Times New Roman', serif` | 1.6–2.2rem | font-weight 400, negative letter-spacing |
| Brand logo | `'Courier New', monospace` | 1–1.1rem | `<devAI />` in accent colour |

Letter-spacing for monospace labels: `0.06–0.16em`.  
Headings use `letter-spacing: -0.02em` to `-0.03em`.

## Borders & Shape

- Border radius: **3–4px** (sharp corners, not rounded).
- Borders use semi-transparent white or accent at low opacity — never solid opaque colours.

## Styling approach

- Use **inline styles** for component-level styles (existing pattern in this codebase).
- Use Tailwind only where it already exists in a file — don't mix the two in the same component.
- Interactive elements need `transition: 'all 0.2s'` and `onMouseEnter`/`onMouseLeave` handlers for hover states.

## Spacing & Layout

- Page padding: `2rem` horizontal, `2.5–3rem` vertical.
- Max content width: `1280px` (`max-w-7xl`), centred.
- Sticky navbar height: `56px`, `background: rgba(10,10,15,0.95)` with `backdropFilter: blur(8px)`.

## Component patterns

### Buttons (primary)
```
background: #00e5a0
color: #0a0a0f
font-family: Courier New monospace
font-size: 0.8rem
letter-spacing: 0.1em
font-weight: 700
border-radius: 3px
padding: 0.875rem
```

### Buttons (ghost / secondary)
```
background: transparent
border: 1px solid rgba(255,255,255,0.1)
color: rgba(255,255,255,0.35–0.5)
hover border: rgba(255,255,255,0.25)
hover color: rgba(255,255,255,0.8)
```

### Inputs
```
background: rgba(255,255,255,0.03)  [focus: rgba(0,229,160,0.04)]
border: 1px solid rgba(255,255,255,0.1)  [focus: rgba(0,229,160,0.4)]
color: #f0f0ea
font-family: Courier New monospace
padding: 0.75rem 1rem
border-radius: 3px
```

### Avatar circle
```
width/height: 30px, border-radius: 50%
background: rgba(0,229,160,0.12–0.15)
border: 1px solid rgba(0,229,160,0.25–0.3)
color: #00e5a0
font: Courier New, 0.6–0.65rem, bold
```

## Brand

- Logo text: `<devAI />`
- Product name: **devAI** (display) / **AI Developer** (long form)
- Tagline: *"Review. Debug. Ship."*
