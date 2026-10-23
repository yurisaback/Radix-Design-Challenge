> **ILLUSTRATIVE CONTENT — FICTIONAL.** The Meridian IP-300 does not exist. This document was written for a design prototype. It is not manufacturer guidance and must never be used for real equipment.

# Meridian IP-300 — Alarm & Error Reference

| Field | Value |
|---|---|
| Document ID | MIP300-AER |
| Revision | **Rev D** |
| Revision date | 2025-04-02 |
| Approval status | Approved for release (simulated) |
| Applies to | Firmware 3.2.x and 3.4.x |

## 1. How to read this table
- **Recoverable:** operator can clear after the cause is removed.
- **Non-recoverable:** remove from service; contact authorized service.
- **Service manual ref:** section in MIP300-SM Rev C.

## 2. Error and alarm codes

| Code | Message on screen | Type | Likely area | Service manual ref |
|---|---|---|---|---|
| E-201 | Upstream occlusion | Recoverable | Container, spike, upstream clamp | 5.2 |
| E-214 | Downstream occlusion | Recoverable | Downstream line, filter, clamp, occlusion setting | 5.3 |
| E-220 | Air in line | Recoverable | Tubing, priming | 5.4 |
| E-231 | Door open | Recoverable | Door, latch | 5.5 |
| E-240 | Battery low | Advisory | Battery | 6.3 |
| E-260 | Infusion complete | Advisory | — | — |
| E-907 | Motor encoder fault | Non-recoverable | Motor assembly | 5.6 |
| E-915 | Pressure sensor out of range | Non-recoverable | Pressure sensor module | 8.2 |
| E-940 | Memory checksum error | Non-recoverable | Main control board | 8.2 |

## 3. Notes
- E-214 may be caused by conditions outside the pump (downstream line). Verify the line before suspecting the pump.
- E-915 is not field-serviceable. See MIP300-SM section 8.2.
- Codes not listed here are not documented for firmware 3.2.x / 3.4.x. Contact authorized service.
