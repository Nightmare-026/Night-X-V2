'use strict';

const limit = 30;
let storedCount = 29;
let providerCalls = 0;
const reads = [];

function readAndCheck(id) {
  const observed = storedCount; // Firestore get() in the route
  if (observed >= limit) return Promise.resolve({ id, admitted: false });
  reads.push({ id, observed });
  return Promise.resolve({ id, admitted: true });
}

async function main() {
  const decisions = await Promise.all(
    Array.from({ length: 10 }, (_, i) => readAndCheck(String.fromCharCode(65 + i)))
  );
  if (decisions.some(d => !d.admitted) || reads.length !== 10) {
    throw new Error('barrier setup failed');
  }
  // All ten requests now cross the provider boundary before accounting.
  for (const d of decisions) {
    providerCalls++;
    storedCount++;
  }
  console.log(`[+] all ${reads.length} requests observed count=${reads[0].observed}`);
  console.log(`[+] provider invocations=${providerCalls}`);
  console.log(`[+] final stored count=${storedCount}`);
  console.log('[+] quota invariant violated: 10 calls consumed with 1 slot available');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
