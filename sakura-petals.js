/* =========================================================
   ASS Lyric Replacer — Cursor Sakura Petals
   Decorative-only canvas overlay: spawns falling cherry-
   blossom petals as the cursor moves, then lets them drift
   down with gravity + sway + rotation until they fade out.
   Fully self-contained; never intercepts clicks.
   ========================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var canvas = document.createElement('canvas');
    canvas.id = 'sakura-petals-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '45';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0, height = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var PETAL_COLORS = [
      { fill: '#FFB7CE', shade: '#F472B6' },
      { fill: '#FFD1E3', shade: '#EC4899' },
      { fill: '#FFC6DD', shade: '#F9A8D4' },
      { fill: '#FFFFFF', shade: '#FBCFE8' }
    ];

    var MAX_PETALS = reduceMotion ? 0 : 70;
    var petals = [];
    var lastSpawn = 0;
    var SPAWN_INTERVAL = 45; // ms between spawns while moving
    var lastPointer = null;

    function spawnPetal(x, y) {
      if (petals.length >= MAX_PETALS) return;
      var palette = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
      petals.push({
        x: x + (Math.random() * 16 - 8),
        y: y + (Math.random() * 16 - 8),
        size: 6 + Math.random() * 7,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        vy: 0.7 + Math.random() * 1.1,
        swayAmp: 12 + Math.random() * 18,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swaySeed: Math.random() * 1000,
        life: 0,
        maxLife: 260 + Math.random() * 160,
        fill: palette.fill,
        shade: palette.shade
      });
    }

    function drawPetal(p, opacity) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = opacity;

      var s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.9, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.9, s * 0.5, -s * 0.9, -s * 0.6, 0, -s);
      ctx.closePath();

      var grad = ctx.createLinearGradient(0, -s, 0, s);
      grad.addColorStop(0, p.fill);
      grad.addColorStop(1, p.shade);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(190,24,93,0.15)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0, s * 0.85);
      ctx.stroke();

      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (var i = petals.length - 1; i >= 0; i--) {
        var p = petals[i];
        p.life++;
        p.y += p.vy;
        p.x += Math.sin((p.life * p.swaySpeed) + p.swaySeed) * (p.swayAmp * 0.02);
        p.angle += p.rotSpeed;

        var lifeRatio = p.life / p.maxLife;
        var opacity = lifeRatio < 0.12
          ? lifeRatio / 0.12
          : (1 - Math.max(0, (lifeRatio - 0.7) / 0.3));

        if (p.life >= p.maxLife || p.y > height + 40 || opacity <= 0) {
          petals.splice(i, 1);
          continue;
        }
        drawPetal(p, Math.max(0, Math.min(1, opacity)) * 0.9);
      }

      requestAnimationFrame(tick);
    }

    function handlePointerMove(x, y) {
      var now = performance.now();
      if (lastPointer) {
        var dist = Math.hypot(x - lastPointer.x, y - lastPointer.y);
        if (dist < 4) return; // ignore tiny jitter
      }
      lastPointer = { x: x, y: y };
      if (now - lastSpawn < SPAWN_INTERVAL) return;
      lastSpawn = now;
      spawnPetal(x, y);
    }

    if (!reduceMotion) {
      window.addEventListener('pointermove', function (e) {
        handlePointerMove(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('touchmove', function (e) {
        var t = e.touches && e.touches[0];
        if (t) handlePointerMove(t.clientX, t.clientY);
      }, { passive: true });
    }

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
