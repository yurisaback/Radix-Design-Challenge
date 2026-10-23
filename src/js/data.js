// All content is simulated and illustrative. Mirrors docs/manuals and docs/scenarios.md.

export const EQUIPMENT = 'Meridian IP-300 · Infusion pump';

export const USER = { name: 'Alex', role: 'Field Service Engineer' };

export const SUGGESTIONS = [
  { flow: 'e214', tag: 'Resume last topic', text: 'Error E-214 on an IP-300, what should I check?', resume: true },
  { flow: 'maint', tag: 'Document', text: 'Where is the preventive maintenance schedule for the IP-300?' },
  { flow: 'recal', tag: 'Question', text: 'Can I recalibrate the IP-300 pressure sensor without the factory tool?' },
];

export const RECENTS = [
  { group: 'Today', items: [['ECG lead-off alarm on bedside unit', 'Patient monitor'], ['Daily self-test failed', 'Ventilator']] },
  { group: 'Yesterday', items: [['Battery capacity check procedure', 'Defibrillator'], ['Probe not detected', 'Ultrasound system']] },
  { group: 'Previous 7 days', items: [['Alarm after cleaning', 'Syringe pump'], ['Leak test fails at step 3', 'Anesthesia machine'], ['Flow rate drifts on long runs', 'Infusion pump'], ['Calibration reminder will not clear', 'Pulse oximeter']] },
  { group: 'Earlier', items: [['Transport monitor battery drains fast', 'Patient monitor'], ['Self-test code E-102', 'Defibrillator'], ['Probe cleaning intervals', 'Ultrasound system'], ['Door latch does not close', 'Syringe pump']] },
];

export const NAV = ['Equipment', 'Documents', 'Saved answers', 'Help & feedback'];

export const BASIS = "Based on: Service Manual Rev C · Alarm & Error Reference Rev D · Operator's Guide Rev B";

// Citation labels. [1] Service Manual, [2] Alarm & Error Reference, [3] Operator's Guide.
export const CITE = {
  'sm-1-2': '[1] §1.2', 'sm-5-1': '[1] §5.1', 'sm-5-3': '[1] §5.3', 'sm-5-3-1': '[1] §5.3.1',
  'sm-6-1': '[1] §6.1', 'sm-8-2': '[1] §8.2', 'sm-8-3': '[1] §8.3', 'aer-2': '[2] §2', 'og-2-3': '[3] §2.3',
};

const SM = { n: 1, title: 'Meridian IP-300 — Service Manual', docId: 'MIP300-SM', rev: 'Rev C · 2025-03-14', approval: 'Approved for release', applies: ['3.2.x', '3.4.x'], file: 'MIP300-SM_Rev-C.pdf', size: '3.2 MB' };

// Source documents (verbatim excerpts from docs/manuals)
export const SOURCES = {
  'sm-1-2': {
    ...SM, section: '§1.2 General warnings',
    quote: [{ bullets: [
      'WARNING: Do not service a pump that is connected to a patient. Transfer the infusion to another pump according to facility protocol before any inspection.',
      'WARNING: Disconnect mains power and remove the battery before opening any housing.',
      'WARNING: Service actions do not replace clinical judgment. The clinician remains responsible for patient safety.',
      'CAUTION: Use only parts and tubing sets listed in section 8.',
      'NOTE: Procedures in this manual apply only to the firmware versions listed on the title page. Check the firmware version before following any procedure.',
    ] }],
    explanation: 'This is why the assistant asks whether the pump is disconnected from the patient before any troubleshooting step. The decision to proceed stays with you.',
  },
  'sm-5-1': {
    ...SM, section: '§5.1 Before you begin',
    quote: [{ bullets: [
      'Confirm the pump is not connected to a patient.',
      'Record the pump serial number and firmware version (Biomed Menu → About).',
      'Record the error code and the time it occurred.',
    ] }],
    explanation: 'The assistant asks for the firmware version first because the E-214 procedure differs between 3.2.x and 3.4.x. It does not assume the version.',
  },
  'sm-5-3': {
    ...SM, section: '§5.3 E-214 Downstream occlusion',
    quote: [
      { lines: ['Description. The pump detected pressure above the configured occlusion level on the patient side of the set.', 'Diagnostic sequence. Work through the checks in order. Stop at the first check that identifies a cause.'] },
      { bullets: [
        'A. Patient safety: Pump disconnected from the patient (1.2). If a cause is found: Do not continue until disconnected. If clear: Go to B.',
        'B. Downstream line: Pump outlet to connector: closed clamp, roller clamp, stopcock, kink. If a cause is found: Open or straighten; go to Retest. If clear: Go to C.',
        'C. Filters and access devices: In-line filter, access device: visible blockage. If a cause is found: Replace with new approved part; go to Retest. If clear: Go to D (3.4.x) or Escalate (3.2.x).',
        'D. Occlusion Sensitivity (3.4.x only): Biomed Menu → Settings → Occlusion Sensitivity. If a cause is found: Level is not Medium: record the value and report to the biomedical department (5.3.1); go to Retest after any approved change. If clear: Level is Medium: Escalate.',
        'Retest: Reload the set (Operator’s Guide 2.3); run 25 mL/h for 2 minutes into a collection container. E-214 does not return: record result. E-214 returns on a verified clear line: Escalate.',
        'Escalate: Stop. Do not attempt further adjustment. Contact an authorized service center (8.3).',
      ] },
      { lines: ['Firmware 3.2.x: the Occlusion Sensitivity setting is not available. Skip check D.'] },
    ],
    explanation: 'The assistant followed this sequence with you: safety, downstream line, filters, then Occlusion Sensitivity. Each question you answered corresponds to one check (A to D).',
  },
  'sm-5-3-1': {
    ...SM, section: '§5.3.1 Occlusion Sensitivity levels (firmware 3.4.x)',
    quote: [
      { table: { head: ['Level', 'Alarm threshold', 'Typical use'], rows: [
        ['Low', 'Lowest pressure; alarms earliest (most sensitive)', 'Short, low-resistance sets at low rates'],
        ['Medium (default)', 'Intermediate pressure', 'General use'],
        ['High', 'Highest pressure; alarms latest (least sensitive)', 'Long lines, filters or higher rates'],
      ] } },
      { bullets: [
        'A level below Medium can cause E-214 with an unobstructed line when a filter is used or the rate is raised.',
        'Do not change the level without approval from the biomedical department. Record the previous value, the new value, the date and the technician identifier.',
      ] },
    ],
    explanation: 'Your answer (Low) matches the first row: Low alarms at the lowest pressure, so it can raise E-214 even when the line is clear. This is an interpretation. Confirm with your biomedical department before changing the setting.',
  },
  'sm-6-1': {
    ...SM, section: '§6.1 Schedule',
    quote: [{ table: { head: ['Interval', 'Task'], rows: [
      ['Every use', 'Visual inspection of housing, door and latch'],
      ['6 months', 'Cleaning (6.2), battery check (6.3)'],
      ['12 months', 'Performance verification (section 7)'],
    ] } }],
    explanation: 'The schedule has three intervals. Performance verification (section 7) is the only task that needs a flow analyzer.',
  },
  'sm-8-2': {
    ...SM, section: '§8.2 Not field-serviceable',
    quote: [
      { lines: ['The following assemblies are not covered by this manual. Calibration data, tools and procedures for them are not published.'] },
      { bullets: ['Pressure sensor module', 'Motor and drive assembly', 'Main control board'] },
    ],
    explanation: 'The manual lists the pressure sensor module as not field-serviceable and does not publish a calibration or recalibration procedure. For that reason the assistant offers no steps. Contact an authorized service center.',
  },
  'sm-8-3': {
    ...SM, section: '§8.3 Authorized service',
    quote: [{ lines: ['Contact the Meridian Technical Support line (+1 555 010 0199) or your authorized service center. Have the serial number, firmware version and error code ready.'] }],
    explanation: 'When the checks do not identify a cause, the manual sends you to authorized service. Have the three items ready before you call.',
  },
  'aer-2': {
    n: 2, title: 'Meridian IP-300 — Alarm & Error Reference', docId: 'MIP300-AER', rev: 'Rev D · 2025-04-02', approval: 'Approved for release', applies: ['3.2.x', '3.4.x'], file: 'MIP300-AER_Rev-D.pdf', size: '640 KB',
    section: '§2 Error and alarm codes',
    quote: [{ table: { head: ['Code', 'Message', 'Type'], rows: [
      ['E-201', 'Upstream occlusion', 'Recoverable'], ['E-214', 'Downstream occlusion', 'Recoverable'], ['E-220', 'Air in line', 'Recoverable'],
      ['E-231', 'Door open', 'Recoverable'], ['E-240', 'Battery low', 'Advisory'], ['E-260', 'Infusion complete', 'Advisory'],
      ['E-907', 'Motor encoder fault', 'Non-recoverable'], ['E-915', 'Pressure sensor out of range', 'Non-recoverable'], ['E-940', 'Memory checksum error', 'Non-recoverable'],
    ] } }],
    explanation: 'E-915 (pressure sensor out of range) is listed as non-recoverable: the pump must be removed from service and handled by authorized service.',
  },
  'og-2-3': {
    n: 3, title: 'Meridian IP-300 — Operator’s Guide', docId: 'MIP300-OG', rev: 'Rev B · 2024-11-08', approval: 'Approved for release', applies: ['3.x'], file: 'MIP300-OG_Rev-B.pdf', size: '1.1 MB',
    section: '§2.3 Loading the tubing set',
    quote: [{ bullets: ['Open the door.', 'Insert the pump segment into the channel with the arrow pointing down.', 'Close the door until it latches.', 'Prime the set before connecting to the patient.'] }],
    explanation: 'The Retest check in the Service Manual refers to this procedure for reloading the set.',
  },
};

const FIRMWARE_CHIPS = [{ label: '3.2.x' }, { label: '3.4.x', active: true, set: { firmware: '3.4.x', finding: ['Firmware', '3.4.x'] } }, { label: "I don't know" }];

export const FLOWS = {
  e214: {
    query: 'Error E-214 on an IP-300, what should I check?',
    after: 'recal',
    steps: [
      { paras: ['Before I look into E-214, I need one detail: which firmware version is installed on this pump? The procedure differs between versions.'], cites: ['sm-5-1'], chips: FIRMWARE_CHIPS },
      { paras: ['Safety first. Is the pump disconnected from the patient?'], cites: ['sm-1-2'],
        chips: [{ label: 'Yes, disconnected', active: true, set: { finding: ['Pump disconnected from patient', 'Yes'] } }, { label: 'No' }] },
      { paras: ['Is the downstream line clear, from the pump outlet to the connector? No closed clamp, roller clamp, stopcock or kink.'], cites: ['sm-5-3'],
        chips: [{ label: 'Found a closed clamp / kink' }, { label: 'Line looks clear', active: true, set: { finding: ['Downstream line', 'Clear'] } }, { label: 'Not sure' }] },
      { paras: ['Are the in-line filters and access devices free of visible blockage?'], cites: ['sm-5-3'],
        chips: [{ label: 'Blocked' }, { label: 'Clear', active: true, set: { finding: ['Filters and access devices', 'Clear'] } }] },
      { paras: ['On firmware 3.4.x, open Biomed Menu → Settings → Occlusion Sensitivity. Which level is set?'], cites: ['sm-5-3-1'],
        chips: [{ label: 'Low', active: true, set: { finding: ['Occlusion Sensitivity', 'Low'] } }, { label: 'Medium' }, { label: 'High' }, { label: "Can't access" }] },
      { kind: 'response' },
    ],
  },
  maint: { query: 'Where is the preventive maintenance schedule for the IP-300?', after: 'recal', steps: [{ kind: 'schedule' }] },
  recal: { query: 'Can I recalibrate the IP-300 pressure sensor without the factory tool?', after: null, steps: [{ kind: 'insufficient' }] },
};

export const RESPONSE = {
  summary: 'Most likely cause, based on what you reported and §5.3: Occlusion Sensitivity is set to Low, which alarms earliest and can trigger E-214 on an unobstructed line.',
  warnings: [['Keep the pump disconnected from the patient.', ['sm-1-2']], ['Do not change the level without approval from the biomedical department.', ['sm-5-3-1']]],
  steps: [
    ['Record the current value (Low).', ['sm-5-3']],
    ['Report it to the biomedical department before changing it.', ['sm-5-3', 'sm-5-3-1']],
    ['After an approved change, reload the set and run 25 mL/h for 2 minutes.', ['sm-5-3', 'og-2-3']],
    ['If E-214 returns on a verified clear line, stop and contact authorized service.', ['sm-5-3', 'sm-8-3']],
  ],
  notCovered: [['Pressure sensor module repair or calibration.', ['sm-8-2']]],
  // suggested follow-ups: only the scripted one (with a flow) is active in the demo
  followups: [
    { text: 'Can I recalibrate the IP-300 pressure sensor without the factory tool?', flow: 'recal' },
    { text: 'What if E-214 returns after the retest?' },
    { text: 'Show me how to reload the tubing set.' },
  ],
  // from the user's own answers during the conversation, not verified by the assistant
  ruledOut: [
    ['Downstream line is clear: no closed clamp, roller clamp, stopcock or kink.', ['sm-5-3']],
    ['Filters and access devices are free of visible blockage.', ['sm-5-3']],
  ],
};

export const INSUFFICIENT = {
  message: 'No procedure for this was found in the available documents. No steps are offered.',
  found: [['The pressure sensor module is listed as not field-serviceable.', 'sm-8-2'], ['Calibration data and tools are not published.', 'sm-8-2'], ['E-915 (pressure sensor out of range) is non-recoverable.', 'aer-2']],
  notFound: ['Any approved calibration or recalibration procedure.'],
};
