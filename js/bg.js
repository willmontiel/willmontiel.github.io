/* Phosphor dot-grid background (internal pages only).
   A faint dot grid; dots near the cursor light up and lean toward the orange
   accent, like phosphors under the beam. Self-injects its canvas. Disabled on
   touch (no cursor). Adapts to the light/dark theme. */
(function () {
	if (!window.matchMedia) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	var ACCENT = [255, 74, 28];
	function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
	function lerp(a, b, t) { return a + (b - a) * t; }

	var canvas = document.createElement('canvas');
	canvas.className = 'fx-bg';
	canvas.setAttribute('aria-hidden', 'true');
	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var cssW = 0, cssH = 0, dots = [], SP = 30;
	var mx = -9999, my = -9999;

	function resize() {
		cssW = window.innerWidth; cssH = window.innerHeight;
		canvas.width = Math.floor(cssW * dpr); canvas.height = Math.floor(cssH * dpr);
		canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		dots = [];
		for (var y = SP / 2; y < cssH; y += SP)
			for (var x = SP / 2; x < cssW; x += SP) dots.push([x, y]);
	}
	function draw() {
		ctx.clearRect(0, 0, cssW, cssH);
		var dark = isDark(), base = dark ? '244,244,244' : '10,10,10', bc = dark ? 244 : 10, R = 150, i, d;
		ctx.fillStyle = 'rgba(' + base + ',0.07)';
		for (i = 0; i < dots.length; i++) { d = dots[i]; ctx.fillRect(d[0] - 1, d[1] - 1, 2, 2); }
		if (mx > -9000) {
			for (i = 0; i < dots.length; i++) {
				d = dots[i]; var dx = d[0] - mx, dy = d[1] - my, dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > R) continue;
				var t = 1 - dist / R;
				var r = Math.round(lerp(bc, ACCENT[0], t)), g = Math.round(lerp(bc, ACCENT[1], t)), b = Math.round(lerp(bc, ACCENT[2], t));
				ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (0.12 + t * 0.75) + ')';
				var s = 2 + t * 2.4;
				ctx.fillRect(d[0] - s / 2, d[1] - s / 2, s, s);
			}
		}
		requestAnimationFrame(draw);
	}

	window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
	document.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
	window.addEventListener('resize', resize);

	function init() {
		document.body.appendChild(canvas);
		resize();
		requestAnimationFrame(draw);
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
