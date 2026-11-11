(() => {
  const NICKNAMES = ['Ashley', 'Lumei', 'Toot', 'Tooty', 'Baobao', 'Baobei', 'Peanut'];
  let nickIdx = 0;

  const unlockedTangerines = new Set();
  let soundEnabled = true;
  let audioCtx = null;

  const prefersReducedMotion = () =>
    Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function getActiveNickname() {
    return NICKNAMES[nickIdx];
  }

  // ---------- Audio (Soft Music-Box Chimes) ----------
  function playChime(freq = 523.25, duration = 0.16, type = 'sine', delay = 0) {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!audioCtx) audioCtx = new AudioContextClass();

      const scheduleNote = () => {
        if (!soundEnabled || !audioCtx || audioCtx.state !== 'running') return;
        const now = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
      };

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          if (soundEnabled && audioCtx && audioCtx.state === 'running') {
            scheduleNote();
          }
        }).catch(() => {});
      } else {
        scheduleNote();
      }
    } catch (_) {
      // Ignore audio errors when autoplay/audio is restricted
    }
  }

  function playSparkleChord() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => playChime(f, 0.24, 'triangle', idx * 0.07));
  }

  // ---------- Confetti & Mascot Reaction Helpers ----------
  const confettiLayer = document.getElementById('confetti-layer');
  function spawnConfetti(count = 20, emojis = ['🌸', '🍊', '💛', '✨', '🌷', '🍓']) {
    if (prefersReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.left = `${Math.random() * 96 + 2}vw`;
      piece.style.top = `${-10 - Math.random() * 20}px`;
      piece.style.animationDuration = `${1.5 + Math.random() * 1.2}s`;
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 2900);
    }
  }

  function boopMascot(el, withSparkles = false) {
    if (!el) return;
    if (!prefersReducedMotion()) {
      el.classList.remove('mascot-boop');
      void el.offsetWidth;
      el.classList.add('mascot-boop');
      clearTimeout(el._boopTimer);
      el._boopTimer = setTimeout(() => el.classList.remove('mascot-boop'), 520);
    }
    if (withSparkles && !prefersReducedMotion()) {
      const symbols = ['✨', '💛', '🍊', '🌸', '🍓'];
      for (let i = 0; i < 5; i++) {
        const sp = document.createElement('span');
        sp.className = 'mascot-sparkle';
        sp.setAttribute('aria-hidden', 'true');
        sp.textContent = symbols[i % symbols.length];
        const angle = (-135 + i * 38) * (Math.PI / 180);
        const dist = 26 + (i % 2) * 14;
        sp.style.left = `${44 + (i - 2) * 12}%`;
        sp.style.top = `${26 + (i % 2) * 14}%`;
        sp.style.setProperty('--sx', `${Math.round(Math.cos(angle) * dist)}px`);
        sp.style.setProperty('--sy', `${Math.round(Math.sin(angle) * dist)}px`);
        el.appendChild(sp);
        setTimeout(() => sp.remove(), 880);
      }
    }
  }

  // ---------- HUD, Sticky Height Sync & Tangerines ----------
  const questHud = document.getElementById('quest-hud');
  function syncHudHeight() {
    if (!questHud) return;
    const h = Math.ceil(questHud.getBoundingClientRect().height) + 12;
    document.documentElement.style.setProperty('--hud-height', `${h}px`);
  }
  syncHudHeight();
  if (typeof ResizeObserver === 'function' && questHud) {
    new ResizeObserver(syncHudHeight).observe(questHud);
  }
  window.addEventListener('resize', syncHudHeight);

  const tangerinesRow = document.getElementById('tangerines-row');
  const tangerineCountEl = document.getElementById('tangerine-count');

  function renderTangerines() {
    tangerinesRow.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const slot = document.createElement('span');
      const has = unlockedTangerines.has(i);
      slot.className = `tangerine-badge-slot${has ? ' unlocked' : ''}`;
      slot.innerHTML = MascotArt.tangerineBadgeSVG(has, 23);
      slot.title = has ? `Tangerine #${i} collected!` : `Tangerine #${i} (Chapter ${i})`;
      tangerinesRow.appendChild(slot);
    }
    tangerineCountEl.textContent = `${unlockedTangerines.size}/5 Tangerines`;
  }

  function unlockTangerine(chapterNum) {
    if (unlockedTangerines.has(chapterNum)) return;
    unlockedTangerines.add(chapterNum);
    renderTangerines();
    const pill = document.querySelector(`.chap-pill[data-chap="${chapterNum}"]`);
    if (pill) pill.classList.add('done');
    playSparkleChord();
    if (unlockedTangerines.size === 5) {
      spawnConfetti(36, ['🍊', '💐', '🌸', '✨', '💛', '🎉']);
    }
  }

  // ---------- Nickname Cycler & Sound Toggle ----------
  const nicknamePill = document.getElementById('nickname-pill');
  const activeNicknameEl = document.getElementById('active-nickname');

  function refreshInlineNicknames() {
    const nick = getActiveNickname();
    activeNicknameEl.textContent = nick;
    document.querySelectorAll('.js-nick-inline').forEach((el) => {
      el.textContent = nick;
    });
  }

  nicknamePill.addEventListener('click', () => {
    nickIdx = (nickIdx + 1) % NICKNAMES.length;
    refreshInlineNicknames();
    playChime(659.25 + nickIdx * 28, 0.14);
  });

  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.setAttribute('aria-pressed', String(soundEnabled));
    soundToggleBtn.setAttribute(
      'aria-label',
      soundEnabled ? 'Toggle cute chimes (currently on)' : 'Toggle cute chimes (currently muted)'
    );
    soundIcon.textContent = soundEnabled ? '🔔' : '🔕';
    const label = soundToggleBtn.querySelector('.hide-sm');
    if (label) label.textContent = soundEnabled ? 'Chimes On' : 'Muted';
    if (soundEnabled) playChime(587.33, 0.14);
  });

  // ---------- Render Mascot SVGs & Hero Tap Delight ----------
  const heroLuluBtn = document.getElementById('hero-lulu');
  const heroLumeiBtn = document.getElementById('hero-lumei');
  const chap2Lulu = document.getElementById('chap2-lulu');
  const finaleLulu = document.getElementById('finale-lulu');

  heroLuluBtn.innerHTML = MascotArt.luluSVG('welcome', 178);
  heroLumeiBtn.innerHTML = MascotArt.lumeiSVG('happy', 148);
  document.getElementById('chap1-lulu').innerHTML = MascotArt.luluSVG('shy', 165);
  chap2Lulu.innerHTML = MascotArt.luluSVG('camera', 64);
  document.getElementById('basket-player').innerHTML = MascotArt.basketLuluSVG(84);
  document.getElementById('letter-lulu-sticker').innerHTML = MascotArt.luluSVG('holding-flowers', 68);
  document.getElementById('letter-lumei-sticker').innerHTML = MascotArt.lumeiSVG('happy', 62);
  document.getElementById('bouquet-art').innerHTML = MascotArt.bouquetSVG(210);
  finaleLulu.innerHTML = MascotArt.luluSVG('cheering', 135);
  renderTangerines();

  heroLuluBtn.addEventListener('click', () => {
    boopMascot(heroLuluBtn, true);
    playChime(659.25, 0.15);
  });

  heroLumeiBtn.addEventListener('click', () => {
    boopMascot(heroLumeiBtn, true);
    playChime(783.99, 0.15, 'triangle');
  });

  document.getElementById('start-quest-btn').addEventListener('click', () => {
    playChime(587.33, 0.18);
    document.getElementById('chapter-1').scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  });

  // ---------- Photo Modal (Accessible Focus Trap & Scroll Lock) ----------
  const photoModal = document.getElementById('photo-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalSub = document.getElementById('modal-sub');
  let lastFocusedEl = null;

  function openPhotoModal(src, caption, sub = '') {
    lastFocusedEl = document.activeElement;
    modalImg.src = src;
    modalImg.alt = caption;
    modalCaption.textContent = caption;
    modalSub.textContent = sub;
    photoModal.classList.remove('hidden');
    photoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalCloseBtn.focus({ preventScroll: true });
  }

  function closePhotoModal() {
    photoModal.classList.add('hidden');
    photoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalImg.removeAttribute('src');
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function' && document.contains(lastFocusedEl)) {
      lastFocusedEl.focus({ preventScroll: true });
    }
    lastFocusedEl = null;
  }

  modalCloseBtn.addEventListener('click', closePhotoModal);
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) closePhotoModal();
  });
  photoModal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      photoModal.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length <= 1) {
      e.preventDefault();
      if (focusables[0]) focusables[0].focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !photoModal.classList.contains('hidden')) closePhotoModal();
  });

  // ---------- CHAPTER 1: THOUGHT BUBBLE REFLECTIONS ----------
  const REFLECTIONS = [
    {
      emoji: '🎙️',
      label: 'Real Heart-to-Heart',
      title: 'A Proper Talk Instead of Texting',
      text: 'I am so sorry for ending things abruptly without giving us a real chance to talk. Next time I want a proper heart-to-heart talk instead of hiding behind online texts or running away.'
    },
    {
      emoji: '🧠',
      label: 'No ChatGPT',
      title: 'Real Thinking Ourselves, Not ChatGPT',
      text: 'No more using ChatGPT to analyze our conversations or tell us what to think. I want us to do the thinking ourselves until we truly get it, understand each other, and actually change.'
    },
    {
      emoji: '🕊️',
      label: 'Calm Conflicts',
      title: 'Zero Blame, Zero Defensiveness',
      text: 'When disagreements come up, I promise calm conflict management — zero blame, zero finger-pointing, and zero defensiveness. Just listening to Tooty first, like you always deserved.'
    },
    {
      emoji: '🌇',
      label: 'New Tiong Bahru',
      title: 'Opening Up Since New Tiong Bahru',
      text: 'From that day at New Tiong Bahru and that night where I was completely avoidant, I could have opened up and fixed it so easily. I will never shut you out of my life again.'
    },
    {
      emoji: '🥹',
      label: 'Missing Your Nagging',
      title: 'Teary Eyes & Missing Your Voice',
      text: 'Over these 3 weeks I realized how sweet, patient, and kind you were even in conflicts. OMG I missed your nagging and your voice so much haizzz — getting teary-eyed in the office like the good old days, muahaha.'
    },
    {
      emoji: '🪩',
      label: 'Marquee & Unblock',
      title: 'Marquee +1, Meetings & Unblock Day',
      text: 'Adding a +1 for the Google EOY Party at Marquee two weeks ago hoping you would go, missing Tooty right after my team meeting, and celebrating in the Google office when you unblocked me: GUYS SHE UNBLOCKED ME WHAT DOES IT MEAN LETS GOOOOO!'
    }
  ];

  const bubblesGrid = document.getElementById('bubbles-grid');
  const reflectionsBox = document.getElementById('revealed-reflections');
  const statusChap1 = document.getElementById('status-chap-1');
  const revealAllBubblesBtn = document.getElementById('reveal-all-bubbles-btn');
  const poppedBubbles = new Set();

  function popBubble(idx, btn) {
    if (poppedBubbles.has(idx)) return;
    poppedBubbles.add(idx);
    btn.classList.add('popped');
    btn.disabled = true;
    const item = REFLECTIONS[idx];
    btn.setAttribute('aria-label', `${item.label} — opened`);
    btn.innerHTML = `<span class="bubble-emoji">✨</span><span>Opened!</span>`;

    const note = document.createElement('div');
    note.className = 'reflection-note';
    note.innerHTML = `<h4>${item.emoji} ${item.title}</h4><p>${item.text}</p>`;
    reflectionsBox.appendChild(note);

    playChime(440 + idx * 55, 0.16);
    statusChap1.textContent = `${poppedBubbles.size} / ${REFLECTIONS.length} Thoughts Opened`;

    if (poppedBubbles.size === REFLECTIONS.length) {
      statusChap1.textContent = '6 / 6 Complete 🍊';
      revealAllBubblesBtn.disabled = true;
      revealAllBubblesBtn.textContent = '✨ All 6 reflections revealed';
      document.getElementById('chap1-lulu').innerHTML = MascotArt.luluSVG('welcome', 165);
      unlockTangerine(1);
    }
  }

  REFLECTIONS.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thought-bubble-btn';
    btn.setAttribute('aria-label', `${item.label} thought bubble`);
    btn.innerHTML = `<span class="bubble-emoji">${item.emoji}</span><span>${item.label}</span>`;
    btn.addEventListener('click', () => popBubble(idx, btn));
    bubblesGrid.appendChild(btn);
  });

  revealAllBubblesBtn.addEventListener('click', () => {
    revealAllBubblesBtn.disabled = true;
    const unpopped = Array.from(bubblesGrid.querySelectorAll('.thought-bubble-btn'))
      .map((btn, idx) => ({ btn, idx }))
      .filter(({ idx }) => !poppedBubbles.has(idx));

    const reduced = prefersReducedMotion();
    unpopped.forEach(({ btn, idx }, orderIdx) => {
      if (reduced) {
        popBubble(idx, btn);
      } else {
        setTimeout(() => popBubble(idx, btn), orderIdx * 160);
      }
    });
  });

  // ---------- CHAPTER 2: MEMORY POLAROID MATCH ----------
  const MEMORIES = [
    {
      id: 'couple',
      src: 'assets/photos/couple-with-you.jpg',
      caption: 'with you ♡',
      sub: 'Right next to you is still my favorite place in the entire world — missing Tooty right after every team meeting.'
    },
    {
      id: 'nus',
      src: 'assets/photos/nus-graduation.jpg',
      caption: 'So Proud! Congratulations!',
      sub: 'NUS Data Science & Analytics (Honours Highest Distinction) — the smartest, strongest woman I know, always.'
    },
    {
      id: 'tiong-bahru',
      src: 'assets/photos/tiong-bahru-chimutan.jpg',
      caption: 'Tiong Bahru · Chimutan & you 🐰',
      sub: 'Hair roller, glasses, Chimutan in a pot — Tiong Bahru and missing your cute nagging voice so much haizzz.'
    },
    {
      id: 'popcorn',
      src: 'assets/photos/caramel-popcorn.jpg',
      caption: 'Candid snack times!',
      sub: 'Holding onto that giant bag of Korean caramel popcorn like treasure — next time I am bringing two bags for Tooty!'
    },
    {
      id: 'sleeping',
      src: 'assets/photos/sleeping-zzz.jpg',
      caption: 'ZZZ... Super cute! hehe :)',
      sub: 'Peaceful sleepyhead with your signature black glasses — still makes me smile like an idiot, muahaha.'
    },
    {
      id: 'smiling',
      src: 'assets/photos/keep-smiling.jpg',
      caption: 'Keep smiling ☀️',
      sub: 'Missing your smile makes me teary-eyed in the office thinking of the good old days — keep shining, Lumei!'
    }
  ];

  const memoryGrid = document.getElementById('memory-grid');
  const keepsakeShelf = document.getElementById('keepsake-shelf');
  const statusChap2 = document.getElementById('status-chap-2');
  const goofyVault = document.getElementById('goofy-vault');
  const revealMemoryBtn = document.getElementById('reveal-memory-btn');

  let deck = [];
  let flippedIndices = [];
  let matchedIds = new Set();
  let movesCount = 0;
  let boardLocked = false;
  let mismatchTimer = null;

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function syncCardAccessibility(btn, mem, idx, state) {
    const back = btn.querySelector('.mem-back');
    const front = btn.querySelector('.mem-front');
    if (state === 'matched') {
      btn.setAttribute('aria-label', `Matched memory: ${mem.caption} — click to zoom`);
      if (back) back.setAttribute('aria-hidden', 'true');
      if (front) front.setAttribute('aria-hidden', 'false');
    } else if (state === 'flipped') {
      btn.setAttribute('aria-label', `Memory card ${idx + 1}: ${mem.caption}`);
      if (back) back.setAttribute('aria-hidden', 'true');
      if (front) front.setAttribute('aria-hidden', 'false');
    } else {
      btn.setAttribute('aria-label', `Memory card ${idx + 1}, face down`);
      if (back) back.setAttribute('aria-hidden', 'false');
      if (front) front.setAttribute('aria-hidden', 'true');
    }
  }

  function renderKeepsakeShelf() {
    keepsakeShelf.innerHTML = '';
    if (matchedIds.size === 0) {
      keepsakeShelf.innerHTML = '<p class="shelf-placeholder">Match any pair above (or press "Reveal All Memories") to pin Polaroids here!</p>';
      return;
    }
    MEMORIES.forEach((mem) => {
      if (!matchedIds.has(mem.id)) return;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'shelf-polaroid';
      card.innerHTML = `<img src="${mem.src}" alt="${mem.caption}" /><span>${mem.caption}</span>`;
      card.addEventListener('click', () => openPhotoModal(mem.src, mem.caption, mem.sub));
      keepsakeShelf.appendChild(card);
    });
  }

  function updateMemoryStatus() {
    statusChap2.textContent = `${matchedIds.size} / ${MEMORIES.length} Pairs Matched · ${movesCount} Moves`;
    if (matchedIds.size === MEMORIES.length) {
      statusChap2.textContent = '6 / 6 Matched 🍊';
      goofyVault.classList.remove('hidden');
      revealMemoryBtn.disabled = true;
      revealMemoryBtn.textContent = '📸 All 6 Memories Revealed';
      unlockTangerine(2);
    }
  }

  function initMemoryBoard() {
    clearTimeout(mismatchTimer);
    mismatchTimer = null;
    deck = shuffleArray([...MEMORIES, ...MEMORIES]);
    flippedIndices = [];
    matchedIds = new Set();
    movesCount = 0;
    boardLocked = false;
    goofyVault.classList.add('hidden');
    revealMemoryBtn.disabled = false;
    revealMemoryBtn.textContent = '📸 Reveal All Memories';
    memoryGrid.innerHTML = '';

    deck.forEach((mem, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mem-card';
      btn.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-face mem-back" aria-hidden="false">
            <span class="mem-back-icon">🍊</span>
            <span>Flip</span>
          </div>
          <div class="mem-face mem-front" aria-hidden="true">
            <img src="${mem.src}" alt="${mem.caption}" />
            <span class="mem-caption-mini">${mem.caption}</span>
          </div>
        </div>
      `;
      syncCardAccessibility(btn, mem, idx, 'facedown');
      btn.addEventListener('click', () => handleCardFlip(idx, btn));
      memoryGrid.appendChild(btn);
    });

    renderKeepsakeShelf();
    updateMemoryStatus();
  }

  function handleCardFlip(idx, btn) {
    const mem = deck[idx];
    if (btn.classList.contains('matched')) {
      openPhotoModal(mem.src, mem.caption, mem.sub);
      return;
    }
    if (boardLocked) return;
    if (btn.classList.contains('flipped')) return;

    btn.classList.add('flipped');
    syncCardAccessibility(btn, mem, idx, 'flipped');
    playChime(523.25, 0.1);
    flippedIndices.push({ idx, btn, id: mem.id, mem });

    if (flippedIndices.length < 2) return;

    movesCount += 1;
    const [first, second] = flippedIndices;

    if (first.id === second.id) {
      first.btn.classList.add('matched');
      second.btn.classList.add('matched');
      syncCardAccessibility(first.btn, first.mem, first.idx, 'matched');
      syncCardAccessibility(second.btn, second.mem, second.idx, 'matched');
      matchedIds.add(first.id);
      flippedIndices = [];
      playChime(783.99, 0.2);
      boopMascot(chap2Lulu, false);
      renderKeepsakeShelf();
      updateMemoryStatus();
    } else {
      boardLocked = true;
      clearTimeout(mismatchTimer);
      mismatchTimer = setTimeout(() => {
        first.btn.classList.remove('flipped');
        second.btn.classList.remove('flipped');
        syncCardAccessibility(first.btn, first.mem, first.idx, 'facedown');
        syncCardAccessibility(second.btn, second.mem, second.idx, 'facedown');
        flippedIndices = [];
        boardLocked = false;
        mismatchTimer = null;
      }, 720);
      updateMemoryStatus();
    }
  }

  document.getElementById('shuffle-memory-btn').addEventListener('click', initMemoryBoard);
  revealMemoryBtn.addEventListener('click', () => {
    clearTimeout(mismatchTimer);
    mismatchTimer = null;
    flippedIndices = [];
    boardLocked = false;
    const cards = memoryGrid.querySelectorAll('.mem-card');
    cards.forEach((c, idx) => {
      c.classList.add('flipped', 'matched');
      syncCardAccessibility(c, deck[idx], idx, 'matched');
    });
    MEMORIES.forEach((m) => matchedIds.add(m.id));
    boopMascot(chap2Lulu, false);
    renderKeepsakeShelf();
    updateMemoryStatus();
  });

  document.getElementById('vault-photo-btn').addEventListener('click', () => {
    openPhotoModal(
      'assets/photos/goofy-flex.jpg',
      'The “Most Most Retarded Moments” Vault 💪',
      'Thank you for laughing at my dumbest moments instead of running away — never taking a single laugh or nag for granted again, muahaha.'
    );
  });

  initMemoryBoard();

  // ---------- CHAPTER 3: CATCH THE FORGIVENESS FLOWERS ----------
  const flowerStage = document.getElementById('flower-stage');
  const basketEl = document.getElementById('basket-player');
  const startOverlay = document.getElementById('flower-start-overlay');
  const stageToast = document.getElementById('flower-stage-toast');
  const meterFill = document.getElementById('flower-meter-fill');
  const scoreLabel = document.getElementById('flower-score-label');
  const statusChap3 = document.getElementById('status-chap-3');
  const skipFlowerBtn = document.getElementById('skip-flower-game-btn');

  const GOAL_FLOWERS = 10;
  let flowerScore = 0;
  let playerXPercent = 50;
  let gameRunning = false;
  let animFrameId = null;
  let lastSpawnTime = 0;
  let lastFrameTime = 0;
  let fallingItems = [];
  let keysHeld = { left: false, right: false };
  let stageWidth = flowerStage.clientWidth || 600;
  let stageHeight = flowerStage.clientHeight || 340;

  function updateStageMetrics() {
    const rect = flowerStage.getBoundingClientRect();
    if (rect.width > 0) stageWidth = rect.width;
    if (rect.height > 0) stageHeight = rect.height;
  }

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(updateStageMetrics).observe(flowerStage);
  }
  window.addEventListener('resize', updateStageMetrics);

  const ITEM_POOL = [
    { emoji: '🌸', points: 1, label: '+1 Forgiveness Blossom' },
    { emoji: '🌷', points: 1, label: '+1 Pink Tulip for Lumei' },
    { emoji: '🌼', points: 1, label: '+1 Calm-Talk Daisy' },
    { emoji: '💐', points: 1, label: '+1 Zero-Blame Bouquet' },
    { emoji: '🍊', points: 2, label: '+2 Sweet Tangerine for Tooty!' },
    { emoji: '🍿', points: 2, label: '+2 Giant Caramel Popcorn!' },
    { emoji: '🐰', points: 2, label: '+2 Chimutan Nagging Cheer!' },
    { emoji: '🌧️', points: 0, label: 'Oops, 3-week rain cloud! Keep going!' }
  ];

  function showStageToast(msg) {
    stageToast.textContent = msg;
    stageToast.classList.add('show');
    clearTimeout(showStageToast._timer);
    showStageToast._timer = setTimeout(() => stageToast.classList.remove('show'), 1200);
  }

  function resetBasketPosition() {
    playerXPercent = 50;
    basketEl.style.left = '50%';
    keysHeld = { left: false, right: false };
  }

  function updateFlowerProgress() {
    const clamped = Math.min(flowerScore, GOAL_FLOWERS);
    const pct = (clamped / GOAL_FLOWERS) * 100;
    meterFill.style.width = `${pct}%`;
    scoreLabel.textContent = `${clamped} / ${GOAL_FLOWERS} 🌸`;
    statusChap3.textContent = clamped >= GOAL_FLOWERS
      ? '10 / 10 Bouquet Ready 🍊'
      : `${clamped} / ${GOAL_FLOWERS} Flowers Caught`;

    if (clamped >= GOAL_FLOWERS) {
      finishFlowerGame();
    }
  }

  function finishFlowerGame() {
    gameRunning = false;
    cancelAnimationFrame(animFrameId);
    fallingItems.forEach((it) => it.el.remove());
    fallingItems = [];
    resetBasketPosition();
    skipFlowerBtn.disabled = true;
    skipFlowerBtn.textContent = '💐 All 10 flowers caught — LETS GOOOOO!';
    startOverlay.classList.remove('hidden');
    startOverlay.innerHTML = `
      <p class="overlay-msg">💐 Yay! Lulu caught all 10 forgiveness flowers for <span class="js-nick-inline">${getActiveNickname()}</span> — LETS GOOOOO!</p>
      <button type="button" class="btn btn-soft" id="replay-flower-btn">🌸 Play Again</button>
    `;
    document.getElementById('replay-flower-btn').addEventListener('click', startFlowerGame);
    unlockTangerine(3);
  }

  function spawnFallingItem() {
    const pick = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.textContent = pick.emoji;
    const xPct = 8 + Math.random() * 84;
    el.style.left = `${xPct}%`;
    el.style.transform = 'translate3d(-50%, -34px, 0)';
    flowerStage.appendChild(el);
    fallingItems.push({
      el,
      xPct,
      yPx: -34,
      speed: 105 + Math.random() * 65,
      points: pick.points,
      label: pick.label
    });
  }

  function gameLoop(ts) {
    if (!gameRunning) return;
    if (!lastFrameTime) lastFrameTime = ts;
    const dt = Math.min((ts - lastFrameTime) / 1000, 0.05);
    lastFrameTime = ts;

    if (keysHeld.left) playerXPercent = Math.max(9, playerXPercent - 62 * dt);
    if (keysHeld.right) playerXPercent = Math.min(91, playerXPercent + 62 * dt);
    basketEl.style.left = `${playerXPercent}%`;

    if (ts - lastSpawnTime > 780) {
      spawnFallingItem();
      lastSpawnTime = ts;
    }

    const stageH = stageHeight || 340;
    const stageW = stageWidth || 600;
    const basketX = (playerXPercent / 100) * stageW;
    const catchTop = stageH - 86;

    for (let i = fallingItems.length - 1; i >= 0; i--) {
      const item = fallingItems[i];
      item.yPx += item.speed * dt;
      item.el.style.transform = `translate3d(-50%, ${item.yPx}px, 0)`;

      const itemX = (item.xPct / 100) * stageW;
      const caught = item.yPx >= catchTop && item.yPx <= stageH - 12 && Math.abs(itemX - basketX) < 52;

      if (caught) {
        item.el.remove();
        fallingItems.splice(i, 1);
        if (item.points > 0) {
          flowerScore = Math.min(GOAL_FLOWERS, flowerScore + item.points);
          playChime(659.25 + flowerScore * 20, 0.14);
          showStageToast(item.label);
          updateFlowerProgress();
          if (!gameRunning) break;
        } else {
          playChime(240, 0.15, 'triangle');
          basketEl.classList.remove('wobble');
          void basketEl.offsetWidth;
          basketEl.classList.add('wobble');
          showStageToast(item.label);
        }
        continue;
      }

      if (item.yPx > stageH + 30) {
        item.el.remove();
        fallingItems.splice(i, 1);
      }
    }

    if (gameRunning) animFrameId = requestAnimationFrame(gameLoop);
  }

  function startFlowerGame() {
    cancelAnimationFrame(animFrameId);
    updateStageMetrics();
    flowerScore = 0;
    fallingItems.forEach((it) => it.el.remove());
    fallingItems = [];
    lastSpawnTime = 0;
    lastFrameTime = 0;
    resetBasketPosition();
    skipFlowerBtn.disabled = false;
    skipFlowerBtn.textContent = '🌼 Let Lulu catch them all for Tooty';
    gameRunning = true;
    startOverlay.classList.add('hidden');
    updateFlowerProgress();
    flowerStage.focus({ preventScroll: true });
    animFrameId = requestAnimationFrame(gameLoop);
  }

  document.getElementById('start-flower-game-btn').addEventListener('click', startFlowerGame);
  skipFlowerBtn.addEventListener('click', () => {
    flowerScore = GOAL_FLOWERS;
    updateFlowerProgress();
  });

  function moveByPointer(clientX) {
    const rect = flowerStage.getBoundingClientRect();
    const width = rect.width || stageWidth || 600;
    const pct = ((clientX - rect.left) / width) * 100;
    playerXPercent = Math.max(9, Math.min(91, pct));
    basketEl.style.left = `${playerXPercent}%`;
  }

  flowerStage.addEventListener('pointermove', (e) => {
    if (gameRunning) moveByPointer(e.clientX);
  });
  flowerStage.addEventListener('pointerdown', (e) => {
    if (gameRunning) moveByPointer(e.clientX);
  });

  document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft') e.preventDefault();
    if (e.key === 'ArrowRight') e.preventDefault();
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysHeld.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysHeld.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysHeld.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysHeld.right = false;
  });

  const leftBtn = document.getElementById('move-left-btn');
  const rightBtn = document.getElementById('move-right-btn');

  function bindMoveArrowBtn(btn, dirKey, delta) {
    let usedPointer = false;
    btn.addEventListener('pointerdown', (e) => {
      if (!gameRunning) return;
      usedPointer = true;
      keysHeld[dirKey] = true;
      playerXPercent = Math.max(9, Math.min(91, playerXPercent + delta * 0.4));
      basketEl.style.left = `${playerXPercent}%`;
      if (typeof btn.setPointerCapture === 'function') {
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });
    const release = () => {
      keysHeld[dirKey] = false;
    };
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('lostpointercapture', release);
    btn.addEventListener('click', (e) => {
      if (!gameRunning) return;
      if (usedPointer && e.detail !== 0) {
        usedPointer = false;
        return;
      }
      usedPointer = false;
      playerXPercent = Math.max(9, Math.min(91, playerXPercent + delta));
      basketEl.style.left = `${playerXPercent}%`;
    });
  }

  bindMoveArrowBtn(leftBtn, 'left', -10);
  bindMoveArrowBtn(rightBtn, 'right', 10);

  window.addEventListener('blur', () => {
    keysHeld.left = false;
    keysHeld.right = false;
  });

  // ---------- CHAPTER 4: UNSEAL THE LETTER ----------
  const openSealBtn = document.getElementById('open-seal-btn');
  const envelopeClosed = document.getElementById('envelope-closed');
  const letterStationery = document.getElementById('letter-stationery');
  const statusChap4 = document.getElementById('status-chap-4');
  let isUnsealing = false;

  function unsealLetter() {
    if (isUnsealing || envelopeClosed.classList.contains('hidden')) return;
    isUnsealing = true;
    openSealBtn.disabled = true;
    openSealBtn.setAttribute('aria-expanded', 'true');
    envelopeClosed.classList.add('opening');

    const reveal = () => {
      envelopeClosed.classList.add('hidden');
      letterStationery.classList.remove('hidden');
      statusChap4.textContent = 'Unsealed ♡ 🍊';
      letterStationery.focus({ preventScroll: true });
      spawnConfetti(18, ['💌', '🌸', '🍊', '💛']);
      unlockTangerine(4);
    };

    if (prefersReducedMotion()) {
      reveal();
    } else {
      setTimeout(reveal, 220);
    }
  }

  envelopeClosed.addEventListener('click', unsealLetter);

  // ---------- CHAPTER 5: FINALE, CHEER BURSTS & ZERO-PRESSURE RESPONSE ----------
  const headpatBtn = document.getElementById('headpat-btn');
  const headpatCountEl = document.getElementById('headpat-count');
  const cheerCaption = document.getElementById('cheer-caption');
  let headpats = 0;

  const CHEERS = [
    'Cheer up LUMEI YOU CAN DO THIS, YOUR THE BEST LETS GOOOOOOOO! 💪✨',
    'OMG missed your nagging and your voice so much haizzz — cheering for you, Tooty! 🍊🌸',
    'Strongest, smartest, kindest woman I know — even Chimutan agrees, Ashley! 🌟',
    'Just finished my team meeting and still thinking: ughhh miss you so much Tooty! 💛',
    'Teary eyes in the office like the good old days, muahaha — love you Peanut! 🌷'
  ];

  headpatBtn.addEventListener('click', () => {
    headpats += 1;
    headpatCountEl.textContent = String(headpats);
    cheerCaption.textContent = CHEERS[(headpats - 1) % CHEERS.length];
    boopMascot(finaleLulu, false);
    playChime(587.33 + (headpats % 5) * 45, 0.16);
    spawnConfetti(12, ['✨', '💛', '🌸', '🍊']);
  });

  document.getElementById('open-collage-modal').addEventListener('click', () => {
    openPhotoModal(
      'assets/photos/collage-memories.jpg',
      `Memories with ${getActiveNickname()} · My Best Friend & Favorite Person`,
      'Tooty / Lumei / Bao Bao / Ashley — every single moment replaying in my head ♡'
    );
  });

  const responseReply = document.getElementById('response-reply');
  const statusChap5 = document.getElementById('status-chap-5');

  function getReplyHtml(choice) {
    const nick = `<strong class="js-nick-inline">${getActiveNickname()}</strong>`;
    if (choice === 'flowers') {
      return `🌸 Thank you for accepting these flowers, ${nick}. Zero ChatGPT, zero blame, and zero rush — whenever you want a real heart-to-heart talk, I am here to listen and earn back your trust honestly.`;
    }
    if (choice === 'space') {
      return `🍊 Take it as slow as you need, ${nick} — zero rush and zero pressure ever. I added that Marquee +1 because I just hope for us, never to force you. Lean on your friends whenever you feel sad, and I am right here cheering for you.`;
    }
    return `💛 Lulu blushes so hard (teary eyes like in the office, muahaha)! Thank you for visiting this little tangerine garden, ${nick} — LETS GOOOOO!`;
  }

  const CHOICE_CHIMES = { flowers: 659.25, space: 523.25, pat: 783.99 };
  const choiceBtns = document.querySelectorAll('.response-choice');
  choiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      choiceBtns.forEach((other) => {
        const active = other === btn;
        other.classList.toggle('is-selected', active);
        other.setAttribute('aria-pressed', String(active));
      });
      responseReply.innerHTML = getReplyHtml(choice);
      responseReply.classList.remove('hidden');
      statusChap5.textContent = 'Quest Complete 🍊';
      playChime(CHOICE_CHIMES[choice] || 587.33, 0.18);
      spawnConfetti(22, ['🌸', '🍊', '💛', '✨']);
      unlockTangerine(5);
    });
  });

  // ---------- BONUS TAB: ONE MORE CHANCE? (CUTE SHRINK/GROW BIT) ----------
  const chanceLulu = document.getElementById('chance-lulu');
  const chanceLumei = document.getElementById('chance-lumei');
  const chanceDialogue = document.getElementById('chance-dialogue');
  const chanceArena = document.getElementById('chance-arena');
  const chanceYesBtn = document.getElementById('chance-yes-btn');
  const chanceNoBtn = document.getElementById('chance-no-btn');
  const chanceResult = document.getElementById('chance-result');
  const chanceResetBtn = document.getElementById('chance-reset-btn');
  const statusChapChance = document.getElementById('status-chap-chance');
  const chanceTabPill = document.querySelector('.chap-pill[data-chap="chance"]');

  const CHANCE_STEPS = [
    {
      luluMood: 'pleading',
      lumeiMood: 'curious',
      dialogue: '“Will you give me a real heart-to-heart talk — no ChatGPT, no defensiveness — and one more chance to earn back your trust?”',
      yesText: "🌸 Let's have a real talk & try again",
      noText: '🤔 Hmm, not sure yet...',
      yesSize: '1.0rem',
      yesPad: '12px 22px',
      noSize: '0.98rem',
      noPad: '12px 22px',
      noBw: '2.5px',
      noOpacity: '1'
    },
    {
      luluMood: 'shy',
      lumeiMood: 'curious',
      dialogue: '“Fair, I deserve at least one side-eye first. What about coffee & a real talk — doing the thinking ourselves, zero ChatGPT?”',
      yesText: '☕ Coffee & real talk (no ChatGPT)',
      noText: '🍊 Still thinking...',
      yesSize: '1.07rem',
      yesPad: '13px 24px',
      noSize: '0.84rem',
      noPad: '9px 16px',
      noBw: '2px',
      noOpacity: '0.96'
    },
    {
      luluMood: 'shy',
      lumeiMood: 'happy',
      dialogue: '“Even after my team meeting my first thought was ‘ughhh miss you so much tooty’... what if I bring two giant caramel popcorn bags from New Tiong Bahru?”',
      yesText: '🍿 Two giant caramel popcorn bags!',
      noText: '🤨 Maybe later?',
      yesSize: '1.15rem',
      yesPad: '14px 26px',
      noSize: '0.70rem',
      noPad: '6px 12px',
      noBw: '2px',
      noOpacity: '0.92'
    },
    {
      luluMood: 'pleading',
      lumeiMood: 'curious',
      dialogue: '“Even Chimutan is glaring at me now 🐰😒 I promise calm conflict talks with zero blame, zero finger-pointing, and zero defensiveness.”',
      yesText: '🕊️ Calm talk & zero blame — deal',
      noText: '🙈 Still unsure',
      yesSize: '1.23rem',
      yesPad: '15px 28px',
      noSize: '0.56rem',
      noPad: '4px 9px',
      noBw: '1.5px',
      noOpacity: '0.88'
    },
    {
      luluMood: 'pleading',
      lumeiMood: 'curious',
      dialogue: '“Remember the +1 I added two weeks ago for the Google EOY Party at Marquee? Look how tiny this No button is already getting...”',
      yesText: '🪩 Marquee +1 & real talk? YES',
      noText: '🤏 tiny maybe',
      yesSize: '1.31rem',
      yesPad: '16px 30px',
      noSize: '0.42rem',
      noPad: '3px 7px',
      noBw: '1.5px',
      noOpacity: '0.82',
      isTiny: true
    },
    {
      luluMood: 'pleading',
      lumeiMood: 'happy',
      dialogue: '“OMG I missed your nagging and your voice so much haizzz 😭 Look, Mini Lumei even brought out her cardboard sign now!”',
      yesText: '🎙️ Come get nagged by Tooty!',
      noText: '🔬 smaller still',
      yesSize: '1.39rem',
      yesPad: '17px 32px',
      noSize: '0.30rem',
      noPad: '2px 5px',
      noBw: '1px',
      noOpacity: '0.76',
      isTiny: true
    },
    {
      luluMood: 'pleading',
      lumeiMood: 'happy',
      dialogue: '“Teary eyes in the office like the good old days, muahaha... this No button is literally 1 pixel away from disappearing!!”',
      yesText: '💛 Okay you giant goofball — YES!',
      noText: '🫧 1px away...',
      yesSize: '1.46rem',
      yesPad: '18px 34px',
      noSize: '0.22rem',
      noPad: '1px 3px',
      noBw: '1px',
      noOpacity: '0.70',
      isTiny: true
    },
    {
      luluMood: 'pleading',
      lumeiMood: 'happy',
      dialogue: '“Oops!! The No button literally shrank down to 1 single pixel (you can’t even click it now) — only Yes remains for Lumei & Lulu 🍊💛”',
      yesText: '✨ OKAY FINE, LETS HAVE A REAL TALK! 🍊',
      noText: '',
      yesSize: '1.54rem',
      yesPad: '19px 36px',
      isPixel: true
    }
  ];

  let chanceNoCount = 0;

  function renderChanceStep() {
    const step = CHANCE_STEPS[chanceNoCount];
    const isTiny = Boolean(step.isTiny);
    const isPixel = Boolean(step.isPixel);

    chanceLulu.innerHTML = MascotArt.luluSVG(step.luluMood, 162);
    chanceLumei.innerHTML = chanceNoCount >= 5
      ? MascotArt.lumeiSVG(step.lumeiMood, 146, { holdingSign: true })
      : MascotArt.lumeiSVG(step.lumeiMood, 134);
    chanceDialogue.textContent = step.dialogue;
    chanceYesBtn.textContent = step.yesText;
    chanceYesBtn.style.fontSize = step.yesSize;
    chanceYesBtn.style.padding = step.yesPad;

    chanceArena.classList.toggle('no-is-pixel', isPixel);
    chanceNoBtn.classList.toggle('is-tiny', isTiny);
    chanceNoBtn.classList.toggle('is-pixel', isPixel);

    if (isPixel) {
      const noHadFocus = document.activeElement === chanceNoBtn;
      if (noHadFocus) {
        chanceYesBtn.focus({ preventScroll: true });
      }
      chanceNoBtn.textContent = '';
      chanceNoBtn.style.removeProperty('--no-fs');
      chanceNoBtn.style.removeProperty('--no-pad');
      chanceNoBtn.style.removeProperty('--no-bw');
      chanceNoBtn.style.removeProperty('--no-op');
      chanceNoBtn.setAttribute('aria-hidden', 'true');
      chanceNoBtn.disabled = true;
      chanceNoBtn.setAttribute('aria-disabled', 'true');
      chanceNoBtn.tabIndex = -1;
      statusChapChance.textContent = 'Only 1px Left 👀';
      chanceResetBtn.classList.remove('hidden');
      return;
    }

    chanceNoBtn.disabled = false;
    chanceNoBtn.removeAttribute('aria-disabled');
    chanceNoBtn.removeAttribute('aria-hidden');
    chanceNoBtn.tabIndex = 0;
    chanceNoBtn.textContent = step.noText;
    chanceNoBtn.style.setProperty('--no-fs', step.noSize);
    chanceNoBtn.style.setProperty('--no-pad', step.noPad);
    chanceNoBtn.style.setProperty('--no-bw', step.noBw);
    chanceNoBtn.style.setProperty('--no-op', step.noOpacity);
  }

  function resetChanceSection() {
    chanceNoCount = 0;
    chanceArena.classList.remove('hidden', 'no-is-pixel');
    chanceNoBtn.classList.remove('is-tiny', 'is-pixel');
    chanceNoBtn.style.removeProperty('--no-fs');
    chanceNoBtn.style.removeProperty('--no-pad');
    chanceNoBtn.style.removeProperty('--no-bw');
    chanceNoBtn.style.removeProperty('--no-op');
    chanceNoBtn.disabled = false;
    chanceNoBtn.removeAttribute('aria-disabled');
    chanceNoBtn.removeAttribute('aria-hidden');
    chanceNoBtn.tabIndex = 0;
    chanceResult.classList.add('hidden');
    chanceResult.innerHTML = '';
    chanceResetBtn.classList.add('hidden');
    statusChapChance.textContent = 'Waiting on You 🍊';
    if (chanceTabPill) chanceTabPill.classList.remove('done');
    renderChanceStep();
  }

  chanceNoBtn.addEventListener('click', () => {
    if (chanceNoCount >= CHANCE_STEPS.length - 1) return;
    chanceNoCount += 1;
    playChime(440 - chanceNoCount * 28, 0.14, 'triangle');
    renderChanceStep();
  });

  chanceYesBtn.addEventListener('click', () => {
    chanceArena.classList.add('hidden');
    chanceLulu.innerHTML = MascotArt.luluSVG('cheering', 170);
    chanceLumei.innerHTML = MascotArt.lumeiSVG('cheering', 142);
    chanceDialogue.textContent = '“WAIT REALLY?! GUYS SHE SAID YES WHAT DOES IT MEAN LETS GOOOOO!!”';
    statusChapChance.textContent = 'LETS GOOOOO! 🎉';
    if (chanceTabPill) chanceTabPill.classList.add('done');
    chanceResult.innerHTML = `
      <p>Thank you for giving us a real heart-to-heart talk and another chance, <strong class="js-nick-inline">${getActiveNickname()}</strong> ♡ No ChatGPT, no blame, no defensiveness — just me showing up honestly and treasuring you (and your nagging) forever.</p>
      <button type="button" class="btn btn-soft copy-reply-btn" id="copy-reply-btn">
        📋 Copy quick text: "Hey Lulu 🍊 I saw your site, let's have a real talk"
      </button>
    `;
    chanceResult.classList.remove('hidden');
    chanceResetBtn.classList.remove('hidden');
    playSparkleChord();
    spawnConfetti(34, ['💛', '🌸', '🍊', '✨', '☕', '🎉']);

    const copyBtn = document.getElementById('copy-reply-btn');
    copyBtn.addEventListener('click', async () => {
      const msg = "Hey Lulu 🍊 I saw your site, let's have a real talk";
      try {
        await navigator.clipboard.writeText(msg);
        copyBtn.textContent = '✅ Copied! Ready whenever Tooty is ready';
      } catch (_) {
        copyBtn.textContent = `Message: ${msg}`;
      }
    });
  });

  chanceResetBtn.addEventListener('click', resetChanceSection);

  resetChanceSection();
})();
