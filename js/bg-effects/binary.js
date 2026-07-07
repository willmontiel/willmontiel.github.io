/* Binary grid — cursor background (internal pages).
   A faint grid of 0/1 glyphs; those near the cursor light up toward the orange
   accent and flip value, like a field of bits reacting to the beam. Self-injects
   its .fx-bg canvas (z-index -1). One of the swappable backgrounds in
   js/bg-effects/ — include exactly ONE per page. Disabled on touch. */
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
	var W = 0, H = 0, mx = -9999, my = -9999;
	var SP = 26, GB = '01', cells = [];

	function reset() {
		cells = [];
		for (var y = SP; y < H; y += SP)
			for (var x = SP; x < W; x += SP) cells.push({ x: x, y: y, ch: pick(GB) });
	}
	function resize() {
		W = window.innerWidth; H = window.innerHeight;
		canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
		canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		reset();
	}
	function draw() {
		ctx.fillStyle = rgba(paper(), 1); ctx.fillRect(0, 0, W, H);
		ctx.font = '14px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
		var ic = ink(), R = 95;
		for (var i = 0; i < cells.length; i++) {
			var c = cells[i], dx = c.x - mx, dy = c.y - my, near = 0, d = Math.sqrt(dx * dx + dy * dy);
			if (d < R) near = 1 - d / R;
			if (near > 0 && Math.random() < 0.05 * near) c.ch = pick(GB);
			ctx.fillStyle = near > 0 ? rgba(mix(ic, near), 0.08 + near * 0.9) : rgba(ic, 0.07);
			ctx.fillText(c.ch, c.x, c.y);
		}
		requestAnimationFrame(draw);
	}

	window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
	document.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
	window.addEventListener('resize', resize);

	function init() { document.body.appendChild(canvas); resize(); requestAnimationFrame(draw); }
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
