/* ═══════════ LOVE BACKGROUND — HỆ THỐNG TRÁI TIM CANVAS ═══════════ */
(() => {
  const canvas = document.getElementById('loveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const IS_MOBILE = matchMedia('(max-width: 768px)').matches;
  const COLORS = ['#ff5f8f', '#ff8fb3', '#e6396b', '#c77dff', '#ff7eb3', '#d6336c', '#ffb3c6', '#ff4d6d'];
  const SPARK_COLORS = ['#ffffff', '#ffd9e8', '#fff3b0', '#e8c5ff', '#ffc2d1'];

  const HEART = new Path2D('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');

  let W = 0, H = 0, DPR = 1;
  let hearts = [];      // trái tim bay lên (hậu cảnh + tiền cảnh)
  let bubbles = [];    // bong bóng trái tim
  let sparkles = [];   // đốm sáng lấp lánh
  let trails = [];     // vệt trái tim theo chuột
  let bursts = [];     // trái tim nổ khi nhấn
  let running = true;
  let lastTime = 0;
  let scrollCooldown = 0;

  const AMBIENT_MAX = IS_MOBILE ? 46 : 90;
  const SPARKLE_MAX = IS_MOBILE ? 22 : 36;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeHeart(fg) {
    return {
      x: rnd(0, W),
      y: rnd(-H, H),
      size: fg ? rnd(30, 52) : rnd(9, 30),
      speed: fg ? rnd(1.1, 2.1) : rnd(0.25, 0.95),
      swayAmp: rnd(14, 46),
      swayFreq: rnd(0.4, 1.2),
      phase: rnd(0, Math.PI * 2),
      alpha: fg ? rnd(0.08, 0.2) : rnd(0.16, 0.5),
      color: pick(COLORS),
      glow: Math.random() < (fg ? 0.25 : 0.4),
      flip: rnd(0, Math.PI * 2),
      flipSpeed: rnd(0.4, 1.4),
      rot: rnd(-0.3, 0.3),
      fg: !!fg
    };
  }

  function makeBubble() {
    return {
      x: rnd(0, W),
      y: H + 90,
      size: rnd(40, 86),
      speed: rnd(0.35, 0.8),
      swayAmp: rnd(10, 30),
      swayFreq: rnd(0.2, 0.5),
      phase: rnd(0, Math.PI * 2),
      alpha: rnd(0.14, 0.3),
      color: pick(['#ff8fb3', '#e6396b', '#c77dff', '#ff6b9d'])
    };
  }

  function makeSparkle() {
    return {
      x: rnd(0, W),
      y: rnd(0, H),
      size: rnd(1.2, 3),
      phase: rnd(0, Math.PI * 2),
      twinkleSpeed: rnd(0.8, 2.4),
      color: pick(SPARK_COLORS),
      r: rnd(0, Math.PI)
    };
  }

  function drawHeartShape(x, y, size, rot, color, alpha, glow, flip, stroke) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const f = Math.max(Math.abs(Math.cos(flip)), 0.18) * (Math.cos(flip) < 0 ? -1 : 1);
    ctx.scale((size / 24) * f, size / 24);
    ctx.translate(-12, -11.7);
    ctx.globalAlpha = alpha;
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 0.9;
    }
    if (stroke) {
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = color;
      ctx.stroke(HEART);
    } else {
      ctx.fillStyle = color;
      ctx.fill(HEART);
    }
    ctx.restore();
  }

  function drawSparkle(s, t) {
    const tw = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + t * s.twinkleSpeed));
    const rays = 4 + s.r * 2;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.phase + t * 0.25);
    ctx.globalAlpha = tw * 0.85;
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    for (let i = 0; i < rays * 2; i++) {
      const rr = i % 2 === 0 ? s.size * 2.4 : s.size * 0.55;
      const a = (i / (rays * 2)) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function frame(time) {
    if (!running) return;
    const t = time / 1000;
    const dt = lastTime ? Math.min((time - lastTime) / 16.67, 3) : 1;
    lastTime = time;
    ctx.clearRect(0, 0, W, H);

    /* đốm sáng lấp lánh */
    for (const s of sparkles) drawSparkle(s, t);

    /* trái tim hậu cảnh + tiền cảnh */
    if (hearts.length < AMBIENT_MAX && Math.random() < 0.35) {
      const h = makeHeart(Math.random() < 0.22);
      h.y = H + 60;
      hearts.push(h);
    }
    for (let i = hearts.length - 1; i >= 0; i--) {
      const p = hearts[i];
      p.y -= p.speed * dt;
      p.flip += p.flipSpeed * 0.02 * dt;
      const x = p.x + Math.sin(t * p.swayFreq + p.phase) * p.swayAmp;
      drawHeartShape(x, p.y, p.size, p.rot, p.color, p.alpha, p.glow, p.flip, false);
      if (p.y < -70) hearts.splice(i, 1);
    }

    /* bong bóng trái tim nổi từ đáy */
    if (bubbles.length < 3 && Math.random() < 0.006) bubbles.push(makeBubble());
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y -= b.speed * dt;
      const x = b.x + Math.sin(t * b.swayFreq + b.phase) * b.swayAmp;
      drawHeartShape(x, b.y, b.size, Math.sin(t + b.phase) * 0.12, b.color, b.alpha, true, 0, true);
      if (b.y < -120) bubbles.splice(i, 1);
    }

    /* vệt trái tim theo chuột */
    for (let i = trails.length - 1; i >= 0; i--) {
      const tr = trails[i];
      tr.life -= dt;
      tr.y -= tr.speed * dt;
      tr.size += 0.06 * dt;
      const a = Math.max(tr.life / tr.maxLife, 0) * 0.85;
      drawHeartShape(tr.x, tr.y, tr.size, tr.life * 0.04, tr.color, a, true, tr.life * 0.05, false);
      if (tr.life <= 0) trails.splice(i, 1);
    }

    /* trái tim nổ */
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life -= dt;
      b.vy += 0.05 * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.flip += 0.09 * dt;
      const a = Math.max(b.life / b.maxLife, 0);
      drawHeartShape(b.x, b.y, b.size * (0.4 + a * 0.75), b.rot, b.color, a, b.glow, b.flip, false);
      if (b.life <= 0) bursts.splice(i, 1);
    }

    requestAnimationFrame(frame);
  }

  /* ── API cho main.js ── */
  window.loveBurst = (x, y, n = 20) => {
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + rnd(-0.25, 0.25);
      const v = rnd(2.4, 7.5);
      bursts.push({
        x, y,
        vx: Math.cos(ang) * v,
        vy: Math.sin(ang) * v - 1.2,
        size: rnd(10, 26),
        life: rnd(48, 90),
        maxLife: 90,
        rot: rnd(-0.6, 0.6),
        flip: rnd(0, Math.PI),
        color: pick(COLORS),
        glow: Math.random() < 0.5
      });
    }
    if (bursts.length > 260) bursts.splice(0, bursts.length - 260);
  };

  /* ── Sự kiện chuột ── */
  let lastTrailX = 0, lastTrailY = 0;
  window.addEventListener('mousemove', e => {
    const dx = e.clientX - lastTrailX, dy = e.clientY - lastTrailY;
    if (dx * dx + dy * dy > 380) {
      lastTrailX = e.clientX;
      lastTrailY = e.clientY;
      trails.push({
        x: e.clientX + rnd(-4, 4),
        y: e.clientY + rnd(-4, 4),
        size: rnd(6, 13),
        speed: rnd(0.5, 1.3),
        life: rnd(30, 55),
        maxLife: 55,
        color: pick(COLORS)
      });
      if (trails.length > 34) trails.shift();
    }
  }, { passive: true });

  window.addEventListener('pointerdown', e => {
    if (e.target.closest('button, a, .envelope, .gift-box')) return;
    window.loveBurst(e.clientX, e.clientY, 14);
  });

  /* trái tim lấp lánh khi cuộn trang */
  window.addEventListener('scroll', () => {
    if (IS_MOBILE) return;
    if (scrollCooldown <= 0) {
      scrollCooldown = 6;
      for (let i = 0; i < 2; i++) {
        const s = makeSparkle();
        s.y = rnd(H * 0.15, H * 0.9);
        sparkles.push(s);
      }
      if (sparkles.length > SPARKLE_MAX + 16) sparkles.splice(0, sparkles.length - SPARKLE_MAX - 16);
    }
  }, { passive: true });

  /* giới hạn số sparkle khi vọt quá */
  setInterval(() => {
    if (sparkles.length > SPARKLE_MAX) sparkles.length = SPARKLE_MAX;
    if (scrollCooldown > 0) scrollCooldown--;
  }, 100);

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { lastTime = 0; requestAnimationFrame(frame); }
  });

  window.addEventListener('resize', resize);

  /* ── Khởi động ── */
  resize();
  for (let i = 0; i < SPARKLE_MAX; i++) sparkles.push(makeSparkle());
  for (let i = 0; i < AMBIENT_MAX * 0.7; i++) hearts.push(makeHeart(Math.random() < 0.2));
  requestAnimationFrame(frame);
})();
