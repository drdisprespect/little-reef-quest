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
  function unlockAudio() {
    if (!soundEnabled) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    } catch (_) {
      return null;
    }
  }

  function playChime(freq = 523.25, duration = 0.16, type = 'sine', delay = 0) {
    const ctx = unlockAudio();
    if (!ctx) return;
    try {
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

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
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

  // ---------- Render Mascot SVGs & Tap-to-Boop Pairs ----------
  const heroLuluBtn = document.getElementById('hero-lulu');
  const heroLumeiBtn = document.getElementById('hero-lumei');
  const chap1Lulu = document.getElementById('chap1-lulu');
  const chap1Lumei = document.getElementById('chap1-lumei');
  const chap2Lulu = document.getElementById('chap2-lulu');
  const chap2Lumei = document.getElementById('chap2-lumei');
  const finaleLulu = document.getElementById('finale-lulu');
  const finaleLumei = document.getElementById('finale-lumei');
  const footerLulu = document.getElementById('footer-lulu');
  const footerLumei = document.getElementById('footer-lumei');

  heroLuluBtn.innerHTML = MascotArt.luluSVG('welcome', 178);
  heroLumeiBtn.innerHTML = MascotArt.lumeiSVG('happy', 142);
  chap1Lulu.innerHTML = MascotArt.luluSVG('shy', 144);
  chap1Lumei.innerHTML = MascotArt.lumeiSVG('curious', 114);
  chap2Lulu.innerHTML = MascotArt.luluSVG('camera', 64);
  chap2Lumei.innerHTML = MascotArt.lumeiSVG('happy', 52);
  document.getElementById('chap3-lulu').innerHTML = MascotArt.luluSVG('welcome', 50);
  document.getElementById('chap3-lumei').innerHTML = MascotArt.lumeiSVG('cheering', 42);
  document.getElementById('basket-player').innerHTML = MascotArt.basketLuluSVG(84);
  document.getElementById('envelope-lulu').innerHTML = MascotArt.luluSVG('holding-flowers', 60);
  document.getElementById('envelope-lumei').innerHTML = MascotArt.lumeiSVG('curious', 48);
  document.getElementById('letter-lulu-sticker').innerHTML = MascotArt.luluSVG('holding-flowers', 68);
  document.getElementById('letter-lumei-sticker').innerHTML = MascotArt.lumeiSVG('happy', 56);
  document.getElementById('bouquet-art').innerHTML = MascotArt.bouquetSVG(210);
  finaleLulu.innerHTML = MascotArt.luluSVG('cheering', 134);
  finaleLumei.innerHTML = MascotArt.lumeiSVG('cheering', 108);
  footerLulu.innerHTML = MascotArt.luluSVG('welcome', 52);
  footerLumei.innerHTML = MascotArt.lumeiSVG('happy', 42);
  renderTangerines();

  function bindMascotBoop(el, freq = 659.25, type = 'sine') {
    if (!el) return;
    el.addEventListener('click', () => {
      boopMascot(el, true);
      playChime(freq, 0.15, type);
    });
  }

  bindMascotBoop(heroLuluBtn, 659.25, 'sine');
  bindMascotBoop(heroLumeiBtn, 783.99, 'triangle');
  bindMascotBoop(chap1Lulu, 622.25, 'sine');
  bindMascotBoop(chap1Lumei, 740.0, 'triangle');
  bindMascotBoop(finaleLulu, 659.25, 'sine');
  bindMascotBoop(finaleLumei, 783.99, 'triangle');
  bindMascotBoop(footerLulu, 587.33, 'sine');
  bindMascotBoop(footerLumei, 740.0, 'triangle');

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

  // ---------- Distributed Garden Photos & Hydration ----------
  const GARDEN_PHOTOS = {
    'goofy-flex': {
      src: 'assets/photos/goofy-flex.jpg',
      caption: 'The “Most Most Retarded Moments” Vault 💪',
      sub: 'Thank you for laughing at my dumbest moments instead of judging, never taking a single dumb laugh or nag for granted again muahahha.',
      aspect: 'portrait',
      pos: 'center 20%'
    },
    'escalator-lanyard': {
      src: 'assets/photos/escalator-lanyard-selfie.jpg',
      caption: 'Escalator 0.5x selfie 📸',
      sub: 'Still wearing my Google lanyard behind you while you lined up the 0.5x angle, even tiny mall errands with Tooty are my favorite.',
      aspect: 'portrait',
      pos: '50% 28%'
    },
    'coffee-date': {
      src: 'assets/photos/coffee-date-05x.jpg',
      caption: 'Iced coffee dates ☕',
      sub: 'That cute 0.5x close-up over iced coffees, would give anything for another chill afternoon just sitting across and talking with you.',
      aspect: 'portrait',
      pos: '50% 15%'
    },
    'ndp-antler': {
      src: 'assets/photos/ndp-antler-couple.jpg',
      caption: 'NDP red & silly hair antlers 🇸🇬',
      sub: 'Cheek stickers, red jerseys, and my ridiculous hair horns. Thank you for always matching my goofiness with that sweet smile.',
      aspect: 'landscape',
      pos: '40% 35%'
    },
    'cooking-roller': {
      src: 'assets/photos/cooking-hair-roller.jpg',
      caption: 'Kitchen prep with the hair roller 🎀',
      sub: 'Whisking away in your pink hair roller and black glasses, seriously missed everyday cooking together like this haizzz.',
      aspect: 'portrait',
      pos: '36% 24%'
    },
    'food-glare': {
      src: 'assets/photos/food-guard-glare.jpg',
      caption: 'Serious food-guard glare 😤',
      sub: 'Dead-serious face while scooping every last bit of food, even your fierce grumpy face makes me smile like an idiot every time.',
      aspect: 'portrait',
      pos: '42% 14%'
    },
    'burger-feast': {
      src: 'assets/photos/burger-feast-excited.jpg',
      caption: 'Burger feast hype! 🍔',
      sub: 'Fork and knife ready at full power for a mountain of fries and burgers, nobody gets happier over good food than Lumei!',
      aspect: 'portrait',
      pos: '55% 28%'
    },
    'potato-tornado': {
      src: 'assets/photos/potato-tornado-sideeye.jpg',
      caption: 'Side-eyeing the potato tornado 🥔',
      sub: 'That sneaky side-eye at a crispy pasar malam potato spiral, next time I am buying two just so Tooty gets extra!',
      aspect: 'portrait',
      pos: '48% 24%'
    },
    'french-toast': {
      src: 'assets/photos/french-toast-lift.jpg',
      caption: 'Elevator French toast kiss 🍞',
      sub: 'Little celebratory kiss for golden French toast in the lift, bringing snacks and seeing you happy is always priority #1.',
      aspect: 'portrait',
      pos: '50% 22%'
    },
    'sleeping-profile': {
      src: 'assets/photos/sleeping-blanket-profile.jpg',
      caption: 'Quiet nap under the blanket 🌙',
      sub: 'Peaceful sleepy Tooty tucked under the grey blanket, these 3 weeks made me realise how much I missed taking care of you.',
      aspect: 'landscape',
      pos: '55% 58%'
    },
    'couch-nap': {
      src: 'assets/photos/couch-nap-plushie.jpg',
      caption: 'Sofa nap with your plushie 🧸',
      sub: 'Fast asleep on the couch hugging your pink plushie with glasses still on. Right after my team meeting this popped up in my head and made me miss you so much.',
      aspect: 'portrait',
      pos: '50% 42%'
    },
    'bed-plushies': {
      src: 'assets/photos/bed-plushie-pile.jpg',
      caption: 'Sweet smile & plushie pile 🐰',
      sub: 'Surrounded by all your little Chimutan bunnies and plushies, never going to be avoidant or shut you out of my life again.',
      aspect: 'portrait',
      pos: '50% 25%'
    },
    'mrt-05x': {
      src: 'assets/photos/mrt-05x-selfie.jpg',
      caption: 'MRT 0.5x cuteness 🚇',
      sub: 'Big 0.5x train selfie eyes, even a random MRT ride feels empty when I think about how badly I missed your nagging and your voice haizzz.',
      aspect: 'portrait',
      pos: '45% 32%'
    },
    'mrt-purple': {
      src: 'assets/photos/mrt-purple-top-commute.jpg',
      caption: 'Purple top commute check-in 💜',
      sub: 'Seeing you in your studded purple top on the commute. That day you unblocked me was a celebration at my Google office like GUYS SHE UNBLOCKED ME LETS GOOOOO!',
      aspect: 'portrait',
      pos: '20% 38%'
    },
    'grad-bouquet': {
      src: 'assets/photos/nus-grad-bouquet.jpg',
      caption: 'Big bouquet on your NUS grad day 💐',
      sub: 'Standing beside you holding those huge graduation bouquets, always so proud of the strongest, smartest woman I know.',
      aspect: 'portrait',
      pos: '48% 36%'
    },
    'playful-smirk': {
      src: 'assets/photos/playful-smirk-selfie.jpg',
      caption: 'That playful little smirk 😏',
      sub: 'This cheeky little smirk gets me every single time, hoping to earn back this smile over a proper heart to heart talk, zero rush ♡',
      aspect: 'landscape',
      pos: '45% 38%'
    },
    'couple-us': {
      src: 'assets/photos/couple-with-you.jpg',
      caption: 'with you ♡',
      sub: 'Right next to you is still my favorite place, just finished my team meeting and all I can think is ughhh miss you so much tooty.',
      aspect: 'landscape',
      pos: '50% 28%'
    },
    'keep-smiling-lumei': {
      src: 'assets/photos/keep-smiling.jpg',
      caption: 'Keep smiling ☀️',
      sub: 'Looking at your smile gives me teary eyes in office like the good old days muahahha, keep smiling Lumei!',
      aspect: 'portrait',
      pos: '50% 24%'
    },
    'nus-grad-hero': {
      src: 'assets/photos/nus-graduation.jpg',
      caption: 'So Proud! Congratulations!',
      sub: 'NUS Data Science & Analytics (Honours Highest Distinction), the smartest and strongest woman I know!',
      aspect: 'portrait',
      pos: '50% 24%'
    }
  };

  function createPhotoButton(id, variant = 'polaroid') {
    const photo = GARDEN_PHOTOS[id];
    if (!photo) return null;

    const btn = document.createElement('button');
    btn.type = 'button';
    const baseClass = variant === 'chip' ? 'photo-chip' : 'garden-polaroid';
    btn.className = `${baseClass}${photo.aspect === 'landscape' ? ' is-landscape' : ''}`;
    btn.style.setProperty('--photo-pos', photo.pos || 'center 22%');
    btn.setAttribute('aria-label', `${photo.caption}, tap to zoom`);

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    btn.appendChild(img);

    if (variant === 'chip') {
      const copy = document.createElement('span');
      copy.className = 'photo-chip-copy';

      const cap = document.createElement('span');
      cap.className = 'photo-chip-cap';
      cap.textContent = photo.caption;

      const hint = document.createElement('span');
      hint.className = 'photo-chip-hint';
      hint.textContent = '🔍 Tap to zoom';

      copy.appendChild(cap);
      copy.appendChild(hint);
      btn.appendChild(copy);
    } else {
      const cap = document.createElement('span');
      cap.className = 'polaroid-cap';
      cap.textContent = photo.caption;
      btn.appendChild(cap);
    }

    btn.addEventListener('click', () => openPhotoModal(photo.src, photo.caption, photo.sub));
    return btn;
  }

  function hydratePhotoSlots() {
    document.querySelectorAll('[data-photo-strip]').forEach((container) => {
      const ids = (container.dataset.photoStrip || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      container.textContent = '';
      ids.forEach((id) => {
        const btn = createPhotoButton(id, 'polaroid');
        if (btn) container.appendChild(btn);
      });
    });

    document.querySelectorAll('[data-photo-chip]').forEach((container) => {
      const id = (container.dataset.photoChip || '').trim();
      container.textContent = '';
      if (!id) return;
      const btn = createPhotoButton(id, 'chip');
      if (btn) container.appendChild(btn);
    });
  }

  hydratePhotoSlots();

  // ---------- CHAPTER 1: THOUGHT BUBBLE REFLECTIONS ----------
  const REFLECTIONS = [
    {
      emoji: '💔',
      label: 'Owning My Mistakes',
      title: 'I Screwed Up & Regret It So Much',
      text: 'I broke up so abruptly without giving us a chance for a proper talk, and didn’t tell you what was happening in my life even though we were gf and bf. The past 3 weeks must have been hellish for you, and I feel so so bad and guilty. Regret is an understatement.'
    },
    {
      emoji: '🌇',
      label: 'New Tiong Bahru',
      title: 'New Tiong Bahru & That Night',
      text: 'From that day at New Tiong Bahru, I could have fixed this easily, but I didn’t. That night was completely my fault, I was the avoidant one just like you pointed out, and I don’t know if I can ever repay or make up for the hurt I caused.',
      photoId: 'bed-plushies'
    },
    {
      emoji: '🤝',
      label: 'Future Conflicts',
      title: 'Talking It Out Through Thick & Thin',
      text: 'We already had our real talk, and whenever we have a problem in the future I want us to talk it out calmly ourselves until we both really get it, understand it, and change, with zero blame, finger-pointing, or defensiveness on my side.'
    },
    {
      emoji: '🥹',
      label: 'Missing Your Nagging',
      title: 'Your Patience, Voice & Office Tears',
      text: 'The past 3 weeks I realised how sweet, patient, and kind you were even during conflicts when you were trying your best. Maybe your nagging wasn’t annoying at all, OMG I MISSED IT SOOOOOOO MUCH HAHAHA JUST THE VOICE WHAT A PRIVILEDGE HAIZZZ. Teary eyes in office like the good old days muahahha.',
      photoId: 'mrt-05x'
    },
    {
      emoji: '🪩',
      label: 'Marquee & Unblock',
      title: 'Marquee +1, Meetings & Unblock Day',
      text: '2 weeks ago Google opened their end of year party at Marquee, I added a +1 and was so sad hoping you would go. Just finished my team meeting thinking ughhh miss you so much tooty, and the day you unblocked me was a celebration at my Google office like wow: GUYS SHE UNBLOCKED ME WHAT DOES IT MEAN LETS GOOOOO!',
      photoId: 'mrt-purple'
    },
    {
      emoji: '🌟',
      label: 'Love of My Life',
      title: 'Strongest, Smartest, Best Friend',
      text: 'You are the strongest woman I know, the smartest, most kind person I have ever known, my best friend in life and the love of my life. I loved you 3 weeks ago and I love you even more now, never guilting or forcing your decision. Take all the time you need ♡'
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
    btn.setAttribute('aria-label', `${item.label}, opened`);
    btn.innerHTML = `<span class="bubble-emoji">✨</span><span>Opened!</span>`;

    const note = document.createElement('div');
    note.className = 'reflection-note';
    note.innerHTML = `<h4>${item.emoji} ${item.title}</h4><p>${item.text}</p>`;
    if (item.photoId) {
      const photoBtn = createPhotoButton(item.photoId, 'chip');
      if (photoBtn) note.appendChild(photoBtn);
    }
    reflectionsBox.appendChild(note);

    playChime(440 + idx * 55, 0.16);
    statusChap1.textContent = `${poppedBubbles.size} / ${REFLECTIONS.length} Thoughts Opened`;

    if (poppedBubbles.size === REFLECTIONS.length) {
      statusChap1.textContent = '6 / 6 Complete 🍊';
      revealAllBubblesBtn.disabled = true;
      revealAllBubblesBtn.textContent = '✨ All 6 reflections revealed';
      chap1Lulu.innerHTML = MascotArt.luluSVG('welcome', 144);
      chap1Lumei.innerHTML = MascotArt.lumeiSVG('cheering', 114);
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
    unlockAudio();
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
      sub: 'Right next to you is still my favorite place, just finished my team meeting and all I can think is ughhh miss you so much tooty.'
    },
    {
      id: 'nus',
      src: 'assets/photos/nus-graduation.jpg',
      caption: 'So Proud! Congratulations!',
      sub: 'NUS Data Science & Analytics (Honours Highest Distinction), the smartest and strongest woman I know!'
    },
    {
      id: 'tiong-bahru',
      src: 'assets/photos/tiong-bahru-chimutan.jpg',
      caption: 'Tiong Bahru · Chimutan & you 🐰',
      sub: 'Hair roller, glasses, Chimutan in a pot at Tiong Bahru. OMG I missed your nagging and your voice so much haizzz.'
    },
    {
      id: 'popcorn',
      src: 'assets/photos/caramel-popcorn.jpg',
      caption: 'Candid snack times!',
      sub: 'Holding onto that giant bag of Korean caramel popcorn like treasure, next time I am bringing two bags for Tooty!'
    },
    {
      id: 'sleeping',
      src: 'assets/photos/sleeping-zzz.jpg',
      caption: 'ZZZ... Super cute! hehe :)',
      sub: 'Peaceful sleepyhead with your black glasses still on, makes me smile like an idiot every time muahahha.'
    },
    {
      id: 'smiling',
      src: 'assets/photos/keep-smiling.jpg',
      caption: 'Keep smiling ☀️',
      sub: 'Looking at your smile gives me teary eyes in office like the good old days muahahha, keep smiling Lumei!'
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
      btn.setAttribute('aria-label', `Matched memory: ${mem.caption}, click to zoom`);
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
  const flowerPrizeBox = document.getElementById('flower-prize-box');
  const flowerPrizeLocked = document.getElementById('flower-prize-locked');
  const flowerPrizeUnlocked = document.getElementById('flower-prize-unlocked');
  const flowerPrizeGrid = document.getElementById('flower-prize-grid');
  const shuffleFlowerPrizeBtn = document.getElementById('shuffle-flower-prize-btn');

  const PRIZE_US_IDS = ['couple-us', 'escalator-lanyard', 'coffee-date', 'ndp-antler'];
  const PRIZE_HER_IDS = ['keep-smiling-lumei', 'bed-plushies', 'mrt-05x', 'nus-grad-hero', 'grad-bouquet', 'playful-smirk'];
  let prizeUnlocked = false;
  let prizeUsIdx = 0;
  let prizeHerIdx = 0;

  function renderFlowerPrize(advance = false) {
    if (!flowerPrizeGrid) return;
    if (advance) {
      prizeUsIdx = (prizeUsIdx + 1) % PRIZE_US_IDS.length;
      prizeHerIdx = (prizeHerIdx + 1) % PRIZE_HER_IDS.length;
    }

    flowerPrizeGrid.textContent = '';
    const slots = [
      { tag: 'Photo of Us ♡', id: PRIZE_US_IDS[prizeUsIdx] },
      { tag: 'Photo of Lumei 🍊', id: PRIZE_HER_IDS[prizeHerIdx] }
    ];
    slots.forEach(({ tag, id }) => {
      const slot = document.createElement('div');
      slot.className = 'prize-slot';
      const label = document.createElement('span');
      label.className = 'prize-tag';
      label.textContent = tag;
      slot.appendChild(label);
      const card = createPhotoButton(id, 'polaroid');
      if (card) slot.appendChild(card);
      flowerPrizeGrid.appendChild(slot);
    });
  }

  if (shuffleFlowerPrizeBtn) {
    shuffleFlowerPrizeBtn.addEventListener('click', () => {
      renderFlowerPrize(true);
      playChime(659.25, 0.14);
      spawnConfetti(10, ['📸', '🌸', '🍊', '💛']);
    });
  }

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

  function clampBasketPercent(pct) {
    const w = stageWidth || flowerStage.clientWidth || 600;
    const halfBasket = (basketEl.offsetWidth || 84) / 2;
    const minPct = Math.min(45, Math.max(9, ((halfBasket + 4) / w) * 100));
    return Math.max(minPct, Math.min(100 - minPct, pct));
  }

  function updateStageMetrics() {
    let w = flowerStage.clientWidth;
    let h = flowerStage.clientHeight;
    if (!w || !h) {
      const rect = flowerStage.getBoundingClientRect();
      if (!w) w = rect.width;
      if (!h) h = rect.height;
    }
    if (w > 0) stageWidth = w;
    if (h > 0) stageHeight = h;
    playerXPercent = clampBasketPercent(playerXPercent);
    basketEl.style.left = `${playerXPercent}%`;
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
    skipFlowerBtn.textContent = '💐 All 10 flowers caught, LETS GOOOOO!';

    const wasAlreadyUnlocked = prizeUnlocked;
    prizeUnlocked = true;
    if (flowerPrizeLocked) flowerPrizeLocked.classList.add('hidden');
    if (flowerPrizeUnlocked) flowerPrizeUnlocked.classList.remove('hidden');
    renderFlowerPrize(wasAlreadyUnlocked);

    startOverlay.classList.remove('hidden');
    startOverlay.innerHTML = `
      <p class="overlay-msg">💐 Yay! Lulu caught all 10 forgiveness flowers for <span class="js-nick-inline">${getActiveNickname()}</span>, LETS GOOOOO! Your photo prize is unlocked below!</p>
      <div class="overlay-btn-row">
        <button type="button" class="btn btn-primary" id="view-flower-prize-btn">🎁 See Photo Prize ↓</button>
        <button type="button" class="btn btn-soft" id="replay-flower-btn">🌸 Play Again</button>
      </div>
    `;
    const viewPrizeBtn = document.getElementById('view-flower-prize-btn');
    if (viewPrizeBtn && flowerPrizeBox) {
      viewPrizeBtn.addEventListener('click', () => {
        flowerPrizeBox.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
        spawnConfetti(14, ['📸', '🌸', '🍊', '💛']);
      });
    }
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

    if (keysHeld.left) playerXPercent = clampBasketPercent(playerXPercent - 62 * dt);
    if (keysHeld.right) playerXPercent = clampBasketPercent(playerXPercent + 62 * dt);
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
    unlockAudio();
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
    const innerLeft = rect.left + (flowerStage.clientLeft || 0);
    const width = flowerStage.clientWidth || rect.width || stageWidth || 600;
    const pct = ((clientX - innerLeft) / width) * 100;
    playerXPercent = clampBasketPercent(pct);
    basketEl.style.left = `${playerXPercent}%`;
  }

  flowerStage.addEventListener('pointermove', (e) => {
    if (gameRunning) moveByPointer(e.clientX);
  });
  flowerStage.addEventListener('pointerdown', (e) => {
    if (!gameRunning) return;
    moveByPointer(e.clientX);
    if (typeof flowerStage.setPointerCapture === 'function') {
      try { flowerStage.setPointerCapture(e.pointerId); } catch (_) {}
    }
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
      playerXPercent = clampBasketPercent(playerXPercent + delta * 0.4);
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
      playerXPercent = clampBasketPercent(playerXPercent + delta);
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
    unlockAudio();
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
  const cheerMascotsWrap = document.querySelector('.cheer-mascots');
  let headpats = 0;

  const CHEERS = [
    'Cheer up LUMEI YOU CAN DO THIS, YOUR THE BEST LETS GOOOOOOOO! 💪✨',
    'OMG I MISSED UR NAGGING HAHAHA just the voice, what a priviledge haizzz! 🍊🌸',
    'Strongest, smartest, most kind woman I know (even Chimutan agrees Ashley!) 🌟',
    'Just finished my team meeting... ughhh miss you so much tooty! 💛',
    'Teary eyes in office like the good old days muahahha, love you Peanut! 🌷'
  ];

  function updateFinaleChonk() {
    const steps = Math.min(headpats, 8);
    const lumeiX = (1 + steps * 0.055).toFixed(3);
    const lumeiY = (1 + steps * 0.025).toFixed(3);
    const luluX = (1 + steps * 0.032).toFixed(3);
    const luluY = (1 + steps * 0.014).toFixed(3);
    finaleLumei.style.setProperty('--chonk-x', lumeiX);
    finaleLumei.style.setProperty('--chonk-y', lumeiY);
    finaleLulu.style.setProperty('--chonk-x', luluX);
    finaleLulu.style.setProperty('--chonk-y', luluY);
  }

  function spawnHangyodonBurst(count = 4) {
    if (!cheerMascotsWrap || prefersReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const pop = document.createElement('span');
      pop.className = 'hangyodon-popper';
      pop.setAttribute('aria-hidden', 'true');
      const size = 36 + Math.floor(Math.random() * 14);
      pop.innerHTML = MascotArt.miniHangyodonSVG(size);
      const spread = (i - (count - 1) / 2) * 44 + (Math.random() * 20 - 10);
      const peakY = -58 - Math.random() * 44;
      const endY = -4 + Math.random() * 34;
      const rot = Math.round((spread >= 0 ? 1 : -1) * (14 + Math.random() * 22));
      pop.style.setProperty('--hx', `${Math.round(spread)}px`);
      pop.style.setProperty('--hy-peak', `${Math.round(peakY)}px`);
      pop.style.setProperty('--hy-end', `${Math.round(endY)}px`);
      pop.style.setProperty('--hrot', `${rot}deg`);
      cheerMascotsWrap.appendChild(pop);
      setTimeout(() => pop.remove(), 1120);
    }
  }

  headpatBtn.addEventListener('click', () => {
    headpats += 1;
    headpatCountEl.textContent = String(headpats);
    cheerCaption.textContent = CHEERS[(headpats - 1) % CHEERS.length];
    if (finaleLulu) finaleLulu.innerHTML = MascotArt.luluSVG('cheering', 112);
    if (finaleLumei) finaleLumei.innerHTML = MascotArt.lumeiSVG('cheering', 90);
    updateFinaleChonk();
    boopMascot(finaleLulu, false);
    boopMascot(finaleLumei, false);
    spawnHangyodonBurst(4);
    playChime(587.33 + (headpats % 5) * 45, 0.16);
    spawnConfetti(12, ['✨', '💛', '🌸', '🍊']);
  });

  [finaleLulu, finaleLumei].forEach((el) => {
    if (!el) return;
    el.addEventListener('click', () => {
      headpats += 1;
      headpatCountEl.textContent = String(headpats);
      cheerCaption.textContent = CHEERS[(headpats - 1) % CHEERS.length];
      if (finaleLulu) finaleLulu.innerHTML = MascotArt.luluSVG('cheering', 112);
      if (finaleLumei) finaleLumei.innerHTML = MascotArt.lumeiSVG('cheering', 90);
      updateFinaleChonk();
      spawnHangyodonBurst(3);
    });
  });

  document.getElementById('open-collage-modal').addEventListener('click', () => {
    openPhotoModal(
      'assets/photos/collage-memories.jpg',
      `Memories with ${getActiveNickname()} · My Best Friend & Favorite Person`,
      'Tooty / Lumei / Bao Bao / Ashley, every single moment replaying in my head ♡'
    );
  });

  const responseReply = document.getElementById('response-reply');
  const statusChap5 = document.getElementById('status-chap-5');

  function triggerCryBurst(...els) {
    els.forEach((el) => {
      if (!el) return;
      el.classList.remove('cry-burst');
      void el.offsetWidth;
      el.classList.add('cry-burst');
    });
  }

  function getReplyHtml(choice) {
    const nick = `<strong class="js-nick-inline">${getActiveNickname()}</strong>`;
    if (choice === 'flowers') {
      return `🌸 Thank you for accepting these flowers, ${nick}. Hope they make your day brighter! I loved you 3 weeks ago and I love you even more now, and I want another chance to earn back your trust and love.`;
    }
    if (choice === 'space') {
      return `🍊 Lulu & Lumei have teary eyes already 😭 Take all the time you need to decide, ${nick}, no rush and zero pressure. If you ever feel sad, please reach out to your friends or me if you really want, truly wishing you all the happiness.`;
    }
    return `💛 Lulu blushes so hard (teary eyes in office like the good old days muahahha)! Cheer up ${nick}, LETS GOOOOO!`;
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
      if (choice === 'space') {
        if (finaleLulu) finaleLulu.innerHTML = MascotArt.luluSVG('crying', 112);
        if (finaleLumei) finaleLumei.innerHTML = MascotArt.lumeiSVG('crying', 90);
        updateFinaleChonk();
        triggerCryBurst(finaleLulu, finaleLumei);
        playChime(392, 0.18, 'triangle');
        spawnConfetti(18, ['💧', '😭', '🍊', '🥺']);
      } else {
        if (finaleLulu) finaleLulu.innerHTML = MascotArt.luluSVG('cheering', 112);
        if (finaleLumei) finaleLumei.innerHTML = MascotArt.lumeiSVG('cheering', 90);
        updateFinaleChonk();
        playChime(CHOICE_CHIMES[choice] || 587.33, 0.18);
        spawnConfetti(22, ['🌸', '🍊', '💛', '✨']);
      }
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
  const statusChapChance = document.getElementById('status-chap-chance');
  const chanceTabPill = document.querySelector('.chap-pill[data-chap="chance"]');

  const CHANCE_STEPS = [
    {
      luluMood: 'pleading',
      lumeiMood: 'curious',
      dialogue: '“Will you forgive me and give me one more chance to earn back your trust, your love, and our forever?”',
      yesText: "🌸 Yes, let's give us another chance ♡",
      noText: '🤔 Still deciding...',
      yesSize: '1.00rem',
      yesPad: '12px 22px',
      noSize: '0.98rem',
      noPad: '12px 22px',
      noBw: '2.5px',
      noOpacity: '1'
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“Wait nooo Lulu & Lumei are already tearing up 😭 Fair, I know I disappointed you and hurt you deeply. What if I spend every day proving I truly treasure you now?”',
      yesText: '💛 Earn back my trust step by step',
      noText: '🍊 Still unsure...',
      yesSize: '1.05rem',
      yesPad: '13px 24px',
      noSize: '0.84rem',
      noPad: '9px 16px',
      noBw: '2px',
      noOpacity: '0.95'
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“Both of us are crying rivers now 😭 Even after my team meeting my first thought is still ‘ughhh miss you so much tooty’... plus I owe you two giant caramel popcorn bags from Tiong Bahru!”',
      yesText: '🍿 Two giant caramel popcorn bags!',
      noText: '🤨 Still thinking...',
      yesSize: '1.10rem',
      yesPad: '14px 26px',
      noSize: '0.70rem',
      noPad: '6px 12px',
      noBw: '2px',
      noOpacity: '0.90'
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“We already had our real talk, and whenever we hit a problem in the future I promise we’ll talk it out calmly together through thick and thin, zero blame or defensiveness on my side.”',
      yesText: '🕊️ Talking it out together, let’s try again',
      noText: '🙈 Hmm not yet',
      yesSize: '1.15rem',
      yesPad: '15px 28px',
      noSize: '0.56rem',
      noPad: '5px 10px',
      noBw: '1.5px',
      noOpacity: '0.85'
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“I loved you 3 weeks ago and I love you even more now. 2 weeks ago I added a +1 for the Google EOY Party at Marquee hoping you would go...”',
      yesText: '🪩 Save that Marquee +1 for me!',
      noText: '🤏 tiny maybe',
      yesSize: '1.20rem',
      yesPad: '16px 30px',
      noSize: '0.46rem',
      noPad: '4px 8px',
      noBw: '1.5px',
      noOpacity: '0.78',
      isTiny: true
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“OMG I MISSED UR NAGGING HAHAHA JUST THE VOICE WHAT A PRIVILEDGE HAIZZZ 😭 Look how hard Lulu & Lumei are crying... wait don’t shrink it any smaller!!”',
      yesText: '🎙️ Fine, come wipe my tears & get nagged!',
      noText: '🥹 almost gone...',
      yesSize: '1.25rem',
      yesPad: '17px 32px',
      noSize: '0.38rem',
      noPad: '3px 6px',
      noBw: '1px',
      noOpacity: '0.70',
      isTiny: true
    },
    {
      luluMood: 'crying',
      lumeiMood: 'crying',
      dialogue: '“Uh oh, the No button shrank so small it’s completely gone now 😭 Teary eyes in office like the good old days muahahha... only Yes is left for Lulu & Lumei 🍊💛”',
      yesText: '✨ YES, LETS GOOOOO LUMEI & LULU! 🍊',
      noText: '',
      yesSize: '1.31rem',
      yesPad: '18px 34px',
      isPixel: true
    }
  ];

  let chanceNoCount = 0;

  function renderChanceStep() {
    const step = CHANCE_STEPS[chanceNoCount];
    const isTiny = Boolean(step.isTiny);
    const isPixel = Boolean(step.isPixel);

    chanceLulu.innerHTML = MascotArt.luluSVG(step.luluMood, 164);
    chanceLumei.innerHTML = chanceNoCount >= 5
      ? MascotArt.lumeiSVG(step.lumeiMood, 136, { holdingSign: true })
      : MascotArt.lumeiSVG(step.lumeiMood, 130);
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
      statusChapChance.textContent = 'Only Yes Left 🥹';
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

  chanceNoBtn.addEventListener('click', () => {
    const current = CHANCE_STEPS[chanceNoCount];
    if (current.isPixel || chanceNoCount >= CHANCE_STEPS.length - 1) return;
    chanceNoCount += 1;
    playChime(440 - chanceNoCount * 28, 0.14, 'triangle');
    renderChanceStep();
    triggerCryBurst(chanceLulu, chanceLumei);
    spawnConfetti(14, ['💧', '😭', '🥺', '💦']);
  });

  chanceYesBtn.addEventListener('click', () => {
    chanceArena.classList.add('hidden');
    chanceLulu.innerHTML = MascotArt.luluSVG('cheering', 170);
    chanceLumei.innerHTML = MascotArt.lumeiSVG('cheering', 136);
    chanceDialogue.textContent = '“Yay tears dried up right away!! Haha just kidding about making No disappear, take all your time, zero rush, love you very much ♡”';
    statusChapChance.textContent = 'Take Your Time 💛';
    if (chanceTabPill) chanceTabPill.classList.add('done');
    chanceResult.innerHTML = `
      <p>Just kidding about making the No button disappear, <strong class="js-nick-inline">${getActiveNickname()}</strong>, take your time and don’t feel rushed at all. Love you very much, Lumei / Toot / Tooty / Baobao / Peanut ♡</p>
      <button type="button" class="btn btn-soft copy-reply-btn" id="copy-reply-btn">
        📋 Copy quick text: "Hey Lulu 🍊 saw your site, taking my time no rush ♡"
      </button>
    `;
    chanceResult.classList.remove('hidden');
    playSparkleChord();
    spawnConfetti(34, ['💛', '🌸', '🍊', '✨', '☕', '🎉']);

    const copyBtn = document.getElementById('copy-reply-btn');
    copyBtn.addEventListener('click', async () => {
      const msg = "Hey Lulu 🍊 saw your site, taking my time no rush ♡";
      try {
        await navigator.clipboard.writeText(msg);
        copyBtn.textContent = '✅ Copied! Take all the time you need ♡';
      } catch (_) {
        copyBtn.textContent = `Message: ${msg}`;
      }
    });
  });

  renderChanceStep();
})();
