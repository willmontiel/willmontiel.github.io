/* Type trail — cursor background (internal pages).
   The cursor leaves a trail of code characters that are born orange and fade
   out as they drift up, like typing into the page. Self-injects its .fx-bg
   canvas (z-index -1). One of the swappable backgrounds in js/bg-effects/ —
   include exactly ONE per page. Disabled on touch. */
(function () {
	if (!window.matchMedia) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	var ACCENT = [255, 74, 28];
	function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
	function ink() { return isDark() ? [244, 244, 244] : [10, 10, 10]; }
	function paper() { return isDark() ? [13, 13, 13] : [255, 255, 255]; }
	function lerp(a, b, t) { return a + (b - a) * t; }
	function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
	function mix(base, t) { return [Math.round(lerp(base[0], ACCENT[0], t)), Math.round(lerp(base[1], ACCENT[1], t)), Math.round(lerp(base[2], ACCENT[2], t))]; }
	function pick(s) { return s.charAt((Math.random() * s.length) | 0); }

	var canvas = document.createElement('canvas');
	canvas.className = 'fx-bg';
	canvas.setAttribute('aria-hidden', 'true');
	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0, H = 0, mx = -9999, my = -9999, lx = -9999, ly = -9999;
	var GT = '01{}[]()<>/;=+*abcdef0123456789', parts = [];

	function resize() {
		W = window.innerWidth; H = window.innerHeight;
		canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
		canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	function draw() {
		ctx.fillStyle = rgba(paper(), 1); ctx.fillRect(0, 0, W, H);
		ctx.font = '16px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
		var ic = ink();
		for (var i = parts.length - 1; i >= 0; i--) {
			var p = parts[i];
			p.life -= 0.02; p.y += p.vy;
			if (p.life <= 0) { parts.splice(i, 1); continue; }
			ctx.fillStyle = rgba(mix(ic, p.life), 0.15 + p.life * 0.8);
			ctx.fillText(p.ch, p.x, p.y);
		}
		requestAnimationFrame(draw);
	}

	window.addEventListener('mousemove', function (e) {
		mx = e.clientX; my = e.clientY;
		var dx = mx - lx, dy = my - ly;
		if (dx * dx + dy * dy > 120) { lx = mx; ly = my; parts.push({ x: mx, y: my, ch: pick(GT), life: 1, vy: -(0.3 + Math.random() * 0.6) }); }
	});
	document.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
	window.addEventListener('resize', resize);

	function init() { document.body.appendChild(canvas); resize(); requestAnimationFrame(draw); }
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
