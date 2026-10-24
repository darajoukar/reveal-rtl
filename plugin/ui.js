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
const KEY_M = 77;

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

			// Timer
			let elapsed = 0;
			let running = false;
			const timerValue = el( 'span', 'rtlui-timer', digits( formatDuration( 0 ) ) );
			timerValue.setAttribute( 'role', 'timer' );
			timerValue.setAttribute( 'aria-label', 'زمان سپری‌شده' );
			const playButton = button( ICONS.play, 'شروع تایمر', () => {
				running = !running;
				playButton.innerHTML = running ? ICONS.pause : ICONS.play;
				playButton.setAttribute( 'aria-label', running ? 'توقف تایمر' : 'شروع تایمر' );
				playButton.title = playButton.getAttribute( 'aria-label' );
			} );
			const resetButton = button( ICONS.reset, 'صفر کردن تایمر', () => {
				elapsed = 0;
				timerValue.textContent = digits( formatDuration( 0 ) );
			} );

			// Clock
			const clock = el( 'time', 'rtlui-clock' );
			const clockFormat = new Intl.DateTimeFormat( options.digits ? 'fa-IR' : undefined, { hour: '2-digit', minute: '2-digit' } );

			const tick = () => {
				clock.textContent = clockFormat.format( new Date() );
				if( running ) timerValue.textContent = digits( formatDuration( ++elapsed ) );
			};
			tick();
			setInterval( tick, 1000 );

			const groups = [
				group( menuButton ),
				group( firstButton, lastButton ),
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

			groups.push( group( notesButton, fullscreenButton ) );
			element.append( ...groups );

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
	node.title = label;
	node.setAttribute( 'aria-label', label );
	node.addEventListener( 'click', onClick );
	return node;
}

function group( ...children ) {
	const node = el( 'div', 'rtlui-group' );
	node.append( ...children );
	return node;
}
