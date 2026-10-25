// Builds gallery/<name>/index.html from gallery/src/<name>.md with the create-reveal-rtl template,
// pointing at this repo's files instead of the CDN so the gallery always shows the current code.
// Run by `npm run build`. Source header: <!-- lang: fa | title: … -->
import fs from 'node:fs';
import path from 'node:path';

const page = fs.readFileSync( 'create-reveal-rtl/template/index.html', 'utf8' )
	.replace( /https:\/\/cdn\.jsdelivr\.net\/npm\/reveal-rtl@\{\{version\}\}\//g, '../../' );
const escapeHTML = text => text.replace( /[&<>"']/g, c => ( { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } )[ c ] );

for( const file of fs.readdirSync( 'gallery/src' ).filter( f => f.endsWith( '.md' ) ) ) {
	const source = fs.readFileSync( path.join( 'gallery/src', file ), 'utf8' );
	const header = source.match( /^<!--\s*lang:\s*(\w+)\s*\|\s*title:\s*(.+?)\s*-->\r?\n/ );
	if( !header ) throw new Error( `${ file }: missing <!-- lang: … | title: … --> header` );
	const values = { lang: header[1], title: escapeHTML( header[2] ), slides: source.slice( header[0].length ).trim() };
	const html = page.replace( /\{\{(\w+)\}\}/g, ( m, key ) => values[ key ] ?? m );
	const dir = path.join( 'gallery', path.basename( file, '.md' ) );
	fs.mkdirSync( dir, { recursive: true } );
	fs.writeFileSync( path.join( dir, 'index.html' ), html );
	console.log( `${ dir }/index.html` );
}
