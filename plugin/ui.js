import { toPersianDigits, toLatinDigits, normalizeForSearch, timerDisplay } from '../core/rtl.js';
import { createDrawingLayer } from '../core/draw.js';
import { getSlideTitle, slidesToJSON, slidesToMarkdown, slidesToNotesText, standaloneHTML, offlineHTML, safeFileName, download } from '../core/export.js';

/**
 * reveal.js plugin: toolbar (first/last, timer, clock, theme, notes, fullscreen)
 * and a slide list panel with search. Pair with core/ui.css.
 *
 * Options go in `uiOptions` in Reveal.initialize():
 *   digits:    Persian digits in timer and clock (default: same as config.rtl)
 *   themes:    [ { name, href } ] shown in the theme menu
 *   themeLink: selector of the theme <link> to swap (default '#theme')
 *   idle:      ms without mouse movement before the toolbar hides (default 3000)
 *   duration:  presentation length in minutes; the timer counts down (default: config.totalTime, else counts up)
 *   warnAt:    minutes left when the timer turns yellow (default: 5, or 20% of a short duration)
 */

const THEME_STORAGE_KEY = 'reveal-rtl-ui:theme';
const TIMER_STORAGE_KEY = 'reveal-rtl-ui:timer';
const TOOLBAR_STORAGE_KEY = 'reveal-rtl-ui:toolbar-hidden';
const KEY_M = 77;
const KEY_T = 84;
const KEY_D = 68;
const KEY_E = 69;
const KEY_Z = 90;
const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const PRINT_PARAM = 'rtlui-print';
const PREVIEW_WIDTH = 260;
const canHover = typeof matchMedia === 'function' && matchMedia( '(hover: hover)' ).matches;

// Inline SVG: font glyphs for these symbols are missing on some systems.
const svg = path => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="${ path }"/></svg>`;
const ICONS = {
	menu: svg( 'M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z' ),
	first: svg( 'M6 6h2v12H6zm3.5 6 8.5 6V6z' ),
	last: svg( 'M16 6h2v12h-2zM6 18l8.5-6L6 6z' ),
	play: svg( 'M8 5v14l11-7z' ),
	pause: svg( 'M6 5h4v14H6zm8 0h4v14h-4z' ),
	reset: svg( 'M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z' ),
	notes: svg( 'M4 4h16v12H8l-4 4zm3 4v2h10V8zm0 3v2h7v-2z' ),
	speaker: svg( 'M3 4h18v12H3zm2 2v8h14V6zm3 12h8v2H8z' ),
	grid: svg( 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z' ),
	zoomIn: svg( 'M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM9 7h2v2h2v2h-2v2H9v-2H7V9h2z' ),
	zoomOut: svg( 'M10 3a7 7 0 0 1 5.6 11.2l5.1 5.1-1.4 1.4-5.1-5.1A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM7 9h6v2H7z' ),
	export: svg( 'M11 3h2v9.2l3.3-3.3 1.4 1.4-5.7 5.7-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z' ),
	laser: svg( 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM11 1h2v4h-2zm0 18h2v4h-2zM1 11h4v2H1zm18 0h4v2h-4z' ),
	pen: svg( 'M3 17.2V21h3.8l11-11-3.8-3.8zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8z' ),
	erase: svg( 'M16.2 3.6 21 8.4a1.5 1.5 0 0 1 0 2.1L12.5 19H20v2H8l-4.6-4.6a1.5 1.5 0 0 1 0-2.1L14.1 3.6a1.5 1.5 0 0 1 2.1 0zM6.5 13.4 4.6 15.3 8.3 19h2.5l1.3-1.3z' ),
	hide: svg( 'M7 10l5 5 5-5z' ),
	show: svg( 'M7 14l5-5 5 5z' ),
	fullscreen: svg( 'M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z' )
};

export default () => ( {
	id: 'rtl-ui',

	init( deck ) {
		// The speaker view loads the deck in an iframe; no UI there.
		if( deck.isSpeakerNotes() ) return;

		const config = deck.getConfig();
		const options = {
			digits: !!config.rtl,
			themes: [],
			themeLink: '#theme',
			idle: 3000,
			...config.uiOptions
		};
		const digits = text => options.digits ? toPersianDigits( text ) : String( text );

		const root = deck.getRevealElement();
		const themeLink = document.querySelector( options.themeLink );

		// HTML export: snapshot the page before reveal.js and this plugin change the DOM.
		const pageSnapshot = document.documentElement.cloneNode( true );

		// No toolbar in the print view. PDF export opens it with ?print-pdf&rtlui-print; print once rendered.
		if( deck.isPrintView() ) {
			if( new URLSearchParams( location.search ).has( PRINT_PARAM ) ) {
				deck.on( 'pdf-ready', () => document.fonts.ready.then( () => setTimeout( () => window.print(), 500 ) ) );
			}
			return;
		}

		applyStoredTheme( themeLink, options.themes );

		const drawing = createDrawingLayer( root, () => {
			const { h, v } = deck.getIndices();
			return `${ h }/${ v }`;
		} );
		deck.on( 'slidechanged', () => drawing.redraw() );

		const panel = createPanel();
		const toolbar = createToolbar();
		root.append( panel.element, toolbar.element );

		deck.addKeyBinding( { keyCode: KEY_M, key: 'M', description: 'فهرست اسلایدها' }, () => panel.toggle() );

		// Build the list after all plugins (markdown, rtl digits) have changed the slides.
		deck.on( 'ready', () => {
			panel.build();
			panel.markCurrent();
		} );
		deck.on( 'slidechanged', () => panel.markCurrent() );

		function createPanel() {
			const element = el( 'nav', 'rtlui-panel' );
			element.setAttribute( 'aria-label', 'فهرست اسلایدها' );
			element.hidden = true;

			const search = el( 'input', 'rtlui-search' );
			search.type = 'search';
			search.placeholder = 'جستجو در اسلایدها…';
			search.setAttribute( 'aria-label', 'جستجو در اسلایدها' );

			const list = el( 'ol', 'rtlui-list' );
			const empty = el( 'p', 'rtlui-empty', 'نتیجه‌ای پیدا نشد' );
			empty.hidden = true;

			// Hover preview: a scaled copy of the slide beside the panel (mouse only; touch has no hover).
			const preview = el( 'div', 'rtlui-preview' );
			preview.setAttribute( 'aria-hidden', 'true' );
			preview.hidden = true;
			const stage = el( 'div', 'rtlui-preview-stage' );
			if( config.rtl ) stage.dir = 'rtl';
			preview.append( stage );

			element.append( search, list, empty, preview );

			let items = [];

			function showPreview( item ) {
				const scale = PREVIEW_WIDTH / config.width;
				const clone = item.slide.cloneNode( true );
				clone.removeAttribute( 'style' );
				clone.removeAttribute( 'id' );
				clone.querySelectorAll( '[id]' ).forEach( node => node.removeAttribute( 'id' ) );
				clone.querySelectorAll( 'aside.notes, script, iframe, video, audio' ).forEach( node => node.remove() );
				clone.querySelectorAll( '.fragment' ).forEach( node => node.classList.add( 'visible' ) );
				stage.style.width = `${ config.width }px`;
				stage.style.height = `${ config.height }px`;
				stage.style.scale = scale;
				stage.replaceChildren( clone );
				preview.style.width = `${ PREVIEW_WIDTH }px`;
				preview.style.height = `${ Math.round( config.height * scale ) }px`;
				const top = item.button.getBoundingClientRect().top - element.getBoundingClientRect().top;
				preview.style.top = `${ Math.max( 8, Math.min( top, element.clientHeight - config.height * scale - 8 ) ) }px`;
				preview.hidden = false;
			}

			const hidePreview = () => {
				preview.hidden = true;
				stage.replaceChildren();
			};
			list.addEventListener( 'mouseleave', hidePreview );

			search.addEventListener( 'input', () => {
				const query = normalizeForSearch( search.value.trim() );
				let visible = 0;
				items.forEach( item => {
					const match = !query || item.text.includes( query );
					item.li.hidden = !match;
					if( match ) visible++;
				} );
				empty.hidden = visible > 0;
			} );

			search.addEventListener( 'keydown', event => {
				if( event.key === 'Enter' ) items.find( item => !item.li.hidden )?.button.click();
				if( event.key === 'Escape' ) toggle( false );
			} );

			function build() {
				list.replaceChildren();
				items = deck.getSlides().map( ( slide, i ) => {
					const { h, v } = deck.getIndices( slide );
					const title = getSlideTitle( slide, i );

					const li = el( 'li' );
					const button = el( 'button', 'rtlui-item' );
					button.type = 'button';
					button.append( el( 'span', 'rtlui-item-number', digits( i + 1 ) ), el( 'span', 'rtlui-item-title', title ) );
					if( v > 0 ) button.classList.add( 'rtlui-item-vertical' );
					button.addEventListener( 'click', () => {
						deck.slide( h, v );
						toggle( false );
					} );

					li.append( button );
					list.append( li );
					const item = { slide, li, button, text: normalizeForSearch( `${ title } ${ slide.textContent }` ) };
					if( canHover ) button.addEventListener( 'mouseenter', () => showPreview( item ) );
					return item;
				} );
			}

			function markCurrent() {
				const current = deck.getCurrentSlide();
				items.forEach( item => {
					const active = item.slide === current;
					item.button.classList.toggle( 'rtlui-item-current', active );
					if( active ) item.button.setAttribute( 'aria-current', 'true' );
					else item.button.removeAttribute( 'aria-current' );
				} );
			}

			function toggle( open = element.hidden ) {
				element.hidden = !open;
				if( !open ) hidePreview();
				toolbar?.setMenuOpen( open );
				if( open ) {
					search.focus();
					items.find( item => item.button.classList.contains( 'rtlui-item-current' ) )?.button.scrollIntoView( { block: 'nearest' } );
				}
				else if( element.contains( document.activeElement ) ) {
					document.activeElement.blur();
				}
			}

			return { element, build, markCurrent, toggle };
		}

		function createToolbar() {
			const element = el( 'div', 'rtlui-toolbar' );
			element.setAttribute( 'role', 'toolbar' );
			element.setAttribute( 'aria-label', 'ابزارهای ارائه' );

			const menuButton = button( ICONS.menu, 'فهرست اسلایدها (M)', () => panel.toggle() );
			menuButton.setAttribute( 'aria-expanded', 'false' );

			const firstButton = button( ICONS.first, 'اولین اسلاید', () => deck.slide( 0 ) );
			const lastButton = button( ICONS.last, 'آخرین اسلاید', () => deck.slide( Number.MAX_VALUE ) );
			firstButton.classList.add( 'rtlui-mirror' );
			lastButton.classList.add( 'rtlui-mirror' );

			// Grid view = reveal.js overview mode (also Esc / O).
			const gridButton = button( ICONS.grid, 'نمای شبکه‌ای (Esc)', () => deck.toggleOverview() );
			const syncGrid = () => gridButton.setAttribute( 'aria-pressed', String( deck.isOverview() ) );
			syncGrid();
			deck.on( 'overviewshown', syncGrid );
			deck.on( 'overviewhidden', syncGrid );

			// Timer: base seconds plus the running stretch since startedAt, kept in sessionStorage
			// so a page refresh keeps counting. With a duration it counts down and warns near the end.
			const timer = readTimer( options.duration ? options.duration * 60 : config.totalTime || null );
			const isRunning = () => timer.startedAt !== null;
			const elapsedSeconds = () => timer.base + ( isRunning() ? ( Date.now() - timer.startedAt ) / 1000 : 0 );
			const warnAt = () => options.warnAt ? options.warnAt * 60 : Math.min( 300, Math.round( timer.duration * 0.2 ) );

			// A button: click to set the presentation length (count-down) or clear it (count-up).
			const timerValue = el( 'button', 'rtlui-button rtlui-timer' );
			timerValue.type = 'button';
			const renderTimer = () => {
				const { text, state } = timerDisplay( elapsedSeconds(), timer.duration, warnAt() );
				timerValue.textContent = digits( text );
				timerValue.classList.toggle( 'rtlui-timer-warn', state === 'warn' );
				timerValue.classList.toggle( 'rtlui-timer-over', state === 'over' );
				setLabel( timerValue, timer.duration
					? `زمان باقی‌مانده از ${ digits( timer.duration / 60 ) } دقیقه؛ برای تغییر مدت کلیک کنید`
					: 'زمان سپری‌شده؛ برای تعیین مدت ارائه (شمارش معکوس) کلیک کنید' );
			};
			timerValue.addEventListener( 'click', () => {
				const current = timer.duration ? digits( timer.duration / 60 ) : '';
				const answer = window.prompt( 'مدت ارائه به دقیقه (خالی = شمارش رو به جلو):', current );
				if( answer === null ) return;
				const minutes = parseFloat( toLatinDigits( answer.trim() ) );
				timer.duration = minutes > 0 ? Math.round( minutes * 60 ) : null;
				saveTimer( timer );
				renderTimer();
			} );

			const playButton = button( ICONS.play, 'شروع تایمر', () => {
				if( isRunning() ) {
					timer.base = elapsedSeconds();
					timer.startedAt = null;
				}
				else {
					timer.startedAt = Date.now();
				}
				saveTimer( timer );
				renderPlayButton();
			} );
			const renderPlayButton = () => {
				playButton.innerHTML = isRunning() ? ICONS.pause : ICONS.play;
				setLabel( playButton, isRunning() ? 'توقف تایمر' : 'شروع تایمر' );
			};
			renderPlayButton();

			const resetButton = button( ICONS.reset, 'صفر کردن تایمر', () => {
				timer.base = 0;
				if( isRunning() ) timer.startedAt = Date.now();
				saveTimer( timer );
				renderTimer();
			} );

			// Clock
			const clock = el( 'time', 'rtlui-clock' );
			const clockFormat = new Intl.DateTimeFormat( options.digits ? 'fa-IR' : undefined, { hour: '2-digit', minute: '2-digit' } );

			const tick = () => {
				clock.textContent = clockFormat.format( new Date() );
				renderTimer();
			};
			tick();
			setInterval( tick, 1000 );

			const groups = [
				group( menuButton ),
				group( firstButton, lastButton, gridButton ),
				group( playButton, timerValue, resetButton ),
				wideOnly( group( clock ) )
			];

			// Zoom: scales the slides around the center, on top of reveal.js's own fit-to-window scale.
			let zoom = 1;
			const zoomReset = el( 'button', 'rtlui-button rtlui-zoom-value' );
			zoomReset.type = 'button';
			setLabel( zoomReset, 'بازنشانی بزرگ‌نمایی' );
			const setZoom = value => {
				zoom = Math.min( ZOOM_MAX, Math.max( ZOOM_MIN, Math.round( value * 10 ) / 10 ) );
				root.style.setProperty( '--rtlui-zoom', zoom );
				zoomReset.textContent = digits( `${ Math.round( zoom * 100 ) }%` );
			};
			zoomReset.addEventListener( 'click', () => setZoom( 1 ) );
			setZoom( 1 );
			groups.push( wideOnly( group(
				button( ICONS.zoomIn, 'بزرگ‌نمایی', () => setZoom( zoom + ZOOM_STEP ) ),
				zoomReset,
				button( ICONS.zoomOut, 'کوچک‌نمایی', () => setZoom( zoom - ZOOM_STEP ) )
			) ) );

			if( options.themes.length && themeLink ) groups.push( wideOnly( group( themeSelect() ) ) );

			groups.push( group( exportMenu() ) );

			const notesButton = button( ICONS.notes, 'نمایش یادداشت‌ها', () => {
				const show = !deck.getConfig().showNotes;
				deck.configure( { showNotes: show } );
				notesButton.setAttribute( 'aria-pressed', String( show ) );
			} );
			notesButton.setAttribute( 'aria-pressed', String( !!config.showNotes ) );

			const fullscreenButton = button( ICONS.fullscreen, 'تمام‌صفحه', () => {
				if( document.fullscreenElement ) document.exitFullscreen();
				else document.documentElement.requestFullscreen?.();
			} );

			const noteControls = [ notesButton ];
			// Speaker view needs the notes plugin (RevealNotes).
			if( deck.hasPlugin( 'notes' ) ) {
				noteControls.push( wideOnly( button( ICONS.speaker, 'پنجره‌ی سخنران (S)', () => deck.getPlugin( 'notes' ).open() ) ) );
			}

			// Laser pointer and pen (core/draw.js). Keys: Z laser, D pen, E erase this slide's drawing.
			const laserButton = button( ICONS.laser, 'نشانگر لیزری (Z)', () => toggleTool( 'laser' ) );
			const penButton = button( ICONS.pen, 'قلم (D)', () => toggleTool( 'pen' ) );
			const eraseButton = button( ICONS.erase, 'پاک کردن نوشته‌های این اسلاید (E)', () => drawing.clear() );
			const toggleTool = name => {
				const active = drawing.setTool( name );
				laserButton.setAttribute( 'aria-pressed', String( active === 'laser' ) );
				penButton.setAttribute( 'aria-pressed', String( active === 'pen' ) );
			};
			laserButton.setAttribute( 'aria-pressed', 'false' );
			penButton.setAttribute( 'aria-pressed', 'false' );
			deck.addKeyBinding( { keyCode: KEY_Z, key: 'Z', description: 'نشانگر لیزری' }, () => toggleTool( 'laser' ) );
			deck.addKeyBinding( { keyCode: KEY_D, key: 'D', description: 'قلم' }, () => toggleTool( 'pen' ) );
			deck.addKeyBinding( { keyCode: KEY_E, key: 'E', description: 'پاک کردن نوشته‌های اسلاید' }, () => drawing.clear() );
			groups.push( wideOnly( group( laserButton, penButton, eraseButton ) ) );

			groups.push( group( ...noteControls, wideOnly( fullscreenButton ) ) );

			// Hide/show: the toolbar collapses to a small handle; choice is remembered.
			const hideButton = button( ICONS.hide, 'پنهان کردن نوار ابزار (T)', () => setHidden( true ) );
			groups.push( group( hideButton ) );
			element.append( ...groups );

			const showButton = button( ICONS.show, 'نمایش نوار ابزار (T)', () => setHidden( false ) );
			showButton.classList.add( 'rtlui-show' );
			root.append( showButton );

			const setHidden = hidden => {
				const focusWasInside = element.contains( document.activeElement ) || showButton === document.activeElement;
				root.classList.toggle( 'rtlui-hidden', hidden );
				element.inert = hidden;
				try { localStorage.setItem( TOOLBAR_STORAGE_KEY, hidden ? '1' : '' ); } catch( e ) { /* storage blocked */ }
				if( focusWasInside ) ( hidden ? showButton : hideButton ).focus();
			};
			let storedHidden = false;
			try { storedHidden = localStorage.getItem( TOOLBAR_STORAGE_KEY ) === '1'; } catch( e ) { /* storage blocked */ }
			setHidden( storedHidden );

			deck.addKeyBinding( { keyCode: KEY_T, key: 'T', description: 'پنهان/نمایش نوار ابزار' }, () => setHidden( !root.classList.contains( 'rtlui-hidden' ) ) );

			// Keep reveal.js shortcuts (arrows, Esc) working after a toolbar click, except where the key
			// belongs to the control: arrows in the theme select and export menu, Enter/Space on buttons.
			element.addEventListener( 'keydown', event => {
				const target = event.target;
				if( target.matches( 'select' ) || target.closest( '.rtlui-menu' ) || ( target.matches( 'button' ) && ( event.key === 'Enter' || event.key === ' ' ) ) ) {
					event.stopPropagation();
				}
			} );

			setupIdleHide( element );

			return {
				element,
				setMenuOpen: open => menuButton.setAttribute( 'aria-expanded', String( open ) )
			};
		}

		function exportMenu() {
			const wrapper = el( 'div', 'rtlui-menu-wrapper' );
			const trigger = button( ICONS.export, 'خروجی گرفتن', () => setOpen( menu.hidden ) );
			trigger.setAttribute( 'aria-haspopup', 'menu' );
			trigger.setAttribute( 'aria-expanded', 'false' );

			const menu = el( 'div', 'rtlui-menu' );
			menu.setAttribute( 'role', 'menu' );
			menu.setAttribute( 'aria-label', 'خروجی گرفتن' );
			menu.hidden = true;

			const title = document.title || 'presentation';
			const fileName = ext => `${ safeFileName( title ) }.${ ext }`;
			const slides = () => deck.getSlides().map( element => ( { element, ...deck.getIndices( element ) } ) );

			const items = [
				[ 'PDF (چاپ)', exportPDF ],
				[ 'JSON', () => download( fileName( 'json' ), slidesToJSON( slides(), title ), 'application/json' ) ],
				[ 'متن Markdown', () => download( fileName( 'md' ), slidesToMarkdown( slides() ), 'text/markdown' ) ],
				[ 'HTML', () => download( fileName( 'html' ), standaloneHTML( pageSnapshot.cloneNode( true ), document.baseURI ), 'text/html' ) ],
				[ 'HTML آفلاین (یک فایل)', exportOfflineHTML ],
				[ 'یادداشت‌های سخنران', () => download( `${ safeFileName( title ) }-notes.txt`, slidesToNotesText( slides(), title ), 'text/plain' ) ]
			].map( ( [ label, action ] ) => {
				const item = el( 'button', 'rtlui-menu-item', label );
				item.type = 'button';
				item.setAttribute( 'role', 'menuitem' );
				item.tabIndex = -1;
				item.addEventListener( 'click', () => {
					setOpen( false );
					trigger.focus();
					action();
				} );
				menu.append( item );
				return item;
			} );

			function setOpen( open ) {
				menu.hidden = !open;
				trigger.setAttribute( 'aria-expanded', String( open ) );
				if( open ) items[0].focus();
			}

			menu.addEventListener( 'keydown', event => {
				const i = items.indexOf( document.activeElement );
				if( event.key === 'ArrowDown' ) items[ ( i + 1 ) % items.length ].focus();
				else if( event.key === 'ArrowUp' ) items[ ( i - 1 + items.length ) % items.length ].focus();
				else if( event.key === 'Escape' ) { setOpen( false ); trigger.focus(); }
				else return;
				event.preventDefault();
			} );

			document.addEventListener( 'click', event => {
				if( !menu.hidden && !wrapper.contains( event.target ) ) setOpen( false );
			} );

			wrapper.append( trigger, menu );
			return wrapper;
		}

		async function exportOfflineHTML() {
			const title = document.title || 'presentation';
			root.classList.add( 'rtlui-busy' );
			try {
				const { html, failed } = await offlineHTML( pageSnapshot.cloneNode( true ), document.baseURI );
				download( `${ safeFileName( title ) }-offline.html`, html, 'text/html' );
				if( failed.length ) {
					// Browsers block fetch() for file:// pages, so nothing local can be inlined there.
					const hint = location.protocol === 'file:' ? '\nبرای خروجی آفلاین کامل، ارائه را از یک سرور (مثلاً npm run demo) یا نسخه‌ی آنلاین باز کنید.' : '';
					window.alert( `${ toPersianDigits( failed.length ) } فایل داخل خروجی قرار نگرفت و هنوز به اینترنت یا مسیر اصلی نیاز دارد:\n${ failed.join( '\n' ) }${ hint }` );
				}
			}
			finally {
				root.classList.remove( 'rtlui-busy' );
			}
		}

		function exportPDF() {
			const url = new URL( location.href );
			url.searchParams.set( 'print-pdf', '' );
			url.searchParams.set( PRINT_PARAM, '' );
			url.hash = '';
			// Popup blocked: open the print view in this tab instead.
			if( !window.open( url.href, '_blank' ) ) location.href = url.href;
		}

		function themeSelect() {
			const select = el( 'select', 'rtlui-theme' );
			select.setAttribute( 'aria-label', 'انتخاب تم' );
			select.title = 'انتخاب تم';
			const current = themeLink.getAttribute( 'href' );
			options.themes.forEach( theme => {
				const option = el( 'option', '', theme.name );
				option.value = theme.href;
				option.selected = theme.href === current;
				select.append( option );
			} );
			select.addEventListener( 'change', () => {
				themeLink.setAttribute( 'href', select.value );
				try { localStorage.setItem( THEME_STORAGE_KEY, select.value ); } catch( e ) { /* storage blocked */ }
			} );
			return select;
		}

		function setupIdleHide( element ) {
			let timeout;
			const wake = () => {
				root.classList.remove( 'rtlui-idle' );
				clearTimeout( timeout );
				timeout = setTimeout( () => {
					if( !element.matches( ':hover, :focus-within' ) && panel.element.hidden ) root.classList.add( 'rtlui-idle' );
				}, options.idle );
			};
			document.addEventListener( 'mousemove', wake );
			element.addEventListener( 'focusin', wake );
			wake();
		}
	}
} );

// One timer per deck URL, per browser tab.
const timerStorageKey = () => `${ TIMER_STORAGE_KEY }:${ location.pathname }`;

function readTimer( defaultDuration ) {
	const fresh = { base: 0, startedAt: null, duration: defaultDuration };
	try {
		const stored = JSON.parse( sessionStorage.getItem( timerStorageKey() ) );
		const validStart = stored?.startedAt === null || ( Number.isFinite( stored?.startedAt ) && stored.startedAt <= Date.now() );
		if( Number.isFinite( stored?.base ) && stored.base >= 0 && validStart ) {
			const validDuration = stored.duration === null || ( Number.isFinite( stored.duration ) && stored.duration > 0 );
			return { base: stored.base, startedAt: stored.startedAt, duration: 'duration' in stored && validDuration ? stored.duration : defaultDuration };
		}
	} catch( e ) { /* storage blocked or bad JSON */ }
	return fresh;
}

function saveTimer( timer ) {
	try { sessionStorage.setItem( timerStorageKey(), JSON.stringify( timer ) ); } catch( e ) { /* storage blocked */ }
}

function applyStoredTheme( themeLink, themes ) {
	if( !themeLink ) return;
	let stored = null;
	try { stored = localStorage.getItem( THEME_STORAGE_KEY ); } catch( e ) { /* storage blocked */ }
	// Only accept a stored value that is still in the configured list.
	if( stored && themes.some( theme => theme.href === stored ) ) themeLink.setAttribute( 'href', stored );
}

function el( tag, className = '', text ) {
	const node = document.createElement( tag );
	if( className ) node.className = className;
	if( text !== undefined ) node.textContent = text;
	return node;
}

function button( icon, label, onClick ) {
	const node = el( 'button', 'rtlui-button' );
	node.innerHTML = icon; // static ICONS constant, never user input
	node.type = 'button';
	setLabel( node, label );
	node.addEventListener( 'click', onClick );
	return node;
}

// Hidden on small screens (see core/ui.css): clock, zoom, theme, speaker view, fullscreen.
function wideOnly( node ) {
	node.classList.add( 'rtlui-wide-only' );
	return node;
}

function setLabel( node, label ) {
	node.title = label;
	node.setAttribute( 'aria-label', label );
}

function group( ...children ) {
	const node = el( 'div', 'rtlui-group' );
	node.append( ...children );
	return node;
}
