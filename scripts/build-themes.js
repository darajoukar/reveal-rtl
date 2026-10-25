// Builds themes/*.css from reveal.js's own theme template (dist/theme/simple.css): the template
// rules stay, the font @imports and color variables are replaced. Run by `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const template = fs.readFileSync( 'node_modules/reveal.js/dist/theme/simple.css', 'utf8' )
	.replace( /@import\s+[^;]+;/g, '' )
	.replace( /^:root\{[^}]*\}/, '' );

const shared = {
	'--r-main-font': "'Vazirmatn', Tahoma, sans-serif",
	'--r-main-font-size': '40px',
	'--r-block-margin': '20px',
	'--r-heading-margin': '0 0 24px 0',
	'--r-heading-font': "'Vazirmatn', Tahoma, sans-serif",
	'--r-heading-line-height': '1.4',
	'--r-heading-letter-spacing': 'normal',
	'--r-heading-text-transform': 'none',
	'--r-heading-text-shadow': 'none',
	'--r-heading-font-weight': '800',
	'--r-heading1-text-shadow': 'none',
	'--r-heading1-size': '2.3em',
	'--r-heading2-size': '1.6em',
	'--r-heading3-size': '1.3em',
	'--r-heading4-size': '1em',
	'--r-code-font': 'monospace'
};

const themes = {
	'parsi-light': {
		title: 'پارسی روشن — Parsi light',
		vars: {
			'--r-background': '#faf7f0',
			'--r-background-color': '#faf7f0',
			'--r-main-color': '#2b2d42',
			'--r-heading-color': '#1d3557',
			'--r-link-color': '#c2410c',
			'--r-link-color-dark': '#9a3412',
			'--r-link-color-hover': '#ea580c',
			'--r-selection-background-color': '#1d3557',
			'--r-selection-color': '#fff',
			'--r-overlay-element-bg-color': '0, 0, 0',
			'--r-overlay-element-fg-color': '240, 240, 240'
		}
	},
	'parsi-dark': {
		title: 'پارسی تیره — Parsi dark',
		vars: {
			'--r-background': 'radial-gradient(circle at 50% 30%, #1d2545 0%, #10142a 100%)',
			'--r-background-color': '#10142a',
			'--r-main-color': '#e7e5df',
			'--r-heading-color': '#f2c14e',
			'--r-link-color': '#7cc6fe',
			'--r-link-color-dark': '#4aa8f0',
			'--r-link-color-hover': '#b3ddff',
			'--r-selection-background-color': '#f2c14e',
			'--r-selection-color': '#10142a',
			'--r-overlay-element-bg-color': '240, 240, 240',
			'--r-overlay-element-fg-color': '0, 0, 0'
		}
	}
};

// Persian/Arabic text needs more line height than the Latin-tuned template.
const extra = '.reveal .slides section,.reveal .slides section>section{line-height:1.7}.reveal p,.reveal li{line-height:1.7}';

fs.mkdirSync( 'themes', { recursive: true } );
for( const [ name, { title, vars } ] of Object.entries( themes ) ) {
	const root = Object.entries( { ...shared, ...vars } ).map( ( [ k, v ] ) => `${ k }:${ v }` ).join( ';' );
	const css = `/* reveal-rtl theme: ${ title }. Built by scripts/build-themes.js from the reveal.js theme template (MIT). Load core/rtl.css for the Vazirmatn font. */\n:root{${ root }}${ template }${ extra }\n`;
	fs.writeFileSync( path.join( 'themes', `${ name }.css` ), css );
	console.log( `themes/${ name }.css` );
}
