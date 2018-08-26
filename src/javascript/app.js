import bespoke from 'bespoke';
import classes from 'bespoke-classes';
import bullets from 'bespoke-bullets';
import touch from 'bespoke-touch';
import forms from 'bespoke-forms';
import keys from 'bespoke-keys';
import hash from 'bespoke-hash';

import { highlightBlock } from 'highlight.js';

function autoscroll(selector) {
	let easeInOut = (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t;

	return function(deck) {
		let delay = null;
		let timer = null;

		deck.on('activate', function(event) {
			if (delay) {
				clearTimeout(delay);
				delay = null;
			} else if (timer) {
				clearAnimationFrame(timer);
				timer = null;
			}

			let scroller = event.slide.querySelector(selector);
			if (scroller == null) return;
			scroller.scrollTop = 0;

			delay = setTimeout(() => {
				delay = null;
				let start;
				let duration = 15000;
				let scroll = timestamp => {
					if (start == null) start = timestamp;
					let lerp = (timestamp - start) / duration;
					let eased = easeInOut(lerp);
					let scrollMax = scroller.scrollHeight - scroller.offsetHeight;
					let scrollTop = Math.floor(scrollMax * eased);
					scroller.scrollTop = scrollTop;
					if (lerp < 1) {
						requestAnimationFrame(scroll);
					} else {
						timer = null;
					}
				};
				timer = requestAnimationFrame(scroll);
			}, 3000);

		});
	};
}

function highlight(selector) {
	return function(deck) {
		deck.slides.forEach(function(slide) {
			for (let block of slide.querySelectorAll(selector)) {
				highlightBlock(block);
			}
		});
	};
}

var deck = bespoke.from('#slides', [
	classes(),
	bullets('.bullet'),
	keys(),
	touch(),
	hash(),
	forms(),
	highlight('.highlight'),
	autoscroll('.autoscroll'),
]);
