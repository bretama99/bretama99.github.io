(function () {
  'use strict';

  /* ---- helpers ---- */
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.from(document.querySelectorAll(sel)); };
  var root = document.documentElement;

  /* ================================================
     YEAR
     ============================================== */
  var footYear = $('#foot-year');
  if (footYear) footYear.textContent = new Date().getFullYear();

  /* ================================================
     THEME
     ============================================== */
  var themeBtn  = $('#theme-btn');
  var themeIcon = $('#theme-icon');
  var metaTc    = $('#meta-tc');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('btg-theme', t); } catch (e) {}
    if (themeIcon) themeIcon.textContent = t === 'dark' ? '☀' : '☾';
    if (metaTc)    metaTc.content = t === 'dark' ? '#040c18' : '#f1f6fc';
  }

  /* Sync icon to whatever theme is currently set */
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ================================================
     SCROLL PROGRESS
     ============================================== */
  var progressBar = $('#progress-bar');
  function updateProgress() {
    if (!progressBar) return;
    var scrolled = window.scrollY;
    var total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrolled / total * 100));
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ================================================
     MOBILE NAV
     ============================================== */
  var hamburger = $('#nav-hamburger');
  var siteNav   = $('#site-nav');

  function setNavOpen(open) {
    if (!siteNav || !hamburger) return;
    siteNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setNavOpen(!siteNav.classList.contains('open'));
    });
  }
  if (siteNav) {
    siteNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNavOpen(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNavOpen(false);
  });

  /* ================================================
     SCROLLSPY
     ============================================== */
  var navLinks = $$('.nav-link');
  var sections = navLinks.map(function (l) {
    var id = (l.getAttribute('href') || '').replace('#', '');
    return { link: l, el: document.getElementById(id) };
  }).filter(function (s) { return s.el; });

  function updateSpy() {
    var offset = 110;
    var active = null;
    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top - offset <= 0) active = s;
    });
    navLinks.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
    if (active) { active.link.classList.add('active'); active.link.setAttribute('aria-current', 'page'); }
  }
  window.addEventListener('scroll', updateSpy, { passive: true });
  window.addEventListener('resize', updateSpy);
  updateSpy();

  /* ================================================
     SCROLL REVEAL
     ============================================== */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ================================================
     COUNTER ANIMATION
     ============================================== */
  function animateCount(el) {
    var target   = parseInt(el.dataset.count, 10) || 0;
    var suffix   = el.dataset.suffix || '';
    var duration = 1400;
    var startTs  = null;
    function step(ts) {
      if (!startTs) startTs = ts;
      var progress = Math.min((ts - startTs) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countEls = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animateCount(e.target);
          countIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { countIO.observe(el); });
  }

  /* ================================================
     PROFILE IMAGE FALLBACK
     ============================================== */
  var profileImg = $('.profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', function () {
      profileImg.classList.add('img-hide');
    });
  }

  /* ================================================
     NEURAL NETWORK CANVAS
     ============================================== */
  var canvas = $('#hero-canvas');
  if (!canvas) return;

  var ctx       = canvas.getContext('2d');
  var nodes     = [];
  var N         = 60;
  var MAX_DIST  = 145;
  var animFrame = null;
  var stopped   = false;

  /* Respect prefers-reduced-motion */
  var prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }

  function makeNode() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      (Math.random() - 0.5) * 0.32,
      vy:      (Math.random() - 0.5) * 0.32,
      r:       Math.random() * 1.6 + 0.7,
      opacity: Math.random() * 0.45 + 0.25
    };
  }

  function initNodes() {
    resize();
    nodes = [];
    for (var i = 0; i < N; i++) nodes.push(makeNode());
  }

  function draw() {
    if (stopped) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var isDark    = root.getAttribute('data-theme') !== 'light';
    var nodeRGB   = isDark ? '13,232,207'  : '10,172,152';
    var lineRGB   = isDark ? '13,232,207'  : '10,172,152';

    /* Connections */
    var len = nodes.length;
    for (var i = 0; i < len; i++) {
      for (var j = i + 1; j < len; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          var alpha = (1 - d / MAX_DIST) * (isDark ? 0.13 : 0.09);
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + lineRGB + ',' + alpha + ')';
          ctx.lineWidth   = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* Nodes */
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + nodeRGB + ',' + n.opacity + ')';
      ctx.fill();

      if (!prefersReduced) {
        n.x += n.vx;
        n.y += n.vy;
        /* Wrap edges */
        if (n.x < -8)                 n.x = canvas.width  + 8;
        else if (n.x > canvas.width  + 8) n.x = -8;
        if (n.y < -8)                 n.y = canvas.height + 8;
        else if (n.y > canvas.height + 8) n.y = -8;
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  /* Debounced resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      initNodes();
    }, 200);
  });

  /* Page visibility — pause when hidden */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopped = true;
      cancelAnimationFrame(animFrame);
    } else {
      stopped = false;
      draw();
    }
  });

  initNodes();
  draw();

})();