# Tess - AI Tech Copilot

Interactive prototype for the **Radix Design Challenge**, by Yuri Saback (Senior Product Designer).

Tess is a hypothetical AI assistant that helps field service engineers find, understand and verify technical information about medical equipment. It supports the professional; it does not authorize procedures or replace manufacturer instructions.

- **Live prototype:** https://radix-design-challenge.vercel.app
- **Design file (Figma):** https://www.figma.com/design/bmogfb7skbdfv30rUgvtCs
- **Product requirements:** the PRD supplied with the challenge (`AI-Technical-Copilot-PRD-v2.pdf`)

> All content is simulated. The equipment (Meridian IP-300 infusion pump), the manuals and the procedures are fictional and are not manufacturer guidance. No real equipment, database or AI model is connected.

## How to use the prototype

The prototype is built mobile first and opens as a phone mockup. Everything testable happens inside the phone.

1. Start with the first suggestion ("Resume last topic"), or tap the message field and send the message that is typed for you.
2. Answer Tess's questions by tapping the option that blinks softly (firmware, patient safety, line, filters, Occlusion Sensitivity).
3. Read the structured answer: summary, warnings first, steps with citations, what was ruled out, what is not covered, suggested follow-ups.
4. Tap any citation to open the source at the cited section. Each source shows document, section, revision, date, approval status and a firmware applicability check. The quoted source text is kept apart from the assistant's explanation. A link simulates downloading the full manual.
5. Tap the suggested follow-up that blinks to reach the **insufficient evidence** state: Tess says what it found, what it did not find, offers no invented steps and points to authorized support.

The button under the phone switches to a **static desktop preview** (not interactive) that shows the same components in a wider layout. "Restart demo" resets the flow at any time. On a real phone (viewport up to 520 px) the mockup disappears and the app fills the full screen height with a constant width, including after the first message.

## Run locally

Requires Node.js. There is no build step and no dependency.

```bash
npm start
```

Then open http://localhost:3000. The server (`scripts/serve.mjs`) only serves the `src/` folder.

## Project structure

```
src/                  the prototype (static HTML, CSS and JavaScript)
  index.html          page and phone mockup
  css/tokens.css      design tokens (dark mode), mirror of the Figma variables
  css/app.css         product components and screens
  css/stage.css       phone mockup, glow and desktop preview frame
  js/data.js          simulated content: scenarios, answers, sources
  js/render.js        HTML builders for each component
  js/app.js           scripted flow engine, typing behavior, overlays
docs/
  scenarios.md        scripted scenarios and interaction rules
  review-checklist.md review against the PRD requirements and guardrails
  manuals/            the three fictional manuals the sources quote
scripts/serve.mjs     local static server
vercel.json           tells Vercel to publish the src folder
```

## Design system

Built in Figma and mirrored in code with the same names:

- **Variables:** Primitives, Color (Light and Dark), Spacing and Radius, with scopes and code syntax.
- **Text styles:** IBM Plex Sans for the interface, IBM Plex Mono for quoted source text.
- **Components:** buttons, chips, pills, citations, header, context bar, composer, messages, callouts, steps, source blocks, insufficient-evidence banner, bottom sheet, system notification and more.
- **Visual direction:** graphite and teal, dark mode as the default.

## Figma file

| Page | Content |
|---|---|
| 00 Cover & Notes | Project summary and status |
| 01 Flow | User flow board |
| 02 Wireframes – Mobile | Low and mid fidelity, M1 to M7 |
| 03 Wireframes – Desktop | D1 and D2 |
| 04 Foundations | Variables (Light and Dark), text styles, spacing, radius |
| 05 Components | Component library with variants and properties |
| 06 Final Concept Screens | Five high-fidelity screens in two scenarios (A: guided diagnosis, B: insufficient evidence), each with an "Attention points" note |
| 07 Developer Handoff | State flow (11 states) and specifications (11 panels: behavior, motion, accessibility, acceptance criteria) |

The high-fidelity screens are built only from the library on pages 04 and 05, in dark mode.

## Decisions worth knowing

- **Simulated content is flagged outside the device only.** A note below the phone says the content is simulated. Inside the phone the interface looks like a real product on purpose, so the PRD guardrail "label simulated content as illustrative" is applied at the page level, not on each screen.
- **Desktop is a static preview.** The testable experience is the mobile one; the desktop preview shows consistency of components and hierarchy.
- **The demo is scripted and fail-proof.** Each turn has one active action, signalled by a soft blink; anything else shows a short hint. The conversation has no dead ends and can be restarted.
- **Citations everywhere.** Every step, warning and statement that depends on a document carries a clickable citation. Nothing is presented as a procedure without a reference.
- **Accessibility:** dark palette checked against WCAG 2.2 AA contrast (text 4.5:1, interface boundaries 3:1), visible focus, accessible names on controls, live announcements, reduced-motion support, touch targets of 44 px for primary controls.

## Validation limits

No interviews, usability tests or field research were done. The persona and the hypotheses in the PRD are design hypotheses. The prototype does not claim improved task completion, reduced maintenance time or higher trust. The success criteria in the PRD are proposed, not measured.

## Deployment

The repository is connected to Vercel. Every push to `main` publishes `src/` automatically.

## How it was made

The challenge asks for an AI-driven product design and development approach. The product definition, the scenario, every design decision and every approval came from the designer. The work was done with Claude Code: wireframes, design system and components were created in Figma through its MCP connection, and the prototype code, documents and checks were written and verified with the assistant, one approved phase at a time.
