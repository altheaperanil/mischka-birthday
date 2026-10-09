/* ============================================================
   Mishka's Birthday Website — Main Logic
   You should not need to edit this file for content changes.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }
  function show(el) { el && el.classList.remove('hidden'); }
  function hide(el) { el && el.classList.add('hidden'); }

    function isRealUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const t = url.trim();
    if (!t) return false;
    if (t.indexOf('PASTE_YOUR_') === 0) return false;
    if (t.endsWith('/') && !t.includes('.')) return false;
    return true;
  }

  function getYouTubeId(url) {
    if (!isRealUrl(url)) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname === '/watch') return u.searchParams.get('v');
        if (u.pathname.indexOf('/embed/') === 0) return u.pathname.split('/')[2];
        if (u.pathname.indexOf('/shorts/') === 0) return u.pathname.split('/')[2];
      }
    } catch (e) { return null; }
    return null;
  }

  /* Render **bold** segments inside text */
  function renderWithBold(text) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map(function (p) {
      if (p.indexOf('**') === 0 && p.lastIndexOf('**') === p.length - 2) {
        const s = document.createElement('strong');
        s.textContent = p.slice(2, -2);
        return s;
      }
      return document.createTextNode(p);
    });
  }

  /* ---------- Confetti ---------- */
  const CONFETTI_COLORS = ['#FFB7D5', '#B7E2F7', '#FFF3C4', '#E0C7F5', '#FFD9B7', '#FF9EC7', '#FFFFFF'];
  function launchConfetti(count, duration) {
    count = count || 80;
    duration = duration || 2400;
    const layer = $('#confettiLayer');
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 8;
      const drift = (Math.random() - 0.5) * 260;
      piece.style.left = (Math.random() * 100) + '%';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.animationDuration = duration + 'ms';
      piece.style.setProperty('--drift', drift + 'px');
      layer.appendChild(piece);
      setTimeout(function () { piece.remove(); }, duration + 800);
    }
  }

  /* ---------- Opening Screen ---------- */
  function initOpening() {
    const hearts = $('#openingHearts');
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.className = 'float-heart h' + (i % 7);
      s.textContent = '♡';
      s.style.left = ((i * 7 + 4) % 96) + '%';
      s.style.animationDelay = (i * 0.4) + 's';
      hearts.appendChild(s);
    }
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'float-star s' + (i % 5);
      s.textContent = '✦';
      s.style.left = ((i * 11 + 6) % 92) + '%';
      s.style.animationDelay = (i * 0.55) + 's';
      hearts.appendChild(s);
    }

    const btn = $('#openSurpriseBtn');
    const box = $('#giftBox');
    const opening = $('#opening');
    const site = $('#site');

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Opening… ✨';
      box.classList.add('opening');
      launchConfetti(90, 2200);

      setTimeout(function () {
        hide(opening);
        show(site);
        document.body.style.overflow = 'auto';
        window.scrollTo(0, 0);
      }, 1600);
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const toggle = $('#navToggle');
    const nav = $('#nav');
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    $$('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Letter ---------- */
  function initLetter() {
    const headingEl = $('#letterHeading');
    const bodyEl = $('#letterBody');
    const sig1 = $('#letterSig1');
    const sig2 = $('#letterSig2');

    headingEl.textContent = BIRTHDAY.letter.heading;

    BIRTHDAY.letter.paragraphs.forEach(function (p) {
      const el = document.createElement('p');
      const nodes = renderWithBold(p);
      nodes.forEach(function (n) { el.appendChild(n); });
      bodyEl.appendChild(el);
    });

    const sig = BIRTHDAY.letter.signature.split('\n');
    sig1.textContent = sig[0] || '';
    sig2.textContent = sig[1] || '';

    const closed = $('#letterClosed');
    const open = $('#letterOpen');
    function reveal() {
      hide(closed);
      show(open);
      launchConfetti(40, 1600);
    }
    $('#openLetterBtn').addEventListener('click', reveal);
    $('#openLetterBtn2').addEventListener('click', reveal);
  }

  /* ---------- Gallery + Lightbox ---------- */
  let galleryIndex = -1;
  function initGallery() {
    const grid = $('#galleryGrid');
    BIRTHDAY.photos.forEach(function (p, i) {
      const btn = document.createElement('button');
      btn.className = 'photo-frame tilt-' + (i % 4);
      btn.setAttribute('aria-label', 'Open photo ' + (i + 1));

      const inner = document.createElement('div');
      inner.className = 'photo-inner';

      if (isRealUrl(p.url)) {
        const img = document.createElement('img');
        img.src = p.url;
        img.alt = p.caption || ('Photo ' + (i + 1));
        img.loading = 'lazy';
        img.onerror = function () {
          inner.innerHTML = placeholderHTML(i);
        };
        inner.appendChild(img);
      } else {
        inner.innerHTML = placeholderHTML(i);
      }

      const cap = document.createElement('div');
      cap.className = 'photo-caption';
      cap.textContent = p.caption || '';

      btn.appendChild(inner);
      btn.appendChild(cap);
      btn.addEventListener('click', function () { openLightbox(i); });
      grid.appendChild(btn);
    });

    const closeBtn = $('#lightboxClose');
    const prevBtn = $('#lightboxPrev');
    const nextBtn = $('#lightboxNext');
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(-1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); stepLightbox(1); });
    $('#lightbox').addEventListener('click', function (e) {
      if (e.target.id === 'lightbox') closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (galleryIndex < 0) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    });
  }

  function placeholderHTML(i) {
    return '<div class="photo-placeholder">' +
      '<span class="ph-emoji">🎀</span>' +
      '<span class="ph-label">Photo ' + (i + 1) + '</span>' +
      '<span class="ph-hint">Replace image link</span>' +
      '</div>';
  }

  function openLightbox(i) {
    galleryIndex = i;
    renderLightbox();
    show($('#lightbox'));
  }
  function closeLightbox() {
    galleryIndex = -1;
    hide($('#lightbox'));
  }
  function stepLightbox(dir) {
    if (galleryIndex < 0) return;
    galleryIndex = (galleryIndex + dir + BIRTHDAY.photos.length) % BIRTHDAY.photos.length;
    renderLightbox();
  }
  function renderLightbox() {
    const p = BIRTHDAY.photos[galleryIndex];
    const media = $('#lightboxMedia');
    media.innerHTML = '';
    if (isRealUrl(p.url)) {
      const img = document.createElement('img');
      img.src = p.url;
      img.alt = p.caption || '';
      img.onerror = function () { media.innerHTML = '<div class="photo-placeholder large"><span class="ph-emoji">🎀</span><span class="ph-label">Photo ' + (galleryIndex + 1) + '</span><span class="ph-hint">Replace image link in content.js</span></div>'; };
      media.appendChild(img);
    } else {
      media.innerHTML = '<div class="photo-placeholder large"><span class="ph-emoji">🎀</span><span class="ph-label">Photo ' + (galleryIndex + 1) + '</span><span class="ph-hint">Replace image link in content.js</span></div>';
    }
    $('#lightboxCaption').textContent = p.caption || '';
  }

  /* ---------- Video ---------- */
  function initVideo() {
    const frame = $('#videoFrame');
    const url = BIRTHDAY.video.url;
    const ytId = getYouTubeId(url);
    const isMp4 = isRealUrl(url) && /\.(mp4|webm|ogg)(\?|$)/i.test(url);
    const hasThumb = isRealUrl(BIRTHDAY.video.thumbnail);

    $('#videoCaption').textContent = BIRTHDAY.video.caption;

    if (ytId) {
      frame.innerHTML =
        '<div class="video-responsive">' +
        '<iframe src="https://www.youtube.com/embed/' + ytId + '" title="Birthday video" ' +
        'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '</div>';
      return;
    }
    if (isMp4) {
      frame.innerHTML =
        '<div class="video-responsive">' +
        '<video controls ' + (hasThumb ? 'poster="' + BIRTHDAY.video.thumbnail + '"' : '') + '>' +
        '<source src="' + url + '">Your browser does not support the video tag.' +
        '</video>' +
        '</div>';
      return;
    }

    // Placeholder
    frame.innerHTML =
      '<div class="video-placeholder">' +
      (hasThumb ? '<img class="video-thumb" src="' + BIRTHDAY.video.thumbnail + '" alt="">' : '<div class="video-placeholder-art">🎬</div>') +
      '<div class="video-placeholder-text">' +
      '<p class="vp-title">Your Birthday Video Goes Here ♡</p>' +
      '<p class="vp-hint">A special little video is waiting to be added here!</p>' +
      '</div>' +
      '<button class="play-btn" disabled aria-label="Play button (video not added yet)">▶</button>' +
      '</div>';
  }

  /* ---------- Cake ---------- */
  const TOTAL_CANDLES = 11;
  function initCake() {
    const candlesWrap = $('#candles');
    const cakeButtons = $('#cakeButtons');
    const cakeCelebrate = $('#cakeCelebrate');
    let lit = [];

    function buildCandles() {
      candlesWrap.innerHTML = '';
      lit = [];
      for (let i = 0; i < TOTAL_CANDLES; i++) {
        lit.push(true);
        const c = document.createElement('div');
        c.className = 'candle lit';
        c.innerHTML =
          '<span class="flame"></span>' +
          '<span class="wick"></span>' +
          '<span class="candle-body"></span>';
        candlesWrap.appendChild(c);
      }
    }

    function updateUI() {
      const nodes = candlesWrap.children;
      let remaining = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (lit[i]) {
          nodes[i].classList.add('lit');
          nodes[i].classList.remove('out');
          remaining++;
        } else {
          nodes[i].classList.remove('lit');
          nodes[i].classList.add('out');
        }
      }
      const oneBtn = $('#blowOneBtn');
      oneBtn.textContent = 'Blow One Candle 🕯️ (' + remaining + ' left)';
      oneBtn.disabled = remaining === 0;

      if (remaining === 0) {
        hide(cakeButtons);
        show(cakeCelebrate);
        launchConfetti(80, 2800);
      }
    }

    function reset() {
      buildCandles();
      show(cakeButtons);
      hide(cakeCelebrate);
      updateUI();
    }

    $('#blowOneBtn').addEventListener('click', function () {
      const idx = lit.indexOf(true);
      if (idx === -1) return;
      lit[idx] = false;
      updateUI();
    });

    $('#blowAllBtn').addEventListener('click', function () {
      for (let i = 0; i < lit.length; i++) lit[i] = false;
      updateUI();
    });

    $('#resetCakeBtn').addEventListener('click', reset);

    buildCandles();
    updateUI();
  }

  /* ---------- Balloon Popping Game ---------- */
  function initBalloons() {
    const stage = $('#balloonStage');
    const counter = $('#balloonCounter');
    const winEl = $('#balloonWin');
    const resetBtn = $('#balloonResetBtn');
    const confettiLayer = $('#balloonConfettiLayer');

    const balloons = BIRTHDAY.balloons || [];
    const total = balloons.length;
    let popped = 0;

    /* Scatter balloons randomly around the stage — no overlap */
    function randomPositions(n) {
      const positions = [];
      const maxAttempts = 200;
      for (let i = 0; i < n; i++) {
        let placed = false;
        for (let a = 0; a < maxAttempts && !placed; a++) {
          const pos = {
            left: 6 + Math.random() * 78,
            top: 6 + Math.random() * 68,
          };
          let ok = true;
          for (let j = 0; j < positions.length; j++) {
            const dx = Math.abs(positions[j].left - pos.left);
            const dy = Math.abs(positions[j].top - pos.top);
            if (dx < 14 && dy < 20) { ok = false; break; }
          }
          if (ok) {
            positions.push(pos);
            placed = true;
          }
        }
        if (!placed) {
          const cols = 4;
          positions.push({
            left: 6 + (i % cols) * 23,
            top: 6 + Math.floor(i / cols) * 24,
          });
        }
      }
      return positions;
    }

    function buildBalloons() {
      stage.querySelectorAll('.balloon').forEach(function (b) { b.remove(); });
      stage.querySelectorAll('.balloon-photo-card').forEach(function (b) { b.remove(); });
      popped = 0;
      counter.textContent = '0 / ' + total + ' popped';
      hide(winEl);

      const positions = randomPositions(total);

      balloons.forEach(function (data, i) {
        const btn = document.createElement('button');
        btn.className = 'balloon';
        btn.setAttribute('aria-label', 'Pop balloon ' + (i + 1));
        btn.style.left = positions[i].left + '%';
        btn.style.top = positions[i].top + '%';
        btn.style.setProperty('--balloon-color', data.color || '#FFB7D5');
        btn.style.animationDelay = (Math.random() * 2) + 's';
        btn.style.animationDuration = (3 + Math.random() * 2) + 's';
        btn.dataset.photo = data.photo || '';
        btn.dataset.caption = data.caption || '';
        btn.dataset.index = i;

        btn.innerHTML =
          '<span class="balloon-body">' +
            '<span class="balloon-highlight"></span>' +
          '</span>' +
          '<span class="balloon-knot"></span>' +
          '<span class="balloon-string"></span>' +
          '<span class="balloon-number">' + (i + 1) + '</span>';

        btn.addEventListener('click', function () { popBalloon(btn); });
        stage.appendChild(btn);
      });
    }

    function popBalloon(btn) {
      if (btn.classList.contains('popped')) return;
      btn.classList.add('popped');
      popped++;
      counter.textContent = popped + ' / ' + total + ' popped';

      /* Balloon location on the stage */
      const rect = btn.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const x = rect.left - stageRect.left + rect.width / 2;
      const y = rect.top - stageRect.top + rect.height / 2;

      /* Sparkle burst */
      for (let i = 0; i < 14; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'balloon-sparkle';
        sparkle.textContent = ['✨', '⭐', '💛', '💗', '🌟'][i % 5];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        const angle = (Math.PI * 2 * i) / 14;
        const dist = 50 + Math.random() * 60;
        sparkle.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        sparkle.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        confettiLayer.appendChild(sparkle);
        setTimeout(function () { sparkle.remove(); }, 1300);
      }

      /* Show the photo card where the balloon was */
      showPhotoCard(btn, x, y);

      /* All popped → celebrate */
      if (popped >= total) {
        setTimeout(showWin, 1400);
      }
    }

    function showPhotoCard(btn, x, y) {
      const photoUrl = btn.dataset.photo;
      const caption = btn.dataset.caption;
      const idx = parseInt(btn.dataset.index, 10) + 1;

      const card = document.createElement('div');
      card.className = 'balloon-photo-card';

      /* Keep the card within the stage bounds */
      const stageW = stage.clientWidth;
      const stageH = stage.clientHeight;
      const cardW = 180;
      const cardH = 220;
      let leftPx = x - cardW / 2;
      let topPx = y - cardH / 2;
      leftPx = Math.max(8, Math.min(stageW - cardW - 8, leftPx));
      topPx = Math.max(8, Math.min(stageH - cardH - 8, topPx));
      card.style.left = leftPx + 'px';
      card.style.top = topPx + 'px';

      /* Photo content */
      if (isRealUrl(photoUrl)) {
        const media = document.createElement('div');
        media.className = 'balloon-photo-media';
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = caption || ('Photo ' + idx);
        img.onerror = function () {
          media.innerHTML = photoPlaceholderHTML(idx);
        };
        media.appendChild(img);
        card.appendChild(media);
      } else {
        const media = document.createElement('div');
        media.className = 'balloon-photo-media';
        media.innerHTML = photoPlaceholderHTML(idx);
        card.appendChild(media);
      }

      if (caption) {
        const cap = document.createElement('p');
        cap.className = 'balloon-photo-caption';
        cap.textContent = caption;
        card.appendChild(cap);
      }

      stage.appendChild(card);

      /* Auto-fade the card after a while so the sky doesn't clutter */
      setTimeout(function () {
        card.classList.add('fade-out');
        setTimeout(function () { card.remove(); }, 600);
      }, 2800);
    }

    function photoPlaceholderHTML(idx) {
      return '<div class="balloon-photo-placeholder">' +
        '<span class="bpp-emoji">📸</span>' +
        '<span class="bpp-label">Photo ' + idx + '</span>' +
        '<span class="bpp-hint">Replace image link</span>' +
        '</div>';
    }

    function showWin() {
      show(winEl);
      launchConfetti(120, 3200);
      for (let i = 0; i < 20; i++) {
        const s = document.createElement('span');
        s.className = 'balloon-sparkle';
        s.textContent = ['🎈', '🎉', '✨', '💗', '⭐'][i % 5];
        s.style.left = (Math.random() * 100) + '%';
        s.style.top = '100%';
        s.style.setProperty('--dx', ((Math.random() - 0.5) * 100) + 'px');
        s.style.setProperty('--dy', (-250 - Math.random() * 150) + 'px');
        s.style.fontSize = '1.6rem';
        confettiLayer.appendChild(s);
        setTimeout(function () { s.remove(); }, 2200);
      }
    }

    resetBtn.addEventListener('click', buildBalloons);

    buildBalloons();
  }

  /* ---------- Memory Game ---------- */
  function initGame() {
    const EMOJIS = ['🌸', '🎀', '🌷', '⭐', '🍰', '💗', '🐻', '☁️'];
    const grid = $('#gameGrid');
    const movesEl = $('#movesCount');
    const winEl = $('#gameWin');
    const winMsg = $('#gameWinMsg');

    let deck = [];
    let flipped = [];
    let moves = 0;
    let lock = false;

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    function buildDeck() {
      const pairSet = shuffle(EMOJIS).slice(0, 6);
      const d = pairSet.concat(pairSet).map(function (emoji) {
        return { emoji: emoji, matched: false };
      });
      return shuffle(d);
    }
    function render() {
      grid.innerHTML = '';
      deck.forEach(function (card, i) {
        const btn = document.createElement('button');
        btn.className = 'game-card';
        if (card.matched || flipped.indexOf(i) !== -1) btn.classList.add('revealed');
        if (card.matched) btn.classList.add('matched');
        btn.setAttribute('aria-label', btn.classList.contains('revealed') ? 'Card showing ' + card.emoji : 'Hidden card');
        btn.innerHTML = '<span class="card-inner"><span class="card-front">♡</span><span class="card-back">' + card.emoji + '</span></span>';
        btn.addEventListener('click', function () { flip(i); });
        grid.appendChild(btn);
      });
      movesEl.textContent = moves;
    }
    function flip(i) {
      if (lock) return;
      if (deck[i].matched) return;
      if (flipped.indexOf(i) !== -1) return;
      if (flipped.length >= 2) return;
      flipped.push(i);
      render();
      if (flipped.length === 2) {
        lock = true;
        const a = flipped[0], b = flipped[1];
        moves++;
        movesEl.textContent = moves;
        if (deck[a].emoji === deck[b].emoji) {
          setTimeout(function () {
            deck[a].matched = true;
            deck[b].matched = true;
            flipped = [];
            lock = false;
            render();
            checkWin();
          }, 500);
        } else {
          setTimeout(function () {
            flipped = [];
            lock = false;
            render();
          }, 900);
        }
      }
    }
    function checkWin() {
      const won = deck.every(function (c) { return c.matched; });
      if (won) {
        winMsg.textContent = 'You matched them all in ' + moves + ' moves! You\'re amazing, Kuchi! 🌟';
        show(winEl);
        launchConfetti(60, 2200);
      }
    }
    function restart() {
      deck = buildDeck();
      flipped = [];
      moves = 0;
      lock = false;
      hide(winEl);
      render();
    }
    $('#restartGameBtn').addEventListener('click', restart);
    $('#playAgainBtn').addEventListener('click', restart);

    restart();
  }

  /* ---------- Final Surprise: Star Lanterns ---------- */
  function initFinal() {
    const skyStage = $('#skyStage');
    const firstLanternBtn = $('#firstLanternBtn');
    const skyCollection = $('#skyCollection');
    const skyLanterns = $('#skyLanterns');
    const lanternModal = $('#lanternModal');
    const lanternModalInner = $('#lanternModal .lantern-modal-inner');
    const lanternModalText = $('#lanternModalText');
    const lanternModalClose = $('#lanternModalClose');
    const skyFinale = $('#skyFinale');
    const skyInstruction = $('.sky-instruction');

    const wishes = BIRTHDAY.starWishes || [];
    const finaleMsg = BIRTHDAY.finalLanternMessage || {};

    let openedCount = 0;
    const totalLanterns = wishes.length;

    const starsWrap = $('#skyStars');
    for (let i = 0; i < 55; i++) {
      const dot = document.createElement('span');
      dot.className = 'sky-dot';
      dot.style.left = (Math.random() * 100) + '%';
      dot.style.top = (Math.random() * 100) + '%';
      dot.style.animationDelay = (Math.random() * 2.4) + 's';
      const size = 2 + Math.random() * 2.5;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      starsWrap.appendChild(dot);
    }

    function buildSkyLanterns() {
      skyLanterns.innerHTML = '';
      openedCount = 0;

      wishes.forEach(function (wish, i) {
        const btn = document.createElement('button');
        btn.className = 'mini-lantern';
        btn.setAttribute('aria-label', 'Read lantern wish ' + (i + 1));
        btn.innerHTML =
          '<span class="mini-body"></span>' +
          '<span class="mini-base"></span>';

        const col = i % 5;
        const row = Math.floor(i / 5);
        const leftPct = 6 + col * 19 + (Math.random() * 6 - 3);
        const topPct = 10 + row * 28 + (Math.random() * 10);
        btn.style.left = leftPct + '%';
        btn.style.top = topPct + '%';
        btn.style.animationDelay = (Math.random() * 3) + 's';
        btn.style.animationDuration = (4 + Math.random() * 2) + 's';

        btn.addEventListener('click', function () {
          openLanternWish(wish, btn);
        });
        skyLanterns.appendChild(btn);
      });

      if (skyInstruction) {
        skyInstruction.textContent = 'Tap any lantern to read a wish ♡ (0/' + totalLanterns + ')';
      }
    }

    function openLanternWish(text, lanternEl) {
      lanternModalText.textContent = text;
      show(lanternModal);

      lanternModalInner.style.animation = 'none';
      void lanternModalInner.offsetWidth;
      lanternModalInner.style.animation = '';

      if (lanternEl && !lanternEl.classList.contains('opened')) {
        lanternEl.classList.add('opened');
        openedCount++;
        if (skyInstruction) {
          skyInstruction.textContent = 'Tap any lantern to read a wish ♡ (' + openedCount + '/' + totalLanterns + ')';
        }
        if (openedCount >= totalLanterns) {
          setTimeout(showFinale, 800);
        }
      }
    }

    function closeLanternModal() { hide(lanternModal); }

    lanternModalClose.addEventListener('click', closeLanternModal);
    lanternModal.addEventListener('click', function (e) {
      if (e.target === lanternModal) closeLanternModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lanternModal.classList.contains('hidden')) {
        closeLanternModal();
      }
    });

    firstLanternBtn.addEventListener('click', function () {
      launchConfetti(80, 2600);
      skyStage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      skyStage.style.opacity = '0';
      skyStage.style.transform = 'scale(0.92)';

      setTimeout(function () {
        hide(skyStage);
        show(skyCollection);
        buildSkyLanterns();
      }, 650);
    });

    function showFinale() {
      $('#finaleLine1').textContent = finaleMsg.line1 || '';
      $('#finaleLine2').textContent = finaleMsg.line2 || '';
      $('#finaleLine3').textContent = finaleMsg.line3 || '';
      $('#finaleSig').textContent = finaleMsg.signature || '';

      hide(skyCollection);
      show(skyFinale);

      launchConfetti(140, 4000);

      for (let i = 0; i < 18; i++) {
        const s = document.createElement('span');
        s.className = 'final-float';
        s.textContent = ['✨', '🌟', '♡', '💛', '⭐'][i % 5];
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * 2.5) + 's';
        s.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
        skyFinale.appendChild(s);
        setTimeout(function () { s.remove(); }, 6500);
      }
    }

    $('#replayBtn').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () {
        hide(skyFinale);
        hide(skyCollection);
        show(skyStage);
        skyStage.style.opacity = '';
        skyStage.style.transform = '';
        openedCount = 0;
      }, 700);
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.style.overflow = 'hidden';
    initOpening();
    initNav();
    initLetter();
    initGallery();
    initVideo();
    initCake();
    initBalloons();
    initGame();
    initFinal();
  });

})();