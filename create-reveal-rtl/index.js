#!/usr/bin/env node
// npm create reveal-rtl [folder] [--lang fa|ar|en] [--template basic|thesis|class] [--title "…"]
// Writes a ready-to-open right-to-left reveal.js presentation (one HTML file, slides in Markdown).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMPLATES } from './templates.js';

// reveal-rtl version range used in the CDN links (jsDelivr resolves "0.5" to the latest 0.5.x).
export const REVEAL_RTL_VERSION = '0.5';

const CONTENT = {
	fa: {
		title: 'ارائه‌ی من',
		slides: `# {{title}}

<time data-jalali></time>

Note: یادداشت سخنران؛ با کلید S پنجره‌ی سخنران باز می‌شود.

---

## فهرست

- اسلایدها را با Markdown بنویسید
- با \`---\` اسلاید جدید بسازید
- اعداد خودکار فارسی می‌شوند: 1404

---

## کلیدها

| کلید | کار |
|---|---|
| M | فهرست اسلایدها |
| D | قلم |
| ? | راهنما |`,
		readme: `# {{title}}

فایل \`index.html\` را در مرورگر باز کنید. اسلایدها داخل همان فایل با Markdown نوشته شده‌اند.

- راهنمای reveal-rtl: https://github.com/darajoukar/reveal-rtl
- بررسی متن فارسی: \`npx reveal-rtl-lint\`
`
	},
	ar: {
		title: 'عرضي التقديمي',
		slides: `# {{title}}

<time data-hijri></time>

Note: ملاحظات المتحدث؛ اضغط S لفتح نافذة المتحدث.

---

## المحتويات

- اكتب الشرائح بصيغة Markdown
- أنشئ شريحة جديدة بـ \`---\`
- تتحول الأرقام تلقائيًا إلى العربية: 2026

---

## المفاتيح

| المفتاح | الإجراء |
|---|---|
| M | قائمة الشرائح |
| D | قلم |
| ? | المساعدة |`,
		readme: `# {{title}}

افتح الملف \`index.html\` في المتصفح. الشرائح مكتوبة بصيغة Markdown داخل الملف نفسه.

- دليل reveal-rtl: https://github.com/darajoukar/reveal-rtl
`
	},
	en: {
		title: 'My presentation',
		slides: `# {{title}}

Right-to-left slides with reveal-rtl

Note: Speaker notes; press S for the speaker view.

---

## Contents

- Write slides in Markdown
- Start a new slide with \`---\`
- Keys: M slide list, D pen, ? help`,
		readme: `# {{title}}

Open \`index.html\` in a browser. The slides are written in Markdown inside that file.

- reveal-rtl docs: https://github.com/darajoukar/reveal-rtl
`
	}
};

const fill = ( text, values ) => text.replace( /\{\{(\w+)\}\}/g, ( m, key ) => values[ key ] ?? m );

// Escapes text placed into HTML (the title comes from the command line).
const escapeHTML = text => text.replace( /[&<>"']/g, c => ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } )[ c ] );

export function createPresentation( target, { lang = 'fa', title, template = 'basic' } = {} ) {
	if( !CONTENT[ lang ] ) throw new Error( `Unknown language "${ lang }" (use fa, ar or en)` );
	if( template !== 'basic' && !TEMPLATES[ template ] ) {
		throw new Error( `Unknown template "${ template }" (use basic, ${ Object.keys( TEMPLATES ).join( ', ' ) })` );
	}
	if( fs.existsSync( target ) && fs.readdirSync( target ).length ) {
		throw new Error( `Folder "${ target }" already exists and is not empty` );
	}
	// Template slides and default title; the README text comes from the language.
	const content = { ...CONTENT[ lang ], ...( template === 'basic' ? {} : TEMPLATES[ template ][ lang ] ) };
	const safeTitle = escapeHTML( title || content.title );
	// The first slide's heading is the title too (slides are filled first: fill() does not recurse).
	const values = { lang, version: REVEAL_RTL_VERSION, title: safeTitle, slides: fill( content.slides, { title: safeTitle } ) };
	const page = fs.readFileSync( path.join( path.dirname( fileURLToPath( import.meta.url ) ), 'template', 'index.html' ), 'utf8' );

	fs.mkdirSync( target, { recursive: true } );
	fs.writeFileSync( path.join( target, 'index.html' ), fill( page, values ) );
	fs.writeFileSync( path.join( target, 'README.md' ), fill( content.readme, { title: title || content.title } ) );
	return [ 'index.html', 'README.md' ].map( file => path.join( target, file ) );
}

function parseArgs( argv ) {
	const options = { target: 'my-presentation' };
	for( let i = 0; i < argv.length; i++ ) {
		if( argv[i] === '--lang' ) options.lang = argv[ ++i ];
		else if( argv[i] === '--title' ) options.title = argv[ ++i ];
		else if( argv[i] === '--template' ) options.template = argv[ ++i ];
		else if( argv[i] === '--help' || argv[i] === '-h' ) options.help = true;
		else options.target = argv[i];
	}
	return options;
}

if( process.argv[1] && fileURLToPath( import.meta.url ) === path.resolve( process.argv[1] ) ) {
	const options = parseArgs( process.argv.slice( 2 ) );
	if( options.help ) {
		console.log( 'Usage: npm create reveal-rtl [folder] -- [--lang fa|ar|en] [--template basic|thesis|class] [--title "…"]' );
		process.exit( 0 );
	}
	try {
		const files = createPresentation( options.target, options );
		console.log( `Created:\n  ${ files.join( '\n  ' ) }\n\nOpen ${ files[0] } in a browser to start presenting.` );
	} catch( error ) {
		console.error( `create-reveal-rtl: ${ error.message }` );
		process.exit( 1 );
	}
}
