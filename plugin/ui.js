import { toPersianDigits, normalizeForSearch, formatDuration } from '../core/rtl.js';

/**
 * reveal.js plugin: toolbar (first/last, timer, clock, theme, notes, fullscreen)
 * and a slide list panel with search. Pair with core/ui.css.
 *
 * Options go in `uiOptions` in Reveal.initialize():
 *   digits:    Persian digits in timer and clock (default: same as config.rtl)
 *   themes:    [ { name, href } ] shown in the theme menu
 *   themeLink: selector of the theme <link> to swap (default '#theme')
 *   idle:      ms without mouse movement before the toolbar hides (default 3000)
 */

const THEME_STORAGE_KEY = 'reveal-rtl-ui:theme';
const TIMER_STORAGE_KEY = 'reveal-rtl-ui:timer';
const TOOLBAR_STORAGE_KEY = 'reveal-rtl-ui:toolbar-hidden';
const KEY_M = 77;
const KEY_T = 84;

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

		applyStoredTheme( themeLink, options.themes );

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

			element.append( search, list, empty );

			let items = [];

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
					const title = slide.dataset.menuTitle
						|| slide.querySelector( 'h1, h2, h3' )?.textContent.trim()
						|| `اسلاید ${ i + 1 }`;

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
					return { slide, li, button, text: normalizeForSearch( `${ title } ${ slide.textContent }` ) };
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
			// so a page refresh keeps counting.
			const timer = readTimer();
			const isRunning = () => timer.startedAt !== null;
			const elapsedSeconds = () => timer.base + ( isRunning() ? ( Date.now() - timer.startedAt ) / 1000 : 0 );

			const timerValue = el( 'span', 'rtlui-timer' );
			timerValue.setAttribute( 'role', 'timer' );
			timerValue.setAttribute( 'aria-label', 'زمان سپری‌شده' );
			const renderTimer = () => {
				timerValue.textContent = digits( formatDuration( Math.floor( elapsedSeconds() ) ) );
			};

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
				group( clock )
			];

			if( options.themes.length && themeLink ) groups.push( group( themeSelect() ) );

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
				noteControls.push( button( ICONS.speaker, 'پنجره‌ی سخنران (S)', () => deck.getPlugin( 'notes' ).open() ) );
			}

			groups.push( group( ...noteControls, fullscreenButton ) );

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

			// Keys pressed inside toolbar controls (e.g. arrows in the theme menu) must not move slides.
			element.addEventListener( 'keydown', event => event.stopPropagation() );

			setupIdleHide( element );

			return {
				element,
				setMenuOpen: open => menuButton.setAttribute( 'aria-expanded', String( open ) )
			};
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

function readTimer() {
	try {
		const stored = JSON.parse( sessionStorage.getItem( timerStorageKey() ) );
		const validStart = stored?.startedAt === null || ( Number.isFinite( stored?.startedAt ) && stored.startedAt <= Date.now() );
		if( Number.isFinite( stored?.base ) && stored.base >= 0 && validStart ) return stored;
	} catch( e ) { /* storage blocked or bad JSON */ }
	return { base: 0, startedAt: null };
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

function setLabel( node, label ) {
	node.title = label;
	node.setAttribute( 'aria-label', label );
}

function group( ...children ) {
	const node = el( 'div', 'rtlui-group' );
	node.append( ...children );
	return node;
}
