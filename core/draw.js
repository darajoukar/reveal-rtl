// Laser pointer and pen on top of the slides. Strokes are kept per slide, in 0..1 coordinates of
// the slide box (the .slides element: config width × height, scaled), saved in localStorage, and
// can be redrawn onto the PDF print view pages.

const PEN_COLOR = '#e53935';
const PEN_WIDTH = 4; // px at 100% slide scale

export function drawStrokes( ctx, strokes, box, scale = 1 ) {
	ctx.strokeStyle = PEN_COLOR;
	ctx.lineWidth = PEN_WIDTH * scale;
	ctx.lineCap = ctx.lineJoin = 'round';
	strokes.forEach( points => {
		if( !points.length ) return;
		ctx.beginPath();
		points.forEach( ( [ x, y ], i ) => {
			const px = box.x + x * box.width, py = box.y + y * box.height;
			i ? ctx.lineTo( px, py ) : ctx.moveTo( px, py );
		} );
		if( points.length === 1 ) ctx.lineTo( box.x + points[0][0] * box.width + 0.1, box.y + points[0][1] * box.height );
		ctx.stroke();
	} );
}

// Reads saved strokes: { "h/v": [ [ [x, y], ... ], ... ] }. Bad data is dropped, not trusted.
export function loadStrokes( storageKey ) {
	const strokes = new Map();
	try {
		const data = JSON.parse( localStorage.getItem( storageKey ) );
		for( const [ key, list ] of Object.entries( data || {} ) ) {
			if( !/^\d+\/\d+$/.test( key ) || !Array.isArray( list ) ) continue;
			const valid = list.filter( points => Array.isArray( points ) && points.every( p => Array.isArray( p ) && p.length === 2 && p.every( Number.isFinite ) ) );
			if( valid.length ) strokes.set( key, valid );
		}
	} catch( e ) { /* storage blocked or bad JSON */ }
	return strokes;
}

function saveStrokes( storageKey, strokes ) {
	try {
		if( strokes.size ) localStorage.setItem( storageKey, JSON.stringify( Object.fromEntries( strokes ) ) );
		else localStorage.removeItem( storageKey );
	} catch( e ) { /* storage blocked or full: drawings stay for this page view only */ }
}

// getSlideKey(): "h/v" of the current slide; getSlideBox(): DOMRect of the slide box on screen.
export function createDrawingLayer( root, { getSlideKey, getSlideBox, storageKey } ) {
	const canvas = document.createElement( 'canvas' );
	canvas.className = 'rtlui-canvas';
	canvas.setAttribute( 'aria-hidden', 'true' );
	const laser = document.createElement( 'div' );
	laser.className = 'rtlui-laser';
	laser.hidden = true;
	root.append( canvas, laser );

	const ctx = canvas.getContext( '2d' );
	const strokes = loadStrokes( storageKey );
	let tool = null;
	let current = null;

	// Slide box in canvas pixels, and the slide's current scale (box width / unscaled width).
	function box() {
		const ratio = window.devicePixelRatio || 1;
		const c = canvas.getBoundingClientRect(), s = getSlideBox();
		return { x: ( s.left - c.left ) * ratio, y: ( s.top - c.top ) * ratio, width: s.width * ratio, height: s.height * ratio };
	}

	const point = event => {
		const s = getSlideBox();
		return [ ( event.clientX - s.left ) / s.width, ( event.clientY - s.top ) / s.height ];
	};

	const lineScale = () => ( window.devicePixelRatio || 1 ) * getSlideBox().width / root.querySelector( '.slides' ).offsetWidth;

	function resize() {
		const ratio = window.devicePixelRatio || 1;
		canvas.width = Math.round( canvas.clientWidth * ratio );
		canvas.height = Math.round( canvas.clientHeight * ratio );
		redraw();
	}

	function redraw() {
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		drawStrokes( ctx, strokes.get( getSlideKey() ) || [], box(), lineScale() );
	}

	canvas.addEventListener( 'pointerdown', event => {
		if( tool !== 'pen' ) return;
		canvas.setPointerCapture( event.pointerId );
		current = [ point( event ) ];
		const key = getSlideKey();
		if( !strokes.has( key ) ) strokes.set( key, [] );
		strokes.get( key ).push( current );
		drawStrokes( ctx, [ current ], box(), lineScale() );
		event.preventDefault();
	} );

	canvas.addEventListener( 'pointermove', event => {
		if( !current ) return;
		current.push( point( event ) );
		drawStrokes( ctx, [ current.slice( -2 ) ], box(), lineScale() );
	} );

	const endStroke = () => {
		if( !current ) return;
		current = null;
		saveStrokes( storageKey, strokes );
	};
	canvas.addEventListener( 'pointerup', endStroke );
	canvas.addEventListener( 'pointercancel', endStroke );

	root.addEventListener( 'pointermove', event => {
		if( tool !== 'laser' ) return;
		const r = root.getBoundingClientRect();
		laser.style.translate = `${ event.clientX - r.left }px ${ event.clientY - r.top }px`;
		laser.hidden = false;
	} );
	root.addEventListener( 'pointerleave', () => { laser.hidden = true; } );

	new ResizeObserver( resize ).observe( canvas );

	return {
		get tool() { return tool; },
		setTool( next ) {
			tool = tool === next ? null : next;
			root.classList.toggle( 'rtlui-pen', tool === 'pen' );
			root.classList.toggle( 'rtlui-laser-on', tool === 'laser' );
			if( tool !== 'laser' ) laser.hidden = true;
			current = null;
			return tool;
		},
		clear() {
			strokes.delete( getSlideKey() );
			saveStrokes( storageKey, strokes );
			redraw();
		},
		redraw
	};
}

// PDF print view: draw saved strokes on each page. Pages hold slides in a slideWidth × slideHeight
// box centred in a page of size × (1 + margin) (reveal.js 6 printview.js).
export function drawStrokesOnPrintPages( storageKey, { slideWidth, slideHeight, margin } ) {
	const strokes = loadStrokes( storageKey );
	if( !strokes.size ) return;
	const pageWidth = Math.floor( slideWidth * ( 1 + margin ) );
	const pageHeight = Math.floor( slideHeight * ( 1 + margin ) );
	document.querySelectorAll( '.pdf-page' ).forEach( page => {
		const key = page.querySelector( 'section[data-rtlui-key]' )?.dataset.rtluiKey;
		if( !strokes.has( key ) ) return;
		const canvas = document.createElement( 'canvas' );
		canvas.className = 'rtlui-print-canvas';
		canvas.width = pageWidth * 2; // 2x for crisp print
		canvas.height = pageHeight * 2;
		Object.assign( canvas.style, { position: 'absolute', left: 0, top: 0, width: `${ pageWidth }px`, height: `${ pageHeight }px`, zIndex: 10, pointerEvents: 'none' } );
		const box = { x: ( pageWidth - slideWidth ), y: ( pageHeight - slideHeight ), width: slideWidth * 2, height: slideHeight * 2 };
		drawStrokes( canvas.getContext( '2d' ), strokes.get( key ), box, 2 );
		page.append( canvas );
	} );
}
