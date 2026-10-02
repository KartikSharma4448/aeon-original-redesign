/* AEON v2 — cinematic hero + editorial scroll animations */

const { gsap } = window;
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  // Dismiss loader
  gsap.to('#loader', {
    opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.6,
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
      runHeroIntro();
    }
  });

  initAll();
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (!window.__aeonInit) initAll(); }, 2000);
});

/* ===== HERO INTRO ===== */
function runHeroIntro() {
  // Orbital animation first
  startHeroOrbits();

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Nav + ticker
  tl.from('.dossier-nav', { y: -28, opacity: 0, duration: 0.8 }, 0)
    .from('.ticker', { y: 20, opacity: 0, duration: 0.7 }, 0.1)

  // Hero rings scale in from nothing
    .from('#heroRingsSvg', { scale: 0.4, opacity: 0, rotate: -30,
      transformOrigin: 'center', duration: 2.2, ease: 'power3.out' }, 0.2)

  // Eyebrow slides in
    .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.7)

  // Each headline line clips up from overflow:hidden
    .to('.hero-headline .line:nth-child(1) span', {
      y: 0, duration: 1.0, ease: 'power4.out' }, 1.0)
    .to('.hero-headline .line:nth-child(2) span', {
      y: 0, duration: 1.0, ease: 'power4.out' }, 1.2)

  // Subtitle
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 1.6)

  // CTAs stagger in
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, 2.0)

  // Scroll hint
    .to('.hero-scroll', { opacity: 1, duration: 0.6 }, 2.4)

  // Dossier strip slides up
    .to('.hero-dossier', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 2.2)
    .from('.hero-dossier > div', {
      opacity: 0, y: 10, stagger: 0.07, duration: 0.5 }, 2.4);

  // Subtle parallax on rings while scrolling hero
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,
    onUpdate: self => {
      gsap.set('#heroRingsSvg', {
        rotate: -30 * self.progress,
        scale: 0.4 + self.progress * 0.22,
        opacity: 1 - self.progress * 0.6,
        transformOrigin: 'center'
      });
    }
  });
}

/* ===== Hero orbiting dots ===== */
function startHeroOrbits() {
  const svg = document.getElementById('heroRingsSvg');
  if (!svg) return;
  const cx = 500, cy = 500;
  const orbits = [
    { id: 'heroOrbitDot', r: 350, period: 22, start: 0 },
    { id: 'heroOrbitDot2', r: 240, period: 14, start: Math.PI / 2 },
    { id: 'heroOrbitDot3', r: 140, period: 9, start: Math.PI }
  ];
  orbits.forEach(o => {
    const el = document.getElementById(o.id);
    if (!el) return;
    const obj = { a: o.start };
    gsap.to(obj, {
      a: o.start + Math.PI * 2,
      duration: o.period,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const x = cx + Math.cos(obj.a) * o.r;
        const y = cy + Math.sin(obj.a) * o.r;
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
      }
    });
  });
}

function initAll() {
  if (window.__aeonInit) return;
  window.__aeonInit = true;
  setupCursor();
  setupHeartbeat();
  setupEngine();
  setupGraph();
  setupOrbit();
  setupDream();
  setupMesh();
  setupMigration();
  setupCardReveals();
  setupWordReveals();
  setupCounters();
  setupMarqueeInteraction();
  setupChapterParallax();
  startTickerClock();
}

/* ===== Cursor ===== */
function setupCursor() {
  const c = document.getElementById('cursor');
  if (!c) return;
  let x = innerWidth / 2, y = innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .dream-panel, .mesh-list .item, .heart-stage, .migration-stop, .identity-cols .col').forEach(el => {
    el.addEventListener('mouseenter', () => c.classList.add('lg'));
    el.addEventListener('mouseleave', () => c.classList.remove('lg'));
  });
}

/* ===== Card reveals — scale + translate entrance ===== */
function setupCardReveals() {
  // [data-card]: scale + translateY, staggered if siblings
  gsap.utils.toArray('[data-card]').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // [data-card-slow]: softer, delayed
  gsap.utils.toArray('[data-card-slow]').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: i * 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true
      }
    });
  });

  // Batch siblings inside .identity-cols, .dream-strip, .motiv-rewards
  ['.identity-cols .col', '.dream-strip .dream-panel', '.migration-track .migration-stop'].forEach(sel => {
    const els = gsap.utils.toArray(sel);
    if (!els.length) return;
    ScrollTrigger.create({
      trigger: els[0].parentElement,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(els, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.85,
          stagger: { each: 0.1, from: 'start' },
          ease: 'power3.out'
        });
      }
    });
  });

  // Spec rows slide in from left, staggered
  const rows = gsap.utils.toArray('.spec-table .row[data-card]');
  if (rows.length) {
    ScrollTrigger.create({
      trigger: '.spec-table',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(rows, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out'
        });
      }
    });
  }
}

/* ===== Word-by-word line reveal on [data-reveal] headings ===== */
function setupWordReveals() {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    // Preserve child structure — iterate over inline text nodes only
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(tn => {
      const words = tn.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        const outer = document.createElement('span');
        outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
        const inner = document.createElement('span');
        inner.style.cssText = 'display:inline-block;transform:translateY(115%);';
        inner.textContent = w;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      tn.parentNode.replaceChild(frag, tn);
    });

    const inners = el.querySelectorAll('span > span');
    gsap.to(inners, {
      y: 0,
      stagger: 0.05,
      duration: 1.0,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });
}

/* ===== Marquee: speed up on scroll velocity ===== */
function setupMarqueeInteraction() {
  document.querySelectorAll('.marquee').forEach(m => {
    ScrollTrigger.create({
      trigger: m,
      start: 'top bottom', end: 'bottom top',
      onUpdate: self => {
        const v = Math.abs(self.getVelocity());
        const dur = Math.max(12, 42 - v * 0.0004);
        m.querySelectorAll('.track').forEach(t => {
          t.style.animationDuration = dur + 's';
        });
      }
    });
  });
}

/* ===== Chapter heading parallax ===== */
function setupChapterParallax() {
  // Chapter background numbers drift upward slower than scroll
  gsap.utils.toArray('.chapter-bg-num').forEach(el => {
    gsap.to(el, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.chapter-open'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.4
      }
    });
  });

  // Chapter headings drift slightly upward (parallax feel)
  gsap.utils.toArray('.chapter-open h2').forEach(el => {
    gsap.from(el, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.chapter-open'),
        start: 'top bottom',
        end: 'center center',
        scrub: 0.6
      }
    });
  });

  // Heart stage subtle float
  ScrollTrigger.create({
    trigger: '.s-heart',
    start: 'top bottom', end: 'bottom top',
    scrub: 0.5,
    onUpdate: self => {
      gsap.set('.heart-stage', { y: (self.progress - 0.5) * -40 });
    }
  });

  // Identity graph drifts
  ScrollTrigger.create({
    trigger: '.s-identity',
    start: 'top bottom', end: 'bottom top',
    scrub: 0.6,
    onUpdate: self => {
      gsap.set('.identity-visual-full', { y: (self.progress - 0.5) * -50 });
    }
  });
}

/* ===== Counters ===== */
function setupCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = obj.v.toFixed(decimals) + suffix; }
    });
  });
}

/* ===== Ticker clock ===== */
function startTickerClock() {
  const clock = document.querySelector('#tickClock');
  const uptime = document.querySelector('#tickUptime');
  const start = performance.now();
  function tick() {
    if (clock) {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      clock.textContent = `${h}:${m}:${s} UTC`;
    }
    if (uptime) {
      const sec = (performance.now() - start) / 1000 + 8472619;
      uptime.textContent = sec.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + 's';
    }
    setTimeout(tick, 80);
  }
  tick();
}

/* ===== Heartbeat — clean ECG schematic on bone ===== */
function setupHeartbeat() {
  const wrap = document.querySelector('.heart-stage');
  if (!wrap) return;
  const c = wrap.querySelector('canvas') || document.createElement('canvas');
  if (!c.parentNode) wrap.prepend(c);
  c.id = 'hbCanvas';
  const ctx = c.getContext('2d');
  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = wrap.getBoundingClientRect();
    w = c.width = r.width * dpr;
    h = c.height = r.height * dpr;
    c.style.width = r.width + 'px';
    c.style.height = r.height + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function pulse(x) {
    const a = Math.exp(-((x - 0.30) ** 2) / 0.0009) * 1.0;
    const b = Math.exp(-((x - 0.36) ** 2) / 0.002) * -0.45;
    const cc = Math.exp(-((x - 0.5) ** 2) / 0.0006) * 0.22;
    return a + b + cc;
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    t += 1 / 60;

    // Schematic background: dotted grid
    ctx.fillStyle = 'rgba(20,20,30,0.18)';
    const step = 28 * dpr;
    for (let y = step; y < h; y += step) {
      for (let x = step; x < w; x += step) {
        ctx.beginPath(); ctx.arc(x, y, 0.6 * dpr, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Center crosshair circles
    const cx = w / 2, cy = h * 0.52;
    ctx.save();
    ctx.translate(cx, cy);
    for (let i = 0; i < 4; i++) {
      const r = (60 + i * 36) * dpr + Math.sin(t * 1.3 + i * 0.7) * 2 * dpr;
      ctx.strokeStyle = `rgba(20,30,60,${0.18 - i * 0.03})`;
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Pulsing core (mint)
    const pulseT = (t % 1.1) / 1.1;
    const coreR = (16 + pulse(pulseT) * 14) * dpr;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR * 3.5);
    grad.addColorStop(0, 'rgba(100, 200, 170, 0.9)');
    grad.addColorStop(0.4, 'rgba(60, 130, 250, 0.4)');
    grad.addColorStop(1, 'rgba(60, 130, 250, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0, 0, coreR * 3.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(50, 110, 220, 1)';
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(20, 30, 80, 0.9)';
    ctx.lineWidth = dpr;
    ctx.stroke();

    // ECG-like line along the bottom
    ctx.strokeStyle = 'rgba(20, 60, 160, 0.9)';
    ctx.lineWidth = 1.6 * dpr;
    ctx.beginPath();
    const baseY = h * 0.84;
    for (let x = 0; x < w; x++) {
      const localT = (x / w + t * 0.16) % 1;
      const y = baseY - pulse(localT) * 60 * dpr;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Mint underglow
    ctx.strokeStyle = 'rgba(80, 200, 160, 0.25)';
    ctx.lineWidth = 5 * dpr;
    ctx.stroke();
    ctx.restore();

    // Tick marks along baseline
    ctx.fillStyle = 'rgba(20,30,60,0.25)';
    for (let i = 0; i <= 16; i++) {
      const x = (i / 16) * w;
      ctx.fillRect(x, h * 0.84 + 18 * dpr, dpr, i % 4 === 0 ? 10 * dpr : 5 * dpr);
    }

    requestAnimationFrame(frame);
  }
  frame();
}

/* ===== Engine — distillation visualization, dark bg ===== */
function setupEngine() {
  const c = document.getElementById('engineCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = c.getBoundingClientRect();
    w = c.width = r.width * dpr;
    h = c.height = r.height * dpr;
    c.style.width = r.width + 'px';
    c.style.height = r.height + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const state = { progress: 0 };

  function drawNN(cx, cy, layers, radius, density, alpha, color) {
    const layerYs = layers.map((_, i) => cy + (i - (layers.length - 1) / 2) * 38 * dpr);
    const nodes = [];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const x = cx + (i - (count - 1) / 2) * 26 * dpr;
        nodes.push({ x, y: layerYs[li], l: li });
      }
    });
    ctx.lineWidth = dpr * 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[i].l + 1 !== nodes[j].l) continue;
        if (Math.random() > density) continue;
        ctx.strokeStyle = `rgba(140,220,255,${0.18 * alpha})`;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = color || `rgba(180,255,220,${0.95 * alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFrame(cx, cy, fw, fh, label, alpha = 1) {
    ctx.strokeStyle = `rgba(140,255,210,${0.55 * alpha})`;
    ctx.lineWidth = dpr;
    ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
    const tick = 10 * dpr;
    ctx.beginPath();
    ctx.moveTo(cx - fw / 2, cy - fh / 2 + tick);
    ctx.lineTo(cx - fw / 2, cy - fh / 2);
    ctx.lineTo(cx - fw / 2 + tick, cy - fh / 2);
    ctx.moveTo(cx + fw / 2, cy + fh / 2 - tick);
    ctx.lineTo(cx + fw / 2, cy + fh / 2);
    ctx.lineTo(cx + fw / 2 - tick, cy + fh / 2);
    ctx.stroke();
    ctx.font = `${10 * dpr}px Geist Mono, JetBrains Mono`;
    ctx.fillStyle = `rgba(220,255,235,${alpha})`;
    ctx.fillText(label, cx - fw / 2, cy + fh / 2 + 22 * dpr);
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() * 0.001;
    const p = state.progress;

    // Top: universal template
    const a1 = 1 - p * 0.55;
    const s1 = 1 - p * 0.3;
    drawNN(w / 2, h * 0.22, [5, 8, 10, 10, 10, 8, 5], 2.8 * dpr * s1, 0.5, a1);
    drawFrame(w / 2, h * 0.22, 220 * dpr, 130 * dpr, '2.1T params · universal', a1);

    // Mid: stream of particles falling
    if (p > 0.05) {
      const sa = Math.min(1, (p - 0.05) * 2.5);
      for (let i = 0; i < 24; i++) {
        const pp = ((t * 0.5 + i / 24) % 1);
        const sy = h * 0.32 + pp * h * 0.22;
        const sx = w / 2 + Math.sin(pp * 4 + i) * 26 * dpr;
        ctx.globalAlpha = (1 - pp) * sa * 0.9;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(180,255,220,1)' : 'rgba(140,200,255,1)';
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Bottom: target model (changes with progress)
    if (p > 0.4) {
      const a = Math.min(1, (p - 0.4) * 2);
      let layers, label;
      if (p < 0.65) { layers = [4, 6, 7, 6, 4]; label = 'TIER · 2  ·  4.2 GB resident'; }
      else if (p < 0.85) { layers = [3, 5, 5, 3]; label = 'EDGE  ·  480 MB resident'; }
      else { layers = [3, 4, 3]; label = 'EMBEDDED  ·  22 MB resident'; }
      drawNN(w / 2, h * 0.74, layers, 2.4 * dpr, 0.85, a, 'rgba(180, 255, 220, 1)');
      drawFrame(w / 2, h * 0.74, 200 * dpr, 110 * dpr, label, a);
    }

    requestAnimationFrame(frame);
  }
  frame();

  ScrollTrigger.create({
    trigger: '.s-engine',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    pin: window.matchMedia('(min-width: 1101px)').matches ? '.engine-canvas-wrap' : false,
    pinSpacing: false,
    onUpdate: self => {
      state.progress = self.progress;
      const ph = document.querySelectorAll('.engine-phases .ph');
      const idx = Math.min(ph.length - 1, Math.floor(self.progress * ph.length));
      ph.forEach((p, i) => p.classList.toggle('active', i === idx));
      const meter = document.querySelector('.engine-meter .bar i');
      const pct = document.querySelector('.engine-meter .pct');
      if (meter) meter.style.width = `${(1 - self.progress * 0.99) * 100}%`;
      if (pct) pct.textContent = `${(100 - self.progress * 99).toFixed(2)}%`;
    }
  });
}

/* ===== Identity graph (full-bleed) ===== */
function setupGraph() {
  const svg = document.getElementById('graphSvg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const W = 1400, H = 600;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // 4 clusters spread horizontally
  const clusters = [
    { x: 240, y: 300, label: 'episodic', count: 14 },
    { x: 560, y: 240, label: 'semantic', count: 14 },
    { x: 880, y: 360, label: 'affective', count: 12 },
    { x: 1160, y: 280, label: 'procedural', count: 14 }
  ];

  const nodes = [];
  clusters.forEach((c, ci) => {
    for (let i = 0; i < c.count; i++) {
      const a = (i / c.count) * Math.PI * 2 + ci;
      const r = 40 + Math.random() * 110;
      nodes.push({
        x: c.x + Math.cos(a) * r,
        y: c.y + Math.sin(a) * r * 0.8,
        cluster: ci,
        size: 2 + Math.random() * 3.5
      });
    }
    nodes.push({ x: c.x, y: c.y, cluster: ci, size: 9, center: true, label: c.label });
  });

  // Edges: within cluster + bridges
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const same = nodes[i].cluster === nodes[j].cluster;
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if ((same && d < 110) || (!same && Math.random() < 0.008 && d < 380)) {
        edges.push([i, j, same]);
      }
    }
  }

  const edgeG = document.createElementNS(ns, 'g');
  const colors = ['#2d6cdf', '#3aa388', '#356dc8', '#2d8a7a'];
  edges.forEach(([i, j, same]) => {
    const ln = document.createElementNS(ns, 'line');
    ln.setAttribute('x1', nodes[i].x); ln.setAttribute('y1', nodes[i].y);
    ln.setAttribute('x2', nodes[j].x); ln.setAttribute('y2', nodes[j].y);
    ln.setAttribute('stroke', same ? 'rgba(45, 80, 140, 0.4)' : 'rgba(58, 163, 136, 0.5)');
    ln.setAttribute('stroke-width', same ? 0.6 : 0.9);
    edgeG.appendChild(ln);
  });
  svg.appendChild(edgeG);

  const nodeG = document.createElementNS(ns, 'g');
  nodes.forEach((n) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y);
    c.setAttribute('r', n.size);
    c.setAttribute('fill', n.center ? colors[n.cluster] : 'rgba(45, 80, 140, 0.85)');
    if (n.center) c.setAttribute('filter', 'drop-shadow(0 0 6px ' + colors[n.cluster] + ')');
    nodeG.appendChild(c);

    if (n.center) {
      const txt = document.createElementNS(ns, 'text');
      txt.setAttribute('x', n.x);
      txt.setAttribute('y', n.y - 22);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('fill', '#1a2238');
      txt.setAttribute('font-family', 'Geist Mono, JetBrains Mono, monospace');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('letter-spacing', '2.2');
      txt.textContent = n.label.toUpperCase();
      nodeG.appendChild(txt);
    }
  });
  svg.appendChild(nodeG);

  gsap.from(nodeG.querySelectorAll('circle'), {
    scale: 0,
    transformOrigin: 'center',
    stagger: { each: 0.008, from: 'random' },
    duration: 0.7,
    ease: 'back.out(1.7)',
    scrollTrigger: { trigger: svg, start: 'top 80%' }
  });
  gsap.from(edgeG.querySelectorAll('line'), {
    opacity: 0,
    stagger: 0.004,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: svg, start: 'top 80%' }
  });

  // Sporadic edge flash
  setInterval(() => {
    const idx = Math.floor(Math.random() * edges.length);
    const lineEl = edgeG.children[idx];
    if (lineEl) {
      const orig = lineEl.getAttribute('stroke');
      gsap.fromTo(lineEl, { stroke: '#3aa388', strokeWidth: 2.4 },
        { stroke: orig, strokeWidth: 0.8, duration: 1.4, ease: 'power2.out' });
    }
  }, 280);
}

/* ===== Orbit / motivation ===== */
function setupOrbit() {
  const svg = document.getElementById('orbitSvg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const W = 600, H = 600;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const cx = W / 2, cy = H / 2;
  const rings = [
    { r: 110, label: 'prediction', color: '#2d6cdf', period: 9 },
    { r: 170, label: 'curiosity', color: '#3aa388', period: 14 },
    { r: 225, label: 'feedback', color: '#356dc8', period: 19 },
    { r: 275, label: 'efficiency', color: '#2d8a7a', period: 24 }
  ];

  rings.forEach((ring, i) => {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy);
    c.setAttribute('r', ring.r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', 'rgba(20,30,60,0.18)');
    c.setAttribute('stroke-width', 0.7);
    c.setAttribute('stroke-dasharray', i % 2 ? '2 4' : '0');
    svg.appendChild(c);
  });

  // crosshairs
  const cross = document.createElementNS(ns, 'g');
  cross.setAttribute('stroke', 'rgba(20,30,60,0.16)');
  cross.setAttribute('stroke-width', '0.5');
  cross.innerHTML = `
    <line x1="${cx}" y1="40" x2="${cx}" y2="${H - 40}"/>
    <line x1="40" y1="${cy}" x2="${W - 40}" y2="${cy}"/>
    <line x1="${cx - 8}" y1="40" x2="${cx + 8}" y2="40"/>
    <line x1="${cx - 8}" y1="${H - 40}" x2="${cx + 8}" y2="${H - 40}"/>
    <line x1="40" y1="${cy - 8}" x2="40" y2="${cy + 8}"/>
    <line x1="${W - 40}" y1="${cy - 8}" x2="${W - 40}" y2="${cy + 8}"/>
  `;
  svg.appendChild(cross);

  // Center
  const center = document.createElementNS(ns, 'circle');
  center.setAttribute('cx', cx); center.setAttribute('cy', cy);
  center.setAttribute('r', 56);
  center.setAttribute('fill', 'rgba(45, 80, 140, 0.08)');
  center.setAttribute('stroke', 'rgba(20,30,60,0.4)');
  center.setAttribute('stroke-width', 0.6);
  svg.appendChild(center);

  const pulse = document.createElementNS(ns, 'circle');
  pulse.setAttribute('cx', cx); pulse.setAttribute('cy', cy);
  pulse.setAttribute('r', 56);
  pulse.setAttribute('fill', 'none');
  pulse.setAttribute('stroke', 'rgba(58, 163, 136, 0.5)');
  pulse.setAttribute('stroke-width', 0.7);
  svg.appendChild(pulse);
  gsap.to(pulse, { attr: { r: 130 }, opacity: 0, duration: 2.6, repeat: -1, ease: 'power2.out' });

  rings.forEach((ring, i) => {
    const startAngle = i * (Math.PI / 2);
    const body = document.createElementNS(ns, 'g');

    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('r', 8);
    c.setAttribute('fill', ring.color);
    c.setAttribute('filter', 'drop-shadow(0 0 6px ' + ring.color + ')');
    body.appendChild(c);

    const lblBox = document.createElementNS(ns, 'g');
    lblBox.setAttribute('transform', 'translate(16, 4)');
    const lblText = document.createElementNS(ns, 'text');
    lblText.setAttribute('fill', '#1a2238');
    lblText.setAttribute('font-family', 'Geist Mono, JetBrains Mono, monospace');
    lblText.setAttribute('font-size', '10');
    lblText.setAttribute('letter-spacing', '1.8');
    lblText.textContent = ring.label.toUpperCase();
    lblBox.appendChild(lblText);
    body.appendChild(lblBox);

    svg.appendChild(body);

    const obj = { a: startAngle };
    gsap.to(obj, {
      a: startAngle + Math.PI * 2,
      duration: ring.period,
      repeat: -1,
      ease: 'none',
      onUpdate: () => {
        const x = cx + Math.cos(obj.a) * ring.r;
        const y = cy + Math.sin(obj.a) * ring.r;
        body.setAttribute('transform', `translate(${x}, ${y})`);
      }
    });

    // dotted connector
    const ln = document.createElementNS(ns, 'line');
    ln.setAttribute('stroke', ring.color);
    ln.setAttribute('stroke-width', 0.6);
    ln.setAttribute('stroke-dasharray', '1 3');
    ln.setAttribute('opacity', '0.4');
    svg.insertBefore(ln, body);
    gsap.ticker.add(() => {
      const x = cx + Math.cos(obj.a) * ring.r;
      const y = cy + Math.sin(obj.a) * ring.r;
      ln.setAttribute('x1', cx); ln.setAttribute('y1', cy);
      ln.setAttribute('x2', x); ln.setAttribute('y2', y);
    });
  });
}

/* ===== Dream state vizboxes ===== */
function setupDream() {
  // Panel 1: memory consolidation — convergent particles
  const v1 = document.querySelector('.dream-panel.b1 .vizbox');
  if (v1) {
    const c = document.createElement('canvas');
    v1.appendChild(c);
    const ctx = c.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
    }
    size();
    window.addEventListener('resize', size);
    const pts = Array.from({ length: 36 }, () => ({
      x: Math.random(), y: Math.random(),
      tx: 0.5 + (Math.random() - 0.5) * 0.05,
      ty: 0.5 + (Math.random() - 0.5) * 0.05,
      vx: 0, vy: 0, life: Math.random()
    }));
    function frame() {
      const w = c.width, h = c.height;
      ctx.fillStyle = 'rgba(19, 22, 35, 0.18)';
      ctx.fillRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += (p.tx - p.x) * 0.008;
        p.y += (p.ty - p.y) * 0.008;
        p.life -= 0.003;
        if (p.life <= 0 || Math.hypot(p.x - p.tx, p.y - p.ty) < 0.02) {
          p.x = Math.random(); p.y = Math.random();
          p.life = 1;
        }
        ctx.fillStyle = `rgba(180,255,220,${p.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 1.8 * dpr, 0, Math.PI * 2);
        ctx.fill();
      });
      // central node
      ctx.fillStyle = 'rgba(120, 200, 255, 1)';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(frame);
    }
    frame();
  }

  // Panel 2: synaptic pruning
  const v2 = document.querySelector('.dream-panel.b2 .vizbox');
  if (v2) {
    const c = document.createElement('canvas');
    v2.appendChild(c);
    const ctx = c.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
    }
    size();
    window.addEventListener('resize', size);
    let t = 0;
    function frame() {
      const w = c.width, h = c.height;
      ctx.clearRect(0, 0, w, h);
      t += 1 / 60;
      const cols = 14, rows = 4;
      const cw = w / cols, rh = h / rows;
      for (let r = 0; r < rows - 1; r++) {
        for (let cidx = 0; cidx < cols; cidx++) {
          for (let dcol = -1; dcol <= 1; dcol++) {
            const nc = cidx + dcol;
            if (nc < 0 || nc >= cols) continue;
            const seed = Math.sin(cidx * 13.1 + nc * 7.3 + r * 3.7) * 0.5 + 0.5;
            const phase = ((t * 0.25 + seed * 4) % 4) / 4;
            const visible = phase < 0.5;
            ctx.strokeStyle = visible
              ? `rgba(140,220,255,${0.45 * (1 - phase / 0.5)})`
              : 'rgba(140,220,255,0.04)';
            ctx.lineWidth = dpr * 0.5;
            ctx.beginPath();
            ctx.moveTo((cidx + 0.5) * cw, (r + 0.5) * rh);
            ctx.lineTo((nc + 0.5) * cw, (r + 1.5) * rh);
            ctx.stroke();
          }
        }
      }
      for (let r = 0; r < rows; r++) {
        for (let cidx = 0; cidx < cols; cidx++) {
          ctx.fillStyle = 'rgba(180,255,220,0.85)';
          ctx.beginPath();
          ctx.arc((cidx + 0.5) * cw, (r + 0.5) * rh, 1.4 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  // Panel 3: hot recompile — log
  const v3 = document.querySelector('.dream-panel.b3 .vizbox');
  if (v3) {
    v3.innerHTML = '';
    const inner = document.createElement('div');
    Object.assign(inner.style, {
      fontFamily: 'Geist Mono, JetBrains Mono, monospace',
      fontSize: '10.5px',
      color: 'rgba(180,255,220,0.7)',
      lineHeight: '1.65',
      whiteSpace: 'pre',
      height: '100%',
      overflow: 'hidden',
      letterSpacing: '0.03em'
    });
    const tokens = [
      '$ recompile --hot kernel.io',
      'optimizing /sense/touch...',
      '  ↳ 12.4MB → 4.1MB',
      'fusing attn.0, attn.1',
      'kernel ok · 0x9e2a',
      '$ deploy --rolling',
      'reload @ 0.0001s',
      'pruning weights θ<1e-5',
      '  - 184,201 / 9.2M',
      'memory compact · 38% free',
      '$ recompile vision.io',
      '  ↳ 8.7MB → 2.3MB',
      'fusing conv stack',
      'kernel ok · 0x4f12',
    ];
    inner.textContent = tokens.slice(0, 8).join('\n');
    v3.appendChild(inner);
    let i = 0;
    function tick() {
      i = (i + 1) % tokens.length;
      const out = [];
      for (let k = 0; k < 8; k++) out.push(tokens[(i + k) % tokens.length]);
      inner.textContent = out.join('\n');
      setTimeout(tick, 850);
    }
    tick();
  }
}

/* ===== Mesh ===== */
function setupMesh() {
  const svg = document.getElementById('meshSvg');
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  const W = 800, H = 640;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const agents = [];
  const cols = 6, rows = 5;
  const spacingX = 120, spacingY = 110;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offset = r % 2 ? spacingX / 2 : 0;
      const x = 60 + c * spacingX + offset;
      const y = 70 + r * spacingY;
      if (x < W - 20 && y < H - 20) agents.push({ x, y, id: agents.length });
    }
  }

  const edges = [];
  agents.forEach((a, i) => {
    agents.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 150) edges.push([i, j]);
    });
  });

  function hexPath(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      d += (i ? 'L' : 'M') + x + ',' + y + ' ';
    }
    return d + 'Z';
  }

  const edgeG = document.createElementNS(ns, 'g');
  edges.forEach(([i, j]) => {
    const ln = document.createElementNS(ns, 'line');
    ln.setAttribute('x1', agents[i].x); ln.setAttribute('y1', agents[i].y);
    ln.setAttribute('x2', agents[j].x); ln.setAttribute('y2', agents[j].y);
    ln.setAttribute('stroke', 'rgba(45, 80, 140, 0.25)');
    ln.setAttribute('stroke-width', 0.6);
    edgeG.appendChild(ln);
  });
  svg.appendChild(edgeG);

  const focusIdx = Math.floor(agents.length / 2);
  const nodeG = document.createElementNS(ns, 'g');
  agents.forEach((a, i) => {
    const hex = document.createElementNS(ns, 'path');
    hex.setAttribute('d', hexPath(a.x, a.y, 22));
    hex.setAttribute('fill', i === focusIdx ? 'rgba(45, 108, 223, 0.18)' : 'rgba(238, 234, 226, 0.4)');
    hex.setAttribute('stroke', i === focusIdx ? 'rgba(45, 108, 223, 0.9)' : 'rgba(45, 80, 140, 0.5)');
    hex.setAttribute('stroke-width', 0.8);
    nodeG.appendChild(hex);
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', a.x); c.setAttribute('cy', a.y);
    c.setAttribute('r', 3);
    c.setAttribute('fill', i === focusIdx ? '#2d6cdf' : 'rgba(45, 80, 140, 0.6)');
    nodeG.appendChild(c);
  });
  svg.appendChild(nodeG);

  function emitPacket() {
    if (!edges.length) return;
    const [i, j] = edges[Math.floor(Math.random() * edges.length)];
    const a = agents[i], b = agents[j];
    const dot = document.createElementNS(ns, 'circle');
    dot.setAttribute('r', 2.8);
    dot.setAttribute('fill', Math.random() < 0.5 ? '#3aa388' : '#2d6cdf');
    dot.setAttribute('filter', 'drop-shadow(0 0 4px currentColor)');
    svg.appendChild(dot);
    const obj = { t: 0 };
    gsap.to(obj, {
      t: 1,
      duration: 1 + Math.random() * 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        dot.setAttribute('cx', a.x + (b.x - a.x) * obj.t);
        dot.setAttribute('cy', a.y + (b.y - a.y) * obj.t);
      },
      onComplete: () => dot.remove()
    });
  }
  setInterval(emitPacket, 200);
}

/* ===== Migration timeline rail ===== */
function setupMigration() {
  const svg = document.getElementById('migrationSvg');
  const track = document.querySelector('.migration-track');
  if (!svg || !track) return;
  const stops = track.querySelectorAll('.migration-stop .dot');
  if (stops.length < 2) return;

  function position() {
    svg.innerHTML = '';
    const sr = track.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    const pts = Array.from(stops).map(d => {
      const r = d.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
    });
    const ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const path = document.createElementNS(ns, 'path');
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - 40;
      path.setAttribute('d', `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(45, 108, 223, 0.4)');
      path.setAttribute('stroke-width', 1);
      path.setAttribute('stroke-dasharray', '3 5');
      svg.appendChild(path);

      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', 4.5);
      dot.setAttribute('fill', i % 2 ? '#3aa388' : '#2d6cdf');
      dot.setAttribute('filter', 'drop-shadow(0 0 6px currentColor)');
      svg.appendChild(dot);

      const length = path.getTotalLength();
      const obj = { t: 0 };
      gsap.to(obj, {
        t: 1,
        duration: 2.4 + i * 0.3,
        repeat: -1,
        ease: 'power2.inOut',
        delay: i * 0.4,
        onUpdate: () => {
          const p = path.getPointAtLength(obj.t * length);
          dot.setAttribute('cx', p.x);
          dot.setAttribute('cy', p.y);
        }
      });
    }
  }
  setTimeout(position, 400);
  window.addEventListener('resize', () => setTimeout(position, 200));

  // Parallax: each stop drifts vertically opposite directions
  ScrollTrigger.create({
    trigger: '.migration-rail',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: self => {
      const p = self.progress;
      track.querySelectorAll('.migration-stop').forEach((s, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const amt = (p - 0.5) * 50 * dir;
        s.style.transform = `translateY(${amt}px)`;
      });
      setTimeout(position, 0);
    }
  });
}

