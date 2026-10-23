// All content is simulated and illustrative. Mirrors docs/manuals and docs/scenarios.md.

export const EQUIPMENT = 'Meridian IP-300 · Infusion pump';

export const USER = { name: 'Alex', role: 'Field Service Engineer' };

export const SUGGESTIONS = [
  { flow: 'e214', tag: 'Error code', text: 'Error E-214 on an IP-300, what should I check?', start: true },
  { flow: 'maint', tag: 'Document', text: 'Where is the preventive maintenance schedule?' },
  { flow: 'recal', tag: 'Question', text: 'Can I recalibrate the pressure sensor without the factory tool?' },
];

export const RECENTS = [
  { group: 'Today', items: [['ECG lead-off alarm on bedside unit', 'Patient monitor'], ['Daily self-test failed', 'Ventilator']] },
  { group: 'Yesterday', items: [['Battery capacity check procedure', 'Defibrillator'], ['Probe not detected', 'Ultrasound system']] },
  { group: 'Previous 7 days', items: [['Alarm after cleaning', 'Syringe pump']] },
];

export const NAV = ['Equipment', 'Documents', 'Saved answers', 'Help & feedback'];

export const BASIS = "Based on: Service Manual Rev C · Alarm & Error Reference Rev D · Operator's Guide Rev B";

// Source documents (verbatim excerpts from docs/manuals)
export const SOURCES = {
  'sm-5-3-1': {
    n: 1, title: 'Meridian IP-300 — Service Manual', docId: 'MIP300-SM', rev: 'Rev C · 2025-03-14',
    approval: 'Approved for release (simulated)', applies: ['3.2.x', '3.4.x'], section: '§5.3.1 Occlusion Sensitivity levels (firmware 3.4.x)',
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
  'sm-8-2': {
    n: 1, title: 'Meridian IP-300 — Service Manual', docId: 'MIP300-SM', rev: 'Rev C · 2025-03-14',
    approval: 'Approved for release (simulated)', applies: ['3.2.x', '3.4.x'], section: '§8.2 Not field-serviceable',
    quote: [
      { lines: ['The following assemblies are not covered by this manual. Calibration data, tools and procedures for them are not published.'] },
      { bullets: ['Pressure sensor module', 'Motor and drive assembly', 'Main control board'] },
    ],
    explanation: 'The manual lists the pressure sensor module as not field-serviceable and does not publish a calibration or recalibration procedure. For that reason the assistant offers no steps. Contact an authorized service center.',
  },
  'sm-6-1': {
    n: 1, title: 'Meridian IP-300 — Service Manual', docId: 'MIP300-SM', rev: 'Rev C · 2025-03-14',
    approval: 'Approved for release (simulated)', applies: ['3.2.x', '3.4.x'], section: '§6.1 Schedule',
    quote: [
      { table: { head: ['Interval', 'Task'], rows: [
        ['Every use', 'Visual inspection of housing, door and latch'],
        ['6 months', 'Cleaning (6.2), battery check (6.3)'],
        ['12 months', 'Performance verification (section 7)'],
      ] } },
    ],
    explanation: 'The schedule has three intervals. Performance verification (section 7) is the only task that needs a flow analyzer.',
  },
};

const FIRMWARE_CHIPS = [{ label: '3.2.x' }, { label: '3.4.x', active: true, set: { firmware: '3.4.x', finding: ['Firmware', '3.4.x'] } }, { label: "I don't know" }];

export const FLOWS = {
  e214: {
    query: 'Error E-214 on an IP-300, what should I check?',
    after: 'recal',
    steps: [
      { paras: ['Before I look into E-214, I need one detail: which firmware version is installed on this pump? The procedure differs between versions.'],
        cites: [{ label: '[1] Service Manual Rev C §5.1' }], chips: FIRMWARE_CHIPS },
      { paras: ['Safety first. Is the pump disconnected from the patient?'], cites: [{ label: '[1] §1.2' }],
        chips: [{ label: 'Yes, disconnected', active: true, set: { finding: ['Pump disconnected from patient', 'Yes'] } }, { label: 'No' }] },
      { paras: ['Is the downstream line clear, from the pump outlet to the connector? No closed clamp, roller clamp, stopcock or kink.'], cites: [{ label: '[1] §5.3 · check B' }],
        chips: [{ label: 'Found a closed clamp / kink' }, { label: 'Line looks clear', active: true, set: { finding: ['Downstream line', 'Clear'] } }, { label: 'Not sure' }] },
      { paras: ['Are the in-line filters and access devices free of visible blockage?'], cites: [{ label: '[1] §5.3 · check C' }],
        chips: [{ label: 'Blocked' }, { label: 'Clear', active: true, set: { finding: ['Filters and access devices', 'Clear'] } }] },
      { paras: ['On firmware 3.4.x, open Biomed Menu → Settings → Occlusion Sensitivity. Which level is set?'], cites: [{ label: '[1] §5.3 · check D' }],
        chips: [{ label: 'Low', active: true, set: { finding: ['Occlusion Sensitivity', 'Low'] } }, { label: 'Medium' }, { label: 'High' }, { label: "Can't access" }] },
      { kind: 'response' },
    ],
  },
  maint: { query: 'Where is the preventive maintenance schedule?', after: 'recal', steps: [{ kind: 'schedule' }] },
  recal: { query: 'Can I recalibrate the pressure sensor without the factory tool?', after: null, steps: [{ kind: 'insufficient' }] },
};

export const RESPONSE = {
  summary: 'Most likely cause, based on what you reported and §5.3: Occlusion Sensitivity is set to Low, which alarms earliest and can trigger E-214 on an unobstructed line.',
  warnings: ['Keep the pump disconnected from the patient.  [1 §1.2]', 'Do not change the level without approval from the biomedical department.  [1 §5.3.1]'],
  steps: [
    ['Record the current value (Low).', ['[1] §5.3']],
    ['Report it to the biomedical department before changing it.', ['[1] §5.3, §5.3.1']],
    ['After an approved change, reload the set and run 25 mL/h for 2 minutes.', ['[1] §5.3 Retest', '[3] §2.3']],
    ['If E-214 returns on a verified clear line, stop and contact authorized service.', ['[1] §5.3, §8.3']],
  ],
};

export const INSUFFICIENT = {
  message: 'No procedure for this was found in the available documents. No steps are offered.',
  found: [['The pressure sensor module is listed as not field-serviceable.', '[1 §8.2]'], ['Calibration data and tools are not published.', '[1 §8.2]'], ['E-915 (pressure sensor out of range) is non-recoverable.', '[2 §2]']],
  notFound: ['Any approved calibration or recalibration procedure.'],
};
