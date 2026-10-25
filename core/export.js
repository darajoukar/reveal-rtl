// Export helpers: slide data as JSON, Markdown, notes text; standalone HTML snapshot; downloads.
// The converters only use nodeType/nodeName/nodeValue/childNodes/getAttribute, so they run on
// real DOM nodes and on the plain objects used in tests.

const BLOCK_TAGS = new Set( [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'PRE', 'BLOCKQUOTE', 'TABLE', 'SECTION', 'DIV', 'FIGURE', 'HR' ] );

const isElement = node => node.nodeType === 1;
const isNotes = node => isElement( node ) && node.nodeName === 'ASIDE' && /\bnotes\b/.test( node.getAttribute( 'class' ) || '' );
const children = node => Array.from( node.childNodes || [] );

// Raw text of a node, skipping speaker notes.
export function textOf( node ) {
	if( node.nodeType === 3 ) return node.nodeValue;
	if( isNotes( node ) ) return '';
	return children( node ).map( textOf ).join( '' );
}

const collapse = text => text.replace( /\s+/g, ' ' ).trim();

// t: optional resolveLocale().t for the "Slide N" fallback (default Persian).
export function getSlideTitle( slide, index, t ) {
	const explicit = slide.getAttribute( 'data-menu-title' );
	if( explicit ) return explicit;
	const heading = findFirst( slide, node => /^H[1-3]$/.test( node.nodeName ) );
	if( heading ) return collapse( textOf( heading ) );
	return t ? t( 'slideN', { n: index + 1 } ) : `اسلاید ${ index + 1 }`;
}

function findFirst( node, test ) {
	for( const child of children( node ) ) {
		if( !isElement( child ) || isNotes( child ) ) continue;
		if( test( child ) ) return child;
		const found = findFirst( child, test );
		if( found ) return found;
	}
	return null;
}

export function getSlideNotes( slide ) {
	const notes = [];
	const walk = node => children( node ).forEach( child => {
		if( isNotes( child ) ) notes.push( collapse( children( child ).map( textOf ).join( '' ) ) );
		else if( isElement( child ) ) walk( child );
	} );
	walk( slide );
	const attr = slide.getAttribute( 'data-notes' );
	if( attr ) notes.push( attr );
	return notes.join( '\n' );
}

// --- Markdown ---

function inline( node ) {
	if( node.nodeType === 3 ) return node.nodeValue.replace( /\s+/g, ' ' );
	if( !isElement( node ) || isNotes( node ) ) return '';
	const inner = () => children( node ).map( inline ).join( '' );
	switch( node.nodeName ) {
		case 'STRONG': case 'B': return wrap( '**', inner() );
		case 'EM': case 'I': return wrap( '*', inner() );
		case 'CODE': return '`' + textOf( node ) + '`';
		case 'BR': return '  \n';
		case 'A': return `[${ inner().trim() }](${ node.getAttribute( 'href' ) || '' })`;
		case 'IMG': return `![${ node.getAttribute( 'alt' ) || '' }](${ node.getAttribute( 'src' ) || '' })`;
		default: return inner();
	}
}

function wrap( mark, text ) {
	const trimmed = text.trim();
	return trimmed ? mark + trimmed + mark : '';
}

function list( node, depth ) {
	const ordered = node.nodeName === 'OL';
	let n = 0;
	return children( node ).filter( li => li.nodeName === 'LI' ).map( li => {
		n++;
		const own = children( li ).filter( c => c.nodeName !== 'UL' && c.nodeName !== 'OL' ).map( inline ).join( '' ).trim();
		const nested = children( li ).filter( c => c.nodeName === 'UL' || c.nodeName === 'OL' ).map( c => list( c, depth + 1 ) ).join( '' );
		return `${ '  '.repeat( depth ) }${ ordered ? n + '.' : '-' } ${ own }\n${ nested }`;
	} ).join( '' );
}

function table( node ) {
	const rows = [];
	const collect = el => children( el ).forEach( c => {
		if( c.nodeName === 'TR' ) rows.push( children( c ).filter( cell => /^T[HD]$/.test( cell.nodeName ) ).map( cell => collapse( inline( cell ) ).replace( /\|/g, '\\|' ) ) );
		else if( isElement( c ) ) collect( c );
	} );
	collect( node );
	if( !rows.length ) return '';
	const line = cells => `| ${ cells.join( ' | ' ) } |\n`;
	return line( rows[0] ) + line( rows[0].map( () => '---' ) ) + rows.slice( 1 ).map( line ).join( '' ) + '\n';
}

function block( node ) {
	if( node.nodeType === 3 ) {
		const text = collapse( node.nodeValue );
		return text ? text + '\n\n' : '';
	}
	if( !isElement( node ) || isNotes( node ) ) return '';
	const name = node.nodeName;
	if( /^H[1-6]$/.test( name ) ) return `${ '#'.repeat( +name[1] ) } ${ collapse( inline( node ) ) }\n\n`;
	switch( name ) {
		case 'P': {
			const text = inline( node ).trim();
			return text ? text + '\n\n' : '';
		}
		case 'UL': case 'OL': return list( node, 0 ) + '\n';
		case 'PRE': {
			const code = findFirst( node, c => c.nodeName === 'CODE' );
			const lang = ( ( code?.getAttribute( 'class' ) || '' ).match( /language-(\S+)/ ) || [] )[1] || '';
			return '```' + lang + '\n' + textOf( node ).replace( /\n$/, '' ) + '\n```\n\n';
		}
		case 'BLOCKQUOTE': return blocks( node ).trim().split( '\n' ).map( l => '> ' + l ).join( '\n' ) + '\n\n';
		case 'TABLE': return table( node );
		case 'HR': return '***\n\n';
		case 'SCRIPT': case 'STYLE': return '';
	}
	// Containers: recurse if they hold blocks, otherwise treat as a paragraph.
	if( children( node ).some( c => BLOCK_TAGS.has( c.nodeName ) ) ) return blocks( node );
	const text = inline( node ).trim();
	return text ? text + '\n\n' : '';
}

function blocks( node ) {
	return children( node ).map( block ).join( '' );
}

export function htmlToMarkdown( node ) {
	return blocks( node ).replace( /\n{3,}/g, '\n\n' ).trim();
}

// slides: array of { element, h, v }
export function slidesToMarkdown( slides ) {
	return slides.map( ( { element } ) => {
		const notes = getSlideNotes( element );
		return htmlToMarkdown( element ) + ( notes ? `\n\nNote: ${ notes }` : '' );
	} ).join( '\n\n---\n\n' ) + '\n';
}

export function slidesToJSON( slides, title, t ) {
	return JSON.stringify( {
		title,
		exportedAt: new Date().toISOString(),
		slideCount: slides.length,
		slides: slides.map( ( { element, h, v }, i ) => ( {
			number: i + 1,
			indices: { h, v },
			title: getSlideTitle( element, i, t ),
			text: collapse( textOf( element ) ),
			notes: getSlideNotes( element ),
			markdown: htmlToMarkdown( element )
		} ) )
	}, null, 2 );
}

export function slidesToNotesText( slides, title, t ) {
	const parts = slides.map( ( { element }, i ) => {
		const notes = getSlideNotes( element );
		return `${ i + 1 }. ${ getSlideTitle( element, i, t ) }\n${ notes || '—' }`;
	} );
	const heading = t ? t( 'notesFileTitle' ) : 'یادداشت‌های سخنران';
	return `${ heading }: ${ title }\n\n${ parts.join( '\n\n' ) }\n`;
}

// --- HTML ---

// Makes src/href attributes absolute so a saved copy still loads its CSS, scripts and images.
// Attributes holding URLs (link[href] only: <a href> may be in-deck "#/3" links and stays as is).
const URL_ATTRS = [ 'src', 'data-src', 'data-background-image', 'data-background-video', 'data-background-iframe' ];

export function standaloneHTML( docClone, baseURI ) {
	const absolutize = ( el, attr ) => {
		const value = el.getAttribute( attr );
		if( value && !/^(data:|blob:|#)/.test( value ) ) {
			try { el.setAttribute( attr, new URL( value, baseURI ).href ); } catch( e ) { /* leave invalid URLs as is */ }
		}
	};
	docClone.querySelectorAll( 'link[href]' ).forEach( el => absolutize( el, 'href' ) );
	URL_ATTRS.forEach( attr => docClone.querySelectorAll( `[${ attr }]` ).forEach( el => absolutize( el, attr ) ) );
	// data-background is a shorthand: only image paths are URLs (not colors or gradients).
	docClone.querySelectorAll( '[data-background]' ).forEach( el => {
		if( /\.(png|jpe?g|gif|svg|webp|avif|bmp)([?#]|$)/i.test( el.getAttribute( 'data-background' ) ) ) absolutize( el, 'data-background' );
	} );
	return '<!doctype html>\n' + docClone.outerHTML;
}

// --- Offline HTML: CSS, scripts, fonts and images inlined into one file ---

const CSS_IMPORT = /@import\s+(?:url\(\s*)?(['"]?)([^'")\s;]+)\1\s*\)?[^;]*;/g;
const CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

export async function toDataURL( blob ) {
	const bytes = new Uint8Array( await blob.arrayBuffer() );
	let binary = '';
	for( let i = 0; i < bytes.length; i += 0x8000 ) binary += String.fromCharCode( ...bytes.subarray( i, i + 0x8000 ) );
	return `data:${ blob.type || 'application/octet-stream' };base64,${ btoa( binary ) }`;
}

async function fetchOk( url, fetchFn ) {
	const response = await fetchFn( url );
	if( !response.ok ) throw new Error( `${ response.status } ${ url }` );
	return response;
}

// Inlines @import rules (recursively) and url() references of a stylesheet fetched from cssURL.
export async function inlineCss( css, cssURL, fetchFn = fetch, failed = [], depth = 0 ) {
	if( depth > 5 ) return css;

	const imports = [ ...css.matchAll( CSS_IMPORT ) ];
	for( const [ rule, , href ] of imports ) {
		const url = new URL( href, cssURL ).href;
		try {
			const imported = await ( await fetchOk( url, fetchFn ) ).text();
			css = css.replace( rule, await inlineCss( imported, url, fetchFn, failed, depth + 1 ) );
		}
		catch( e ) { failed.push( url ); }
	}

	const cache = new Map();
	for( const [ , , href ] of css.matchAll( CSS_URL ) ) {
		if( /^(data:|#)/.test( href ) || cache.has( href ) ) continue;
		const url = new URL( href, cssURL ).href;
		if( failed.includes( url ) ) continue;
		try { cache.set( href, await toDataURL( await ( await fetchOk( url, fetchFn ) ).blob() ) ); }
		catch( e ) { failed.push( url ); }
	}
	// Leftovers become absolute: once inlined into another stylesheet or the page, relative paths would break.
	return css.replace( CSS_URL, ( match, quote, href ) => {
		if( cache.has( href ) ) return `url("${ cache.get( href ) }")`;
		return /^(data:|#)/.test( href ) ? match : `url("${ new URL( href, cssURL ).href }")`;
	} );
}

// Returns { html, failed }: failed lists URLs that could not be fetched (left as absolute links).
export async function offlineHTML( docClone, baseURI, fetchFn = fetch ) {
	const failed = [];
	const doc = docClone.ownerDocument;

	for( const link of docClone.querySelectorAll( 'link[rel="stylesheet"][href]' ) ) {
		const url = new URL( link.getAttribute( 'href' ), baseURI ).href;
		try {
			const style = doc.createElement( 'style' );
			if( link.media ) style.media = link.media;
			style.textContent = await inlineCss( await ( await fetchOk( url, fetchFn ) ).text(), url, fetchFn, failed );
			link.replaceWith( style );
		}
		catch( e ) { failed.push( url ); }
	}

	for( const script of docClone.querySelectorAll( 'script[src]' ) ) {
		const url = new URL( script.getAttribute( 'src' ), baseURI ).href;
		try {
			const code = await ( await fetchOk( url, fetchFn ) ).text();
			const inline = doc.createElement( 'script' );
			// "</script" inside the code would end the inline element early.
			inline.textContent = code.replace( /<\/script/gi, '<\\/script' );
			script.replaceWith( inline );
		}
		catch( e ) { failed.push( url ); }
	}

	// Images: <img src>, lazy-loaded <img data-src>, and slide backgrounds (data-background-image, or the
	// data-background shorthand when it holds an image path rather than a color or gradient).
	// shortcut: background videos and iframes stay as links (too large to inline); revisit if asked.
	const IMAGE_PATH = /\.(png|jpe?g|gif|svg|webp|avif|bmp)([?#]|$)/i;
	const targets = [
		...[ ...docClone.querySelectorAll( 'img[src]' ) ].map( el => [ el, 'src' ] ),
		...[ ...docClone.querySelectorAll( 'img[data-src]' ) ].map( el => [ el, 'data-src' ] ),
		...[ ...docClone.querySelectorAll( '[data-background-image]' ) ].map( el => [ el, 'data-background-image' ] ),
		...[ ...docClone.querySelectorAll( '[data-background]' ) ].filter( el => IMAGE_PATH.test( el.getAttribute( 'data-background' ) ) ).map( el => [ el, 'data-background' ] )
	];
	for( const [ el, attr ] of targets ) {
		const value = el.getAttribute( attr );
		if( !value || value.startsWith( 'data:' ) ) continue;
		const url = new URL( value, baseURI ).href;
		try { el.setAttribute( attr, await toDataURL( await ( await fetchOk( url, fetchFn ) ).blob() ) ); }
		catch( e ) { failed.push( url ); }
	}

	// Anything not inlined still needs to resolve from the saved file.
	return { html: standaloneHTML( docClone, baseURI ), failed: [ ...new Set( failed ) ] };
}

// --- Download ---

export function safeFileName( title ) {
	return ( title || '' ).replace( /[\\/:*?"<>|]+/g, '' ).replace( /\s+/g, '-' ).slice( 0, 80 ) || 'presentation';
}

export function download( fileName, content, type ) {
	const url = URL.createObjectURL( new Blob( [ content ], { type: `${ type };charset=utf-8` } ) );
	const link = document.createElement( 'a' );
	link.href = url;
	link.download = fileName;
	document.body.append( link );
	link.click();
	link.remove();
	setTimeout( () => URL.revokeObjectURL( url ), 1000 );
}
