#!/usr/bin/env python3
"""Local dev server that mirrors GitHub Pages' clean-URL behavior.

The site links to extensionless URLs (/about, /portfolio, ...), which GitHub
Pages resolves to about.html, portfolio.html, etc. Plain `python3 -m http.server`
does NOT do that, so those links 404 locally. Run this instead:

    python3 serve.py            # serves on :8000 (or the next free port)
    python3 serve.py 8080       # serves on a port you pick

For a path with no extension that isn't a real file or directory, it serves the
same path + ".html" — exactly what GitHub Pages does in production. (Opening the
files via file:// can't do this; a local server is required for clean URLs.)
"""
import http.server
import os
import socketserver
import sys

DEFAULT_PORT = 8000
ADDR_IN_USE = (48, 98, 10048)  # macOS / Linux / Windows


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        fs = super().translate_path(path)
        if os.path.isdir(fs):
            return fs  # base handler serves the directory's index.html
        if not os.path.exists(fs) and not os.path.splitext(fs)[1]:
            html = fs + ".html"
            if os.path.exists(html):
                return html
        return fs


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True

    start = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", DEFAULT_PORT))
    for port in range(start, start + 20):
        try:
            httpd = socketserver.TCPServer(("", port), Handler)
        except OSError as e:
            if e.errno in ADDR_IN_USE:
                continue  # port busy — try the next one
            raise
        with httpd:
            if port != start:
                print("Port %d was busy — using %d instead." % (start, port), flush=True)
            print("Serving %s" % os.getcwd(), flush=True)
            print("  http://localhost:%d   (clean URLs, like GitHub Pages)" % port, flush=True)
            print("Stop with Ctrl+C.", flush=True)
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nbye")
        return

    sys.exit("No free port in %d-%d. Free one (lsof -i :%d) or pass a port: python3 serve.py 8123"
             % (start, start + 19, start))


if __name__ == "__main__":
    main()
