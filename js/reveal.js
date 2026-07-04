/* Project reveal (Portfolio). Hovering an element with [data-shot] pops a small
   CRT screen that follows the cursor: the screenshot arrives pixelated with a
   signal tear + scanlines, then locks into focus. Elements with [data-nosignal]
   show an animated "NO SIGNAL" static screen with the tech stack instead.
   Self-injects its canvas. Disabled for touch and reduced-motion. */
(function () {
	if (!window.matchMedia) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if (window.matchMedia('(pointer: coarse)').matches) return;

	var CW = 300, CH = 169;
	var canvas = document.createElement('canvas');
	canvas.className = 'fx-preview';
	canvas.setAttribute('aria-hidden', 'true');
	var ctx = canvas.getContext('2d');
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	canvas.width = CW * dpr; canvas.height = CH * dpr;
	canvas.style.width = CW + 'px'; canvas.style.height = CH + 'px';
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	var off = document.createElement('canvas'), octx = off.getContext('2d');

	var img = null, imgReady = false, mode = 'pic', start = 0, raf = null, stack = '';
	function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
	function scan() { ctx.fillStyle = 'rgba(0,0,0,0.18)'; for (var y = 0; y < CH; y += 3) ctx.fillRect(0, y, CW, 1); }

	function position(x, y) {
		var ox = 22, px = x + ox, py = y - CH / 2;
		if (px + CW > window.innerWidth - 8) px = x - CW - ox;
		if (px < 8) px = 8;
		py = Math.min(Math.max(py, 8), window.innerHeight - CH - 8);
		canvas.style.transform = 'translate(' + px + 'px,' + py + 'px)';
	}

	function frame() {
		var t = Math.min(1, (Date.now() - start) / 440), e = easeOut(t);
		ctx.clearRect(0, 0, CW, CH);
		if (mode === 'pic') {
			if (!imgReady) { raf = requestAnimationFrame(frame); return; }
			var block = Math.max(1, Math.round(18 * (1 - e)));
			var sw = Math.max(1, Math.ceil(CW / block)), sh = Math.max(1, Math.ceil(CH / block));
			off.width = sw; off.height = sh;
			octx.imageSmoothingEnabled = true; octx.clearRect(0, 0, sw, sh);
			octx.drawImage(img, 0, 0, sw, sh);
			ctx.imageSmoothingEnabled = false;
			if (t < 0.5) {
				var n = 6;
				for (var s = 0; s < n; s++) {
					var j = (Math.random() - 0.5) * (1 - t) * 44;
					ctx.drawImage(off, 0, Math.floor(sh * s / n), sw, Math.ceil(sh / n), j, CH * s / n, CW, CH / n);
				}
			} else {
				ctx.drawImage(off, 0, 0, sw, sh, 0, 0, CW, CH);
			}
			scan();
			if (t < 0.16) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * (1 - t / 0.16)) + ')'; ctx.fillRect(0, 0, CW, CH); }
			if (t < 1) raf = requestAnimationFrame(frame);
			else { ctx.clearRect(0, 0, CW, CH); ctx.imageSmoothingEnabled = true; ctx.drawImage(img, 0, 0, CW, CH); scan(); raf = null; }
		} else {
			var nb = 3, nsw = Math.ceil(CW / nb), nsh = Math.ceil(CH / nb);
			off.width = nsw; off.height = nsh;
			var id = octx.createImageData(nsw, nsh);
			for (var i = 0; i < id.data.length; i += 4) { var v = Math.random() * 255 | 0; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
			octx.putImageData(id, 0, 0);
			ctx.imageSmoothingEnabled = false;
			ctx.globalAlpha = 0.5; ctx.drawImage(off, 0, 0, nsw, nsh, 0, 0, CW, CH); ctx.globalAlpha = 1;
			ctx.fillStyle = 'rgba(6,6,6,0.4)'; ctx.fillRect(0, 0, CW, CH);
			scan();
			ctx.textAlign = 'center';
			ctx.fillStyle = '#FF4A1C'; ctx.font = '700 16px "Space Mono", monospace';
			ctx.fillText('NO SIGNAL', CW / 2, CH / 2 - 4);
			ctx.fillStyle = 'rgba(235,235,235,0.85)'; ctx.font = '11px "Space Mono", monospace';
			ctx.fillText(stack, CW / 2, CH / 2 + 18);
			raf = requestAnimationFrame(frame);
		}
	}

	function enter(row) {
		start = Date.now();
		var src = row.getAttribute('data-shot');
		if (src) { mode = 'pic'; imgReady = false; img = new Image(); img.onload = function () { imgReady = true; }; img.src = src; }
		else { mode = 'nosignal'; stack = row.getAttribute('data-nosignal') || ''; }
		canvas.style.opacity = '1';
		if (!raf) raf = requestAnimationFrame(frame);
	}
	function leave() { canvas.style.opacity = '0'; if (raf) { cancelAnimationFrame(raf); raf = null; } }

	function init() {
		document.body.appendChild(canvas);
		document.querySelectorAll('[data-shot],[data-nosignal]').forEach(function (row) {
			row.addEventListener('mouseenter', function () { enter(row); });
			row.addEventListener('mousemove', function (e) { position(e.clientX, e.clientY); });
			row.addEventListener('mouseleave', leave);
		});
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();
