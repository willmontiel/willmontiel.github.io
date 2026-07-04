/* Terminal-decode scramble on hover for the name headings (.home__name /
   .page__name). Same 90s glitch used on the Home nav links, but here on plain
   text — no navigation. Spaces are preserved so the word shape stays intact.
   Skipped for reduced-motion / no-JS. */
(function () {
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/()=<>*+';

	function bind(el) {
		var label = el.textContent;
		el.addEventListener('mouseenter', function () {
			var frame = 0;
			clearInterval(el._glit);
			el._glit = setInterval(function () {
				var out = '';
				for (var i = 0; i < label.length; i++) {
					var ch = label[i];
					out += (ch === ' ' || i < frame / 2) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
				}
				el.textContent = out;
				if (frame / 2 >= label.length) { clearInterval(el._glit); el.textContent = label; }
				frame++;
			}, 35);
		});
		el.addEventListener('mouseleave', function () { clearInterval(el._glit); el.textContent = label; });
	}

	document.querySelectorAll('.home__name, .page__name').forEach(bind);
})();
