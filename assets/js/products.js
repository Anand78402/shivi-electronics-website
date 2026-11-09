// Shivi Electronics System — Products page behaviour (UPS series tabs + sticky jump bar)
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Photo gallery (front / back thumbnails) ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    var main = g.querySelector('.pr-gallery-main');
    var thumbs = g.querySelectorAll('.pr-thumb');
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        main.src = t.dataset.src; main.alt = t.dataset.alt;
        thumbs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
      });
    });
  });

  /* ---------- UPS series tabs (deep-linkable: #alpha / #beta / #gama) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.pr-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.pr-panel'));

  function selectSeries(key, updateHash) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.dataset.series === key;
      if (on) found = true;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (!found) return false;
    panels.forEach(function (p) { p.hidden = p.dataset.series !== key; });
    if (updateHash && window.history && history.replaceState) {
      history.replaceState(null, '', '#' + key);
    }
    return true;
  }

  if (tabs.length) {
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectSeries(t.dataset.series, true); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        selectSeries(next.dataset.series, true);
      });
    });

    // Initial series: from the URL hash if it names one, otherwise Alpha.
    var fromHash = (location.hash || '').replace('#', '');
    if (!selectSeries(fromHash, false)) selectSeries('alpha', false);
    if (['alpha', 'beta', 'gama'].indexOf(fromHash) !== -1) {
      var target = document.getElementById('online-ups');
      if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
    }

    // Back/forward or a manual hash edit (e.g. ...products.html#gama) switches the tab too.
    window.addEventListener('hashchange', function () {
      var key = (location.hash || '').replace('#', '');
      if (['alpha', 'beta', 'gama'].indexOf(key) !== -1 && selectSeries(key, false)) {
        var t = document.getElementById('online-ups');
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Any link to #alpha / #beta / #gama on the page switches the tab too.
    document.querySelectorAll('a[href="#alpha"], a[href="#beta"], a[href="#gama"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        selectSeries(a.getAttribute('href').slice(1), true);
        var t = document.getElementById('online-ups');
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---------- Sticky jump bar: highlight the section in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.pr-jump a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = sections.indexOf(entry.target);
        links.forEach(function (a, i) { a.classList.toggle('on', i === idx); });
        var on = links[idx];
        if (on && on.scrollIntoView && on.parentElement.scrollWidth > on.parentElement.clientWidth) {
          on.parentElement.scrollTo({ left: on.offsetLeft - 24, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }
});
