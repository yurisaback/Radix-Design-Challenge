# Prototype scenarios (scripted)

All content is simulated and illustrative. Sources: files in `docs/manuals/`.

## Interaction rules (mobile-first)

- **Tapping the composer fills the next scripted user message.** The text appears as if typed by the user; a tap on send submits it. No typing is required.
- **When the assistant offers options, the user answers with the option chips**, not the composer. The composer is inactive during those turns.
- Only the scripted option is active in each chip set. Other chips stay visible (they show the real decision space) but are inactive, with a short hint: "Not part of this demo path".
- Suggested queries on Home submit directly when tapped.
- There is one ending per scenario. No other branches are built.
- **Fail-proof by design.** Anyone must be able to complete the flow without prior knowledge. There are no dead ends and no wrong answers: every turn has exactly one active action (one chip or one composer fill), highlighted, with a short hint ("Tap the highlighted option"). A **New consultation** action restarts the demo at any point.
- **Only the sidebar open/close is interactive outside the conversation.** Sidebar content (recent consultations, equipment, documents, saved answers, profile) is figurative: it shows what the product would offer and does not navigate.
- **Sidebar recents are simulated**, about other equipment types (patient monitor, ventilator, defibrillator, ultrasound, syringe pump), to show a realistic history. They are not openable.

## Equipment context (default chip)
`Meridian IP-300 · Infusion pump · Firmware: not set`

## Suggested queries (home)
1. "Error E-214 on an IP-300, what should I check?" → Scenario 1
2. "Where is the preventive maintenance schedule?" → Scenario 3
3. "Can I recalibrate the pressure sensor without the factory tool?" → Scenario 2

## Scenario 1 — Guided diagnosis (E-214)

The assistant asks one question per turn. Each question comes from a section of the manual. The panel **Findings so far** records each confirmed answer. The technician reaches the likely cause through the conversation. The assistant never concludes beyond the evidence.

| Turn | Speaker | Content | Source |
|---|---|---|---|
| 1 | User (composer fill) | "Error E-214 on an IP-300, what should I check?" | — |
| 2 | Assistant | **Context needed.** Which firmware version? The E-214 procedure differs between versions. Chips: `3.2.x` · **`3.4.x`** · `I don't know` | SM §5.1 |
| 3 | User (chip) | "3.4.x" — context chip updates to `Firmware 3.4.x` | — |
| 4 | Assistant | **Safety first.** Is the pump disconnected from the patient? Chips: **`Yes, disconnected`** · `No` | SM §1.2 |
| 5 | User (chip) | "Yes, disconnected" | — |
| 6 | Assistant | Is the downstream line clear (pump outlet to connector): no closed clamp, roller clamp, stopcock or kink? Chips: `Found a closed clamp / kink` · **`Line looks clear`** · `Not sure` | SM §5.3 check B |
| 7 | User (chip) | "Line looks clear" | — |
| 8 | Assistant | Are the in-line filters and access devices free of visible blockage? Chips: `Blocked` · **`Clear`** | SM §5.3 check C |
| 9 | User (chip) | "Clear" | — |
| 10 | Assistant | On firmware 3.4.x, check Biomed Menu → Settings → Occlusion Sensitivity. What level is set? Chips: **`Low`** · `Medium` · `High` · `Can't access` | SM §5.3 check D, §5.3.1 |
| 11 | User (chip) | "Low" | — |
| 12 | Assistant | **Structured response** (see below) | SM §5.3, §5.3.1 |

### Findings so far (panel, updates after each answer)
- Firmware: 3.4.x
- Pump disconnected from patient: yes
- Downstream line: clear
- Filters and access devices: clear
- Occlusion Sensitivity: Low

### Turn 12 — Structured response
1. **Summary:** Most likely cause, based on what you reported and §5.3: Occlusion Sensitivity is set to **Low**, which alarms earliest and can cause E-214 on an unobstructed line. [1 §5.3.1]
2. **Before you start** (warnings and prerequisites, shown before steps):
   - Pump must stay disconnected from the patient. [1 §1.2]
   - Do not change the level without approval from the biomedical department. [1 §5.3.1]
3. **Next steps:**
   1. Record the current value (Low). [1 §5.3]
   2. Report it to the biomedical department before changing it. [1 §5.3, §5.3.1]
   3. After an approved change, reload the set and run 25 mL/h for 2 minutes. [1 §5.3 Retest, 3 §2.3]
   4. If E-214 returns on a verified clear line, stop and contact authorized service. [1 §5.3, §8.3]
4. **Ruled out in this conversation:** closed clamp or kink, blocked filter or access device. (Based on your answers, not verified by the assistant.)
5. **Not covered:** pressure sensor module repair or calibration. [1 §8.2]
6. **Citations are clickable** and replace a separate sources list. Each citation shows document and section, for example `[1] §5.3.1`. Tapping one opens the Source detail view at the cited section. In the demo only the highlighted citation `[1] §5.3.1` (in the summary) is active, with the hint "Tap to verify the source". The others are visible but inactive.
7. **Basis line** (version stays visible with every answer): "Based on: Service Manual Rev C · Alarm & Error Reference Rev D · Operator's Guide Rev B · Illustrative"
8. **Next actions:** `Ask a follow-up` · `Contact authorized support` (figurative). The composer stays inactive until the user returns from the source.
9. Footer: "Simulated content. Not manufacturer guidance. You decide whether to proceed."

| Turn | Speaker | Content |
|---|---|---|
| 13 | User (tap) | Citation `[1] §5.3.1` → Source detail opens at §5.3.1 (source text, assistant explanation, version check) |
| 14 | User (tap) | `Back to answer` → returns to the response; the composer is now active and fills the follow-up (Scenario 2) |

If the user had selected `3.2.x` at turn 3, turns 10–11 would be skipped. This path is not built in the prototype.

## Scenario 2 — Insufficient evidence

Triggered from Home (suggested query 3), or as the follow-up after Scenario 1: tapping the composer fills the question below.

**User (composer fill):** Can I recalibrate the pressure sensor without the factory tool?

**Assistant (variant of response):**
- Banner: **Not enough evidence.** No procedure for this was found in the available documents.
- **What was found:** the pressure sensor module is listed as not field-serviceable; calibration data and tools are not published. [1 §8.2] E-915 is non-recoverable. [2 §2]
- **What was not found:** any approved calibration or recalibration procedure.
- No steps are offered.
- **Next actions:** `Contact authorized support` · `Open official documentation` · `Rephrase the question`

## Scenario 3 — Document lookup

**User:** Where is the preventive maintenance schedule?
**Assistant:** Short answer with one cited table (SM §6.1: every use, 6 months, 12 months) and `Open source`.

## Free text matching (simulated)
Applies only if the user types instead of using the composer fill.
- Contains `E-214` or `occlusion` → starts Scenario 1 at turn 2.
- Contains `maintenance` or `schedule` → Scenario 3.
- Contains `calibrat` or `sensor` → Scenario 2.
- Anything else → Scenario 2 style response ("not enough evidence").

## Source detail view (all scenarios)
- Header: document title, section, revision, revision date, approval status.
- Block **Source text** (quoted, monospaced, left bar).
- Block **Assistant's explanation** (separate, labeled).
- Badge: `Illustrative` on every source.
- Version warning when the firmware in context is outside "Applies to".
