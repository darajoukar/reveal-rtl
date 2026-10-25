#!/usr/bin/env node
// reveal-rtl-lint: checks Persian text in .html / .md slide files. Reports only, never edits.
// Usage: npx reveal-rtl-lint [files or folders…]   (default: current folder)
import fs from 'node:fs';
import path from 'node:path';
import { lintPersian } from '../core/lint.js';

const EXTENSIONS = new Set( [ '.html', '.htm', '.md', '.markdown' ] );
const SKIP_DIRS = new Set( [ 'node_modules', '.git', 'dist' ] );

function collect( target, files ) {
	const stat = fs.statSync( target, { throwIfNoEntry: false } );
	if( !stat ) {
		console.error( `reveal-rtl-lint: not found: ${ target }` );
		process.exitCode = 2;
		return;
	}
	if( stat.isFile() ) {
		files.push( target );
		return;
	}
	for( const entry of fs.readdirSync( target, { withFileTypes: true } ) ) {
		if( entry.isDirectory() && SKIP_DIRS.has( entry.name ) ) continue;
		const full = path.join( target, entry.name );
		if( entry.isDirectory() ) collect( full, files );
		else if( EXTENSIONS.has( path.extname( entry.name ).toLowerCase() ) ) files.push( full );
	}
}

const args = process.argv.slice( 2 );
if( args.includes( '--help' ) || args.includes( '-h' ) ) {
	console.log( 'Usage: reveal-rtl-lint [files or folders…]\nChecks .html/.md files for Arabic ي/ك, missing ZWNJ (نیم‌فاصله) and mixed digits. Exit code 1 when something is found.' );
	process.exit( 0 );
}

const files = [];
( args.length ? args : [ '.' ] ).forEach( target => collect( target, files ) );

let total = 0;
for( const file of files ) {
	for( const issue of lintPersian( fs.readFileSync( file, 'utf8' ) ) ) {
		total++;
		const suggestion = JSON.stringify( issue.suggestion ).replace( /\\u200c/gi, '<ZWNJ>' );
		console.log( `${ file }:${ issue.line }:${ issue.column }  ${ issue.rule }  ${ issue.message }  «${ issue.found }» → ${ suggestion }` );
	}
}

console.log( total ? `\n${ total } issue(s) in ${ files.length } file(s).` : `No issues in ${ files.length } file(s).` );
if( total && !process.exitCode ) process.exitCode = 1;
