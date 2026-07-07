/* Terminal typewriter for the name headings (.home__name / .page__name).
   The name types in character-by-character behind a block cursor, like a
   console prompt; when it finishes the real name is restored (so it wraps
   normally) with the cursor left blinking after it. Runs once on load — on
   Home after the CRT turn-on, on internal pages once the webfont is ready —
   and again on hover. The typing frames are painted in an absolute overlay so
   the growing line never re-wraps the heading or shifts the layout.
   (The 90s glitch scramble now lives only on the Home nav links — see the
   inline script in index.html.) */
(function () {
	var names = document.querySelectorAll('.home__name, .page__name');
	if (!names.length) return;
	var SPEED = 62;   /* ms per character */

	function span(cls) { var s = document.createElement('span'); if (cls) s.className = cls; return s; }

	function setup(el) {
		var label = el.textContent;
		el.textContent = '';
		var real = span('type-real'); real.textContent = label;   /* in flow: holds the box + wraps */
		real.style.visibility = 'hidden';   /* start blank — the name reveals purely by typing */
		var cur = span('type-cursor'); cur.setAttribute('aria-hidden', 'true'); cur.style.display = 'none';
		var scr = span('type-scr'); scr.setAttribute('aria-hidden', 'true');   /* absolute typing overlay */
		var out = span(''), scur = span('type-cursor');
		scr.appendChild(out); scr.appendChild(scur);
		el.appendChild(real); el.appendChild(cur); el.appendChild(scr);
		el._label = label; el._real = real; el._cur = cur; el._scr = scr; el._out = out;
		el.addEventListener('mouseenter', function () { type(el); });
	}

	function finish(el) {
		clearInterval(el._typ);
		el._scr.style.display = 'none';
		el._real.style.visibility = '';
		el._cur.style.display = '';        /* blinking cursor, parked after the name */
	}

	function type(el) {
		var label = el._label, out = el._out, i = 0;
		clearInterval(el._typ);
		el._real.style.visibility = 'hidden';   /* keep its space so the box never moves */
		el._cur.style.display = 'none';
		el._scr.style.display = 'block';
		out.textContent = '';
		function tick() {
			i++;
			out.textContent = label.slice(0, i);
			if (i >= label.length) finish(el);
		}
		tick();
		el._typ = setInterval(tick, SPEED);
	}

	names.forEach(setup);

	function autorun() { for (var i = 0; i < names.length; i++) type(names[i]); }

	if (document.body.classList.contains('is-home')) {
		/* Home: type the name once the CRT intro finishes turning on. */
		var root = document.documentElement;
		var stage = document.querySelector('.crt-stage');
		var ran = false;
		function go() { if (ran) return; ran = true; autorun(); }
		if (root.classList.contains('crt-arm') || root.classList.contains('crt-play')) {
			if (stage) stage.addEventListener('animationend', function () { setTimeout(go, 120); }, { once: true });
			setTimeout(go, 2200);   /* safety if animationend is ever missed */
		} else {
			setTimeout(go, 200);    /* CRT already finished (fast/cached) or disabled → type now */
		}
	} else {
		/* Internal pages: type once the webfont is ready (right font, no swap). */
		var done = false;
		function once() { if (done) return; done = true; autorun(); }
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(once);
		setTimeout(once, 1500);
	}
})();
