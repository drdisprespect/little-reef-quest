(() => {
  const NICKNAMES = ['Ashley', 'Lumei', 'Toot', 'Tooty', 'Baobao', 'Baobei', 'Peanut'];
  let nickIdx = 0;

  const unlockedShells = new Set();
  let soundEnabled = true;
  let audioCtx = null;

  // ---------- Audio (Soft Music-Box Chimes) ----------
  function playChime(freq = 523.25, duration = 0.16, type = 'sine', delay = 0) {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();
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
    } catch (_) {
      // Ignore audio errors when autoplay/audio is restricted
    }
  }

  function playSparkleChord() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => playChime(f, 0.24, 'triangle', idx * 0.07));
  }

  // ---------- Confetti Burst ----------
  const confettiLayer = document.getElementById('confetti-layer');
  function spawnConfetti(count = 20, emojis = ['🌸', '🫧', '🐚', '💙', '✨', '🌷']) {
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

  // ---------- HUD & Shells ----------
  const shellsRow = document.getElementById('shells-row');
  const shellCountEl = document.getElementById('shell-count');

  function renderShells() {
    shellsRow.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const slot = document.createElement('span');
      const has = unlockedShells.has(i);
      slot.className = `shell-badge-slot${has ? ' unlocked' : ''}`;
      slot.innerHTML = HangyodonArt.shellSVG(has, 23);
      slot.title = has ? `Shell #${i} collected!` : `Shell #${i} (Chapter ${i})`;
      shellsRow.appendChild(slot);
    }
    shellCountEl.textContent = `${unlockedShells.size}/5 Shells`;
  }

  function unlockShell(chapterNum) {
    if (unlockedShells.has(chapterNum)) return;
    unlockedShells.add(chapterNum);
    renderShells();
    const pill = document.querySelector(`.chap-pill[data-chap="${chapterNum}"]`);
    if (pill) pill.classList.add('done');
    playSparkleChord();
    if (unlockedShells.size === 5) {
      spawnConfetti(36, ['🐚', '💐', '🌸', '✨', '💙', '🎉']);
    }
  }

  // ---------- Nickname Cycler & Sound Toggle ----------
  const nicknamePill = document.getElementById('nickname-pill');
  const activeNicknameEl = document.getElementById('active-nickname');

  nicknamePill.addEventListener('click', () => {
    nickIdx = (nickIdx + 1) % NICKNAMES.length;
    const nick = NICKNAMES[nickIdx];
    activeNicknameEl.textContent = nick;
    document.querySelectorAll('.js-nick-inline').forEach((el) => {
      el.textContent = nick;
    });
    playChime(659.25 + nickIdx * 28, 0.14);
  });

  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.setAttribute('aria-pressed', String(soundEnabled));
    soundIcon.textContent = soundEnabled ? '🔔' : '🔕';
    const label = soundToggleBtn.querySelector('.hide-sm');
    if (label) label.textContent = soundEnabled ? 'Chimes On' : 'Muted';
    if (soundEnabled) playChime(587.33, 0.14);
  });

  // ---------- Render Mascot SVGs ----------
  document.getElementById('hero-hangyodon').innerHTML = HangyodonArt.hangyodonSVG('welcome', 180);
  document.getElementById('hero-sayuri').innerHTML = HangyodonArt.sayuriSVG(82);
  document.getElementById('chap1-hangyodon').innerHTML = HangyodonArt.hangyodonSVG('shy', 165);
  document.getElementById('basket-player').innerHTML = HangyodonArt.basketHangyodonSVG(84);
  document.getElementById('letter-hangyodon-sticker').innerHTML = HangyodonArt.hangyodonSVG('holding-flowers', 64);
  document.getElementById('letter-sayuri-sticker').innerHTML = HangyodonArt.sayuriSVG(56);
  document.getElementById('bouquet-art').innerHTML = HangyodonArt.bouquetSVG(210);
  document.getElementById('finale-hangyodon').innerHTML = HangyodonArt.hangyodonSVG('cheering', 135);
  renderShells();

  document.getElementById('start-quest-btn').addEventListener('click', () => {
    playChime(587.33, 0.18);
    document.getElementById('chapter-1').scrollIntoView({ behavior: 'smooth' });
  });

  // ---------- Photo Modal ----------
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalSub = document.getElementById('modal-sub');

  function openPhotoModal(src, caption, sub = '') {
    modalImg.src = src;
    modalImg.alt = caption;
    modalCaption.textContent = caption;
    modalSub.textContent = sub;
    photoModal.classList.remove('hidden');
  }

  function closePhotoModal() {
    photoModal.classList.add('hidden');
    modalImg.removeAttribute('src');
  }

  document.getElementById('modal-close').addEventListener('click', closePhotoModal);
  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) closePhotoModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !photoModal.classList.contains('hidden')) closePhotoModal();
  });

  // ---------- CHAPTER 1: BUBBLE POP REFLECTIONS ----------
  const REFLECTIONS = [
    {
      emoji: '🫧',
      label: 'Opening Up',
      title: 'Keeping You Out Was Wrong',
      text: 'I am sorry for not telling you what was happening in my life even when we were together, and for ending things abruptly without giving us a chance to talk.'
    },
    {
      emoji: '🌊',
      label: 'New Tiong Bahru',
      title: 'That Day at New Tiong Bahru',
      text: 'I screwed up. From that day at New Tiong Bahru, it could have been fixed so easily — I could have chosen honesty and communication, and I did not.'
    },
    {
      emoji: '🐚',
      label: 'Avoidant Habits',
      title: 'You Were Right About That Night',
      text: 'That night was completely my fault. You pointed out that I was being avoidant, and you called it perfectly.'
    },
    {
      emoji: '💛',
      label: 'Little Things',
      title: 'Even Your Nagging Was a Privilege',
      text: 'Every memory keeps replaying in my head — the goofy moments and even your nagging. What a joy and a privilege to be cared for like that, and I took it for granted.'
    },
    {
      emoji: '🌸',
      label: 'Your Patience',
      title: 'Seeing How Patient You Actually Were',
      text: 'Over these 3 weeks, I realized how many mistakes I made and how sweet, patient, and kind you truly were even during conflicts.'
    },
    {
      emoji: '🌟',
      label: 'Who You Are',
      title: 'Strongest, Smartest, Kindest',
      text: 'You are my best friend and the strongest, smartest, kindest woman I have ever known. Whatever you decide, I never want to guilt or rush you.'
    }
  ];

  const bubblesGrid = document.getElementById('bubbles-grid');
  const reflectionsBox = document.getElementById('revealed-reflections');
  const statusChap1 = document.getElementById('status-chap-1');
  const poppedBubbles = new Set();

  function popBubble(idx, btn) {
    if (poppedBubbles.has(idx)) return;
    poppedBubbles.add(idx);
    btn.classList.add('popped');
    btn.disabled = true;
    const item = REFLECTIONS[idx];
    btn.innerHTML = `<span class="bubble-emoji">✨</span><span>Popped!</span>`;

    const note = document.createElement('div');
    note.className = 'reflection-note';
    note.innerHTML = `<h4>${item.emoji} ${item.title}</h4><p>${item.text}</p>`;
    reflectionsBox.appendChild(note);

    playChime(440 + idx * 55, 0.16);
    statusChap1.textContent = `${poppedBubbles.size} / ${REFLECTIONS.length} Bubbles Popped`;

    if (poppedBubbles.size === REFLECTIONS.length) {
      statusChap1.textContent = '6 / 6 Complete 🐚';
      document.getElementById('chap1-hangyodon').innerHTML = HangyodonArt.hangyodonSVG('welcome', 165);
      unlockShell(1);
    }
  }

  REFLECTIONS.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sea-bubble-btn';
    btn.innerHTML = `<span class="bubble-emoji">${item.emoji}</span><span>${item.label}</span>`;
    btn.addEventListener('click', () => popBubble(idx, btn));
    bubblesGrid.appendChild(btn);
  });

  document.getElementById('reveal-all-bubbles-btn').addEventListener('click', () => {
    const btns = bubblesGrid.querySelectorAll('.sea-bubble-btn');
    btns.forEach((btn, idx) => popBubble(idx, btn));
  });

  // ---------- CHAPTER 2: MEMORY POLAROID MATCH ----------
  const MEMORIES = [
    {
      id: 'couple',
      src: 'assets/photos/couple-with-you.jpg',
      caption: 'with you ♡',
      sub: 'My favorite place to be — right next to you.'
    },
    {
      id: 'nus',
      src: 'assets/photos/nus-graduation.jpg',
      caption: 'So Proud! Congratulations!',
      sub: 'NUS Data Science & Analytics (Honours Highest Distinction) — smartest woman I know!'
    },
    {
      id: 'tiong-bahru',
      src: 'assets/photos/tiong-bahru-chimutan.jpg',
      caption: 'Tiong Bahru · Chimutan & you 🐰',
      sub: 'Hair roller, glasses, Chimutan in a pot — one of our cutest memories.'
    },
    {
      id: 'popcorn',
      src: 'assets/photos/caramel-popcorn.jpg',
      caption: 'Candid snack times!',
      sub: 'Holding onto a giant bag of Korean caramel popcorn like treasure.'
    },
    {
      id: 'sleeping',
      src: 'assets/photos/sleeping-zzz.jpg',
      caption: 'ZZZ... Super cute! hehe :)',
      sub: 'Peaceful sleepyhead with your signature black glasses.'
    },
    {
      id: 'smiling',
      src: 'assets/photos/keep-smiling.jpg',
      caption: 'Keep smiling ☀️',
      sub: 'Your smile brightens every single day.'
    }
  ];

  const memoryGrid = document.getElementById('memory-grid');
  const keepsakeShelf = document.getElementById('keepsake-shelf');
  const statusChap2 = document.getElementById('status-chap-2');
  const goofyVault = document.getElementById('goofy-vault');

  let deck = [];
  let flippedIndices = [];
  let matchedIds = new Set();
  let movesCount = 0;
  let boardLocked = false;

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
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
      statusChap2.textContent = `6 / 6 Matched 🐚`;
      goofyVault.classList.remove('hidden');
      unlockShell(2);
    }
  }

  function initMemoryBoard() {
    deck = shuffleArray([...MEMORIES, ...MEMORIES]);
    flippedIndices = [];
    matchedIds = new Set();
    movesCount = 0;
    boardLocked = false;
    goofyVault.classList.add('hidden');
    memoryGrid.innerHTML = '';

    deck.forEach((mem, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mem-card';
      btn.setAttribute('aria-label', `Memory card ${idx + 1}`);
      btn.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-face mem-back">
            <span class="mem-back-icon">🐚</span>
            <span>Flip</span>
          </div>
          <div class="mem-face mem-front">
            <img src="${mem.src}" alt="${mem.caption}" />
            <span class="mem-caption-mini">${mem.caption}</span>
          </div>
        </div>
      `;
      btn.addEventListener('click', () => handleCardFlip(idx, btn));
      memoryGrid.appendChild(btn);
    });

    renderKeepsakeShelf();
    updateMemoryStatus();
  }

  function handleCardFlip(idx, btn) {
    if (boardLocked) return;
    if (btn.classList.contains('flipped') || btn.classList.contains('matched')) return;

    btn.classList.add('flipped');
    playChime(523.25, 0.1);
    flippedIndices.push({ idx, btn, id: deck[idx].id });

    if (flippedIndices.length < 2) return;

    movesCount += 1;
    const [first, second] = flippedIndices;

    if (first.id === second.id) {
      first.btn.classList.add('matched');
      second.btn.classList.add('matched');
      matchedIds.add(first.id);
      flippedIndices = [];
      playChime(783.99, 0.2);
      renderKeepsakeShelf();
      updateMemoryStatus();
    } else {
      boardLocked = true;
      setTimeout(() => {
        first.btn.classList.remove('flipped');
        second.btn.classList.remove('flipped');
        flippedIndices = [];
        boardLocked = false;
      }, 720);
      updateMemoryStatus();
    }
  }

  document.getElementById('shuffle-memory-btn').addEventListener('click', initMemoryBoard);
  document.getElementById('reveal-memory-btn').addEventListener('click', () => {
    const cards = memoryGrid.querySelectorAll('.mem-card');
    cards.forEach((c) => c.classList.add('flipped', 'matched'));
    MEMORIES.forEach((m) => matchedIds.add(m.id));
    renderKeepsakeShelf();
    updateMemoryStatus();
  });

  document.getElementById('vault-photo-btn').addEventListener('click', () => {
    openPhotoModal(
      'assets/photos/goofy-flex.jpg',
      'The “Most Most Retarded Moments” Vault 💪',
      'Thank you for loving even my silliest self — never taking a single laugh for granted again.'
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

  const GOAL_FLOWERS = 10;
  let flowerScore = 0;
  let playerXPercent = 50;
  let gameRunning = false;
  let animFrameId = null;
  let lastSpawnTime = 0;
  let lastFrameTime = 0;
  let fallingItems = [];
  let keysHeld = { left: false, right: false };

  const ITEM_POOL = [
    { emoji: '🌸', points: 1, label: '+1 Cherry Blossom' },
    { emoji: '🌷', points: 1, label: '+1 Pink Tulip' },
    { emoji: '🌼', points: 1, label: '+1 Sunny Daisy' },
    { emoji: '💐', points: 1, label: '+1 Mini Bouquet' },
    { emoji: '🍿', points: 2, label: '+2 Caramel Popcorn Bonus!' },
    { emoji: '🐰', points: 2, label: '+2 Chimutan Cheer!' },
    { emoji: '🌧️', points: 0, label: 'Oops, soggy fin! Keep going!' }
  ];

  function showStageToast(msg) {
    stageToast.textContent = msg;
    stageToast.classList.add('show');
    clearTimeout(showStageToast._timer);
    showStageToast._timer = setTimeout(() => stageToast.classList.remove('show'), 1200);
  }

  function updateFlowerProgress() {
    const clamped = Math.min(flowerScore, GOAL_FLOWERS);
    const pct = (clamped / GOAL_FLOWERS) * 100;
    meterFill.style.width = `${pct}%`;
    scoreLabel.textContent = `${clamped} / ${GOAL_FLOWERS} 🌸`;
    statusChap3.textContent = clamped >= GOAL_FLOWERS
      ? '10 / 10 Bouquet Ready 🐚'
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
    startOverlay.classList.remove('hidden');
    startOverlay.innerHTML = `
      <p class="overlay-msg">💐 Yay! Hangyodon gathered all 10 forgiveness flowers for Ashley!</p>
      <button type="button" class="btn btn-soft" id="replay-flower-btn">🌸 Play Again</button>
    `;
    document.getElementById('replay-flower-btn').addEventListener('click', startFlowerGame);
    unlockShell(3);
  }

  function spawnFallingItem() {
    const pick = ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.textContent = pick.emoji;
    const xPct = 8 + Math.random() * 84;
    el.style.left = `${xPct}%`;
    el.style.top = '-34px';
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

    const stageRect = flowerStage.getBoundingClientRect();
    const stageH = stageRect.height || 340;
    const stageW = stageRect.width || 600;
    const basketX = (playerXPercent / 100) * stageW;
    const catchTop = stageH - 86;

    for (let i = fallingItems.length - 1; i >= 0; i--) {
      const item = fallingItems[i];
      item.yPx += item.speed * dt;
      item.el.style.top = `${item.yPx}px`;

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
    flowerScore = 0;
    fallingItems.forEach((it) => it.el.remove());
    fallingItems = [];
    lastSpawnTime = 0;
    lastFrameTime = 0;
    gameRunning = true;
    startOverlay.classList.add('hidden');
    updateFlowerProgress();
    flowerStage.focus({ preventScroll: true });
    animFrameId = requestAnimationFrame(gameLoop);
  }

  document.getElementById('start-flower-game-btn').addEventListener('click', startFlowerGame);
  document.getElementById('skip-flower-game-btn').addEventListener('click', () => {
    flowerScore = GOAL_FLOWERS;
    updateFlowerProgress();
  });

  function moveByPointer(clientX) {
    const rect = flowerStage.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
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
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysHeld.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysHeld.right = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysHeld.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysHeld.right = false;
  });

  const leftBtn = document.getElementById('move-left-btn');
  const rightBtn = document.getElementById('move-right-btn');
  leftBtn.addEventListener('pointerdown', () => { keysHeld.left = true; });
  leftBtn.addEventListener('pointerup', () => { keysHeld.left = false; });
  leftBtn.addEventListener('pointerleave', () => { keysHeld.left = false; });
  leftBtn.addEventListener('pointercancel', () => { keysHeld.left = false; });
  leftBtn.addEventListener('click', () => {
    playerXPercent = Math.max(9, playerXPercent - 10);
    basketEl.style.left = `${playerXPercent}%`;
  });
  rightBtn.addEventListener('pointerdown', () => { keysHeld.right = true; });
  rightBtn.addEventListener('pointerup', () => { keysHeld.right = false; });
  rightBtn.addEventListener('pointerleave', () => { keysHeld.right = false; });
  rightBtn.addEventListener('pointercancel', () => { keysHeld.right = false; });
  rightBtn.addEventListener('click', () => {
    playerXPercent = Math.min(91, playerXPercent + 10);
    basketEl.style.left = `${playerXPercent}%`;
  });
  window.addEventListener('blur', () => {
    keysHeld.left = false;
    keysHeld.right = false;
  });

  // ---------- CHAPTER 4: UNSEAL THE LETTER ----------
  const openSealBtn = document.getElementById('open-seal-btn');
  const envelopeClosed = document.getElementById('envelope-closed');
  const letterStationery = document.getElementById('letter-stationery');
  const statusChap4 = document.getElementById('status-chap-4');

  function unsealLetter() {
    if (!envelopeClosed.classList.contains('hidden')) {
      envelopeClosed.classList.add('hidden');
      letterStationery.classList.remove('hidden');
      statusChap4.textContent = 'Unsealed ♡ 🐚';
      spawnConfetti(18, ['💌', '🌸', '🐚', '💙']);
      unlockShell(4);
    }
  }

  openSealBtn.addEventListener('click', unsealLetter);

  // ---------- CHAPTER 5: FINALE, CHEER BURSTS & ZERO-PRESSURE RESPONSE ----------
  const headpatBtn = document.getElementById('headpat-btn');
  const headpatCountEl = document.getElementById('headpat-count');
  const cheerCaption = document.getElementById('cheer-caption');
  let headpats = 0;

  const CHEERS = [
    'Cheer up LUMEI YOU CAN DO THIS, YOUR THE BEST LETS GOOOOOOOO! 💪✨',
    'Hangyodon & Sayuri are cheering for you, Tooty! 🐟🐙',
    'You are the strongest, smartest, kindest person ever, Ashley! 🌟',
    'Sending a giant cozy coral-reef hug, Baobao! 💙',
    'Hope these flowers make your day a little brighter, Peanut! 🌸'
  ];

  headpatBtn.addEventListener('click', () => {
    headpats += 1;
    headpatCountEl.textContent = String(headpats);
    cheerCaption.textContent = CHEERS[(headpats - 1) % CHEERS.length];
    playChime(587.33 + (headpats % 5) * 45, 0.16);
    spawnConfetti(12, ['✨', '💙', '🌸', '🫧']);
  });

  document.getElementById('open-collage-modal').addEventListener('click', () => {
    openPhotoModal(
      'assets/photos/collage-memories.jpg',
      'Memories with Ashley · You are my favorite!',
      'Tooty / Bao Bao / Ashley'
    );
  });

  const responseReply = document.getElementById('response-reply');
  const statusChap5 = document.getElementById('status-chap-5');

  const REPLIES = {
    flowers: '🌸 Thank you for accepting these flowers, Ashley. There is no rush at all — whenever you feel ready, I am here to listen and earn back your trust honestly.',
    space: '🐚 That is 100% okay. Take all the time and space you need — zero pressure, ever. Please take care of yourself, lean on your friends if you ever feel sad, and I truly wish you all the happiness.',
    pat: '💙 Hangyodon blushes happily! Thank you for visiting this little reef, Lumei. Wishing you the brightest, happiest days ahead — you are the best!'
  };

  document.querySelectorAll('.response-choice').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.getAttribute('data-choice');
      responseReply.textContent = REPLIES[choice];
      responseReply.classList.remove('hidden');
      statusChap5.textContent = 'Quest Complete 🐚';
      spawnConfetti(22, ['🌸', '🐚', '💙', '✨']);
      unlockShell(5);
    });
  });

  // ---------- BONUS TAB: ONE MORE CHANCE? (CUTE SHRINK/GROW BIT) ----------
  const chanceHangyodon = document.getElementById('chance-hangyodon');
  const chanceSayuri = document.getElementById('chance-sayuri');
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
      mood: 'pleading',
      dialogue: '“Will you give me one more chance to talk things through properly and earn back your trust?”',
      yesText: "🌸 Okay, let's talk & try again",
      noText: '🤔 Hmm, not sure yet...',
      yesSize: '1.0rem',
      yesPad: '12px 22px',
      noSize: '0.98rem',
      noPad: '12px 22px',
      noOpacity: '1'
    },
    {
      mood: 'shy',
      dialogue: '“Fair, Sayuri says I deserve at least one side-eye first. What about a zero-pressure coffee chat?”',
      yesText: "☕ Let's grab coffee & talk properly?",
      noText: '🐟 Still thinking...',
      yesSize: '1.08rem',
      yesPad: '14px 26px',
      noSize: '0.88rem',
      noPad: '9px 16px',
      noOpacity: '0.96'
    },
    {
      mood: 'shy',
      dialogue: '“Okay valid, I really fumbled at New Tiong Bahru... Hangyodon is doing push-ups to prove he’s serious.”',
      yesText: "🍿 I'll bring giant caramel popcorn!",
      noText: '🤨 Maybe later?',
      yesSize: '1.18rem',
      yesPad: '16px 30px',
      noSize: '0.78rem',
      noPad: '7px 14px',
      noOpacity: '0.92'
    },
    {
      mood: 'pleading',
      dialogue: '“Even Chimutan is glaring at me now 🐰😒 What if I promise zero avoidant disappearing acts ever again?”',
      yesText: '🐰 Chimutan & Hangyodon vote YES!',
      noText: '🙈 Still unsure',
      yesSize: '1.28rem',
      yesPad: '18px 34px',
      noSize: '0.70rem',
      noPad: '6px 12px',
      noOpacity: '0.88'
    },
    {
      mood: 'pleading',
      dialogue: '“Look how tiny this button is getting... Sayuri is holding a cardboard sign that says ‘pls talk to this dummy fish’.”',
      yesText: "💙 Okay let's talk!! (Hangyodon is ready)",
      noText: '🫧 Tiny maybe-no',
      yesSize: '1.38rem',
      yesPad: '20px 38px',
      noSize: '0.64rem',
      noPad: '5px 10px',
      noOpacity: '0.84'
    }
  ];

  let chanceNoCount = 0;

  function renderChanceStep() {
    const step = CHANCE_STEPS[chanceNoCount];
    chanceHangyodon.innerHTML = HangyodonArt.hangyodonSVG(step.mood, 165);
    chanceSayuri.innerHTML = HangyodonArt.sayuriSVG(76);
    chanceDialogue.textContent = step.dialogue;
    chanceYesBtn.textContent = step.yesText;
    chanceYesBtn.style.fontSize = step.yesSize;
    chanceYesBtn.style.padding = step.yesPad;
    chanceNoBtn.textContent = step.noText;
    chanceNoBtn.style.fontSize = step.noSize;
    chanceNoBtn.style.padding = step.noPad;
    chanceNoBtn.style.opacity = step.noOpacity;
  }

  function resetChanceSection() {
    chanceNoCount = 0;
    chanceArena.classList.remove('hidden');
    chanceResult.classList.add('hidden');
    chanceResult.innerHTML = '';
    chanceResetBtn.classList.add('hidden');
    statusChapChance.textContent = 'Waiting on You 🐟';
    renderChanceStep();
  }

  chanceNoBtn.addEventListener('click', () => {
    if (chanceNoCount < CHANCE_STEPS.length - 1) {
      chanceNoCount += 1;
      playChime(440 - chanceNoCount * 32, 0.14, 'triangle');
      renderChanceStep();
      return;
    }

    // Final click genuinely respects her answer without guilt
    chanceArena.classList.add('hidden');
    chanceHangyodon.innerHTML = HangyodonArt.hangyodonSVG('holding-flowers', 165);
    chanceDialogue.textContent = '“Okay, message received loud and clear! Hangyodon bows politely.”';
    statusChapChance.textContent = 'Respected Always 💙';
    if (chanceTabPill) chanceTabPill.classList.add('done');
    chanceResult.innerHTML = `
      <p>No guilt and no rushing — I truly meant it when I said I never want to force your decision. Take all the time and space you need, Lumei. Wishing you the brightest, happiest days ahead. 🌸</p>
    `;
    chanceResult.classList.remove('hidden');
    chanceResetBtn.classList.remove('hidden');
    playChime(523.25, 0.2);
  });

  chanceYesBtn.addEventListener('click', () => {
    chanceArena.classList.add('hidden');
    chanceHangyodon.innerHTML = HangyodonArt.hangyodonSVG('cheering', 175);
    chanceDialogue.textContent = '“WAIT REALLY?! Hangyodon & Sayuri are doing celebratory backflips!!”';
    statusChapChance.textContent = 'Another Chance! 🎉';
    if (chanceTabPill) chanceTabPill.classList.add('done');
    chanceResult.innerHTML = `
      <p>Thank you for giving us another chance to talk, Ashley ♡ I promise to show up honestly, never shut you out again, and earn back your trust step by step.</p>
      <button type="button" class="btn btn-soft copy-reply-btn" id="copy-reply-btn">
        📋 Copy quick text: "Hey Hangyodon 🐟 I saw your site, let's talk"
      </button>
    `;
    chanceResult.classList.remove('hidden');
    chanceResetBtn.classList.remove('hidden');
    playSparkleChord();
    spawnConfetti(34, ['💙', '🌸', '🐚', '✨', '☕', '🎉']);

    const copyBtn = document.getElementById('copy-reply-btn');
    copyBtn.addEventListener('click', async () => {
      const msg = "Hey Hangyodon 🐟 I saw your site, let's talk";
      try {
        await navigator.clipboard.writeText(msg);
        copyBtn.textContent = '✅ Copied! Ready to paste whenever you want';
      } catch (_) {
        copyBtn.textContent = `Message: ${msg}`;
      }
    });
  });

  chanceResetBtn.addEventListener('click', resetChanceSection);

  resetChanceSection();
})();
