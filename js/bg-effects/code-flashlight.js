/* Code flashlight — cursor background (internal pages).
   The page background is faint source code that is only revealed inside a soft
   halo around the cursor, like reading with a flashlight. Self-injects its
   .fx-bg canvas (z-index -1). One of the swappable backgrounds in js/bg-effects/
   — include exactly ONE per page. Disabled on touch. */
(function () {
	if (!window.matchMedia) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
	function ink() { return isDark() ? [244, 244, 244] : [10, 10, 10]; }
	function paper() { return isDark() ? [13, 13, 13] : [255, 255, 255]; }
	function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

	var canvas = document.createElement('canvas');
	canvas.className = 'fx-bg';
	canvas.setAttribute('aria-hidden', 'true');
	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W = 0, H = 0, mx = -9999, my = -9999;
	var LH = 19, lines = [];
	var SRC = [
		'const routes = fleet.filter(function (v) { return v.online })',
		'function decode(sig) { return sig.lat != null && sig.lng != null }',
		'while (queue.length) dispatch(queue.shift())',
		'addEventListener("mousemove", function (e) { track(e) })',
		'if (!ctx) throw new Error("no canvas context")',
		'db.query("SELECT * FROM devices WHERE active = 1")',
		'export default function App() { return render(<Map/>) }',
		'for (var i = 0; i < dots.length; i++) draw(dots[i])',
		'const socket = connect(url, { retry: true, backoff: 2 })'
	];

	function reset() {
		lines = [];
		var n = Math.ceil(H / LH) + 2;
		for (var i = 0; i < n; i++) lines.push(SRC[i % SRC.length]);
	}
	function resize() {
		W = window.innerWidth; H = window.innerHeight;
		canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
		canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		reset();
	}
	function draw() {
		ctx.clearRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'source-over';
		ctx.font = '13px "Space Mono", monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = rgba(ink(), 0.9);
		for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], 24, (i + 1) * LH);
		/* soft round "flashlight" mask around the cursor */
		ctx.globalCompositeOperation = 'destination-in';
		var g = ctx.createRadialGradient(mx, my, 0, mx, my, 175);
		g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.62, 'rgba(0,0,0,0.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
		/* paper behind everything */
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = rgba(paper(), 1); ctx.fillRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'source-over';
		requestAnimationFrame(draw);
	}

	window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
	document.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });
	window.addEventListener('resize', resize);

	function init() { document.body.appendChild(canvas); resize(); requestAnimationFrame(draw); }
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
