// Persian text checks for slide sources (HTML / Markdown). Reports only; never rewrites text.

const LETTER = 'آ-ی';

const RULES = [
	{
		id: 'arabic-yeh',
		pattern: /[يى]/g,
		message: 'Arabic yeh: use Persian «ی»',
		suggest: () => 'ی'
	},
	{
		id: 'arabic-kaf',
		pattern: /ك/g,
		message: 'Arabic kaf: use Persian «ک»',
		suggest: () => 'ک'
	},
	{
		id: 'zwnj-mi',
		// "می رود" → "می‌رود" (also "نمی")
		pattern: new RegExp( `(?<![${ LETTER }\\u200c])(ن?می) (?=[${ LETTER }])`, 'g' ),
		message: 'Space after «می»: use a zero-width non-joiner (نیم‌فاصله)',
		suggest: m => m[1] + '‌'
	},
	{
		id: 'zwnj-suffix',
		// "کتاب ها" → "کتاب‌ها", "بزرگ ترین" → "بزرگ‌ترین"
		pattern: new RegExp( `(?<=[${ LETTER }]) (ها|های|هایی|هایم|هایت|هایش|ترین|تر)(?![${ LETTER }\\u200c])`, 'g' ),
		message: 'Space before suffix: use a zero-width non-joiner (نیم‌فاصله)',
		suggest: m => '‌' + m[1]
	},
	{
		id: 'mixed-digits',
		// One number written with two digit sets, e.g. "۱4".
		pattern: /(?=[0-9۰-۹٠-٩]*[0-9])(?=[0-9۰-۹٠-٩]*[۰-۹٠-٩])[0-9۰-۹٠-٩]{2,}/g,
		message: 'Number mixes Latin and Persian/Arabic digits',
		suggest: m => m[0].replace( /[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d] ).replace( /[٠-٩]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d.charCodeAt( 0 ) - 0x0660] )
	},
	{
		id: 'arabic-digits',
		pattern: /[٠-٩]+/g,
		message: 'Arabic-Indic digits: Persian uses ۰۱۲۳۴۵۶۷۸۹',
		suggest: m => m[0].replace( /[٠-٩]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d.charCodeAt( 0 ) - 0x0660] )
	}
];

// Left alone: fenced and inline Markdown code, <pre>, <code>, <script>, <style>, elements in another
// language (lang="ar", lang="en"…), and <!-- reveal-rtl-lint-disable --> … <!-- reveal-rtl-lint-enable -->.
// shortcut: lang="…" matching does not handle the same tag nested inside itself; fine for slides.
const CODE = /```[\s\S]*?```|`[^`\n]*`|<(pre|code|script|style)\b[\s\S]*?<\/\1>|<(\w+)\b[^>]*\blang=["'](?!fa)[^"']*["'][^>]*>[\s\S]*?<\/\2>|<!--\s*reveal-rtl-lint-disable\s*-->[\s\S]*?(<!--\s*reveal-rtl-lint-enable\s*-->|$)/gi;

// Replace code with spaces (newlines kept) so line/column numbers stay right.
function maskCode( text ) {
	return text.replace( CODE, block => block.replace( /[^\n]/g, ' ' ) );
}

/**
 * Returns [ { line, column, rule, message, found, suggestion } ], 1-based line/column.
 */
export function lintPersian( text ) {
	const masked = maskCode( text );
	const lineStarts = [ 0 ];
	for( let i = 0; i < masked.length; i++ ) if( masked[i] === '\n' ) lineStarts.push( i + 1 );
	const position = index => {
		let line = lineStarts.length - 1;
		while( lineStarts[ line ] > index ) line--;
		return { line: line + 1, column: index - lineStarts[ line ] + 1 };
	};

	const issues = [];
	for( const rule of RULES ) {
		for( const match of masked.matchAll( rule.pattern ) ) {
			issues.push( { ...position( match.index ), rule: rule.id, message: rule.message, found: match[0], suggestion: rule.suggest( match ) } );
		}
	}
	return issues.sort( ( a, b ) => a.line - b.line || a.column - b.column );
}
