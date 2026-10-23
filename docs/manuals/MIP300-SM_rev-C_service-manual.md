> **ILLUSTRATIVE CONTENT — FICTIONAL.** The Meridian IP-300 does not exist. This document was written for a design prototype. It is not manufacturer guidance and must never be used for real equipment.

# Meridian IP-300 Volumetric Infusion Pump — Service Manual

| Field | Value |
|---|---|
| Document ID | MIP300-SM |
| Revision | **Rev C** |
| Revision date | 2025-03-14 |
| Approval status | Approved for release |
| Applies to | Firmware **3.2.x** and **3.4.x** |
| Superseded | Rev B (firmware 2.x, 3.0.x, 3.1.x) |
| Audience | Qualified biomedical and field service personnel |

## Revision history

| Rev | Date | Summary of change |
|---|---|---|
| A | 2023-06-02 | First release, firmware 2.x |
| B | 2024-02-19 | Added firmware 3.0.x and 3.1.x; revised alarm tables |
| C | 2025-03-14 | Added firmware 3.2.x and 3.4.x; added Occlusion Sensitivity setting (3.4.x); revised section 5.3 |

---

## 1. Introduction and safety

### 1.1 Purpose
This manual describes inspection, troubleshooting, preventive maintenance and performance verification of the Meridian IP-300 at the level permitted to qualified service personnel.

### 1.2 General warnings
- **WARNING:** Do not service a pump that is connected to a patient. Transfer the infusion to another pump according to facility protocol before any inspection.
- **WARNING:** Disconnect mains power and remove the battery before opening any housing.
- **WARNING:** Service actions do not replace clinical judgment. The clinician remains responsible for patient safety.
- **CAUTION:** Use only parts and tubing sets listed in section 8.
- **NOTE:** Procedures in this manual apply only to the firmware versions listed on the title page. Check the firmware version before following any procedure.

### 1.3 Required tools
- Calibrated flow analyzer (performance verification)
- Insulated screwdriver set (T10, T15)
- IP-300 Biomed Menu access code (issued by facility biomedical department)
- Lint-free cloths and approved disinfectant (section 6.2)

---

## 2. Specifications

| Parameter | Value |
|---|---|
| Delivery range | 0.1 – 999 mL/h |
| Flow accuracy | ±5 % (see 7.2) |
| Occlusion pressure levels | Low / Medium / High |
| Default occlusion level | Medium |
| Power | 100–240 V AC, internal Li-ion battery (≈6 h at 25 mL/h) |
| Ingress protection | IPX2 |
| Compatible sets | MIP-SET-100, MIP-SET-200 |

---

## 3. Alarm types

### 3.1 Recoverable alarms
Recoverable alarms stop delivery and can be cleared by the operator after the cause is removed. Examples: downstream occlusion, air-in-line, door open.

### 3.2 Non-recoverable alarms
Non-recoverable alarms stop delivery and cannot be cleared by the operator. The pump must be removed from service and inspected. Codes beginning E-9xx are non-recoverable.

### 3.3 Advisory messages
Advisories do not stop delivery. Examples: battery low, near end of infusion.

---

## 4. Error codes

The complete code list is maintained in the **IP-300 Alarm & Error Reference (MIP300-AER, Rev D)**. Codes relevant to this manual:

| Code | Description | Type | See |
|---|---|---|---|
| E-201 | Upstream occlusion | Recoverable | 5.2 |
| E-214 | Downstream occlusion | Recoverable | **5.3** |
| E-220 | Air-in-line detected | Recoverable | 5.4 |
| E-231 | Door open during delivery | Recoverable | 5.5 |
| E-907 | Motor encoder fault | Non-recoverable | 5.6 |

---

## 5. Troubleshooting

### 5.1 Before you begin
1. Confirm the pump is **not connected to a patient**.
2. Record the pump serial number and firmware version (Biomed Menu → About).
3. Record the error code and the time it occurred.

### 5.2 E-201 Upstream occlusion
Check the container, spike and upstream clamp. Reload the set if the clamp is closed.

### 5.3 E-214 Downstream occlusion

**Description.** The pump detected pressure above the configured occlusion level on the patient side of the set.

**Prerequisites**
- Pump disconnected from the patient (see 1.2).
- Firmware version identified (**3.2.x** or **3.4.x**). Steps differ as marked.
- A new, unopened MIP-SET-100 or MIP-SET-200 available.

**Possible causes (most to least common)**
1. Clamp, roller clamp or stopcock closed or partially closed downstream
2. Kinked or compressed tubing
3. Blocked in-line filter or access device
4. Occlusion level set too sensitive for the configured rate (3.4.x only)
5. Pressure sensor module fault (see 8.2)

**Diagnostic sequence.** Work through the checks in order. Stop at the first check that identifies a cause.

| Check | What to look at | If a cause is found | If clear |
|---|---|---|---|
| A. Patient safety | Pump disconnected from the patient (1.2) | — Do not continue until disconnected | Go to B |
| B. Downstream line | Pump outlet to connector: closed clamp, roller clamp, stopcock, kink | Open or straighten; go to Retest | Go to C |
| C. Filters and access devices | In-line filter, access device: visible blockage | Replace with new approved part; go to Retest | Go to D (3.4.x) or Escalate (3.2.x) |
| D. Occlusion Sensitivity (**3.4.x only**) | Biomed Menu → Settings → *Occlusion Sensitivity* | Level is not Medium: record the value and report to the biomedical department (5.3.1); go to Retest after any approved change | Level is Medium: Escalate |
| Retest | Reload the set (Operator's Guide 2.3); run 25 mL/h for 2 minutes into a collection container | E-214 does not return: record result | E-214 returns on a verified clear line: Escalate |
| Escalate | Stop. Do not attempt further adjustment. | Contact an authorized service center (8.3) | — |

**Firmware 3.2.x:** the Occlusion Sensitivity setting is not available. Skip check D.

#### 5.3.1 Occlusion Sensitivity levels (firmware 3.4.x)

| Level | Alarm threshold | Typical use |
|---|---|---|
| Low | Lowest pressure; alarms earliest (most sensitive) | Short, low-resistance sets at low rates |
| **Medium (default)** | Intermediate pressure | General use |
| High | Highest pressure; alarms latest (least sensitive) | Long lines, filters or higher rates |

- A level below Medium can cause E-214 with an unobstructed line when a filter is used or the rate is raised.
- Do not change the level without approval from the biomedical department. Record the previous value, the new value, the date and the technician identifier.
- After an approved change, perform the Retest check.

**Related**
- Performance verification after any repair: section 7.
- The pressure sensor module is not field-serviceable. See section 8.2.

### 5.4 E-220 Air-in-line detected
Check for bubbles in the line and re-prime the set. Replace the set if the alarm persists.

### 5.5 E-231 Door open during delivery
Close the door fully. Inspect the door latch for damage.

### 5.6 E-907 Motor encoder fault
Non-recoverable. Remove from service and contact an authorized service center.

---

## 6. Preventive maintenance

### 6.1 Schedule

| Interval | Task |
|---|---|
| Every use | Visual inspection of housing, door and latch |
| 6 months | Cleaning (6.2), battery check (6.3) |
| 12 months | Performance verification (section 7) |

### 6.2 Cleaning
Wipe external surfaces with a lint-free cloth and an approved low-level disinfectant. Do not immerse the pump. Do not spray directly into the door or connectors.

### 6.3 Battery check
Run the pump on battery at 25 mL/h. Runtime below 4 hours indicates the battery should be replaced (section 8.1).

---

## 7. Performance verification

### 7.1 Equipment
Calibrated flow analyzer, new MIP-SET-100.

### 7.2 Flow accuracy test
1. Prime the set and connect it to the flow analyzer.
2. Run at 25 mL/h for 30 minutes.
3. Record delivered volume. Acceptable range: ±5 % of programmed volume.
4. If outside range, remove the pump from service (section 8.3).

### 7.3 Records
Record serial number, firmware, date, result and technician identifier according to facility policy.

---

## 8. Parts and service-level boundaries

### 8.1 Field-replaceable parts
Battery pack, door assembly, AC inlet fuse, tubing sets (MIP-SET-100/200).

### 8.2 Not field-serviceable
The following assemblies are **not** covered by this manual. Calibration data, tools and procedures for them are not published.
- Pressure sensor module
- Motor and drive assembly
- Main control board

### 8.3 Authorized service
Contact the Meridian Technical Support line (+1 555 010 0199) or your authorized service center. Have the serial number, firmware version and error code ready.
