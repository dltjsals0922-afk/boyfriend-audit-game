(() => {
  // -------- roundRect polyfill --------
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      this.beginPath();
      this.moveTo(x + rr, y);
      this.arcTo(x + w, y, x + w, y + h, rr);
      this.arcTo(x + w, y + h, x, y + h, rr);
      this.arcTo(x, y + h, x, y, rr);
      this.arcTo(x, y, x + w, y, rr);
      this.closePath();
      return this;
    };
  }

  const $ = (id) => document.getElementById(id);

  // Screens
  const screenGame = $("screen-game");
  const screenReport = $("screen-report");

  // Game UI
  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const hudTime = $("hud-time");
  const hudScore = $("hud-score");
  const toast = $("toast");
  const btnStart = $("btn-start");
  const btnRestart = $("btn-restart");
  const btnBack = $("btn-back");

  // Report DOM
  const heroImg = $("heroImg");
  const factPhotoA = $("factPhotoA");
  const factPhotoB = $("factPhotoB");
  const glassesPhoto = $("glassesPhoto");

  const repKpis = $("rep-kpis");
  const repObservationProse = $("rep-observation-prose");
  const factsFood = $("facts-food");
  const factsHabits = $("facts-habits");
  const factsGlasses = $("facts-glasses");
  const repChangeLog = $("rep-change-log");
  const repAffectionNotes = $("rep-affection-notes");
  const repScore = $("rep-score");
  const repTime = $("rep-time");
  const repComment = $("rep-comment");
  const repEnding = $("rep-ending");

  // -------- Assets --------
  const ASSETS = {
    player: "images/mini_hayden.png",
    me: "images/mini_me.png",
    hero: "images/hero.jpg",
    factA: "images/fact_a.jpg",
    factB: "images/fact_b.jpg",
    glasses: "images/glasses.jpg",
  };

  // preload report images
  if (heroImg) heroImg.src = ASSETS.hero;
  if (factPhotoA) factPhotoA.src = ASSETS.factA;
  if (factPhotoB) factPhotoB.src = ASSETS.factB;
  if (glassesPhoto) glassesPhoto.src = ASSETS.glasses;

  // preload sprites
  const playerImg = new Image();
  playerImg.src = ASSETS.player;

  const meImg = new Image();
  meImg.src = ASSETS.me;

  // -------- Copy --------
  const COPY = {
    intro: "Survive 30 seconds and unlock your report 💗",
    start: "Alright, oppa. Don’t embarrass yourself 😌",
    win: "Okay okay. I’m impressed.",
    failPool: [
      "Oops… that was fast. Should I pretend I didn’t see that?",
      "Wow. 30 seconds felt… ambitious.",
      "It’s okay. You’re cute even when you lose.",
      "Again? I’ll wait. I’m patient 😏",
      "That obstacle wasn’t even that scary."
    ],
    reportCommentBase: "Performance Review: Not perfect. Still adorable."
  };

  // -------- Report content --------
  const KPI_DATA_BASE = [
    { label: "Cuteness Index", value: "97%", note: "⚠ Overexposure may cause emotional overload" },
    { label: "Emotional Stability", value: "A+", note: "Unpredictable, yet deeply reassuring" },
    { label: "“I Miss You” Trigger Rate", value: "Constant", note: "24/7 background process running" },
    { label: "Recovery Time (After Teasing)", value: "Fast", note: "Primary protocol: hugging" },
    { label: "Feeding Requirement", value: "Regular", note: "Snack delivery increases happiness exponentially" },
    { label: "Heart Stress Level (Mine)", value: "High", note: "Cause: You" }
  ];

  const OBSERVATION_PROSE = `
    <p><b>Hayden displays a unique duality.</b></p>
    <p>
      During the day, he appears gentle, soft, and almost childlike—
      especially when sleeping, where his expression resembles that of a baby.
    </p>
    <p>
      At night, however, his energy intensifies dramatically,
      as if a different mode has been activated.
    </p>
    <p>
      He works incredibly hard and takes responsibility seriously,
      yet remains deeply attentive to the people around him.
      Helping others seems to come naturally to him.
    </p>
  `;

  const FACTS_FOOD = [
    "Loves bulgogi kimbap and shabu-shabu",
    "Absolutely refuses to eat live octopus",
    "Must eat fried chicken. This is non-negotiable.",
    "Enjoys strange characters and novelty keychains",
    "Has a soft spot for the Buldak ramen character",
    "Surprisingly skilled with chopsticks",
    "Eats anything well, with enthusiasm"
  ];

  const FACTS_HABITS = [
    "Snores loudly while sleeping",
    "Complains about foot pain daily",
    "Has very large feet",
    "Listens to audiobooks every single day",
    "Shouts “computer, rain sound!” before sleeping",
    "Cannot justify movies over ₩5,000— unless I want to watch them, in which case ₩50,000 is acceptable"
  ];

  const CHANGE_LOG = `
    <p>Early observations noted a tendency to prepare only his own utensils.</p>
    <p>
      However, recent data shows a significant behavioral shift:
      when presented with the best piece of food,
      he now gives it to me first.
    </p>
    <p class="muted">This change indicates emotional growth, increased attunement, and genuine care.</p>
  `;

  const AFFECTION_NOTES = `
    <p>
      Despite his calm expression,
      the natural curve of his lips gives the impression of warmth.
    </p>
    <p>
      His arms are strong,
      his chest feels unexpectedly soft,
      and his presence is consistently comforting.
    </p>
  `;

  const GLASSES_BLOCK = `
    <p>
      After switching to brown glasses—at my recommendation—
      external recognition of his attractiveness increased.
    </p>
    <p class="muted">
      This has caused mild concern.
    </p>
  `;

  const GLASSES_FACTS = [
    "Increased public awareness",
    "Heightened personal protectiveness"
  ];

  const ENDING_NOTE = `
    No matter how strange,<br/>
    loud,<br/>
    annoying,<br/>
    or exhausting he may be—<br/><br/>
    <b>I am happiest when he is next to me.</b><br/><br/>
    Report completed.<br/>
    Reviewed daily.<br/>
    Never archived.
  `;

  // -------- Helpers --------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const randFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function setToast(msg){ if (toast) toast.innerHTML = msg; }

  // 비율 유지(Contain) + 살짝 확대(너무 크면 1.00으로)
  function drawImageContain(img, x, y, w, h, zoom=1.05) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    if (!iw || !ih) return;

    const scale = Math.min(w / iw, h / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;

    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
  }

  // 하트
  function drawHeart(x, y, scale=1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,77,141,0.95)";
    ctx.beginPath();
    ctx.moveTo(11, 6);
    ctx.bezierCurveTo(11, -2, 0, -2, 0, 6);
    ctx.bezierCurveTo(0, 12, 7, 15, 11, 18);
    ctx.bezierCurveTo(15, 15, 22, 12, 22, 6);
    ctx.bezierCurveTo(22, -2, 11, -2, 11, 6);
    ctx.fill();
    ctx.restore();
  }

  function drawHeartByType(h) {
    if (h.type === "big") {
      drawHeart(h.x, h.y, 1.25);
      return;
    }
    if (h.type === "risk") {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.fillStyle = "rgba(124,92,255,0.95)";
      ctx.beginPath();
      ctx.moveTo(11, 6);
      ctx.bezierCurveTo(11, -2, 0, -2, 0, 6);
      ctx.bezierCurveTo(0, 12, 7, 15, 11, 18);
      ctx.bezierCurveTo(15, 15, 22, 12, 22, 6);
      ctx.bezierCurveTo(22, -2, 11, -2, 11, 6);
      ctx.fill();
      ctx.restore();
      return;
    }
    drawHeart(h.x, h.y, 1.0);
  }

  function renderReport(dynamicKpis, dynamicComment) {
    const kpis = dynamicKpis ?? KPI_DATA_BASE;

    if (repKpis) {
      repKpis.innerHTML = kpis.map(k => `
        <div class="kpi">
          <div class="kpi-label">${k.label}</div>
          <div class="kpi-val">${k.value}</div>
          <div class="kpi-note">${k.note}</div>
        </div>
      `).join("");
    }

    if (repObservationProse) repObservationProse.innerHTML = OBSERVATION_PROSE;
    if (factsFood) factsFood.innerHTML = FACTS_FOOD.map(x => `<li>${x}</li>`).join("");
    if (factsHabits) factsHabits.innerHTML = FACTS_HABITS.map(x => `<li>${x}</li>`).join("");
    if (repChangeLog) repChangeLog.innerHTML = CHANGE_LOG;
    if (repAffectionNotes) repAffectionNotes.innerHTML = AFFECTION_NOTES + GLASSES_BLOCK;
    if (factsGlasses) factsGlasses.innerHTML = GLASSES_FACTS.map(x => `<li>${x}</li>`).join("");
    if (repEnding) repEnding.innerHTML = ENDING_NOTE;

    if (repComment) repComment.textContent = dynamicComment ?? COPY.reportCommentBase;
  }

  // -------- Game constants/state --------
  const W = canvas.width, H = canvas.height;
  const GROUND_Y = H - 56;
  const DURATION = 30.0;

  let mood = "calm"; // calm / focused / overloaded

  let running = false;
  let lastT = 0;
  let elapsed = 0;
  let score = 0;
  let jumpsLeft = 2;   // ✅ 더블 점프

  let speed = 240;
  let spawnObsTimer = 0;
  let spawnHeartTimer = 0;

  const ending = { active:false, t:0, phase:0 };

  const player = {
    x: 120, y: GROUND_Y,
    w: 86, h: 86,   // ✅ 캐릭터 키움
    vy: 0, onGround: true,
  };

  const me = {
    x: W + 120, y: GROUND_Y,
    w: 80, h: 80,
    visible: false
  };

  const obstacles = [];
  const hearts = [];
  const particles = [];
  function drawSprite(img, x, y, w, h, flipX = false) {
    ctx.save();
    if (flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);
    } else {
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, w, h);
    }
    ctx.restore();
  }

  function reset() {
    running = false;
    lastT = 0;
    elapsed = 0;
    score = 0;
    jumpsLeft = 2;

    mood = "calm";
    speed = 240;
    spawnObsTimer = 0;
    spawnHeartTimer = 0;

    obstacles.length = 0;
    hearts.length = 0;
    particles.length = 0;

    player.x = 120;
    player.y = GROUND_Y;
    player.vy = 0;
    player.onGround = true;

    ending.active = false;
    ending.t = 0;
    ending.phase = 0;

    me.visible = false;
    me.x = W + 120;
    me.y = GROUND_Y;

    if (hudScore) hudScore.textContent = "0";
    if (hudTime) hudTime.textContent = `${DURATION.toFixed(1)}s`;
    setToast(COPY.intro);

    if (btnRestart) btnRestart.disabled = true;
  }

  function start() {
    reset();
    running = true;
    if (btnRestart) btnRestart.disabled = true;
    setToast(COPY.start);
    requestAnimationFrame(step);
  }

  function gameOver() {
    running = false;
    if (btnRestart) btnRestart.disabled = false;
    setToast(randFrom(COPY.failPool));
  }

  function jump() {
    if (!running || ending.active) return;
    if(jumpsLeft <= 0) return;

    player.vy = -640;
    player.onGround = false;
    jumpsLeft -= 1;
  }

  function sampleHeartType() {
    const r = Math.random();
    if (r < 0.62) return "safe";
    if (r < 0.90) return "big";
    return "risk";
  }

  // ✅ 장애물 더 큼
  function spawnObstacle() {
    const tall = Math.random() < 0.35;
    const w = tall ? 42 : 56;
    const h = tall ? 104 : 56;
    obstacles.push({
      x: W + 30,
      y: (GROUND_Y - h) + 10,
      w, h
    });
  }

  function spawnHeart() {
    const y = (GROUND_Y - 170) + Math.random() * 150;
    hearts.push({ x: W + 20, y, w: 22, h: 18, type: sampleHeartType() });
  }

  function popParticles(x, y) {
    for (let i = 0; i < 14; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.8) * 320,
        life: 0.55 + Math.random() * 0.30,
      });
    }
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function updateMoodAndPacing() {
    if (elapsed < 10) mood = "calm";
    else if (elapsed < 20) mood = "focused";
    else mood = "overloaded";

    if (mood === "calm") speed = 220 + elapsed * 3.0;
    if (mood === "focused") speed = 260 + (elapsed - 10) * 5.0;
    if (mood === "overloaded") speed = 320 + (elapsed - 20) * 7.0;
  }

  function drawBackground(t) {
    ctx.clearRect(0, 0, W, H);

    // tint
    if (mood === "calm") ctx.fillStyle = "rgba(255,77,141,0.03)";
    if (mood === "focused") ctx.fillStyle = "rgba(124,92,255,0.04)";
    if (mood === "overloaded") ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(0, 0, W, H);

    // stars
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 28; i++) {
      const sx = (i * 103 + t * 24) % W;
      const sy = (i * 57) % H;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;

    // ground
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 22);
    ctx.lineTo(W, GROUND_Y + 22);
    ctx.stroke();
  }

  function drawObstacle(o) {
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.roundRect(o.x, o.y, o.w, o.h, 12);
    ctx.fill();
  }

  function drawPlayer() {
    const px = player.x;
    const py = player.y - player.h;

    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(px + player.w/2, GROUND_Y + 26, 20, 7, 0, 0, Math.PI*2);
    ctx.fill();

    if (playerImg.complete && playerImg.naturalWidth > 0) {
      // 컷씬에서는 오른쪽에 있는 헤이든이 "왼쪽(너 쪽)"을 보게
      const faceLeft = ending.active ? true : false;
      drawSprite(playerImg, px, py, player.w, player.h, faceLeft);

    } else {
      ctx.fillStyle = "rgba(255,77,141,0.95)";
      ctx.roundRect(px, py, player.w, player.h, 12);
      ctx.fill();
    }
  }
  function drawSprite(img, x, y, w, h, flipX = false) {
    ctx.save();

    if (flipX) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);
    } else {
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, w, h);
    }

    ctx.restore();
  }

  function drawMe() {
    if (!me.visible) return;

    const px = me.x;
    const py = me.y - me.h;

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(px + me.w / 2, GROUND_Y + 26, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (meImg.complete && meImg.naturalWidth > 0) {
      // ✅ 컷씬에서는 "오른쪽을 바라보게" (헤이든 쪽)
      const flipX = true;
      drawSprite(meImg, px, py, me.w, me.h, flipX);
    } else {
      ctx.fillStyle = "rgba(124,92,255,0.85)";
      ctx.roundRect(px, py, me.w, me.h, 12);
      ctx.fill();
    }
  }


  function drawParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 900 * dt;

      ctx.globalAlpha = clamp(p.life, 0, 1);
      ctx.fillStyle = "rgba(255,77,141,0.9)";
      ctx.fillRect(p.x, p.y, 3, 3);
      ctx.globalAlpha = 1;
    }
  }

  function drawEndingOverlay(alpha, lines) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "700 22px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";

    const baseY = H * 0.44;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], W / 2, baseY + i * 30);
    }
    ctx.restore();
  }

  function startEndingCutscene() {
    ending.active = true;
    ending.t = 0;
    ending.phase = 0;

    // 바닥 고정
    player.vy = 0;
    player.onGround = true;
    player.y = GROUND_Y;

    // 너는 오른쪽에서 왼쪽으로
    me.visible = true;
    me.y = GROUND_Y;
    me.x = W + 140;

    setToast(COPY.win);
  }

  function updateEnding(dt) {
    ending.t += dt;

    const meetXPlayer = W * 0.58 - player.w / 2;
    const meetXMe = meetXPlayer - me.w + 14;

    // 헤이든 바닥 고정
    player.y = GROUND_Y;
    player.vy = 0;
    player.onGround = true;

    if (ending.phase === 0) {
      player.x += (meetXPlayer - player.x) * 0.10;
      if (Math.abs(player.x - meetXPlayer) < 1.2) {
        ending.phase = 1;
        ending.t = 0;
      }
      return;
    }

    if (ending.phase === 1) {
      me.x += (meetXMe - me.x) * 0.10;
      if (Math.abs(me.x - meetXMe) < 1.2) {
        ending.phase = 2;
        ending.t = 0;
      }
      return;
    }

    if (ending.phase === 2) {
      // 폭죽
      if (ending.t < 1.0) {
        for (let k = 0; k < 5; k++) {
          if (Math.random() < 0.75) {
            const cx = (player.x + player.w/2 + me.x + me.w/2) / 2;
            const cy = (GROUND_Y - player.h) + 24;
            popParticles(cx, cy);
          }
        }
      }
      if (ending.t > 1.10) {
        ending.phase = 3;
        ending.t = 0;
      }
      return;
    }

    if (ending.phase === 3) {
      if (ending.t > 1.2) openReport();
    }
  }

  function openReport() {
    if (repScore) repScore.textContent = String(score);
    if (repTime) repTime.textContent = `${Math.max(0, DURATION - elapsed).toFixed(1)}s`;

    renderReport(undefined, COPY.reportCommentBase);

    screenGame.classList.add("hidden");
    screenReport.classList.remove("hidden");
    window.scrollTo(0, 0);

    ending.active = false;
  }

  function win() {
    running = false;
    if (btnRestart) btnRestart.disabled = false;

    lastT = 0;              // dt 꼬임 방지
    startEndingCutscene();  // 컷씬 시작
    requestAnimationFrame(step); // 멈춤 방지
  }

  function step(ts) {
    if (!running && !ending.active) return;

    if (!lastT) lastT = ts;
    const dt = Math.min(0.033, (ts - lastT) / 1000);
    lastT = ts;

    // ---- 컷씬 ----
    if (ending.active) {
      drawBackground(elapsed);

      for (const h of hearts) drawHeartByType(h);
      for (const o of obstacles) drawObstacle(o);

      drawMe();
      drawPlayer();
      drawParticles(dt);

      updateEnding(dt);

      if (ending.phase === 3) {
        const a = clamp(ending.t / 0.7, 0, 1);
        drawEndingOverlay(a, [
          "You did well.",
          "I was watching the entire time.",
          "And I still chose you."
        ]);
      }

      requestAnimationFrame(step);
      return;
    }

    // ---- 게임 ----
    elapsed += dt;
    updateMoodAndPacing();

    spawnObsTimer -= dt;
    spawnHeartTimer -= dt;

    // ✅ 간격 더 넓게
    let obsInterval, heartInterval;
    if (mood === "calm") { obsInterval = 1.70; heartInterval = 0.62; }
    else if (mood === "focused") { obsInterval = 1.45; heartInterval = 0.75; }
    else { obsInterval = 1.20; heartInterval = 0.95; }

    obsInterval += Math.random() * 0.25;
    heartInterval += Math.random() * 0.25;

    if (spawnObsTimer <= 0) { spawnObstacle(); spawnObsTimer = obsInterval; }
    if (spawnHeartTimer <= 0) { spawnHeart(); spawnHeartTimer = heartInterval; }

    // physics
    player.y += player.vy * dt;
    player.vy += 1400 * dt;

    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
      jumpsLeft = 2; 
    }

    // move
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= speed * dt;
      if (obstacles[i].x + obstacles[i].w < -60) obstacles.splice(i, 1);
    }
    for (let i = hearts.length - 1; i >= 0; i--) {
      hearts[i].x -= speed * dt;
      if (hearts[i].x + hearts[i].w < -60) hearts.splice(i, 1);
    }

    // collisions
    const pRect = {
      x: player.x + 12,
      y: (player.y - player.h) + 12,
      w: player.w - 24,
      h: player.h - 24
    };

    for (const o of obstacles) {
      const oRect = { x: o.x, y: o.y, w: o.w, h: o.h };
      if (rectsOverlap(pRect, oRect)) { gameOver(); return; }
    }

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      const hRect = { x: h.x, y: h.y, w: h.w, h: h.h };
      if (rectsOverlap(pRect, hRect)) {
        hearts.splice(i, 1);

        if (h.type === "safe") score += 1;
        else if (h.type === "big") score += 5;
        else { if (Math.random() < 0.85) spawnObstacle(); }

        if (hudScore) hudScore.textContent = String(score);
        popParticles(h.x + 11, h.y + 10);
      }
    }

    // render
    drawBackground(elapsed);
    for (const h of hearts) drawHeartByType(h);
    for (const o of obstacles) drawObstacle(o);
    drawPlayer();
    drawParticles(dt);

    // HUD time
    const remaining = Math.max(0, DURATION - elapsed);
    if (hudTime) hudTime.textContent = `${remaining.toFixed(1)}s`;

    if (remaining <= 0) { win(); return; }
    requestAnimationFrame(step);
  }

  // -------- Controls --------
  btnStart?.addEventListener("click", start);
  btnRestart?.addEventListener("click", start);

  btnBack?.addEventListener("click", () => {
    screenReport.classList.add("hidden");
    screenGame.classList.remove("hidden");
    reset();
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      jump();
    }
    if (e.code === "Enter" && !running && screenReport.classList.contains("hidden") && !ending.active) {
      start();
    }
  });

  canvas.addEventListener("pointerdown", () => jump());

  // init (시작은 버튼으로)
  reset();
})();
