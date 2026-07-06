/* Terminal-decode scramble for the name headings (.home__name / .page__name).
   Same 90s glitch as the Home nav links: chars shuffle then resolve left to
   right. Runs on hover AND once automatically on load (a decode-in intro) — on
   Home right after the CRT turn-on, on internal pages once fonts are ready.

   The scramble is painted in an absolutely-positioned overlay while the real
   name (kept in flow, just hidden) holds the layout box. That way scrambled
   frames — whose glyphs are wider/narrower — can never re-wrap the heading or
   jump the layout, which was happening on narrow / mobile widths. Spaces are
   preserved so the word shape holds. */
(function () {
	/* Lowercase set without the widest glyphs (m, w): the name is mostly lowercase,
	   so this keeps a scrambled frame close to the real name's width and it never
	   re-wraps the heading (which was clipping the last name on the wide Home name). */
	var CHARS = 'abcdefghijklnopqrstuvxyz0123456789/()=<>+*:.-';

	function setup(el) {
		var label = el.textContent;
		el.textContent = '';
		var real = document.createElement('span');
		real.className = 'glitch-real';
		real.textContent = label;
		var scr = document.createElement('span');
		scr.className = 'glitch-scr';
		scr.setAttribute('aria-hidden', 'true');
		el.appendChild(real);
		el.appendChild(scr);
		el._label = label;
		el._real = real;
		el._scr = scr;
	}

	function scramble(el) {
		var label = el._label, real = el._real, scr = el._scr, frame = 0;
		clearInterval(el._glit);
		function restore() {
			clearInterval(el._glit);
			scr.textContent = '';
			scr.style.display = 'none';
			real.style.visibility = '';
		}
		el._restore = restore;
		real.style.visibility = 'hidden';   /* keeps its space → box never moves */
		scr.style.display = 'block';         /* absolute overlay: paints over, never re-wraps the layout */
		function tick() {
			var out = '';
			for (var i = 0; i < label.length; i++) {
				var ch = label[i];
				out += (ch === ' ' || i < frame / 2) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
			}
			scr.textContent = out;
			if (frame / 2 >= label.length) { restore(); return; }
			frame++;
		}
		tick();                       /* render a garbled frame immediately */
		el._glit = setInterval(tick, 35);
	}

	var names = document.querySelectorAll('.home__name, .page__name');
	names.forEach(function (el) {
		setup(el);
		el.addEventListener('mouseenter', function () { scramble(el); });
		el.addEventListener('mouseleave', function () { if (el._restore) el._restore(); });
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
