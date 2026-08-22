import { sleep } from "../lib/sleep";

// Set VITE_MOCK_LATENCY > 0 to test loading states; defaults to 0 for instant resolution.
// Promise contract is preserved either way (await still yields control).
const MOCK_LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY ?? 0);

export async function simulateLatency() {
  if (MOCK_LATENCY_MS > 0) {
    const jitter = MOCK_LATENCY_MS * 0.3;
    const ms = MOCK_LATENCY_MS - jitter + Math.random() * (jitter * 2);
    await sleep(ms);
  }
}
