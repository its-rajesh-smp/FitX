---
name: auth-design
description: Build a calm, editorial split-screen sign-in / sign-up page with a painted landscape art panel on one side and a compact auth card on the other. Use when designing or restyling auth pages (sign in, sign up, reset) in any web project, with any auth provider.
---

# Auth page design

The page should feel like an editorial spread, not a form dump: a quiet painted scene with a few lines of voice on one side, and a compact, almost boring card on the other. Taste first, then mechanics.

This is a pattern, not a template. Pick a new scene, palette, voice and side for each product. Keep the proportions and the rules.

## Layout

- **Full page, never a modal.** Use dedicated routes (`/sign-in`, `/sign-up`). A modal can't hold the art and feels cramped.
- **Two columns on desktop, about 58/42.** The art panel is the wider one (`grid-cols-[1.4fr_1fr]`). Put it on whichever side suits the product (left reads as "story first", right as "form first") and keep that side consistent across sign-in and sign-up.
- **Phones: form only.** Hide the art panel below `lg`. Show the wordmark above the card instead.
- **The form column never scrolls.** It is a fixed-height flex column (`h-full overflow-hidden`): a top row for "← Back", then the card and its footer centred in the remaining space. A scrollbar there looks broken. Check that the tallest variant (sign-up with the password field) fits at about 680px of viewport height.
- **The back link sits in its own row, not absolute.** Absolutely positioned, it collides with the card on short screens.

## The art panel

### Structure (top to bottom)

1. **Wordmark:** small mono caps with wide tracking (`font-mono text-[12px] tracking-[0.3em] uppercase`), with an optional tiny logo mark. About 60px from the top, about 48px side padding.
2. **Statement:** one quote or claim of 2–3 lines. `text-[22px] leading-[1.45] font-medium tracking-[-0.02em]`, max about 540px wide. It should be roughly 1.3× the auth card's title size, no bigger. Larger reads as a landing page.
3. **Attribution:** one short line, 15px, muted ("The creator, honestly").
4. **Divider:** a 64px hairline (`h-px w-16`, about 15% ink), with about 36px of space around it.
5. **Two smaller lines:** quotes or product truths, 15px muted, about 16px apart. Indent the second one about 24px (`even:pl-6`). The stagger is the signature detail.

Everything above sits on **flat sky**. Nothing painted goes behind text.

### The artwork

- **A wide strip pinned to the bottom.** Render it full panel width with natural height (`absolute inset-x-0 bottom-0 w-full h-auto`), not `object-cover` over the whole panel. Cover-cropping pushes the scenery up behind the text on wide panels.
- **The panel background is the image's top-edge colour.** Generate the image with a flat, uniform sky at its top edge. Sample that pixel and set it as the panel's background colour. The art then melts into the panel with no seam, gradient or overlay.
- **Crop before shipping.** Trim most of the empty sky so the strip's aspect ratio is about 2.1:1. Keep the tallest peak or cliff with some margin above it.
- **The art panel stays light in dark mode.** Only the form column follows the theme. Hard-code the art panel's text colours (`text-stone-900` / `text-stone-600`) so they don't flip.
- **Ship WebP.** Expect 90–180 KB at quality 86, down from 2–3 MB PNGs. Use `next/image` (or equivalent) with `priority` and a blur placeholder.

### Image taste

- Soft painterly realism, like a hazy watercolour-oil painting. Calm, airy, light overall, never photographic or saturated.
- Real places with water and land: a coast, a lake, a fjord, an alpine meadow. Mountains, beaches and water read as "breathing room".
- **No** people, buildings, boats, text, logos, clouds near the top, or large dark areas.
- Match the palette to the brand accent: butter for warm brands, aqua and peach for fresh ones, lilac and blue for calm ones.

### Image prompt template

Keep each prompt in its own file and pass it with `--prompt-file`. Multi-line prompts passed inline through shell loops silently lose lines.

```
Use case: wide illustration along the bottom of a website sign-in panel; its top edge blends into a flat background colour.
Scene: <place, time of day, the main subject on one side, a foreground with texture (grass, sand, pebbles, flowers)>.
Palette: <sky colour>, <2–3 scene colours>.
Composition (strict): landscape. The upper 40% of the image is empty, plain, even pale sky with no clouds, no texture and no detail, becoming a perfectly flat uniform colour along the very top edge. Nothing rises above 40% from the top: the tallest peak or cliff top sits at about 42% down. Main subject in the middle band; ground and foreground fill the bottom 35%.
Style: soft painterly realism, hazy watercolor-oil painting; gentle atmospheric haze; calm, airy and light overall, so dark text can sit on the sky.
Avoid: text, logos, people, buildings, boats, birds, any clouds in the upper half, harsh contrast, oversaturated colours, large dark areas.
```

Generate at 1536×1024 and high quality. Make 3 variants with different scenes and palettes. Preview each **in the real panel** (screenshot at the target viewport), not as a loose image, and let the user pick.

## The form column

- **Use the auth provider's default card size** (Clerk's is about 400px wide, with a 17px title and 13px subtitle). Don't inflate it. The art carries the personality, and the card should be compact and familiar.
- **Theme with variables, not overrides.** For Clerk, map the `--clerk-color-*` CSS variables to the app's design tokens in global CSS (primary → ink, primary-foreground → canvas, background → surface, input → surface, border → strong line, ring → accent). Light and dark mode then come for free. Set `appearance.cssLayerName` and declare `@layer theme, base, clerk, components, utilities;` so Tailwind wins.
- **Move the sign-in/sign-up switch out of the card.** Hide the provider's footer action and render your own line under the card: "Don't have an account? **Sign up**". Under that, add Privacy Policy and Terms links at 14px, subtle colour.
- **Primary button = ink on canvas.** It inverts automatically in dark mode, so the card looks native in both themes.
- **Social sign-in first**, then "or", then email, using block buttons (not icon buttons) for one or two providers.

## Honesty rules

- **No invented social proof:** no "★★★★★ Used by 8,000+ users", user counts or ratings that aren't real.
- **Quotes must be real.** Placeholder quotes are fine during design, but mark them clearly in code (`// Placeholders until real quotes are in.`) and point them out to the user.
- **Legal links need real pages** before launch.

## Verify before calling it done

- Screenshot sign-in and sign-up at 1512×750, at about 1100px wide, and at 680px tall, in light and dark mode.
- Check that no text overlaps painted scenery at any of those sizes, and that the art's top edge shows no seam.
- Check that the form column has no scrollbar and nothing is clipped at 680px tall.
- Check that the console has no hydration errors. Browser extensions that add attributes to `<body>` need `suppressHydrationWarning` on `<body>`, the same as `<html>` gets for theme classes.
