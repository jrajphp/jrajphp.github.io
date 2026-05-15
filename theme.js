(function () {
  try {
    var t = localStorage.getItem('jr-theme');
    if (!t) {
      var pref = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      t = pref ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = t;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();

window.jrTheme = {
  get: function () {
    return document.documentElement.dataset.theme || 'light';
  },
  set: function (t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('jr-theme', t); } catch (e) {}
  },
  toggle: function () {
    window.jrTheme.set(window.jrTheme.get() === 'dark' ? 'light' : 'dark');
  },
};
