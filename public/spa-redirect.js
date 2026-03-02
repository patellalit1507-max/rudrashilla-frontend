// Loaded synchronously by index.html before the React bundle.
// Restores the real URL that 404.html encoded into the query string.
// Must run before React Router initialises so it reads the correct pathname.
(function (l) {
  if (l.search[1] === '/') {
    var decoded = l.search
      .slice(1)
      .split('&')
      .map(function (s) { return s.replace(/~and~/g, '&'); })
      .join('?');
    window.history.replaceState(
      null,
      null,
      l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location));
