/* ═══════════ OUR LOVE 20.10 — TƯƠNG TÁC CHÍNH ═══════════ */
(() => {
  const $ = s => document.querySelector(s);
  const COLORS = ['#ff5f8f', '#ff8fb3', '#e6396b', '#c77dff', '#ff7eb3', '#d6336c', '#ffb3c6'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[(Math.random() * arr.length) | 0];
  const heartSVG = () => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#heart');
    s.appendChild(u);
    return s;
  };

  /* ═══ INTRO — trái tim DOM bay ═══ */
  const introHearts = $('#introHearts');
  if (introHearts) {
    const n = window.innerWidth < 700 ? 26 : 44;
    for (let i = 0; i < n; i++) {
      const h = document.createElement('span');
      h.className = 'i-heart' + (Math.random() < 0.3 ? ' blur' : Math.random() < 0.5 ? ' glow' : '');
      const size = rnd(12, 44);
      h.style.left = rnd(0, 100) + '%';
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      h.style.color = pick(COLORS);
      h.style.setProperty('--dur', rnd(7, 18) + 's');
      h.style.animationDuration = rnd(7, 18) + 's';
      h.style.animationDelay = -rnd(0, 18) + 's';
      const svg = heartSVG();
      svg.style.fill = 'currentColor';
      h.appendChild(svg);
      introHearts.appendChild(h);
    }
    for (let i = 0; i < 16; i++) {
      const sp = document.createElement('span');
      sp.className = 'i-spark';
      sp.textContent = '✦';
      sp.style.left = rnd(0, 100) + '%';
      sp.style.animationDuration = rnd(6, 14) + 's';
      sp.style.animationDelay = -rnd(0, 14) + 's';
      sp.style.fontSize = rnd(8, 16) + 'px';
      introHearts.appendChild(sp);
    }
  }

  /* ═══ Nổ trái tim DOM (trên cùng mọi layer) ═══ */
  function domBurst(x, y, n = 16) {
    for (let i = 0; i < n; i++) {
      const h = document.createElement('span');
      h.className = 'burst-heart';
      const size = rnd(14, 34);
      const ang = rnd(0, Math.PI * 2);
      const dist = rnd(70, 190);
      h.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;color:${pick(COLORS)};--tx:${Math.cos(ang) * dist}px;--ty:${Math.sin(ang) * dist - 60}px;--rot:${rnd(-160, 160)}deg`;
      const svg = heartSVG();
      svg.style.fill = 'currentColor';
      h.appendChild(svg);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1100);
    }
  }
  const centerOf = el => {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };

  /* ═══ Mở phong thư ═══ */
  const envelope = $('#envelope');
  const envelopeWrap = $('#envelopeWrap');
  const openGiftBtn = $('#openGiftBtn');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    envelopeWrap.classList.add('opened');
    const [cx, cy] = centerOf(envelope);
    setTimeout(() => {
      envelope.classList.add('risen');
      domBurst(cx, cy - 30, 22);
    }, 620);
    setTimeout(() => openGiftBtn.classList.add('show'), 1500);
  }
  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  /* ═══ Vào website chính ═══ */
  const intro = $('#intro');
  const site = $('#site');
  let entered = false;

  function enterSite() {
    if (entered || !opened) return;
    entered = true;
    const [cx, cy] = centerOf(openGiftBtn);
    domBurst(cx, cy, 26);
    setTimeout(() => {
      intro.classList.add('leave');
      site.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => site.classList.add('in')));
      startHero();
      setTimeout(() => intro.remove(), 1100);
    }, 250);
  }
  openGiftBtn.addEventListener('click', enterSite);

  /* ═══ HERO — chữ xuất hiện từng ký tự ═══ */
  function typeChars(el, perChar = 0.038, startDelay = 0) {
    const chars = Array.from(el.textContent);
    el.setAttribute('aria-label', chars.join(''));
    el.textContent = '';
    chars.forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.animationDelay = (startDelay + i * perChar) + 's';
      if (/[,.]/.test(ch)) s.style.animationDelay = (startDelay + i * perChar + 0.25) + 's';
      el.appendChild(s);
    });
  }

  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    typeChars($('#heroTitle'), 0.04, 0.2);
    setTimeout(() => typeChars($('#heroSub'), 0.012, 0), 2600);
    makePetals();
  }

  /* ═══ Cánh hoa hồng rơi trong hero ═══ */
  function makePetals() {
    const wrap = $('#petals');
    if (!wrap) return;
    const n = window.innerWidth < 700 ? 8 : 14;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      p.style.left = rnd(2, 98) + '%';
      p.style.setProperty('--sway', rnd(-120, 120) + 'px');
      p.style.animationDuration = rnd(9, 20) + 's';
      p.style.animationDelay = -rnd(0, 20) + 's';
      p.style.transform = `scale(${rnd(0.7, 1.3)})`;
      wrap.appendChild(p);
    }
  }

  /* ═══ Nút ôm ═══ */
  const hugBtn = $('#hugBtn');
  const hugMsg = $('#hugMsg');
  let hugTimer;
  hugBtn.addEventListener('click', () => {
    const [cx, cy] = centerOf(hugBtn);
    domBurst(cx, cy, 20);
    window.loveBurst && loveBurst(cx, cy, 16);
    hugMsg.classList.add('show');
    clearTimeout(hugTimer);
    hugTimer = setTimeout(() => hugMsg.classList.remove('show'), 2400);
  });

  /* ═══ Reveal khi cuộn ═══ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        if (en.target.id === 'letterPaper') revealLetter();
        if (en.target.id === 'heartFormation') revealFormation();
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const letterPaper = $('#letterPaper');
  if (letterPaper) io.observe(letterPaper);

  /* ═══ Thư hiện từng dòng ═══ */
  function revealLetter() {
    document.querySelectorAll('.letter-line').forEach((l, i) => {
      l.style.transitionDelay = (i * 0.75) + 's';
    });
    $('#letterPaper').classList.add('show');
  }

  /* ═══ Trái tim viền khung thư ═══ */
  const edgeHearts = $('#edgeHearts');
  function buildEdgeHearts() {
    if (!edgeHearts) return;
    edgeHearts.innerHTML = '';
    const g = $('#letterGlass').getBoundingClientRect();
    const pts = [
      ...Array.from({ length: 9 }, (_, i) => [(i + 0.5) / 9, 0]),
      ...Array.from({ length: 9 }, (_, i) => [1, (i + 0.5) / 9]),
      ...Array.from({ length: 9 }, (_, i) => [(i + 0.5) / 9, 1]),
      ...Array.from({ length: 9 }, (_, i) => [0, (i + 0.5) / 9])
    ];
    pts.forEach(([fx, fy], i) => {
      const h = document.createElement('span');
      h.className = 'edge-heart';
      const size = rnd(10, 17);
      h.style.cssText = `left:calc(${fx * 100}% - ${size / 2}px);top:calc(${fy * 100}% - ${size / 2}px);width:${size}px;height:${size}px;color:${pick(COLORS)};animation-delay:${rnd(0, 2.4)}s;animation-duration:${rnd(2, 3.4)}s`;
      const svg = heartSVG();
      svg.style.fill = 'currentColor';
      h.appendChild(svg);
      edgeHearts.appendChild(h);
    });
  }
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildEdgeHearts(); buildFormation(); }, 400);
  });
  buildEdgeHearts();

  /* ═══ Cụm trái tim nhỏ tạo hình trái tim lớn ═══ */
  function buildFormation() {
    const wrap = $('#heartFormation');
    if (!wrap || !wrap.clientWidth) return;
    wrap.innerHTML = '';
    const Wf = wrap.clientWidth, Hf = wrap.clientHeight;
    const unit = Math.min(Wf, Hf) / 34;
    const colors = ['#ff6b9d', '#e6396b', '#c77dff', '#ff8fb3', '#d6336c', '#ffb3c6'];
    for (let i = 0; i < 44; i++) {
      const t = (i / 44) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const m = document.createElement('span');
      m.className = 'mh';
      const size = rnd(9, 16);
      const offX = Math.round(x * unit - size / 2);
      const offY = Math.round(-y * unit - size / 2);
      m.style.cssText = `left:calc(50% ${offX < 0 ? '-' : '+'} ${Math.abs(offX)}px);top:calc(50% ${offY < 0 ? '-' : '+'} ${Math.abs(offY)}px);width:${size}px;height:${size}px;color:${pick(colors)};animation-delay:${rnd(0, 2.4)}s;animation-duration:${rnd(1.8, 3.2)}s`;
      const svg = heartSVG();
      svg.style.fill = 'currentColor';
      m.appendChild(svg);
      wrap.appendChild(m);
    }
  }
  const formationEl = $('#heartFormation');
  if (formationEl) io.observe(formationEl);
  function revealFormation() { buildFormation(); }

  /* ═══ Hộp quà bí mật ═══ */
  const giftBox = $('#giftBox');
  const giftStage = $('.gift-stage');
  let giftOpened = false;
  function openGiftBox() {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add('open');
    giftStage.classList.add('open');
    const [cx, cy] = centerOf(giftBox);
    domBurst(cx, cy - 20, 30);
    setTimeout(() => domBurst(cx, cy - 60, 22), 350);
    setTimeout(() => window.loveBurst && loveBurst(cx, cy - 40, 24), 500);
  }
  giftBox.addEventListener('click', openGiftBox);
  giftBox.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGiftBox(); }
  });

  /* ═══ Nhạc nền lãng mạn — WebAudio ═══ */
  const musicBtn = $('#musicBtn');
  let actx = null, playing = false, loopTimer = null, masterGain = null;
  const MELODY = [
    [0, 523.25], [0.45, 587.33], [0.9, 659.25], [1.35, 783.99],
    [1.8, 659.25], [2.25, 698.46], [2.7, 880.0], [3.15, 783.99],
    [3.6, 659.25], [4.05, 587.33], [4.5, 523.25], [5.4, 392.0],
    [5.85, 523.25], [6.3, 659.25], [6.75, 587.33]
  ];
  const LOOP_LEN = 7.2;

  function playNote(freq, when, dur = 1.1, vol = 0.1) {
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g);
    g.connect(masterGain);
    o.start(when);
    o.stop(when + dur + 0.05);
  }
  function scheduleLoop() {
    const t0 = actx.currentTime + 0.05;
    MELODY.forEach(([t, f]) => playNote(f, t0 + t));
    playNote(261.63, t0, LOOP_LEN, 0.035);
    playNote(329.63, t0, LOOP_LEN, 0.028);
    loopTimer = setTimeout(scheduleLoop, LOOP_LEN * 1000);
  }
  function startMusic() {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = actx.createGain();
      masterGain.gain.value = 0.9;
      masterGain.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
    playing = true;
    musicBtn.textContent = '🎶';
    musicBtn.classList.add('playing');
    musicBtn.setAttribute('aria-pressed', 'true');
    scheduleLoop();
  }
  function stopMusic() {
    playing = false;
    clearTimeout(loopTimer);
    musicBtn.textContent = '🎵';
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-pressed', 'false');
    if (masterGain) {
      masterGain.gain.setValueAtTime(masterGain.gain.value, actx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, actx.currentTime + 0.4);
      setTimeout(() => { masterGain.gain.value = 0.9; }, 500);
    }
  }
  musicBtn.addEventListener('click', () => playing ? stopMusic() : startMusic());
})();
