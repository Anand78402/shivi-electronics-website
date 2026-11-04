// Shivi Electronics System — Home page behaviour (series showcase + UPS selector)
document.addEventListener('DOMContentLoaded', function () {
  var WA_NUMBER = '919457274772';

  var SERIES = {
    alpha: { name: 'Alpha', phase: '1Ø – 1Ø', min: 1,  max: 40,  cabinet: 'Black tower',            img: 'assets/img/product-alpha.png', alt: 'Shivi Alpha series single-phase online UPS' },
    beta:  { name: 'Beta',  phase: '3Ø – 1Ø', min: 5,  max: 60,  cabinet: 'White tower',            img: 'assets/img/product-beta.png',  alt: 'Shivi Beta series three-phase input online UPS' },
    gama:  { name: 'Gama',  phase: '3Ø – 3Ø', min: 10, max: 300, cabinet: 'White, fan-cooled',      img: 'assets/img/product-gama.png',  alt: 'Shivi Gama series three-phase online UPS' }
  };

  /* ---------- Hero series showcase ---------- */
  var tabs = document.querySelectorAll('.hm-tab');
  var photo = document.getElementById('hmPhoto');
  if (tabs.length && photo) {
    var tag = document.getElementById('hmTag');
    var fields = {
      phase: document.getElementById('hmPhase'),
      range: document.getElementById('hmRange'),
      cabinet: document.getElementById('hmCabinet')
    };
    var select = function (key) {
      var s = SERIES[key];
      if (!s) return;
      tabs.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.series === key)); });
      photo.src = s.img;
      photo.alt = s.alt;
      tag.textContent = s.name + ' Series';
      fields.phase.textContent = s.phase;
      fields.range.textContent = s.min + ' – ' + s.max + ' kVA';
      fields.cabinet.textContent = s.cabinet;
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t.dataset.series); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        next.focus();
        select(next.dataset.series);
      });
    });
  }

  /* ---------- "Which UPS do I need?" selector ---------- */
  var form = document.getElementById('upsSelector');
  if (!form) return;

  var loadInput = document.getElementById('selLoad');
  var loadOut = document.getElementById('selLoadOut');
  var res = {
    kicker: document.getElementById('resKicker'),
    title: document.getElementById('resTitle'),
    text: document.getElementById('resText'),
    phase: document.getElementById('resPhase'),
    rating: document.getElementById('resRating'),
    range: document.getElementById('resRange'),
    wa: document.getElementById('resWa')
  };

  function checked(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  function update() {
    var supply = checked('supply');
    var output = checked('output');
    var load = parseInt(loadInput.value, 10) || 1;
    loadOut.textContent = load + ' kVA';

    var needed = Math.ceil(load * 1.25); // load + 25% headroom
    var key = null;
    if (supply === '1' && output === '1') key = 'alpha';
    else if (supply === '3' && output === '1') key = 'beta';
    else if (supply === '3' && output === '3') key = 'gama';

    var summary = 'Supply: ' + (supply === '1' ? 'single-phase' : 'three-phase') +
      ', load: ' + (output === '1' ? 'single-phase' : 'three-phase') + ', ' + load + ' kVA.';
    var message;

    if (!key) {
      res.kicker.textContent = 'Needs a custom check';
      res.title.textContent = 'Talk to our engineer';
      res.text.textContent = 'A single-phase supply feeding a three-phase load is not a standard combination in our range. Our engineers can advise on the right setup.';
      res.phase.textContent = '1Ø in, 3Ø out';
      res.rating.textContent = '≈ ' + needed + ' kVA';
      res.range.textContent = 'Custom';
      message = 'Hi Shivi Electronics, I need a UPS. ' + summary + ' Please advise.';
    } else {
      var s = SERIES[key];
      res.kicker.textContent = 'Recommended series';
      res.title.textContent = s.name + ' Series';
      res.phase.textContent = s.phase;
      res.range.textContent = s.min + ' – ' + s.max + ' kVA';
      res.rating.textContent = '≈ ' + Math.max(needed, s.min) + ' kVA';
      if (needed > s.max) {
        res.text.textContent = 'This load is above the standard ' + s.name + ' range. Our engineers can design a larger or parallel setup — send us your details.';
        message = 'Hi Shivi Electronics, I need a UPS above the standard ' + s.name + ' range. ' + summary + ' Please advise.';
      } else if (needed < s.min) {
        res.text.textContent = 'The smallest ' + s.name + ' unit is ' + s.min + ' kVA, which comfortably covers a ' + load + ' kVA load.';
        message = 'Hi Shivi Electronics, I am interested in the ' + s.name + ' Series UPS. ' + summary + ' Please share a quote.';
      } else {
        res.text.textContent = 'Based on your supply and load, the ' + s.name + ' Series fits. We add about 25% headroom to the load for safe, long-life operation.';
        message = 'Hi Shivi Electronics, I am interested in the ' + s.name + ' Series UPS (about ' + needed + ' kVA). ' + summary + ' Please share a quote.';
      }
    }
    res.wa.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
  }

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  update();
});
