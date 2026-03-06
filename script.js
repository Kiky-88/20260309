document.addEventListener('DOMContentLoaded', () => {
  // ===== TYPING EFFECT ON ENVELOPE =====
  const typeLines = document.querySelectorAll('.type-line');
  typeLines.forEach((line, i) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.visibility = 'visible';
    setTimeout(() => {
      let j = 0;
      const interval = setInterval(() => {
        line.innerHTML = text.slice(0, j + 1) + (j < text.length - 1 ? '<span class="t-cursor"></span>' : '');
        j++;
        if (j >= text.length) clearInterval(interval);
      }, 40);
    }, i * 800);
  });

  // ===== ENVELOPE OPEN =====
  const envelope = document.getElementById('envelope-cover');
  envelope.addEventListener('click', () => {
    envelope.classList.add('opened');
    launchConfetti();
    setTimeout(() => { envelope.style.display = 'none'; }, 1000);
  });

  // ===== COUNTDOWN =====
  const weddingDate = new Date('2026-03-09T10:00:00');
  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) {
      document.querySelector('.countdown-grid').innerHTML =
        '<p style="font-size:1.3rem;color:var(--navy);font-family:JetBrains Mono,monospace;">🎉 System.out.println("Today is THE day!") 🎉</p>';
      return;
    }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff / 36e5) % 24);
    const m = Math.floor((diff / 6e4) % 60);
    const s = Math.floor((diff / 1e3) % 60);
    document.getElementById('cd-days').textContent = d;
    document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.timeline-item, .detail-card').forEach(el => observer.observe(el));

  // ===== MATRIX RAIN BACKGROUND =====
  const matrixCanvas = document.getElementById('matrix-canvas');
  const mCtx = matrixCanvas.getContext('2d');
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;

  const chars = '01アイウエオカキクケコ{}[]<>♥∞λπ∑∂UMICH';
  const fontSize = 14;
  const columns = Math.floor(matrixCanvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    mCtx.fillStyle = 'rgba(245,243,239,0.08)';
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.fillStyle = '#FFCB05';
    mCtx.font = fontSize + 'px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      mCtx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  drawMatrix();

  // ===== FLOATING PARTICLES =====
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      this.type = Math.random() > 0.7 ? 'code' : 'dot';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.008) * 0.2;
      this.twinkle += this.twinkleSpeed;
      if (this.y < -20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
      if (this.type === 'code') {
        ctx.font = (this.size * 4) + 'px JetBrains Mono';
        ctx.fillStyle = '#FFCB05';
        const symbols = ['0', '1', '{', '}', '<', '>', '♥', '∞'];
        ctx.fillText(symbols[Math.floor(Math.random() * symbols.length)], this.x, this.y);
      } else {
        ctx.fillStyle = Math.random() > 0.5 ? '#FFCB05' : '#FFD740';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 25 }, () => new Particle());
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  // ===== CONFETTI =====
  function launchConfetti() {
    const colors = ['#FFCB05', '#00274C', '#FFD740', '#1B365D', '#4ec9b0', '#c586c0'];
    for (let i = 0; i < 100; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.width = Math.random() * 10 + 5 + 'px';
      el.style.height = Math.random() * 10 + 5 + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animationDuration = Math.random() * 2 + 2 + 's';
      el.style.animationDelay = Math.random() * 1.5 + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }

  // ===== WISHES =====
  const wishesWall = document.getElementById('wishes-wall');
  const defaultWishes = [
    { name: 'Bot_Alice', text: 'return "百年好合，永结同心！"; 🎊' },
    { name: 'Dev_Alex', text: 'while(alive) { love++; } // Wishing you infinite loops of happiness! 🥂' },
    { name: '小红.py', text: 'print("才子佳人天作之合，祝你们幸福美满！") 🌟' },
  ];

  function createWishCard(name, text) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `<div class="wish-name">${name}</div><div class="wish-text">${text}</div>`;
    return card;
  }
  defaultWishes.forEach(w => wishesWall.appendChild(createWishCard(w.name, w.text)));

  const wishForm = document.getElementById('wish-form');
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wish-name').value.trim();
    const text = document.getElementById('wish-text').value.trim();
    if (!name || !text) return;
    wishesWall.prepend(createWishCard(name, text));
    launchConfetti();
    wishForm.reset();
    const btn = wishForm.querySelector('.btn-submit');
    const orig = btn.textContent;
    btn.textContent = '✅ commit successful!';
    btn.style.background = 'linear-gradient(135deg, #FFCB05, #FFD740)';
    btn.style.color = '#00274C';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2000);
  });

  // ===== MUSIC =====
  const musicBtn = document.getElementById('music-toggle');
  let audioCtx, isPlaying = false;

  function playMelody() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const melody = [
      { freq: 392, dur: 0.5 }, { freq: 440, dur: 0.5 },
      { freq: 494, dur: 0.5 }, { freq: 392, dur: 0.5 },
      { freq: 494, dur: 0.3 }, { freq: 523, dur: 0.3 },
      { freq: 494, dur: 0.6 },
      { freq: 440, dur: 0.5 }, { freq: 494, dur: 0.5 },
      { freq: 523, dur: 0.5 }, { freq: 587, dur: 0.5 },
      { freq: 523, dur: 0.3 }, { freq: 494, dur: 0.3 },
      { freq: 440, dur: 0.8 },
    ];
    let time = audioCtx.currentTime;
    melody.forEach(note => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.07, time + 0.05);
      gain.gain.linearRampToValueAtTime(0.04, time + note.dur * 0.7);
      gain.gain.linearRampToValueAtTime(0, time + note.dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(time);
      osc.stop(time + note.dur);
      time += note.dur;
    });
  }

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      playMelody();
      musicBtn.classList.add('playing');
      musicBtn.innerHTML = '🎵';
      isPlaying = true;
      setTimeout(() => { musicBtn.classList.remove('playing'); musicBtn.innerHTML = '🎶'; isPlaying = false; }, 7000);
    }
  });

  // ===== CLICK SPARKLE =====
  document.addEventListener('click', (e) => {
    if (e.target.closest('#wish-form') || e.target.closest('.music-toggle') || e.target.closest('#envelope-cover')) return;
    const symbols = ['❤', '✦', '0', '1', '{', '}', '💛', '💙', '</>'];
    for (let i = 0; i < 4; i++) {
      const spark = document.createElement('span');
      spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spark.style.cssText = `
        position:fixed; left:${e.clientX + (Math.random() - 0.5) * 40}px; top:${e.clientY}px;
        font-size:${Math.random() * 14 + 10}px;
        color:${['#FFCB05', '#00274C', '#4ec9b0', '#c586c0', '#d4a843'][Math.floor(Math.random() * 5)]};
        pointer-events:none; z-index:997;
        font-family:'JetBrains Mono',monospace;
        animation:fadeInUp 1s ease forwards;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 1000);
    }
  });
});
