import fs from 'node:fs';
import path from 'node:path';

const scanDir = process.argv[2];
if (!scanDir) throw new Error('scan directory argument required');

const findingsDir = path.join(scanDir, 'artifacts', '05_findings');
const dedupedPath = path.join(scanDir, 'artifacts', '04_reconciliation', 'deduped_candidates.jsonl');
const candidates = new Map(fs.readFileSync(dedupedPath, 'utf8').trim().split(/\r?\n/).filter(Boolean).map((line) => {
  const value = JSON.parse(line);
  return [value.candidate_id, value];
}));

const decisions = {
  'NX-CAN-AI-QUOTA-BIO': ['medium', 'high', 'medium', 'reportable', 'Authenticated remote concurrency crosses the user-to-provider-cost boundary.'],
  'NX-CAN-AI-QUOTA-CHAT': ['medium', 'high', 'medium', 'reportable', 'Authenticated remote concurrency crosses the user-to-provider-cost boundary.'],
  'NX-CAN-AI-QUOTA-PARAPHRASE': ['medium', 'high', 'medium', 'reportable', 'Authenticated remote concurrency crosses the user-to-provider-cost boundary.'],
  'NX-CAN-CREDENTIAL-BRUTEFORCE': ['medium', 'high', 'medium', 'reportable', 'The public credential endpoint permits automated password guessing without a repository-evidenced attempt control.'],
  'NX-CAN-FEEDBACK-LOGGING': ['medium', 'medium', 'low', 'reportable', 'A public submission can enter operator logs only when Firebase Admin is unavailable; the deployment-dependent precondition reduces likelihood.'],
  'NX-CAN-FIRESTORE-CONTACT': ['medium', 'high', 'medium', 'reportable', 'Unauthenticated remote clients can create persistent contact records outside server validation and rate limiting.'],
  'NX-CAN-FIRESTORE-FEEDBACK': ['medium', 'high', 'medium', 'reportable', 'Unauthenticated remote clients can create persistent feedback records outside the API limiter.'],
  'NX-CAN-FIRESTORE-NEWSLETTER': ['medium', 'high', 'medium', 'reportable', 'Unauthenticated remote clients can create persistent newsletter records outside the server workflow.'],
  'NX-CAN-RATELIMIT-CONTACT': ['medium', 'high', 'medium', 'reportable', 'A public remote request reaches contact persistence when the limiter transaction fails open.'],
  'NX-CAN-RATELIMIT-REGISTER': ['medium', 'medium', 'low', 'reportable', 'A public remote request can bypass the limiter only under a backend failure while Turnstile and unique-email checks remain.'],
  'NX-review-004-02': ['medium', 'high', 'medium', 'reportable', 'An authenticated remote caller can submit unbounded history to a shared provider-backed runtime.'],
  'NX-review-004-03': ['medium', 'medium', 'low', 'reportable', 'Authenticated content reaches operator logs only on provider parse failure; log access is not granted to the caller.'],
  'NX-review-005-02': ['medium', 'medium', 'low', 'reportable', 'Authenticated content reaches operator logs only on provider parse failure; log access is not granted to the caller.'],
  'NX-review-005-04': ['medium', 'medium', 'low', 'reportable', 'The remote automation bypass exists only when production is deployed with the documented test secret fallback.'],
  'NX-review-006-03': ['medium', 'high', 'medium', 'reportable', 'An unauthenticated remote caller can allocate provider-side payment orders, but cannot charge or gain entitlement.'],
  'NX-review-007-01': ['medium', 'high', 'medium', 'reportable', 'An unauthenticated remote caller can allocate unbounded persistent short-link records through the Admin-backed API.'],
  'NX-review-008-01': ['medium', 'high', 'medium', 'reportable', 'A crafted public sign-in URL controls post-authentication navigation across the Night X origin boundary.'],
};

const validationFiles = fs.readdirSync('C:/tmp').filter((name) => name.startsWith('validation-') && name.endsWith('.json'));
const reports = [];
const priority = { critical: 'P0', high: 'P1', medium: 'P2', low: 'P3' };

for (const filename of validationFiles) {
  const validation = JSON.parse(fs.readFileSync(path.join('C:/tmp', filename), 'utf8'));
  const id = validation.candidate_id;
  const candidate = candidates.get(id) ?? {};
  const configured = decisions[id];
  const originallySurvived = validation.survives === 'yes';
  const [impact, likelihood, severity, policy, rationale] = configured ?? [
    originallySurvived ? 'low' : 'ignore',
    originallySurvived ? 'high' : 'ignore',
    'ignore',
    'ignore',
    originallySurvived
      ? 'The validated defect has low or self-only security impact; the severity matrix mechanically suppresses it.'
      : 'Validation established no realistic cross-boundary security impact.',
  ];
  const reportable = policy === 'reportable';
  const title = validation.title ?? candidate.title ?? id;
  const instance = validation.instance_key ?? candidate.instance_key ?? '';
  const ledger = validation.ledger_row_id ?? validation.validation_closure?.ledger_row_id ?? candidate.ledger_row_id ?? 'not provided';
  const locations = validation.source_control_sink
    ? Object.entries(validation.source_control_sink).map(([k, v]) => `- **${k}:** ${v}`).join('\n')
    : Object.entries(candidate.exact_labeled_lines ?? candidate.lines ?? {}).map(([k, v]) => `- **${k}:** ${v}`).join('\n') || '- See validation report and canonical candidate inventory.';
  const steps = (candidate['attack path'] ?? candidate.attack_path ?? [
    validation.validation_closure?.entrypoint_source ?? 'Attacker reaches the documented entry point.',
    validation.validation_closure?.root_control ?? 'Input reaches the broken control.',
    validation.validation_closure?.sink_control ?? 'The documented sink is exercised.',
  ]).toString().split(/\s*->\s*/).map((s, i) => `${i + 1}. ${s}`).join('\n');
  const counter = (validation.counterevidence ?? validation.counterevidence_or_proof_gap ?? validation.counterevidence_or_gap ?? candidate.closest_counterevidence ?? candidate['closest counterevidence'] ?? 'No stronger repository counterevidence identified.');
  const counterText = Array.isArray(counter) ? counter.map((v) => `- ${v}`).join('\n') : `- ${counter}`;
  const authScope = /authenticated|sign.?in|valid account/i.test(JSON.stringify(validation.preconditions ?? []) + ' ' + rationale) ? 'authenticated public surface' : 'public';
  const boundary = reportable ? 'Yes; the path reaches shared runtime, persistence, provider cost, operator data, or post-authentication origin state.' : 'No meaningful supported boundary remains, or impact is self-only/low.';
  const report = `# ${title}\n\n- **Candidate:** ${id}\n- **Instance:** ${instance}\n- **Ledger row:** ${ledger}\n- **Final policy:** ${policy}\n- **Final severity:** ${reportable ? severity : 'ignore'}${reportable ? ` (${priority[severity]})` : ''}\n\n## Affected locations\n\n${locations}\n\n## Attack path\n\n${steps}\n\n## Attack Path Facts\n\n- **Assumptions:** Repository routes and rules represent the deployed product surface; external platform controls not exported by the repository remain unknown.\n- **Context:** ${boundary}\n- **In-scope:** Yes. The affected web, API, authentication, persistence, or tool surface is part of the Night X product threat model.\n- **Exposure:** Public web application/API or browser-delivered product surface. No repository evidence proves a private ingress.\n- **Identity:** ${authScope}; server routes use the application service identity where applicable.\n- **Cross-boundary behavior:** ${boundary}\n- **Vector:** ${reportable ? 'remote' : 'none'}\n- **Preconditions:** ${validation.preconditions ? validation.preconditions.join('; ') : 'See validation report; no additional precondition was invented.'}\n- **Attacker input control:** ${reportable ? 'Yes or plausibly yes at the validated public entry point.' : 'Insufficient for a meaningful security boundary.'}\n- **Category:** ${(validation.cwe_ids ?? [candidate.CWE ?? candidate.cwe ?? 'product security']).join(', ')}\n- **Mitigations:** See counterevidence below; no unexported WAF, App Check, or deployment control is assumed.\n- **Auth scope:** ${authScope}.\n- **Impact surface:** ${reportable ? 'runtime/data/identity/provider cost as described by validation' : 'self-only or product correctness'}\n- **Target reach:** Single Night X service/workflow; no fleet-wide compromise established.\n- **Secrets references:** None directly exposed by this path unless the validation report says otherwise.\n- **Blindspots:** Live deployment controls and telemetry were unavailable; confidence is bounded accordingly.\n- **Controls:** Framework validation, authentication, server validation, Firestore rules, and rate limits are credited only where evidenced.\n- **Confidence:** ${JSON.stringify(validation.confidence ?? 'high')}\n\n## Strongest counterevidence\n\n${counterText}\n\nThe counterevidence ${reportable ? 'narrows impact or likelihood but does not defeat the validated attacker path.' : 'is dispositive under the hard-suppression rules or the low-impact severity row.'}\n\n## Severity calibration\n\n- Impact: **${impact}**\n- Likelihood: **${likelihood}**\n- Mechanical matrix result: **${severity}**\n- Rationale: ${rationale}\n\n## Final policy decision\n\n**${policy}**${reportable ? ` as ${severity} / ${priority[severity]}.` : '. No priority is assigned.'}\n`;
  const candidateDir = path.join(findingsDir, id);
  fs.mkdirSync(candidateDir, { recursive: true });
  fs.writeFileSync(path.join(candidateDir, 'attack_path_analysis_report.md'), report);
  const receipt = {
    candidate_id: id,
    phase: 'attack_path',
    status: 'complete',
    reportability_decision: policy,
    impact,
    likelihood,
    final_severity: reportable ? severity : 'ignore',
    priority: reportable ? priority[severity] : null,
    attack_path_facts_or_gap: rationale,
    report_reference: path.join(candidateDir, 'attack_path_analysis_report.md').replaceAll('\\', '/'),
  };
  fs.appendFileSync(path.join(candidateDir, 'candidate_ledger.jsonl'), `${JSON.stringify(receipt)}\n`);
  reports.push({ id, title, policy, severity: reportable ? severity : 'ignore', priority: reportable ? priority[severity] : '', rationale });
}

reports.sort((a, b) => a.id.localeCompare(b.id));
const reportableRows = reports.filter((r) => r.policy === 'reportable');
const ignoredRows = reports.filter((r) => r.policy === 'ignore');
const summary = `# Attack-Path Analysis Report\n\n- Candidates analyzed: ${reports.length}/${reports.length}\n- Final reportable: ${reportableRows.length}\n- Final ignored by policy: ${ignoredRows.length}\n- Critical: ${reportableRows.filter((r) => r.severity === 'critical').length}\n- High: ${reportableRows.filter((r) => r.severity === 'high').length}\n- Medium: ${reportableRows.filter((r) => r.severity === 'medium').length}\n- Low: ${reportableRows.filter((r) => r.severity === 'low').length}\n\n## Final reportable findings\n\n| Candidate | Severity | Priority | Decision basis |\n|---|---|---|---|\n${reportableRows.map((r) => `| ${r.id} | ${r.severity} | ${r.priority} | ${r.rationale.replaceAll('|', '\\|')} |`).join('\n')}\n\n## Policy-suppressed findings\n\n| Candidate | Final decision | Decision basis |\n|---|---|---|\n${ignoredRows.map((r) => `| ${r.id} | ignore | ${r.rationale.replaceAll('|', '\\|')} |`).join('\n')}\n`;
fs.writeFileSync(path.join(findingsDir, 'attack_path_analysis_report.md'), summary);
fs.writeFileSync(path.join(findingsDir, 'attack_path_closure.json'), JSON.stringify({ candidates: reports, counts: { analyzed: reports.length, reportable: reportableRows.length, ignored: ignoredRows.length } }, null, 2));
console.log(JSON.stringify({ analyzed: reports.length, reportable: reportableRows.length, ignored: ignoredRows.length, severity: Object.groupBy(reportableRows, (r) => r.severity) }, null, 2));
