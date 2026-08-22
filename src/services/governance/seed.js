/**
 * Demo seed entrypoint — delegates to ./seed/index.js.
 *
 * Kept here so existing imports of `./seed` keep working.
 */

export { ensureSeed, resetAndReseed, DECON_PACK_KEY } from "./seed/index.js";
