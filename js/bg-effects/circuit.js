/* Circuit — cursor background (internal pages).
   A faint PCB-style grid of traces and pads; orange pulses travel the traces and
   the pads glow toward the cursor. Self-injects its .fx-bg canvas (z-index -1).
   One of the swappable backgrounds in js/bg-effects/ — include exactly ONE per
   page. Disabled on touch. */
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

	var canvas = document.createElement('canvas');
	canvas.className = 'fx-bg';
	canvas.setAttribute('aria-hidden', 'true');
	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0, H = 0, mx = -9999, my = -9999;
	var SP = 46, nodes = [], pulses = [];

	function newPulse() {
		var h = Math.random() < 0.5;
		var span = h ? H : W;
		var line = SP + SP * ((Math.random() * Math.floor(span / SP)) | 0);
		return { h: h, line: line, pos: -30, sp: 1.6 + Math.random() * 2.6 };
	}
	function reset() {
		nodes = [];
		for (var y = SP; y < H; y += SP)
			for (var x = SP; x < W; x += SP) nodes.push({ x: x, y: y });
		pulses = [];
		for (var k = 0; k < 7; k++) { var p = newPulse(); p.pos = Math.random() * (p.h ? W : H); pulses.push(p); }
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
		var ic = ink(), R = 165, i;
		/* faint PCB grid */
		ctx.strokeStyle = rgba(ic, 0.05); ctx.lineWidth = 1; ctx.beginPath();
		for (var x = SP; x < W; x += SP) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
		for (var y = SP; y < H; y += SP) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
		ctx.stroke();
		/* pads — glow toward the cursor */
		for (i = 0; i < nodes.length; i++) {
			var n = nodes[i], dx = n.x - mx, dy = n.y - my, near = 0, d = Math.sqrt(dx * dx + dy * dy);
			if (d < R) near = 1 - d / R;
			var s = 2 + near * 3.5;
			ctx.fillStyle = near > 0 ? rgba(mix(ic, near), 0.12 + near * 0.85) : rgba(ic, 0.09);
			ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
		}
		/* pulses travelling the traces */
		for (i = 0; i < pulses.length; i++) {
			var p = pulses[i]; p.pos += p.sp;
			var span = p.h ? W : H;
			if (p.pos > span + 30) { pulses[i] = newPulse(); continue; }
			for (var j = 6; j >= 0; j--) {
				var q = p.pos - j * 5;
				var px = p.h ? q : p.line, py = p.h ? p.line : q;
				ctx.fillStyle = rgba(ACCENT, (1 - j / 7) * 0.9);
				ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
			}
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
