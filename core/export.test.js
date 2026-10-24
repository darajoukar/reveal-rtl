import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlToMarkdown, getSlideTitle, getSlideNotes, slidesToMarkdown, slidesToJSON, safeFileName } from './export.js';

// Minimal DOM-like nodes: enough for the converters.
const t = value => ( { nodeType: 3, nodeName: '#text', nodeValue: value, childNodes: [] } );
const h = ( tag, attrs, ...kids ) => ( {
	nodeType: 1,
	nodeName: tag.toUpperCase(),
	childNodes: kids.map( k => typeof k === 'string' ? t( k ) : k ),
	getAttribute: name => attrs?.[name] ?? null
} );

const slide = h( 'section', null,
	h( 'h2', null, 'فهرست' ),
	h( 'p', null, 'متن ', h( 'strong', null, 'پررنگ' ), ' و ', h( 'code', null, 'npm i' ) ),
	h( 'ul', null,
		h( 'li', null, 'یک', h( 'ul', null, h( 'li', null, 'تودرتو' ) ) ),
		h( 'li', null, 'دو' )
	),
	h( 'pre', null, h( 'code', { class: 'language-js' }, 'a = 1;\n' ) ),
	h( 'table', null,
		h( 'tr', null, h( 'th', null, 'ستون' ), h( 'th', null, 'وضعیت' ) ),
		h( 'tr', null, h( 'td', null, 'الف' ), h( 'td', null, 'ب' ) )
	),
	h( 'aside', { class: 'notes' }, 'یادداشت\n  سخنران' )
);

test( 'htmlToMarkdown converts headings, inline marks, nested lists, code and tables', () => {
	assert.equal( htmlToMarkdown( slide ), [
		'## فهرست',
		'',
		'متن **پررنگ** و `npm i`',
		'',
		'- یک',
		'  - تودرتو',
		'- دو',
		'',
		'```js',
		'a = 1;',
		'```',
		'',
		'| ستون | وضعیت |',
		'| --- | --- |',
		'| الف | ب |'
	].join( '\n' ) );
} );

test( 'title and notes', () => {
	assert.equal( getSlideTitle( slide, 0 ), 'فهرست' );
	assert.equal( getSlideTitle( h( 'section', { 'data-menu-title': 'ابزارها' }, h( 'h2', null, 'x' ) ), 0 ), 'ابزارها' );
	assert.equal( getSlideTitle( h( 'section', null, h( 'p', null, 'x' ) ), 4 ), 'اسلاید 5' );
	assert.equal( getSlideNotes( slide ), 'یادداشت سخنران' );
} );

test( 'slidesToMarkdown separates slides and adds notes', () => {
	const md = slidesToMarkdown( [ { element: slide }, { element: h( 'section', null, h( 'h1', null, 'پایان' ) ) } ] );
	assert.match( md, /Note: یادداشت سخنران\n\n---\n\n# پایان\n$/ );
} );

test( 'slidesToJSON lists slides with title, notes and indices', () => {
	const data = JSON.parse( slidesToJSON( [ { element: slide, h: 0, v: 0 } ], 'دمو' ) );
	assert.equal( data.title, 'دمو' );
	assert.equal( data.slideCount, 1 );
	assert.deepEqual( data.slides[0].indices, { h: 0, v: 0 } );
	assert.equal( data.slides[0].notes, 'یادداشت سخنران' );
	assert.ok( !data.slides[0].text.includes( 'یادداشت' ) );
} );

test( 'safeFileName strips characters Windows rejects', () => {
	assert.equal( safeFileName( 'reveal-rtl — دمو: نسخه/۱' ), 'reveal-rtl-—-دمو-نسخه۱' );
	assert.equal( safeFileName( '' ), 'presentation' );
} );
