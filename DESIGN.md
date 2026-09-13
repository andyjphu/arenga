---
name: arenga
description: a dense text surface where serif carries argument and mono carries machine text
colors:
  paper: "#f6f5f0"
  panel: "#eeece4"
  ink: "#16150f"
  ink-2: "#57544a"
  ink-3: "#78756a"
  rule: "#d9d6c9"
  rule-2: "#c6c2b2"
  sap: "#91500f"
  frond: "#2f4f3a"
  selection: "#e7d9bd"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "normal"
  body-dense:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "normal"
  label:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "0.04em"
  machine:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
spacing:
  row: "0.875rem"
  block: "1.25rem"
  section: "2.25rem"
  gutter: "1rem"
  gutter-wide: "1.5rem"
components:
  link-inline:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
  link-inline-hover:
    textColor: "{colors.sap}"
  link-inline-visited:
    textColor: "{colors.ink-2}"
  link-machine:
    textColor: "{colors.sap}"
    typography: "{typography.machine}"
    rounded: "{rounded.none}"
  navlink:
    textColor: "{colors.ink-2}"
    typography: "{typography.body-dense}"
    rounded: "{rounded.none}"
  navlink-hover:
    textColor: "{colors.sap}"
  probe-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.875rem 0"
  section-heading:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  command-block:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.machine}"
    rounded: "{rounded.none}"
    padding: "1rem 0"
  disposition-tag:
    textColor: "{colors.frond}"
    typography: "{typography.machine}"
    rounded: "{rounded.none}"
  empty-slot:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "9rem"
---

# Design System: arenga

## Overview

**Creative North Star: "The Reading Surface"**

arenga has no theme and no metaphor. It is the shape that lesswrong, hacker news
and reddit share once their differences are stripped off: an item list and an
attention signal, set in text dense enough that a reader can judge the argument
in fifteen seconds without being sold anything. The palette borrows its two
non-neutral values from the sugar palm the project is named for, amber sap and
frond green, but they are working colors with jobs, not a costume. Nothing on
this surface exists to set a mood.

Depth is entirely absent. There are no cards, no shadows, no gradients, no icon
tiles, no rounded corners anywhere. Structure comes from hairline rules, a
single tonal panel value, and the difference between two typefaces. The one
authored motion moment, probe rows settling in sequence, starts from a state
that is already legible if it never runs.

The only ornament is the type split: Literata carries argument, Geist Mono
carries machine text. That split is load bearing, not decorative, and it is the
first thing a new surface has to get right. Site copy is all lowercase and free
of em dashes, inherited as a brand requirement, and the register is flat: the
page never praises, reassures, or urges.

**Key Characteristics:**
- Flat paper, zero elevation, zero radius
- Hairline rules as the only container
- One serif, one mono, and nothing else
- Two accents with exactly one job each
- Single measured column (45rem shell, 68ch text measure)
- Tabular numerals on every rendered figure

## Colors

A warm off-white paper with near-black ink, plus two working accents pulled from
the sugar palm; the whole surface inverts to a dark warm paper under
`prefers-color-scheme: dark`, with both accents lightened to hold contrast
(sap `#d6933d`, frond `#8fb293`).

### Primary
- **Palm Sap Amber** (`{colors.sap}`): every interactive affordance. Link
  underlines and their hover thickening, hover text color, the focus ring, the
  caret, the printed start command, the `/arena` route in the masthead. If
  something on the page can be acted on, this is how the reader knows.

### Secondary
- **Frond Green** (`{colors.frond}`): one job only, the disposition tag on each
  probe row and the masthead frond mark. It classifies; it never links.

### Neutral
- **Warm Paper** (`{colors.paper}`): the page ground. Set on `html`, not `body`,
  so overscroll stays in the world.
- **Panel** (`{colors.panel}`): the one tonal step available above paper.
- **Ink** (`{colors.ink}`): all argument text.
- **Muted Ink** (`{colors.ink-2}`): secondary text, nav rest state, the
  "refuses" line, section labels, visited links.
- **Faded Ink** (`{colors.ink-3}`): deliberately receding text. Currently only
  the empty-state mark.
- **Hairline** (`{colors.rule}`): the row and section rules that do the work of
  containers.
- **Hairline Heavy** (`{colors.rule-2}`): the two structural edges, under the
  masthead and above the footer, plus the scrollbar thumb.
- **Selection Amber** (`{colors.selection}`): text selection ground, with ink
  kept as the foreground.

### Named Rules
**The Two Signal Rule.** The palette carries exactly two non-neutral values and
each owns one meaning: amber means acting, green means classifying. A new
surface that needs a third meaning uses an ink step, not a new hue.

**The Three Inks Rule.** Text lives at one of three weights of the same warm
black. Anything quieter than faded ink is not quiet, it is missing.

**The Browser Surface Rule.** Theming does not stop at the page: scrollbar,
selection, and caret all carry project colors. A new surface sets them too.

## Typography

**Display / Body Font:** Literata (with Georgia, serif), via `next/font`
**Label/Mono Font:** Geist Mono (with ui-monospace, SFMono-Regular, Menlo)

**Character:** A screen-built book serif against a tight, technical mono. The
serif reads long and settles; the mono reads as something a machine printed. The
distance between them is the whole visual idea.

### Hierarchy
- **Display** (600, 1.6rem, 1.25, -0.025em): the single page thesis line. One
  per surface.
- **Title** (600, 1.05rem, -0.025em): the wordmark. Same treatment as display,
  one step down.
- **Body** (400, 16px, 1.58): all argument prose, held to a 68ch measure with
  0.8em between paragraphs.
- **Body Dense** (400, 0.95rem, 1.375): list content and supporting prose, where
  rows need to pack without shrinking below reading size.
- **Label** (400, 0.78rem, 0.04em, muted ink): field names inside rows
  ("measures", "refuses"). Section headings use the same treatment opened to
  0.1em tracking, and are always real heading elements with an id.
- **Machine** (400, 12.5px, -0.01em, tabular numerals): routes, counts,
  dispositions, shell commands, the domain.

### Named Rules
**The Split Rule.** Serif carries argument. Mono carries machine text: routes,
counts, dispositions, shell commands, anything an agent would read verbatim.
Nothing else. Mono is never worn as a costume to make prose look technical, and
serif is never used to print a command.

**The Tabular Numeral Rule.** Every figure rendered in mono uses tabular
numerals so columns of counts and ranks align without a table.

**The Lowercase Copy Rule.** Nav, labels, headings and body copy are lowercase;
proper nouns keep their case. No em dashes anywhere. This is a brand
requirement, not a stylistic preference, and it is checked mechanically.

## Layout

One column, centered, capped at 45rem with a 1rem gutter that opens to 1.5rem at
the `sm` breakpoint (640px). Text inside that column is further held to a 68ch
measure, so prose never runs the full shell width. There is no grid and no
sidebar; the mobile and desktop layouts are the same layout at different widths,
and the only responsive moves are the gutter step, the domain marker appearing
at `sm`, the probe row's definition pairs going from stacked to a
`4.75rem` label column at `sm`, and the command block stepping from 11px to
12.5px.

Vertical rhythm is coarse and consistent: 0.875rem inside a list row, 1.25rem
under a prose block, 2.25rem between sections, with the masthead at 0.625rem and
the footer at 1rem. Sections are separated by space and by hairline rules, never
by a container.

**The Rule Is The Container Rule.** Grouping is expressed by a 1px horizontal
rule and vertical spacing. Nothing on this surface gets a box, a background
tint, or a padded card to say "these belong together."

## Elevation & Depth

There is no elevation. No `box-shadow` exists anywhere in the build, and none
may be added. Depth, where it is implied at all, comes from a single tonal step
(panel above paper) and from two weights of hairline: the light rule for
repeating separators, the heavier rule for the two structural edges that close
the masthead and open the footer.

**The Flat Paper Rule.** Surfaces are paper. If a new element seems to need a
shadow to read, it needs a rule, a space step, or a different ink weight
instead.

## Shapes

Nothing is rounded. Every corner in the build is square (0 radius), including
the empty-state slot and the command block, both of which are bounded by
top-and-bottom rules rather than a full border. Borders are 1px only, and are
used on single edges (`border-b`, `border-t`, `border-y`), never as a full
outline around a region. The one drawn form on the surface is the frond mark:
open strokes, 1.15px leaflets against a 1.7px rachis, round caps, no fill. Line
art, not a filled glyph.

**The Single Edge Rule.** Borders mark a boundary between things, so they appear
on one or two edges. A four-sided border draws a box, and this system has no
boxes.

## Components

### Links
- **Character:** a printed reference, not a button.
- **Inline (`.link`):** ink text with an amber 1px underline at 3px offset;
  hover thickens the underline to 2px and does not move anything. Visited drops
  the text to muted ink.
- **Nav (`.navlink`):** muted ink, no underline at rest; hover adds the amber
  underline and shifts the text to amber.
- **Focus:** a 2px amber outline at 2px offset, global and never removed.
- **There are no buttons in this build.** The primary action is a printed curl
  command the reader copies. A future button inherits the flat, square, single-edge
  language; it does not introduce a fill radius.

### Probe Row (signature)
- **Character:** a dense index entry, closer to a bibliography line than a card.
- **Shape:** full-bleed within the column, square, separated by a bottom
  hairline, 0.875rem vertical padding.
- **Structure:** a mono rank in a fixed 1rem right-aligned column, the mono
  route as the link, the disposition tag in frond green; below it a definition
  list indented to 1.625rem pairing "measures" (ink) against "refuses" (muted
  ink).
- **Motion:** rows settle in sequence, 520ms on `cubic-bezier(0.16, 1, 0.3, 1)`,
  55ms apart, from opacity 0.35 and 7px below rest, `backwards` so nothing
  flashes. The entire animation block sits inside
  `prefers-reduced-motion: no-preference`.

### Command Block
- **Character:** the thing you actually came for, printed plainly.
- **Style:** mono at 11px rising to 12.5px at `sm`, relaxed leading, bounded top
  and bottom by hairlines, horizontally scrollable, 1rem vertical padding, no
  background tint, no copy button, no chrome.
- **The single-line start command** is printed in amber inside the lede, as the
  one place accent color carries a whole string.

### Empty Slot
- **Character:** a panel that has nothing true to put in it yet, and says so.
- **Style:** 9rem minimum height, bounded top and bottom by hairlines, content
  centered, `overflow: hidden`; the mark is mono, medium, rotated -11deg, scaled
  `clamp(1.75rem, 6vw, 3.25rem)`, tracked open to 0.22em, in faded ink and
  unselectable.
- This is a deliberate empty state, not a placeholder to be filled with
  decoration. It is replaced only by real measured data.

### Masthead Mark (signature)
- **Character:** a drawn pinnate frond, one leaflet pair per probe, so the mark
  measures the suite instead of decorating it.
- **Style:** inline SVG on a 72x42 viewBox, 3.6rem wide, frond green, stroked
  never filled; leaflets attach along a quadratic rachis and shorten toward the
  tip. Marked `aria-hidden` because the wordmark beside it carries the name.

**The Derived Number Rule.** Every number rendered on a surface, including the
leaflet count in the mark, is computed from `lib/probes/` at render time. No
figure is typed into a component, and no figure that is not measured appears at
all.

**The Legible-From-Rest Rule.** Animation may only move an element from a state
that is already readable. If turning the animation off changes what the page
says, the animation is doing work it should not be doing.

## Do's and Don'ts

### Do:
- **Do** keep serif on argument and mono on machine text, and treat that split
  as the surface's only ornament.
- **Do** express grouping with a 1px hairline and vertical space; use the
  heavier rule (`{colors.rule-2}`) only for the two structural edges.
- **Do** hold prose to a 68ch measure inside the 45rem shell.
- **Do** give amber every interactive affordance and green nothing but
  classification.
- **Do** set tabular numerals on any rendered figure.
- **Do** derive every number on the page from `lib/probes/` at render time.
- **Do** theme the browser surface (selection, caret, scrollbar, focus ring)
  alongside the page.
- **Do** wrap any motion in `prefers-reduced-motion: no-preference` and start it
  from a legible state.
- **Do** write copy lowercase, flat in register, with no em dashes.

### Don't:
- **Don't** add a shadow, gradient, card, icon tile, or corner radius. The
  system is flat, square, and rule-bound.
- **Don't** put a four-sided border around a region; single edges only.
- **Don't** set mono on prose to make it look technical, or set serif on a
  command.
- **Don't** introduce a third hue. A new meaning takes an ink step.
- **Don't** print a count, rank, or result that is not derived from real data;
  there are no users, no adoption numbers, and no published results to show.
- **Don't** fill the results slot with decoration while it waits for real
  measurements.
- **Don't** use a glyph-font or packaged icon set; the one mark on this surface
  is drawn as stroked SVG.
