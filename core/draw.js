// Laser pointer and pen on top of the slides. Strokes are kept per slide (in memory) and
// stored in 0..1 coordinates of the layer, so they redraw after a resize.

const PEN_COLOR = '#e53935';
const PEN_WIDTH = 4;

// shortcut: strokes are relative to the viewport, not the slide box; fine while the slide keeps
// its aspect ratio, upgrade to slide coordinates if strokes drift on unusual window shapes.
export function createDrawingLayer( root, getSlideKey ) {
	const canvas = document.createElement( 'canvas' );
	canvas.className = 'rtlui-canvas';
	canvas.setAttribute( 'aria-hidden', 'true' );
	const laser = document.createElement( 'div' );
	laser.className = 'rtlui-laser';
	laser.hidden = true;
	root.append( canvas, laser );

	const ctx = canvas.getContext( '2d' );
	const strokes = new Map(); // slide key -> [ [ [x, y], ... ], ... ]
	let tool = null;
	let current = null;

	const point = event => {
		const r = canvas.getBoundingClientRect();
		return [ ( event.clientX - r.left ) / r.width, ( event.clientY - r.top ) / r.height ];
	};

	function resize() {
		const ratio = window.devicePixelRatio || 1;
		canvas.width = Math.round( canvas.clientWidth * ratio );
		canvas.height = Math.round( canvas.clientHeight * ratio );
		redraw();
	}

	function drawStroke( points ) {
		if( !points.length ) return;
		const ratio = window.devicePixelRatio || 1;
		ctx.strokeStyle = PEN_COLOR;
		ctx.lineWidth = PEN_WIDTH * ratio;
		ctx.lineCap = ctx.lineJoin = 'round';
		ctx.beginPath();
		points.forEach( ( [ x, y ], i ) => {
			const px = x * canvas.width, py = y * canvas.height;
			i ? ctx.lineTo( px, py ) : ctx.moveTo( px, py );
		} );
		if( points.length === 1 ) ctx.lineTo( points[0][0] * canvas.width + 0.1, points[0][1] * canvas.height );
		ctx.stroke();
	}

	function redraw() {
		ctx.clearRect( 0, 0, canvas.width, canvas.height );
		( strokes.get( getSlideKey() ) || [] ).forEach( drawStroke );
	}

	canvas.addEventListener( 'pointerdown', event => {
		if( tool !== 'pen' ) return;
		canvas.setPointerCapture( event.pointerId );
		current = [ point( event ) ];
		const key = getSlideKey();
		if( !strokes.has( key ) ) strokes.set( key, [] );
		strokes.get( key ).push( current );
		drawStroke( current );
		event.preventDefault();
	} );

	canvas.addEventListener( 'pointermove', event => {
		if( !current ) return;
		current.push( point( event ) );
		drawStroke( current.slice( -2 ) );
	} );

	const endStroke = () => { current = null; };
	canvas.addEventListener( 'pointerup', endStroke );
	canvas.addEventListener( 'pointercancel', endStroke );

	root.addEventListener( 'pointermove', event => {
		if( tool !== 'laser' ) return;
		laser.style.translate = `${ event.clientX - root.getBoundingClientRect().left }px ${ event.clientY - root.getBoundingClientRect().top }px`;
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
			redraw();
		},
		hasStrokes: () => ( strokes.get( getSlideKey() ) || [] ).length > 0,
		redraw
	};
}
