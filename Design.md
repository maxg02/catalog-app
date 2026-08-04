# Design System Specification: The Digital Curator

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Digital Curator."**

Unlike standard catalog apps that feel like rigid spreadsheets, this system treats digital inventory as a high-end editorial experience. We move away from the "template" look by embracing **Soft Minimalism**—a philosophy where structure is defined by light and air rather than lines and boxes. By utilizing intentional asymmetry, oversized typography scales, and sophisticated tonal layering, we create an environment that feels premium, trustworthy, and effortlessly efficient.

The goal is to provide a "breathable" interface where the product is the hero, supported by a UI that feels like a series of layered, physical sheets of fine paper and frosted glass.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a "High-Value Neutral" foundation, punctuated by a vibrant Azure Blue.

### Color Tokens

- **Primary (The Signature):** `#0059b6` (Azure Blue). Use for primary CTAs and active states.
- **Surface Foundation:**
    - `surface` (`#f5f6f7`): The base canvas.
    - `surface_container_lowest` (`#ffffff`): For high-contrast cards.
    - `surface_container_low` (`#eff1f2`): For subtle sectioning.
- **Text (The Slate):** `on_surface` (`#2c2f30`) for maximum legibility.

### The "No-Line" Rule

**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning content. Boundaries must be defined through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background provides all the separation necessary. We define space through "blocks of light," not "lines of ink."

### The "Glass & Gradient" Rule

To elevate the "out-of-the-box" feel, floating elements (like bottom navigation bars or sticky headers) must utilize **Glassmorphism**. Use semi-transparent `surface` colors with a `backdrop-blur` of 20px–30px.

For Primary CTAs, move beyond flat fills. Apply a subtle linear gradient from `primary` (`#0059b6`) to `primary_container` (`#68a0ff`) at a 135° angle to add "visual soul" and a sense of tactile depth.

---

## 3. Typography

We utilize **Plus Jakarta Sans** for its geometric clarity and approachable warmth. The hierarchy is intentionally dramatic to create an editorial feel.

- **Display (L/M/S):** Used for featured catalog categories or hero sections. These should be set with tight letter-spacing (-0.02em) to feel authoritative.
- **Headline (L/M/S):** Your primary navigational anchors. Use `headline-lg` (`2rem`) for page titles to establish a clear starting point.
- **Body (L/M):** Optimized for readability. `body-lg` (`1rem`) is our workhorse for product descriptions.
- **Label (M/S):** Used for metadata (SKUs, price labels). These use slightly increased letter-spacing (+0.05em) and semi-bold weights to ensure they don't get lost in the "airy" layout.

**Editorial Tip:** Use "Asymmetric Emphasis." Pair a `display-md` headline with a significantly smaller `label-md` sub-header to create a sophisticated, high-contrast visual rhythm.

---

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering** and physics-based light simulation.

### The Layering Principle

Stacking tiers creates natural hierarchy without visual clutter:

1. **Base:** `surface` (#f5f6f7)
2. **Sub-Section:** `surface_container_low` (#eff1f2)
3. **Interactive Card:** `surface_container_lowest` (#ffffff)

### Ambient Shadows

When a card requires a "lift" (e.g., a featured product), use an **Ambient Shadow**:

- **X: 0, Y: 12px, Blur: 32px**
- **Color:** `on_surface` at **6% opacity**.
  This mimics natural light and prevents the UI from looking "dirty" or dated.

### The "Ghost Border" Fallback

If accessibility requirements demand a container boundary, use a **Ghost Border**: 1px stroke using `outline_variant` (#abadae) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Cards & Lists (The Catalog Core)

- **Styling:** Use `md` (1.5rem / 24px) corner radius for large product cards and `DEFAULT` (1rem / 16px) for smaller grid items.
- **Separation:** Forbid divider lines. Use `vertical white space` (24px or 32px) from the spacing scale to separate list items.
- **Feature:** Implement "Overlapping Elements." Allow product imagery to slightly bleed outside the card container or overlap the text for a bespoke, non-grid feel.

### Buttons

- **Primary:** Gradient-filled (`primary` to `primary_container`) with a `full` (9999px) corner radius. This creates a "pill" shape that feels friendly and modern.
- **Tertiary:** Text-only with an icon. No background. Use for low-priority actions like "View Details."

### Chips (Filtering)

- **Selection Chips:** Use `surface_container_high` for unselected and `primary` with `on_primary` text for selected. Roundedness: `sm` (0.5rem).

### Input Fields

- **Interaction:** On focus, the field should not just change border color; it should subtly "lift" using the Ambient Shadow and transition from `surface_container` to `surface_container_lowest`.

---

## 6. Do's and Don'ts

### Do:

- **Do** use white space as a structural tool. If a layout feels crowded, increase the padding rather than adding a line.
- **Do** use "Surface Tinting" for state changes. A pressed button should shift toward `primary_dim` to show weight.
- **Do** align text-heavy catalog items to a 4px baseline grid to maintain professional rigor amidst the "airy" layout.

### Don't:

- **Don't** use pure black (#000000) for text. Always use `on_surface` (Dark Slate) to keep the contrast soft and high-end.
- **Don't** use "Drop Shadows" that are small and dark. They break the illusion of light and air.
- **Don't** use standard system icons without checking their weight. Use "Light" or "Regular" weights to match the Plus Jakarta Sans stroke width.
