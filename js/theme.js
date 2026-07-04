/* Theme toggle — light (default) / dark, persisted in localStorage.
   The initial theme is applied by a tiny inline script in each page's
   <head> to avoid a flash; this file only wires up the button. */
(function () {
	var root = document.documentElement;
	var btn = document.querySelector('.theme-toggle');
	if (!btn) return;

	function sync(theme) {
		var dark = theme === 'dark';
		if (dark) root.setAttribute('data-theme', 'dark');
		else root.removeAttribute('data-theme');
		btn.setAttribute('aria-pressed', String(dark));
		btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
	}

	sync(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

	btn.addEventListener('click', function () {
		var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		sync(next);
		try { localStorage.setItem('theme', next); } catch (e) {}
	});
})();
