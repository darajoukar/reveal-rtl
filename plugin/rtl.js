import { localizeDigits, localizeDigitsIn, toLatinDigits, fillJalaliDates, formatSlideNumber } from '../core/rtl.js';
import { resolveLocale } from '../core/i18n.js';
import { watchSpeakerView } from '../core/speaker.js';
import { localizeHelp } from '../core/help.js';

/**
 * reveal.js plugin for right-to-left presentations (Persian, Arabic, …).
 *
 * Options go in `rtlOptions` in Reveal.initialize():
 *   lang:   'fa' (default) | 'ar' | 'en' — language of the built-in labels (also used by RevealRTLUI)
 *   digits: 'persian' | 'arabic' | 'latin'; true = the language default, false = 'latin'
 *   labels: { key: 'text' } to override single labels (keys in core/i18n.js)
 */
export default () => ( {
	id: 'rtl',

	init( deck ) {
		const config = deck.getConfig();
		const locale = resolveLocale( config.rtlOptions );
		const { t, digits } = locale;
		const localized = value => localizeDigits( value, digits );

		// Plugins init before reveal.js applies its config, so changing the config object
		// here takes effect on first render (no LTR flash). deck.configure() would need the DOM.
		config.rtl = true;

		const root = deck.getRevealElement();
		root.lang = locale.lang;
		root.dataset.rtlDigits = digits;
		// Label of on-slide notes (core/rtl.css reads it in ::before).
		root.style.setProperty( '--rtl-notes-label', JSON.stringify( t( 'notes' ) ) );

		if( digits !== 'latin' && config.slideNumber && typeof config.slideNumber !== 'function' ) {
			const format = config.slideNumber;
			// One string: reveal.js only renders the "/ total" part when it is a number.
			config.slideNumber = slide => {
				const { h, v } = deck.getIndices( slide );
				return [ localized( formatSlideNumber( format, {
					h, v,
					vertical: deck.isVerticalSlide( slide ),
					pastCount: deck.getSlidePastCount( slide ),
					total: deck.getTotalSlides(),
					uncounted: slide?.dataset.visibility === 'uncounted',
					horizontalCount: deck.getHorizontalSlides().length
				} ) ) ];
			};
		}

		// The PDF print view numbers pages with Latin digits after layout.
		deck.on( 'pdf-ready', () => document.querySelectorAll( '.slide-number-pdf' ).forEach( el => localizeDigitsIn( el, digits ) ) );

		// Jump to slide (G key): reveal.js creates the input on first use and parses it with
		// parseInt, which rejects Persian/Arabic digits. Localized placeholder, and the value reads
		// as Latin digits for reveal.js while the user keeps seeing what they typed.
		const patchJumpInput = input => {
			if( input.dataset.rtl ) return;
			input.dataset.rtl = '1';
			input.placeholder = t( 'jump' );
			input.dir = 'rtl';
			const native = Object.getOwnPropertyDescriptor( HTMLInputElement.prototype, 'value' );
			Object.defineProperty( input, 'value', {
				get() { return toLatinDigits( native.get.call( this ) ); },
				set( value ) { native.set.call( this, value ); }
			} );
		};
		deck.on( 'ready', () => {
			new MutationObserver( () => {
				const input = root.querySelector( '.jump-to-slide-input' );
				if( input ) patchJumpInput( input );
			} ).observe( root, { childList: true } );
		} );

		// Keyboard help overlay (? key), localized.
		deck.on( 'showhelp', () => localizeHelp( root.querySelector( '.r-overlay-help' ), t, locale.lang ) );

		// Speaker view (notes plugin, S key): RTL layout and localized labels.
		if( !deck.isSpeakerNotes() ) watchSpeakerView( locale );

		// 'ready' fires after all plugins, so content from markdown etc. is already in the DOM.
		deck.on( 'ready', () => {
			const slides = deck.getSlidesElement();
			fillJalaliDates( slides, digits );
			localizeDigitsIn( slides, digits );
		} );
	}
} );
