// Keeps the rtl-slides skill in step with the packages (one source of truth), run by `npm run build`;
// CI fails if the result is stale:
// - template.html: copy of the create-reveal-rtl starter template
// - SKILL.md: npx commands pinned to the current exact versions (plugin directory rule), and the
//   reveal-rtl CDN range ("0.5") for the template's {{version}} placeholder
// - plugin.json: version follows reveal-rtl
import fs from 'node:fs';

const SKILL_DIR = 'plugins/reveal-rtl/skills/rtl-slides';
const revealRtl = JSON.parse( fs.readFileSync( 'package.json', 'utf8' ) ).version;
const starter = JSON.parse( fs.readFileSync( 'create-reveal-rtl/package.json', 'utf8' ) ).version;
const range = revealRtl.split( '.' ).slice( 0, 2 ).join( '.' );

fs.copyFileSync( 'create-reveal-rtl/template/index.html', `${ SKILL_DIR }/template.html` );

const skillPath = `${ SKILL_DIR }/SKILL.md`;
fs.writeFileSync( skillPath, fs.readFileSync( skillPath, 'utf8' )
	.replace( /create-reveal-rtl(@[\d.]+)?(?= )/g, `create-reveal-rtl@${ starter }` )
	.replace( /-p reveal-rtl(@[\d.]+)?(?= )/g, `-p reveal-rtl@${ revealRtl }` )
	.replace( /`\{\{version\}\}` → `[\d.]+`/g, `\`{{version}}\` → \`${ range }\`` ) );

const referencePath = `${ SKILL_DIR }/reference.md`;
fs.writeFileSync( referencePath, fs.readFileSync( referencePath, 'utf8' )
	.replace( /-p reveal-rtl(@[\d.]+)?(?= )/g, `-p reveal-rtl@${ revealRtl }` ) );

const manifestPath = 'plugins/reveal-rtl/.claude-plugin/plugin.json';
const manifest = JSON.parse( fs.readFileSync( manifestPath, 'utf8' ) );
manifest.version = revealRtl;
fs.writeFileSync( manifestPath, JSON.stringify( manifest, null, 2 ) + '\n' );

console.log( `${ SKILL_DIR }: create-reveal-rtl@${ starter }, reveal-rtl@${ revealRtl }` );
