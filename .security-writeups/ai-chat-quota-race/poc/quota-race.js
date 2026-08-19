#!/usr/bin/env node

// Safe, offline model of the chat route's read -> provider -> increment order.
// It never contacts Firebase or an AI provider.
const limit = 30;
let count = 29;
let providerCalls = 0;

function request(id, barrier) {
  const observed = count; // all requests read before any accounting write
  if (observed >= limit) return Promise.resolve({ id, admitted: false });
  return barrier.then(() => {
    providerCalls += 1; // external provider is reached first
    count += 1;         // delayed FieldValue.increment(1)
    return { id, admitted: true, observed };
  });
}

async function main() {
  let release;
  const barrier = new Promise(resolve => { release = resolve; });
  const pending = Array.from({ length: 8 }, (_, i) => request(`R${i + 1}`, barrier));
  release();
  const results = await Promise.all(pending);
  console.log(`[+] admitted requests: ${results.filter(r => r.admitted).length}`);
  console.log(`[+] provider calls before limit enforcement: ${providerCalls}`);
  console.log(`[+] final simulated count: ${count}`);
  if (providerCalls > 1) console.log('[!] quota overrun reproduced: every request observed count=29');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
