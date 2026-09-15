// Shivi Electronics System — shared front-end behaviour (no backend/build step required)
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      var open = mobileNav.classList.contains('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.innerHTML = open
        ? '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
        : '<svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    });
    document.querySelectorAll('.mobile-nav .nav-item > a.nav-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var sub = link.nextElementSibling;
        if (sub && sub.classList.contains('mobile-sub')) {
          e.preventDefault();
          sub.classList.toggle('open');
        }
      });
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target < 10 ? (eased * target).toFixed(1) : Math.floor(eased * target);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- Product tabs ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('[data-tab-group]');
        if (!group) return;
        group.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        group.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var target = group.querySelector('#' + btn.getAttribute('data-tab'));
        if (target) target.classList.add('active');
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  var testiWrap = document.querySelector('.testi-wrap');
  if (testiWrap) {
    var slides = testiWrap.querySelectorAll('.testi-slide');
    var dots = testiWrap.querySelectorAll('.testi-dots button');
    var idx = 0;
    function show(i) {
      slides.forEach(function (s, si) { s.classList.toggle('active', si === i); });
      dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
      idx = i;
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); restart(); });
    });
    var timer;
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { show((idx + 1) % slides.length); }, 5500);
    }
    if (slides.length) { show(0); restart(); }
  }

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('.accordion-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Form validation (contact + service request) ---------- */
  function validateField(field) {
    var input = field.querySelector('input, select, textarea');
    if (!input) return true;
    var value = input.value.trim();
    var valid = true;

    if (input.hasAttribute('required') && !value) valid = false;
    if (valid && input.type === 'email' && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (valid && input.type === 'tel' && value) {
      valid = /^[+\d][\d\s-]{7,}$/.test(value);
    }

    field.classList.toggle('invalid', !valid);
    return valid;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = form.querySelectorAll('.field');
    fields.forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input) return;
      input.addEventListener('blur', function () { validateField(field); });
      input.addEventListener('input', function () {
        if (field.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });
      var success = form.querySelector('.form-success');
      var fail = form.querySelector('.form-fail');
      if (allValid) {
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (fail) fail.classList.remove('show');

        // Real submission via Web3Forms (https://web3forms.com) — works from
        // any static host (or even a local file), no backend needed. Each
        // form carries its own hidden access_key input.
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        }).then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || !data.success) throw new Error(data.message || ('HTTP ' + res.status));
            return data;
          });
        }).then(function () {
          if (success) {
            success.classList.add('show');
            success.setAttribute('tabindex', '-1');
            success.focus({ preventScroll: true });
          }
          form.reset();
          fields.forEach(function (f) { f.classList.remove('invalid'); });
        }).catch(function (err) {
          if (fail) {
            fail.classList.add('show');
            fail.setAttribute('tabindex', '-1');
            fail.focus({ preventScroll: true });
            // TEMPORARY diagnostic: shows the raw error so it can be read off
            // a phone screen without devtools. Remove once the Netlify Forms
            // detection issue is confirmed fixed.
            var debugEl = fail.querySelector('.form-fail-debug');
            if (!debugEl) {
              debugEl = document.createElement('div');
              debugEl.className = 'form-fail-debug';
              fail.appendChild(debugEl);
            }
            debugEl.textContent = 'Debug: ' + (err && err.message ? err.message : String(err));
          }
        }).finally(function () {
          if (submitBtn) setTimeout(function () { submitBtn.disabled = false; }, 4000);
        });
      } else {
        if (success) success.classList.remove('show');
        if (fail) fail.classList.remove('show');
        var firstInvalid = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  });

  /* ---------- Enquiry popup ---------- */
  var popupOverlay = document.getElementById('enquiryPopup');
  if (popupOverlay) {
    var popupReasonEl = document.getElementById('enquiryPopupReason');
    var popupSourceInput = popupOverlay.querySelector('input[name="source"]');
    var popupSuccess = popupOverlay.querySelector('.form-success');
    var popupCloseBtn = popupOverlay.querySelector('.enquiry-popup-close');
    var popupCloseTimer = null;

    function openPopup(reason) {
      clearTimeout(popupCloseTimer);
      var label = reason || 'Quick Enquiry';
      if (popupReasonEl) popupReasonEl.textContent = label;
      if (popupSourceInput) popupSourceInput.value = label;
      popupOverlay.hidden = false;
      requestAnimationFrame(function () { popupOverlay.classList.add('show'); });
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      popupOverlay.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(function () { popupOverlay.hidden = true; }, 200);
    }

    // Exposed so a hash-based single-file preview (which simulates page
    // changes without a real document reload) can re-trigger the same
    // "popup on every page change" behavior from its own router.
    window.openEnquiryPopup = openPopup;

    if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function (e) {
      if (e.target === popupOverlay) closePopup();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popupOverlay.classList.contains('show')) closePopup();
    });

    // Any element with data-open-enquiry="<reason label>" opens the popup
    // instead of following its href (used for "Download Brochure" and
    // "Request datasheet" links across the product catalogue).
    document.querySelectorAll('[data-open-enquiry]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPopup(el.getAttribute('data-open-enquiry'));
      });
    });

    // Auto-close a couple seconds after a successful submit inside the popup
    if (popupSuccess) {
      new MutationObserver(function () {
        if (popupSuccess.classList.contains('show')) {
          popupCloseTimer = setTimeout(closePopup, 2500);
        }
      }).observe(popupSuccess, { attributes: true, attributeFilter: ['class'] });
    }

    // Auto-show shortly after every page load/navigation
    setTimeout(function () { openPopup('Quick Enquiry'); }, 1200);
  }

  /* ---------- Active nav highlight ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.primary-nav a.nav-link, .mobile-nav a.nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.split('#')[0] === path) {
      var li = link.closest('li');
      if (li) li.classList.add('active');
    }
  });
});
