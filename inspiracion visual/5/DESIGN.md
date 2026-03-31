# Design System Document: The Friendly Architect

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"The Friendly Architect."** 

In real estate, we often oscillate between the cold, rigid world of blueprints and the emotional, human experience of "home." This system bridges that gap. We reject the sterile, high-density look of traditional fintech in favor of an editorial, spacious, and "haptic" digital environment. 

The aesthetic is characterized by **Soft Structuralism**: using mathematical "squircle" geometries to provide order, but softening them with organic depth, glassmorphism, and tonal layering. By utilizing intentional asymmetry and generous breathing room, we move away from "templates" toward a bespoke, premium experience that feels curated rather than just built.

---

## 2. Colors & Surface Philosophy

Our palette balances the authority of the deep navy (`primary_container`) with the vibrant energy of teal (`secondary`) and amber (`tertiary`).

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   **Context:** Use `surface_container_low` for the main canvas.
*   **Action:** Elevate secondary content areas using `surface_container_highest` or `surface_container_lowest`.

### Surface Hierarchy & Nesting
Think of the UI as a series of stacked, physical layers of fine paper or frosted glass.
*   **Base:** `surface` (#f8f9fa)
*   **Sectioning:** `surface_container` (#edeeef)
*   **Interactive Cards:** `surface_container_lowest` (#ffffff) to create a "pop" against the background.

### The "Glass & Gradient" Rule
Flat colors lack the "soul" required for a premium tool. 
*   **Signature Gradients:** Primary CTAs and progress bars must use a linear gradient from `primary` (#002441) to `primary_container` (#0f3a5f) at a 135° angle.
*   **Glassmorphism:** For floating modals or navigation bars, use `surface_container_lowest` at 70% opacity with a `24px` backdrop-blur. This allows the vibrant teal and amber accents to bleed through the UI, creating a sense of environmental depth.

---

## 3. Typography

The typography strategy uses **Plus Jakarta Sans** for structure (Headlines) and **Manrope** for human readability (Body), focusing on a modern, open feel.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "architectural" elements. Use `display-lg` (3.5rem) with -0.02em letter spacing for hero moments. This conveys authority and modernism.
*   **Body & Titles (Manrope):** To lean into the "Friendly" aspect, our `body-lg` is set at 1rem. We favor generous line-height (1.6) and increased letter spacing (0.01rem) to ensure the interface feels approachable and easy to digest for property owners and managers.
*   **Editorial Hierarchy:** Don't be afraid of high contrast. Pair a `headline-lg` with a `body-sm` in `on_surface_variant` (#42474e) to create a sophisticated, magazine-like layout.

---

## 4. Elevation & Depth

We move away from the "flat" web by embracing **Tonal Layering.**

*   **The Layering Principle:** Instead of shadows, use the spacing scale (`spacing-4` or `spacing-6`) and background shifts to separate ideas. A card (`surface_container_lowest`) sitting on a section (`surface_container_low`) provides all the visual affordance needed.
*   **Ambient Shadows:** For elements that truly "float" (e.g., Achievement Badges), use a tinted shadow.
    *   *Shadow Recipe:* `0px 20px 40px rgba(15, 58, 95, 0.08)`. The use of the navy base in the shadow mimics natural light absorption.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` (#c3c7cf) at 15% opacity. Never use 100% opaque lines.
*   **Squircle Radii:** Consistency is key to the "Friendly Architect" look. 
    *   Main Containers: `rounded-xl` (3rem)
    *   Cards/Inputs: `rounded-lg` (2rem)
    *   Chips/Small Elements: `rounded-md` (1.5rem)

---

## 5. Components

### Buttons & CTAs
*   **Primary:** Gradient (`primary` to `primary_container`), `rounded-full`, with a subtle `primary_fixed` inner glow.
*   **Secondary:** `surface_container_highest` background with `on_primary_container` text. No border.
*   **Success Action:** Use the Teal `secondary` (#006a65) for "celebratory" actions like "Finalizar Contrato."

### Achievement Badges (Gamification)
Instead of standard icons, use **Achievement-style Badges**. These should be circular or squircle-shaped, using `tertiary_fixed` (Amber) for the background and `on_tertiary_container` for the icon/text. 
*   *Interaction:* When a task is completed, trigger a micro-scale animation (1.05x) and a subtle amber glow.

### Progress Rings
Replace horizontal bars with **Architectural Progress Rings**. Use `outline_variant` for the track and a gradient of `secondary` (Teal) for the progress fill. Place the percentage in `title-md` (Manrope) in the center.

### Input Fields
*   **Style:** `surface_container_lowest` with a `rounded-md` (1.5rem) corner. 
*   **State:** On focus, the background remains white, but a 2px "Ghost Border" of `surface_tint` (#3c6188) appears with a 4px soft outer glow.

### Cards & Lists
*   **No Dividers:** Prohibit the use of horizontal rules (`<hr>`). 
*   **Separation:** Use `spacing-4` (1.4rem) of vertical white space or alternate background tones (`surface_container_low` vs `surface_container`).

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts (e.g., a large image on the left, high-contrast text on the right) to create an editorial feel.
*   **Do** use "Celebratory" amber for milestones. Real estate management is stressful; reward the user visually.
*   **Do** use micro-illustrations with thin, architectural lines and soft color fills to explain complex states.

### Don’t
*   **Don't** use sharp 90-degree corners. Everything must feel "held" and safe.
*   **Don't** use pure black (#000000) for text. Use `on_background` (#191c1d) to maintain warmth.
*   **Don't** cram information. If a screen feels full, increase the `spacing` tokens and move content to a secondary "nested" layer.
*   **Don't** use standard "Fintech Blue." Always lean into the Deep Navy/Teal/Amber triad to keep the brand distinct.

---

## 7. Spacing & Rhythm

Use a **Soft-Grid** approach based on the `0.7rem` increment (token `2`).
*   **Inner Padding:** Use `spacing-4` (1.4rem) for internal card padding.
*   **Section Gaps:** Use `spacing-12` (4rem) or `spacing-16` (5.5rem) between major content blocks to ensure the "Architectural" sense of space.
*   **Micro-spacing:** Use `spacing-1.5` (0.5rem) for labeling and small icon-text pairings.