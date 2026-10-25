import { localizeDigits } from './rtl.js';
import { resolveLocale } from './i18n.js';

// RTL + localized labels for the reveal.js notes plugin speaker view (reveal.js 6).
// The speaker view is a same-origin popup whose markup comes from the notes plugin,
// so we patch its document after it opens instead of shipping our own copy.

const STYLE_ID = 'reveal-rtl-speaker';

const SPEAKER_CSS = `
body, #speaker-controls, .speaker-controls-notes .value {
	direction: rtl;
	font-family: var(--rtl-font, 'Vazirmatn', 'Sahel', Tahoma, sans-serif);
}
.speaker-controls-time .label, .speaker-controls-notes .label { text-transform: none; }

/* Mirror the layouts: current slide on the right. */
body[data-speaker-layout] #current-slide { left: auto; right: 0; padding-right: 6px; padding-left: 0; }
body[data-speaker-layout] #upcoming-slide { right: auto; left: 0; }
body[data-speaker-layout] #speaker-controls { right: auto; left: 0; }
body[data-speaker-layout="wide"] #current-slide { padding: 6px; }
body[data-speaker-layout="wide"] #upcoming-slide { left: auto; right: 50%; }
body[data-speaker-layout="tall"] #current-slide { padding: 6px; }
body[data-speaker-layout="tall"] #upcoming-slide { left: auto; right: 0; }
body[data-speaker-layout="tall"] #speaker-controls { left: auto; right: 45%; }
#current-slide .label, #upcoming-slide .label { left: auto; right: 10px; }
#speaker-layout { right: auto; left: 10px; }

.speaker-controls-time .reset-button { float: left; }
.speaker-controls-time .timer { float: right; }
.speaker-controls-time .clock { float: left; text-align: left; }
.speaker-controls-time .timer, .pacing { direction: ltr; unicode-bidi: isolate; }
.speaker-controls-time .timer { text-align: right; }
`;

// selector -> i18n key
const LABELS = [
	[ '#upcoming-slide .label', 'upcoming' ],
	[ '.speaker-controls-time .reset-button', 'clickToReset' ],
	[ '.pacing-title', 'pacing' ],
	[ '.speaker-controls-notes .label', 'notes' ]
];

const LAYOUT_KEYS = { 'default': 'layoutDefault', 'wide': 'layoutWide', 'tall': 'layoutTall', 'notes-only': 'layoutNotesOnly' };

// Elements whose text the speaker view script rewrites every second.
const LIVE_TEXT_SELECTOR = '.clock-value, .timer, .pacing';

// locale: resolveLocale() result ({ lang, digits, t }).
export function applySpeakerRTL( doc, locale = resolveLocale() ) {
	const { t, lang, digits } = locale;
	if( !doc?.head || doc.getElementById( STYLE_ID ) ) return;

	const style = doc.createElement( 'style' );
	style.id = STYLE_ID;
	style.textContent = SPEAKER_CSS;
	doc.head.append( style );
	doc.documentElement.lang = lang;

	// Load the Persian font: rtl.css carries the bundled @font-face; also any Vazirmatn stylesheet
	// the deck links itself. Absolute href, since the popup document is about:blank.
	document.querySelectorAll( 'link[rel="stylesheet"][href*="rtl.css"], link[rel="stylesheet"][href*="Vazirmatn"]' ).forEach( link => {
		const copy = doc.createElement( 'link' );
		copy.rel = 'stylesheet';
		copy.href = link.href;
		doc.head.append( copy );
	} );

	LABELS.forEach( ( [ selector, key ] ) => {
		const el = doc.querySelector( selector );
		if( el ) el.textContent = t( key );
	} );

	// "Time" is a bare text node before the reset button.
	const timeLabel = doc.querySelector( '.speaker-controls-time > .label' );
	if( timeLabel?.firstChild?.nodeType === Node.TEXT_NODE ) timeLabel.firstChild.nodeValue = `${ t( 'time' ) } `;

	const layoutSelect = doc.querySelector( '.speaker-layout-dropdown' );
	const layoutLabel = doc.querySelector( '.speaker-layout-label' );
	if( layoutSelect && layoutLabel ) {
		layoutSelect.querySelectorAll( 'option' ).forEach( option => {
			if( LAYOUT_KEYS[ option.value ] ) option.textContent = t( LAYOUT_KEYS[ option.value ] );
		} );
		const syncLayoutLabel = () => {
			const text = `${ t( 'layout' ) }: ${ layoutSelect.selectedOptions[0]?.textContent || '' }`;
			if( layoutLabel.textContent !== text ) layoutLabel.textContent = text;
		};
		syncLayoutLabel();
		// The speaker script rewrites the label on every layout change.
		new doc.defaultView.MutationObserver( syncLayoutLabel ).observe( layoutLabel, { childList: true, characterData: true, subtree: true } );
	}

	if( digits !== 'latin' || lang !== 'en' ) {
		// Edit text nodes only: the speaker script keeps references to the inner spans.
		const localize = el => {
			const walker = doc.createTreeWalker( el, NodeFilter.SHOW_TEXT );
			for( let node = walker.nextNode(); node; node = walker.nextNode() ) {
				const text = localizeDigits( node.nodeValue, digits ).replace( 'AM', t( 'am' ) ).replace( 'PM', t( 'pm' ) );
				if( node.nodeValue !== text ) node.nodeValue = text;
			}
		};
		doc.querySelectorAll( LIVE_TEXT_SELECTOR ).forEach( el => {
			localize( el );
			new doc.defaultView.MutationObserver( () => localize( el ) ).observe( el, { childList: true, characterData: true, subtree: true } );
		} );
	}
}

// The speaker view posts reveal-notes messages to its opener once connected (and as a heartbeat
// after a reload). Patch its document when one arrives.
export function watchSpeakerView( options ) {
	window.addEventListener( 'message', event => {
		if( typeof event.data !== 'string' || !event.data.includes( 'reveal-notes' ) ) return;
		let doc;
		try { doc = event.source.document; } catch( e ) { return; } // cross-origin: leave it alone
		applySpeakerRTL( doc, options );
	} );
}
