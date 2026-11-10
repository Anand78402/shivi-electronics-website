document.addEventListener('DOMContentLoaded', function () {
  var STORAGE_KEY = 'shiviTheme';
  var themes = [
    { name: 'Navy Classic', purple: '#0a1f5c', purpleDeep: '#001b3d', orange: '#f47c0c' },
    { name: 'Electric Blue', purple: '#1a56db', purpleDeep: '#0f2f8c', orange: '#ff8a1e' },
    { name: 'Navy & Amber', purple: '#0f2a63', purpleDeep: '#071640', orange: '#ffab40' },
    { name: 'Monochrome Navy', purple: '#13294b', purpleDeep: '#060f24', orange: '#e8672b' },
    { name: 'Sunrise', purple: '#e8630a', purpleDeep: '#b34700', orange: '#0a1f5c' }
  ];

  function applyTheme(i) {
    var t = themes[i];
    if (!t) return;
    document.documentElement.style.setProperty('--purple', t.purple);
    document.documentElement.style.setProperty('--purple-deep', t.purpleDeep);
    document.documentElement.style.setProperty('--orange', t.orange);
    document.querySelectorAll('.theme-swatch-btn').forEach(function (el, idx) {
      el.classList.toggle('active', idx === i);
    });
    try { localStorage.setItem(STORAGE_KEY, String(i)); } catch (e) {}
  }

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Choose color theme');
  toggle.innerHTML = '<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="14.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r="1.3" fill="currentColor" stroke="none"/><circle cx="9.5" cy="15" r="1.3" fill="currentColor" stroke="none"/></svg>';

  var panel = document.createElement('div');
  panel.className = 'theme-panel';
  panel.hidden = true;

  var label = document.createElement('div');
  label.className = 'theme-panel-label';
  label.textContent = 'Choose a theme';
  panel.appendChild(label);

  themes.forEach(function (t, i) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-swatch-btn';
    btn.innerHTML =
      '<span class="theme-swatch-dot" style="background:' + t.purple + '"></span>' +
      '<span class="theme-swatch-dot" style="background:' + t.orange + '"></span>' +
      '<span class="theme-swatch-name">' + t.name + '</span>';
    btn.addEventListener('click', function () { applyTheme(i); });
    panel.appendChild(btn);
  });

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) panel.hidden = true;
  });

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(saved !== null ? parseInt(saved, 10) : 0);
});
