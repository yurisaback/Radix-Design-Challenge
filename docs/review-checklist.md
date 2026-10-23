# Review against the PRD

Final review of the prototype against the PRD (sections 5.2, 6, 7, 8, 9 and 10). Status legend: **Met**, **Met with a decision** (a conscious choice that differs from the PRD wording), **Pending**.

Reviewed on the live prototype (https://radix-design-challenge.vercel.app) and on the Figma file.

## 1. Design success criteria (PRD 5.2)

| Criterion | Status | Evidence |
|---|---|---|
| The user can initiate and complete the primary consultation flow | Met | Home, suggestion or typed message, five guided questions, structured answer, source, follow-up, insufficient evidence, restart |
| Clear hierarchy; references reachable from the information they support | Met | Summary first, warnings before steps, a citation on every step, warning and finding; each opens the source at that section |
| The interface communicates uncertainty and limitations | Met | "Based on your answers", "Ruled out… not verified by the assistant", "Not covered by the documents", insufficient-evidence state |
| Usable at mobile widths and adapts to desktop, with consistent components | Met with a decision | Mobile is fully testable; desktop is a static preview that uses the same components (see section 6) |

## 2. Included in the MVP concept (PRD 6.1)

| Item | Status |
|---|---|
| Main assistant interface with conversational query flow | Met |
| Structured response with references and source details | Met |
| Equipment troubleshooting scenario and an insufficient-evidence alternative | Met |
| Clear next steps and escalation to authorized support | Met |
| Responsive behavior with interactive navigation between the main screens | Met with a decision (desktop is static) |

Out of scope items were respected: no agent, no integration, no diagnosis, no automatic execution, no authentication, no regulatory claims.

## 3. Flow and screens (PRD 7)

| Screen or step | Status | Where |
|---|---|---|
| 1 Start: no unnecessary setup | Met | Home with suggestions and a ready message field |
| 2 Provide context: equipment and problem | Met | Context bar appears once the equipment is recognised; Tess asks for the firmware |
| 3 Structured response: documented vs uncertain | Met | Answer screen |
| 4 Verify the source: title, section, revision (simulated) | Met | Source overlay |
| 5 Continue or escalate | Met | Suggested follow-ups, contact authorized support, official documentation, new consultation |
| Main assistant interface | Met | Home |
| AI interaction (clarifying equipment context) | Met | Firmware and safety questions |
| Source detail, source text apart from explanation | Met | Source overlay |
| Insufficient evidence as a variant of the response | Met | Recalibration question |

## 4. Functional requirements (PRD 8)

| ID | Status | Notes |
|---|---|---|
| FR-01 Conversational query | Met | Visible input; suggestions for a procedure, an error code and a document |
| FR-02 Contextual response | Met | Summary, key information, steps, warnings before steps, sources and next actions |
| FR-03 Source inspection | Met with a decision | Dedicated view, source separated from explanation. Content is not badged "illustrative" inside the phone (see section 6) |
| FR-04 Insufficient evidence | Met | Says what it could not substantiate and offers next steps, no invented procedure |
| FR-05 Responsive interface | Met with a decision | Mobile first, hierarchy and access to sources are the same in the desktop preview |

## 5. Risks and design responses (PRD 9)

| Risk | Status | Design response in the prototype |
|---|---|---|
| Unsupported or fabricated answers | Met | Every statement has a reference; uncertainty is shown; no steps without a source |
| Outdated documentation | Met | Revision, revision date and approval status in every source; firmware applicability check |
| Incorrect equipment context | Met | Context bar; Tess asks for the firmware instead of assuming it; the source warns when the firmware is not set |
| Overreliance on AI | Met | Evidence one tap away, "not verified" labels, escalation path |
| Insufficient evidence | Met | Dedicated state with found, not found and next steps |

## 6. Guardrails: Do and Don't (PRD 10)

| Guardrail | Status | Evidence or decision |
|---|---|---|
| Show source, section and version with every answer | Met | Citations plus the "Based on" line with the revision of each document |
| State the equipment context at the top; ask when it is missing | Met | Context bar; firmware question |
| Separate source content from the assistant's explanation | Met | Mono block with a bar vs dashed block labelled AI-generated |
| Say what could not be found and give a next step | Met | Insufficient-evidence state |
| Put warnings and prerequisites before the steps | Met | "Before you start" precedes "Next steps" |
| Label simulated content as illustrative | Met with a decision | Flagged on the page, outside the phone, and in the README. Not repeated inside the phone to keep the product realistic; chosen by the designer |
| Keep key actions and sources reachable on a small screen | Met | Fixed composer and fixed primary button in the source view; every citation is a tap |
| Keep the assistant in a supporting role; the professional decides | Met | Warnings tell the user to get biomedical approval before changing settings; findings are "based on your answers"; no step is executed |
| Don't present a procedure without a supporting reference | Met | Every step carries a citation |
| Don't assume the equipment model or configuration | Met | Home has no equipment; firmware is asked, never assumed |
| Don't blend quoted source text and AI paraphrase | Met | Kept in separate blocks |
| Don't fill gaps with plausible-sounding steps | Met | The recalibration question gets no steps |
| Don't bury warnings below the steps | Met | Warnings come first |
| Don't present simulated content as verified manufacturer guidance | Met with a decision | See the "illustrative" row; the page note says it is not manufacturer guidance |
| Don't hide sources behind desktop-only interactions | Met | Sources open with a tap on mobile |
| Don't imply the assistant authorizes or executes procedures | Met | Language never authorizes; "Contact authorized support" is the escalation |

## 7. Decisions that differ from the PRD wording

1. **"Illustrative" label only outside the phone.** Reason: the project is a design challenge, the note below the phone already says so, and the phone should look like a real product.
2. **Desktop is a static preview, not interactive.** Reason: the testable environment is mobile; the preview shows component consistency and hierarchy.

## 8. Accessibility checks

- Contrast: 25 text and boundary pairs of the dark palette verified for WCAG 2.2 AA; the message field pairs verified too.
- Names: every control has an accessible name; the answer and download status are announced.
- Touch targets: primary controls are 44 px. The composer icons (36 px), citations (28 px) and the download link (32 px) are smaller but above the 24 px minimum of WCAG 2.2 AA.
- Motion: animations stop with "reduce motion"; typing and streaming text can be completed with a tap.

## 9. Open items

| Item | Status |
|---|---|
| High-fidelity final screens in Figma (PRD work plan, day 2: at least 3 final screens) | Done: page 06, five screens in two scenarios (main interface, AI interaction, AI response, source detail, insufficient evidence) |
| Developer handoff (not requested by the PRD, added as a deliverable) | Done: page 07, state flow of 11 states plus 11 specification panels |
| Figma cover status update | Done |
| Mobile layout jump after the first message (screen looked short, then expanded) | Fixed: full-height stretched layout in narrow mode; width verified constant at every instant in a phone-sized frame |
| Figma "Attention points" notes look like prototype frames | Fixed: restyled as light dashed annotation notes with a numbered list |
| Test on a real phone | Pending (needs the designer) |
| Presentation PDF | Pending (the designer will do it) |
| Web fonts are loaded from Google Fonts; offline the system font is used | Known limitation |
