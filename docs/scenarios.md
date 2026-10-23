# Prototype scenarios (scripted)

All content is simulated and illustrative. Sources: files in `docs/manuals/`.

## Interaction rules (mobile-first)

- **No simulation notices inside the device.** The phone looks like the real product: no "demo", "illustrative" or "simulated" labels, badges or footers. The only notice is the project note outside the phone, above the buttons ("Simulated content for a design prototype. Not manufacturer guidance.").

- **Tapping the composer fills the next scripted user message.** The text appears as if typed by the user; a tap on send submits it. No typing is required.
- **When the assistant offers options, the user answers with the option chips**, not the composer. The composer is inactive during those turns.
- **All options in a chip set look identical** (secondary button, solid stroke). Only the scripted option is active, and it is signalled by a soft blink, with no "demo" captions on screen. Tapping another option shows a brief toast ("Choose the option that is blinking.") and the right one blinks.
- Suggested queries on Home submit directly when tapped.
- There is one ending per scenario. No other branches are built.
- **Fail-proof by design.** Anyone must be able to complete the flow without prior knowledge. There are no dead ends and no wrong answers: every turn has exactly one active action (one chip or one composer fill), signalled by a soft blink (a brief toast appears if the wrong element is tapped). A **New consultation** action restarts the demo at any point.
- **Only the sidebar open/close is interactive outside the conversation.** Sidebar content (recent consultations, equipment, documents, saved answers, profile) is figurative: it shows what the product would offer and does not navigate.
- **Sidebar recents are simulated**, about other equipment types (patient monitor, ventilator, defibrillator, ultrasound, syringe pump), to show a realistic history. They are not openable.

## Equipment context
The persona has just opened the page. **Home shows no equipment context**: nothing has been asked yet and the assistant must not assume a model.

The context bar appears at the top **after the first message**, when the assistant recognises the equipment named in it ("IP-300"):
`Meridian IP-300 · Infusion pump · Firmware: not set` (warning pill until the firmware is answered, then `Firmware 3.4.x`).
Every suggested query names the equipment so this recognition is always possible.

## Typing behaviour (human-like)
- **User field:** the scripted message is typed character by character with an irregular rhythm (about 30 to 60 ms per key, longer after spaces and punctuation, rare hesitations) and a blinking caret. The send button stays outlined and disabled in the empty field (placeholder "How can I help you today?"), turns primary (teal) as soon as the demo starts typing, and becomes clickable when the message is complete.
- **Assistant:** the three-dot indicator, then the answer text is written in small chunks with pauses at punctuation. Structured parts (callouts, steps, basis line, actions, chips, citations) fade in after the text, so nothing is tappable before the answer is complete.
- **Skip:** tapping the message, or the field while typing, completes the text immediately. With "reduce motion" enabled the text appears at once.

## Suggested queries (home)
1. **Resume last topic** · "Error E-214 on an IP-300, what should I check?" → Scenario 1 (same as typing the question; no highlight)
2. "Where is the preventive maintenance schedule for the IP-300?" → Scenario 3
3. "Can I recalibrate the IP-300 pressure sensor without the factory tool?" → Scenario 2

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
4. **Ruled out in this conversation (2):** a card that expands on tap to list what the user's answers excluded (downstream line clear, filters and access devices clear), each with its citation. Based on your answers, not verified by the assistant.
5. **Not covered:** pressure sensor module repair or calibration. [1 §8.2]
6. **Citations are clickable** and replace a separate sources list. Each citation shows document and section, for example `[1] §5.3.1`. Tapping one opens the Source detail view at the cited section. **Every citation is clickable** and opens the Source detail overlay at the cited section (§1.2, §5.1, §5.3, §5.3.1, §6.1, §8.2, §8.3 of the Service Manual, §2 of the Alarm & Error Reference, §2.3 of the Operator's Guide). All look the same and none blinks. Reading sources is optional and never blocks the follow-up; opening one during a chip question does not change the conversation.
7. **Basis line** (version stays visible with every answer): "Based on: Service Manual Rev C · Alarm & Error Reference Rev D · Operator's Guide Rev B · Illustrative"
8. **Suggested follow-ups** (replace the old "Ask a follow-up" button): three questions the user can tap instead of typing. All look the same (secondary, solid stroke); only "Can I recalibrate the IP-300 pressure sensor without the factory tool?" is active and blinks softly (it leads to Scenario 2). The other two ("What if E-214 returns after the retest?", "Show me how to reload the tubing set.") only show a brief hint in the demo. In a real product each would send its question.
9. **Next action:** `Contact authorized support` (in a real product it would open the support contact with the conversation context attached: equipment, serial number, firmware, error code and the findings). The composer is also ready as soon as the answer finishes: tapping it fills the same follow-up. Reading sources is optional.

| Turn | Speaker | Content |
|---|---|---|
| 13 | User (tap), optional | Any citation, e.g. `[1] §5.3.1` → Source detail opens at that section (source text, assistant explanation, version check) |
| 14 | User (tap) | Tap the composer → the follow-up question is typed in (Scenario 2); tap send |

If the user had selected `3.2.x` at turn 3, turns 10–11 would be skipped. This path is not built in the prototype.

## Scenario 2 — Insufficient evidence

Triggered from Home (suggested query 3), or as the follow-up after Scenario 1: tapping the composer fills the question below.

**User (composer fill):** Can I recalibrate the IP-300 pressure sensor without the factory tool?

**Assistant (variant of response):**
- Banner: **Not enough evidence.** No procedure for this was found in the available documents.
- **What was found:** the pressure sensor module is listed as not field-serviceable; calibration data and tools are not published. [1 §8.2] E-915 is non-recoverable. [2 §2]
- **What was not found:** any approved calibration or recalibration procedure.
- No steps are offered.
- **Next actions:** `Contact authorized support` · `Open official documentation` · `Rephrase the question`

## Scenario 3 — Document lookup

**User:** Where is the preventive maintenance schedule for the IP-300?
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
- Version warning when the firmware in context is outside "Applies to".

## Download of the full manual (simulated)
- Every source overlay shows a link in the document card: "Download full manual · PDF · size". No file is created.
- Tapping it shows a simulated system notification at the top of the phone, under the Dynamic Island: "Downloading…" with a short progress bar, then "Download complete" with the file name and size. It dismisses by itself after a few seconds, or by tapping it.
- Files (simulated): `MIP300-SM_Rev-C.pdf` (3.2 MB), `MIP300-AER_Rev-D.pdf` (640 KB), `MIP300-OG_Rev-B.pdf` (1.1 MB).
- The primary action "Back to conversation" is fixed at the bottom of the phone only while a manual reference is open.

## Add to session (bottom sheet)
- The "+" in the message field opens a bottom sheet titled "Add to session" with three tiles: Camera, Photos, Files.
- It closes with the X, by tapping outside, with Esc, or by picking a tile (the real picker would open outside the app). Nothing is attached in the prototype.
- It works in every state, including while the assistant is waiting for a chip answer; closing it never changes the conversation.
