// Keeps the skill's template identical to the npm create starter's (one source of truth).
// Run by `npm run build`; CI fails if the copy is stale.
import fs from 'node:fs';

fs.copyFileSync( 'create-reveal-rtl/template/index.html', 'plugins/reveal-rtl/skills/rtl-slides/template.html' );
console.log( 'plugins/reveal-rtl/skills/rtl-slides/template.html' );
