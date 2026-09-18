/* Hero entrance animation (GSAP) — free/open-source, no Animmaster dependency.
   Runs once on page load; safe no-op if GSAP failed to load or hero isn't present. */
document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined') return;

  var hero = document.querySelector('.hero');
  if (hero) {
    gsap.set('.hero .eyebrow, .hero h1, .hero p.lead, .hero-actions, .hero-trust > div', { opacity: 0, y: 24 });
    gsap.set('.hero-visual', { opacity: 0, scale: 0.85 });
    gsap.set('.hero-badge', { opacity: 0, y: 14 });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero .eyebrow', { opacity: 1, y: 0, duration: 0.6 })
      .to('.hero h1', { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
      .to('.hero p.lead', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
      .to('.hero-trust > div', { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
      .to('.hero-visual', { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.6')
      .to('.hero-badge', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, '-=0.3');
  }

  // Same treatment for the simpler banner used on every other page
  // (about/products/services/industries/contact).
  var pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.set('.page-hero .breadcrumb, .page-hero .eyebrow, .page-hero h1, .page-hero p, .page-hero .hero-actions', { opacity: 0, y: 20 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('.page-hero .breadcrumb', { opacity: 1, y: 0, duration: 0.5 })
      .to('.page-hero .eyebrow', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .to('.page-hero h1', { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
      .to('.page-hero p', { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
      .to('.page-hero .hero-actions', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
  }
});
