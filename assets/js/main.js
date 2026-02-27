/* =========================================================
   KELURAHAN PETAMBURAN – MAIN JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- CLOCK ---- */
  const clockEl = document.getElementById('clock-date');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', opts);
    const timeStr = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    clockEl.textContent = `${dateStr}, ${timeStr} WIB`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ---- HERO SLIDER ---- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0, autoTimer = null;

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('heroNext')?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  document.getElementById('heroPrev')?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); startAuto(); }));
  startAuto();

  /* ---- HAMBURGER / MOBILE NAV ---- */
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.querySelector('.site-header').classList.toggle('mobile-open');
  });

  /* ---- STICKY HEADER SHADOW ---- */
  window.addEventListener('scroll', () => {
    const h = document.querySelector('.site-header');
    if (h) h.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.16)' : '0 2px 16px rgba(0,0,0,.1)';
  }, { passive:true });

  /* ---- SCROLL REVEAL (intersection observer) ---- */
  const revealEls = document.querySelectorAll(
    '.news-card, .service-card, .agenda-item, .ppid-card, .layanan-detail-card, .stat-item, .sidebar-card, .pengaduan-stat-card, .alur-step, .faq-item, .timeline-item'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s`;
    observer.observe(el);
  });

  /* Trigger revealed class */
  document.head.insertAdjacentHTML('beforeend', `
    <style>.revealed { opacity:1 !important; transform:translateY(0) !important; }</style>
  `);

  /* ---- ACTIVE NAV HIGHLIGHT ---- */
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href')?.split('#')[0];
    if (href && currentPath.includes(href)) a.closest('li')?.classList.add('active');
  });

  /* ---- FORM VALIDATION (PPID) ---- */
  document.querySelectorAll('.ppid-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          inp.style.borderColor = 'var(--red-light)';
          valid = false;
        } else {
          inp.style.borderColor = '#27AE60';
        }
      });

      /* ---- Pengaduan form specific ---- */
      if (form.id === 'formPengaduan' && valid) {
        const tiketNo = 'ADU-2026-' + String(Math.floor(Math.random() * 900 + 100)).padStart(5, '0');
        showToast(`✅ Pengaduan berhasil dikirim! Nomor Tiket Anda: ${tiketNo}. Simpan nomor ini untuk melacak status.`, 'success');
        form.reset();
        return;
      }

      /* ---- Cek Status form specific ---- */
      if (form.id === 'formCekStatus' && valid) {
        const tiketInput = document.getElementById('inputTiket');
        const hasilDiv = document.getElementById('hasilTracking');
        const trackNo = document.getElementById('trackTiketNo');
        if (hasilDiv && trackNo && tiketInput) {
          trackNo.textContent = tiketInput.value.toUpperCase();
          hasilDiv.style.display = 'block';
          hasilDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast('✅ Data pengaduan ditemukan! Lihat detail di bawah.', 'success');
        }
        return;
      }

      if (valid) {
        showToast('✅ Permohonan berhasil dikirim! Tim kami akan segera menghubungi Anda.', 'success');
        form.reset();
      } else {
        showToast('⚠️ Harap lengkapi semua field yang diperlukan.', 'error');
      }
    });
  });

  /* ---- TOAST NOTIFICATION ---- */
  function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => { toast.classList.remove('toast-show'); setTimeout(() => toast.remove(), 400); }, 4000);
  }

  /* Toast CSS injected */
  document.head.insertAdjacentHTML('beforeend', `
    <style>
    .toast {
      position:fixed; bottom:28px; right:28px; z-index:9999;
      padding:14px 22px; border-radius:10px; font-size:14px; font-weight:600;
      max-width:380px; box-shadow:0 8px 32px rgba(0,0,0,.2);
      transform:translateY(20px); opacity:0; transition:all .35s ease;
    }
    .toast-show { transform:translateY(0); opacity:1; }
    .toast-success { background:#1B5E20; color:#fff; border-left:4px solid #4CAF50; }
    .toast-error   { background:#B71C1C; color:#fff; border-left:4px solid #FF5252; }
    </style>
  `);

  /* =========================================================
     ACCESSIBILITY WIDGET
     ========================================================= */
  (function initA11y() {
    const html       = document.documentElement;
    const toggle     = document.getElementById('a11yToggle');
    const headerBtn  = document.getElementById('a11yHeaderBtn');
    const panel      = document.getElementById('a11yPanel');
    const closeBtn   = document.getElementById('a11yClose');
    const btns       = document.querySelectorAll('.a11y-btn[data-action]');

    if (!toggle || !panel) return;

    // ---- Font size level (-2 to +5) ----
    let fontLevel = 0;

    // ---- Text-to-Speech state ----
    let speechActive = false;
    let speechSynth  = window.speechSynthesis;
    let hoverHandler  = null;
    let speechSupported = false;
    
    // Check speech synthesis support
    try {
      speechSupported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
      if (speechSupported && speechSynth) {
        // Ensure voices are loaded
        if (speechSynth.getVoices().length === 0) {
          speechSynth.addEventListener('voiceschanged', () => {
            console.log('Voices loaded:', speechSynth.getVoices().length);
          });
        }
      }
    } catch (e) {
      console.warn('Speech synthesis not supported:', e);
      speechSupported = false;
    }

    // ---- Load saved preferences ----
    const PREFS_KEY = 'a11y_prefs';
    function loadPrefs() {
      try {
        const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
        fontLevel = saved.fontLevel || 0;
        const classes = saved.classes || [];
        classes.forEach(c => html.classList.add(c));
        if (fontLevel !== 0) applyFontLevel(fontLevel);
        // restore button pressed states
        btns.forEach(btn => {
          const action = btn.dataset.action;
          const cls = actionToClass(action);
          if (cls && html.classList.contains(cls)) btn.setAttribute('aria-pressed', 'true');
          if (action === 'font-increase' && fontLevel > 0) btn.setAttribute('aria-pressed', 'true');
          if (action === 'font-decrease' && fontLevel < 0) btn.setAttribute('aria-pressed', 'true');
        });
      } catch(e) { /* ignore */ }
    }

    function savePrefs() {
      const classes = ['a11y-grayscale','a11y-contrast','a11y-hide-images','a11y-text-align',
                       'a11y-dyslexia','a11y-line-height','a11y-pause-animation','a11y-big-cursor',
                       'a11y-letter-spacing','a11y-underline-links']
        .filter(c => html.classList.contains(c));
      localStorage.setItem(PREFS_KEY, JSON.stringify({ fontLevel, classes }));
    }

    function actionToClass(action) {
      const map = {
        'grayscale':       'a11y-grayscale',
        'contrast':        'a11y-contrast',
        'hide-images':     'a11y-hide-images',
        'text-align':      'a11y-text-align',
        'dyslexia':        'a11y-dyslexia',
        'line-height':     'a11y-line-height',
        'pause-animation': 'a11y-pause-animation',
        'big-cursor':      'a11y-big-cursor',
        'letter-spacing':  'a11y-letter-spacing',
        'underline-links': 'a11y-underline-links',
      };
      return map[action] || null;
    }

    function applyFontLevel(level) {
      // Remove all font classes
      for (let i = -2; i <= 5; i++) {
        if (i !== 0) html.classList.remove(i > 0 ? `a11y-font-${i}` : `a11y-font--${Math.abs(i)}`);
      }
      if (level > 0)  html.classList.add(`a11y-font-${level}`);
      if (level < 0)  html.classList.add(`a11y-font--${Math.abs(level)}`);
    }

    // ---- Open / close panel ----
    function isMobile() {
      return window.innerWidth <= 768;
    }
    
    function openPanel(source = 'toggle') {
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      
      if (isMobile()) {
        // On mobile: fixed full-width panel at bottom
        panel.style.position = 'fixed';
        panel.style.top = 'auto';
        panel.style.right = '15px';
        panel.style.left = '15px';
        panel.style.bottom = '80px';
        panel.style.width = 'calc(100vw - 30px)';
        panel.style.maxHeight = '70vh';
      } else if (source === 'header') {
        // Position panel relative to header button
        panel.style.position = 'fixed';
        panel.style.top = '70px';
        panel.style.right = '20px';
        panel.style.left = 'auto';
        panel.style.bottom = 'auto';
        panel.style.width = '420px';
        panel.style.maxHeight = '85vh';
      } else {
        // Default position (relative to floating button)
        panel.style.position = 'absolute';
        panel.style.top = 'auto';
        panel.style.right = 'auto';
        panel.style.left = '0';
        panel.style.bottom = '70px';
        panel.style.width = '420px';
        panel.style.maxHeight = '85vh';
      }
      
      if (source === 'header') {
        headerBtn?.setAttribute('aria-expanded', 'true');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
      }
      closeBtn.focus();
    }
    function closePanel() {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      headerBtn?.setAttribute('aria-expanded', 'false');
      // Return focus to the button that was clicked
      const lastClicked = document.querySelector('[aria-expanded="true"]');
      if (lastClicked) lastClicked.focus();
      else toggle.focus();
    }

    toggle.addEventListener('click', () => panel.classList.contains('open') ? closePanel() : openPanel('toggle'));
    headerBtn?.addEventListener('click', () => panel.classList.contains('open') ? closePanel() : openPanel('header'));
    closeBtn.addEventListener('click', closePanel);

    // Close on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('#a11yWidget') && 
          !e.target.closest('#a11yHeaderBtn') && 
          !e.target.closest('.a11y-header-btn') &&
          panel.classList.contains('open')) {
        closePanel();
      }
    });

    // Keyboard shortcut CTRL+U
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        panel.classList.contains('open') ? closePanel() : openPanel('toggle');
      }
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });

    // ---- Button actions ----
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;

        if (action === 'reset') {
          // Reset everything
          ['a11y-grayscale','a11y-contrast','a11y-hide-images','a11y-text-align',
           'a11y-dyslexia','a11y-line-height','a11y-pause-animation','a11y-big-cursor',
           'a11y-letter-spacing','a11y-underline-links'].forEach(c => html.classList.remove(c));
          for (let i = -2; i <= 5; i++) {
            if (i !== 0) html.classList.remove(i > 0 ? `a11y-font-${i}` : `a11y-font--${Math.abs(i)}`);
          }
          fontLevel = 0;
          btns.forEach(b => b.setAttribute('aria-pressed', 'false'));
          // Stop speech
          if (speechActive) stopSpeech();
          localStorage.removeItem(PREFS_KEY);
          announceToSR('Semua pengaturan aksesibilitas telah direset.');
          return;
        }

        if (action === 'speech') {
          if (!speechSupported) {
            announceToSR('Maaf, fitur suara tidak didukung di browser ini.');
            return;
          }
          speechActive = !speechActive;
          btn.setAttribute('aria-pressed', speechActive ? 'true' : 'false');
          if (speechActive) {
            startSpeech();
            announceToSR('Mode suara aktif. Arahkan ke teks untuk dibacakan.');
          } else {
            stopSpeech();
            announceToSR('Mode suara dimatikan.');
          }
          savePrefs();
          return;
        }

        if (action === 'font-increase') {
          if (fontLevel < 5) fontLevel++;
          applyFontLevel(fontLevel);
          btn.setAttribute('aria-pressed', fontLevel > 0 ? 'true' : 'false');
          document.querySelector('[data-action="font-decrease"]')?.setAttribute('aria-pressed', fontLevel < 0 ? 'true' : 'false');
          announceToSR(`Ukuran teks diperbesar. Level ${fontLevel}`);
          savePrefs();
          return;
        }

        if (action === 'font-decrease') {
          if (fontLevel > -2) fontLevel--;
          applyFontLevel(fontLevel);
          btn.setAttribute('aria-pressed', fontLevel < 0 ? 'true' : 'false');
          document.querySelector('[data-action="font-increase"]')?.setAttribute('aria-pressed', fontLevel > 0 ? 'true' : 'false');
          announceToSR(`Ukuran teks diperkecil. Level ${fontLevel}`);
          savePrefs();
          return;
        }

        // Toggle class
        const cls = actionToClass(action);
        if (cls) {
          const isActive = html.classList.toggle(cls);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          const labels = {
            'grayscale':       isActive ? 'Skala abu-abu aktif.' : 'Skala abu-abu dimatikan.',
            'contrast':        isActive ? 'Kontras tinggi aktif.' : 'Kontras tinggi dimatikan.',
            'hide-images':     isActive ? 'Gambar disembunyikan.' : 'Gambar ditampilkan.',
            'text-align':      isActive ? 'Rata tulisan aktif.' : 'Rata tulisan dimatikan.',
            'dyslexia':        isActive ? 'Font ramah disleksia aktif.' : 'Font ramah disleksia dimatikan.',
            'line-height':     isActive ? 'Tinggi garis diperbesar.' : 'Tinggi garis normal.',
            'pause-animation': isActive ? 'Animasi dihentikan.' : 'Animasi berjalan.',
            'big-cursor':      isActive ? 'Kursor besar aktif.' : 'Kursor normal.',
            'letter-spacing':  isActive ? 'Spasi teks diperlebar.' : 'Spasi teks normal.',
            'underline-links': isActive ? 'Semua tautan digarisbawahi.' : 'Garis bawah tautan dimatikan.',
          };
          announceToSR(labels[action] || '');
          savePrefs();
        }
      });
    });

    // ---- Text-to-Speech (hover/click-to-read) ----
    function startSpeech() {
      if (!speechSupported || !speechSynth) {
        console.warn('Speech synthesis not supported');
        announceToSR('Maaf, fitur suara tidak didukung di browser ini.');
        return;
      }
      
      try { speechSynth.cancel(); } catch(e) {}
      hoverHandler = function(e) {
        try {
          const target = e.target;
          const text = (target.innerText || target.textContent || '').trim().slice(0, 300);
          if (text.length < 2) return;
          speechSynth.cancel();
          const utt = new SpeechSynthesisUtterance(text);
          utt.lang = 'id-ID';
          utt.rate = 0.95;
          utt.pitch = 1;
          // Prefer Indonesian voice
          const voices = speechSynth.getVoices();
          const idVoice = voices.find(v => v.lang.startsWith('id')) || voices.find(v => v.lang.startsWith('en'));
          if (idVoice) utt.voice = idVoice;
          utt.onerror = function(event) {
            console.warn('Speech error:', event.error);
          };
          speechSynth.speak(utt);
        } catch (error) {
          console.warn('Speech error:', error);
        }
      };
      document.body.addEventListener('mouseover', hoverHandler, { passive:true });
      // Also read touched/clicked element (for mobile)
      document.body.addEventListener('click', hoverHandler);
      // Touch support for mobile
      document.body.addEventListener('touchstart', hoverHandler, { passive:true });
    }

    function stopSpeech() {
      try { speechSynth?.cancel(); } catch(e) {}
      speechActive = false;
      if (hoverHandler) {
        document.body.removeEventListener('mouseover', hoverHandler);
        document.body.removeEventListener('click', hoverHandler);
        document.body.removeEventListener('touchstart', hoverHandler);
        hoverHandler = null;
      }
    }

    // ---- Announce to screen reader via live region ----
    function announceToSR(msg) {
      let live = document.getElementById('a11y-sr-live');
      if (!live) {
        live = document.createElement('div');
        live.id = 'a11y-sr-live';
        live.setAttribute('aria-live', 'polite');
        live.setAttribute('aria-atomic', 'true');
        live.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';
        document.body.appendChild(live);
      }
      live.textContent = '';
      requestAnimationFrame(() => { live.textContent = msg; });
    }

    // ---- Add skip-to-content link if not exists ----
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Lewati ke konten utama';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    // Add id to main content area if missing
    const mainContent = document.querySelector('.main-content, main, .page-wrapper');
    if (mainContent && !mainContent.id) mainContent.id = 'main-content';

    // ---- Reposition panel on resize/orientation change ----
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (panel.classList.contains('open')) {
          // Re-open to recalculate position for new screen size
          const source = headerBtn?.getAttribute('aria-expanded') === 'true' ? 'header' : 'toggle';
          openPanel(source);
        }
      }, 250);
    });

    // ---- Handle touch events for mobile accessibility ----
    if ('ontouchstart' in window) {
      // Make toggle button work with touch
      toggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        panel.classList.contains('open') ? closePanel() : openPanel('toggle');
      }, { passive: false });
      
      if (headerBtn) {
        headerBtn.addEventListener('touchend', function(e) {
          e.preventDefault();
          panel.classList.contains('open') ? closePanel() : openPanel('header');
        }, { passive: false });
      }
    }

    loadPrefs();
  })();

});
