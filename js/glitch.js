/* Terminal-decode scramble for the name headings (.home__name / .page__name).
   Same 90s glitch used on the Home nav links: chars shuffle then resolve left
   to right. Runs on hover AND once automatically on load (a decode-in intro) —
   on Home right after the CRT turn-on, on internal pages once fonts are ready.
   Spaces are preserved so the word shape holds. Skipped for reduced-motion. */
(function () {
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/()=<>*+';

	function scramble(el) {
		var label = el._label, frame = 0;
		clearInterval(el._glit);
		function tick() {
			var out = '';
			for (var i = 0; i < label.length; i++) {
				var ch = label[i];
				out += (ch === ' ' || i < frame / 2) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
			}
			el.textContent = out;
			if (frame / 2 >= label.length) { clearInterval(el._glit); el.textContent = label; return; }
			frame++;
		}
		tick();                       /* render a garbled frame immediately */
		el._glit = setInterval(tick, 35);
	}

	var names = document.querySelectorAll('.home__name, .page__name');
	names.forEach(function (el) {
		el._label = el.textContent;
		el.addEventListener('mouseenter', function () { scramble(el); });
		el.addEventListener('mouseleave', function () { clearInterval(el._glit); el.textContent = el._label; });
	});
	if (!names.length) return;

	function autorun() { names.forEach(scramble); }

	if (document.body.classList.contains('is-home')) {
		/* Home: decode the name once the CRT intro finishes turning on. */
		var root = document.documentElement;
		var stage = document.querySelector('.crt-stage');
		var ran = false;
		function go() { if (ran) return; ran = true; autorun(); }
		if (root.classList.contains('crt-arm') || root.classList.contains('crt-play')) {
			if (stage) stage.addEventListener('animationend', function () { setTimeout(go, 120); }, { once: true });
			setTimeout(go, 2200);     /* safety if animationend is ever missed */
		} else {
			setTimeout(go, 200);      /* CRT already finished (fast/cached) or disabled → decode now */
		}
	} else {
		/* Internal pages: decode once the webfont is ready (right font, no swap). */
		var done = false;
		function once() { if (done) return; done = true; autorun(); }
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(once);
		setTimeout(once, 1500);
	}
})();
