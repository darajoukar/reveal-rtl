import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createPresentation, REVEAL_RTL_VERSION } from './index.js';

const tmp = () => fs.mkdtempSync( path.join( os.tmpdir(), 'create-reveal-rtl-' ) );

test( 'creates a Persian presentation with filled placeholders', () => {
	const target = path.join( tmp(), 'talk' );
	createPresentation( target );
	const html = fs.readFileSync( path.join( target, 'index.html' ), 'utf8' );
	assert.match( html, /<html lang="fa" dir="rtl">/ );
	assert.match( html, /<title>ارائه‌ی من<\/title>/ );
	assert.ok( html.includes( `reveal-rtl@${ REVEAL_RTL_VERSION }/dist/reveal-rtl.js` ) );
	assert.ok( html.includes( '<time data-jalali></time>' ) );
	assert.ok( !/\{\{\w+\}\}/.test( html ) );
	assert.ok( fs.existsSync( path.join( target, 'README.md' ) ) );
} );

test( 'Arabic and English variants, title is escaped', () => {
	const ar = path.join( tmp(), 'ar' );
	createPresentation( ar, { lang: 'ar' } );
	assert.match( fs.readFileSync( path.join( ar, 'index.html' ), 'utf8' ), /lang: 'ar'/ );

	const en = path.join( tmp(), 'en' );
	createPresentation( en, { lang: 'en', title: '<b>A & B</b>' } );
	assert.match( fs.readFileSync( path.join( en, 'index.html' ), 'utf8' ), /<title>&lt;b&gt;A &amp; B&lt;\/b&gt;<\/title>/ );
} );

test( 'refuses a non-empty folder and unknown languages', () => {
	const dir = tmp();
	fs.writeFileSync( path.join( dir, 'keep.txt' ), 'x' );
	assert.throws( () => createPresentation( dir ), /not empty/ );
	assert.equal( fs.readFileSync( path.join( dir, 'keep.txt' ), 'utf8' ), 'x' );
	assert.throws( () => createPresentation( path.join( tmp(), 'x' ), { lang: 'de' } ), /Unknown language/ );
} );
