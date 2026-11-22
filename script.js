/* -------------------------------------------------------------------
   1. SHARED WEB AUDIO CONTEXT & TOAST HELPER
------------------------------------------------------------------- */
let audioCtx = null;
let toastTimeout = null;

function ensureAudioReady() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function showToast(message, icon = '💜') {
    const container = document.getElementById('toast-container');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');

    msgEl.textContent = message;
    iconEl.textContent = icon;
    container.classList.add('visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        container.classList.remove('visible');
    }, 3800);
}

/* -------------------------------------------------------------------
   2. VELVET ENVELOPE INTRO OVERLAY
------------------------------------------------------------------- */
let surpriseOpened = false;

function openBirthdaySurprise() {
    if (surpriseOpened) return;
    surpriseOpened = true;

    const envelope = document.getElementById('envelope-box');
    const overlay = document.getElementById('intro-overlay');

    envelope.classList.add('envelope-open');
    burstGlitter(window.innerWidth / 2, window.innerHeight / 2, 130, false);

    setTimeout(() => {
        overlay.classList.add('hidden-overlay');
        showToast('Happy 20th birthday, Joyce. Today is yours. 🥂', '💜');
    }, 650);

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1400);
}

/* -------------------------------------------------------------------
   3. POPPING VIRTUAL KISS BUTTON WITH GLITTER BURST
------------------------------------------------------------------- */
let kissCount = 0;

function playKissPopSound() {
    try {
        ensureAudioReady();
        const now = audioCtx.currentTime;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.09);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

        const shimmer = audioCtx.createOscillator();
        const shimmerGain = audioCtx.createGain();
        shimmer.type = 'triangle';
        shimmer.frequency.setValueAtTime(1318.5, now + 0.05);
        shimmerGain.gain.setValueAtTime(0.08, now + 0.05);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        shimmer.connect(shimmerGain);
        shimmerGain.connect(audioCtx.destination);
        shimmer.start(now + 0.05);
        shimmer.stop(now + 0.48);
    } catch (err) {
        // Ignore if browser blocks audio
    }
}

function popVirtualKiss() {
    const btn = document.getElementById('pop-kiss-btn');
    const badge = document.getElementById('kiss-counter-badge');

    kissCount += 1;
    badge.textContent = kissCount;

    btn.classList.remove('animate-kiss-pop');
    void btn.offsetWidth;
    btn.classList.add('animate-kiss-pop');

    playKissPopSound();

    const rect = btn.getBoundingClientRect();
    burstGlitter(rect.left + rect.width / 2, rect.top + rect.height / 2, 95, true);

    const sweetLines = [
        'A birthday kiss just for you, Joyce. 💋✨',
        'Sending another kiss straight to those gorgeous lips. 💜',
        'You are dangerously irresistible at twenty, Joyce. 🔥',
        'Consider yourself spoiled with kisses today. 🥂💋'
    ];
    showToast(sweetLines[(kissCount - 1) % sweetLines.length], '💋');
}

/* -------------------------------------------------------------------
   4. SINGLE ROUNDED PHOTO UPLOAD FRAME FOR JOYCE
------------------------------------------------------------------- */
function triggerPhotoUpload() {
    const input = document.getElementById('upload-input-joyce');
    if (input) input.click();
}

function applyPhotoToFrame(dataUrl) {
    const imgEl = document.getElementById('preview-img-joyce');
    const placeholderEl = document.getElementById('placeholder-joyce');
    if (!imgEl || !placeholderEl) return;

    imgEl.src = dataUrl;
    imgEl.classList.remove('hidden');
    placeholderEl.classList.add('hidden');
}

function handlePhotoSelected(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        applyPhotoToFrame(dataUrl);
        try {
            localStorage.setItem('joyce_twenty_frame', dataUrl);
        } catch (err) {
            // Ignore storage quota errors
        }
        burstGlitter(window.innerWidth / 2, window.innerHeight / 2, 70, false);
        showToast('Your photo looks amazing in your frame, Joyce. 💜', '✨');
    };
    reader.readAsDataURL(file);
}

function restoreSavedPhoto() {
    try {
        const saved = localStorage.getItem('joyce_twenty_frame');
        if (saved) applyPhotoToFrame(saved);
    } catch (e) {
        // Ignore storage access errors
    }
}

/* -------------------------------------------------------------------
   5. 20 REALISTIC 3D SHADED BALLOONS AROUND THE CAKE
------------------------------------------------------------------- */
function buildTwentyBalloons() {
    const ring = document.getElementById('balloons-ring');
    if (!ring) return;
    ring.innerHTML = '';

    const coords = [
        { left: '3%',  top: '8%' },
        { left: '11%', top: '28%' },
        { left: '6%',  top: '54%' },
        { left: '15%', top: '72%' },
        { left: '21%', top: '6%' },
        { left: '31%', top: '2%' },
        { left: '41%', top: '-2%' },
        { left: '51%', top: '-2%' },
        { left: '61%', top: '2%' },
        { left: '71%', top: '6%' },
        { left: '80%', top: '4%' },
        { left: '88%', top: '14%' },
        { left: '93%', top: '34%' },
        { left: '89%', top: '56%' },
        { left: '83%', top: '74%' },
        { left: '4%',  top: '32%' },
        { left: '19%', top: '45%' },
        { left: '78%', top: '44%' },
        { left: '94%', top: '18%' },
        { left: '26%', top: '20%' }
    ];

    const themes = [
        { base: '#7c3aed', dark: '#2e1065', hi: '#e9d5ff' },
        { base: '#a1a1aa', dark: '#27272a', hi: '#ffffff' },
        { base: '#3b0764', dark: '#09090d', hi: '#c084fc' },
        { base: '#52525b', dark: '#09090d', hi: '#d4d4d8' }
    ];

    coords.forEach((pos, idx) => {
        const theme = themes[idx % themes.length];
        const gradId = `balloonGrad-${idx}`;
        const floatClass = idx % 2 === 0 ? 'balloon-float-a' : 'balloon-float-b';
        const delay = `${(idx * 0.18) % 2.4}s`;

        const wrapper = document.createElement('div');
        wrapper.className = `balloon-item ${floatClass}`;
        wrapper.style.left = pos.left;
        wrapper.style.top = pos.top;
        wrapper.style.animationDelay = delay;

        wrapper.innerHTML = `
            <svg class="balloon-svg" viewBox="0 0 64 96" fill="none">
                <defs>
                    <radialGradient id="${gradId}" cx="35%" cy="28%" r="68%">
                        <stop offset="0%" stop-color="${theme.hi}" stop-opacity="0.95"/>
                        <stop offset="38%" stop-color="${theme.base}"/>
                        <stop offset="100%" stop-color="${theme.dark}"/>
                    </radialGradient>
                </defs>
                <path d="M32 4C16.5 4 5 16.2 5 31.5C5 46.8 24.5 58 30.5 64.5H33.5C39.5 58 59 46.8 59 31.5C59 16.2 47.5 4 32 4Z" fill="url(#${gradId})"/>
                <ellipse cx="22" cy="21" rx="5.5" ry="10" transform="rotate(-24 22 21)" fill="#ffffff" fill-opacity="0.32"/>
                <polygon points="29,64.5 35,64.5 36.5,68.5 27.5,68.5" fill="${theme.dark}"/>
                <path d="M32 68.5C29 75 35 81 31 94" stroke="#a1a1aa" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
        `;

        ring.appendChild(wrapper);
    });
}

/* -------------------------------------------------------------------
   6. 20 INDIVIDUAL INTERACTIVE BIRTHDAY CANDLES
------------------------------------------------------------------- */
const TOTAL_CANDLES = 20;
const candleStates = new Array(TOTAL_CANDLES).fill(true);

function buildTwentyCandles() {
    const topRow = document.getElementById('candles-row-top');
    const bottomRow = document.getElementById('candles-row-bottom');
    topRow.innerHTML = '';
    bottomRow.innerHTML = '';

    for (let i = 0; i < TOTAL_CANDLES; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => blowSingleCandle(i);
        btn.setAttribute('aria-label', `Blow out candle ${i + 1}`);
        btn.className = 'candle-btn';

        const smoke = document.createElement('div');
        smoke.id = `smoke-${i}`;
        smoke.className = 'candle-smoke hidden';

        const flame = document.createElement('div');
        flame.id = `flame-${i}`;
        flame.className = 'candle-flame';

        const stick = document.createElement('div');
        stick.className = i % 2 === 0
            ? 'candle-stick candle-stick-silver'
            : 'candle-stick candle-stick-purple';

        btn.appendChild(smoke);
        btn.appendChild(flame);
        btn.appendChild(stick);

        if (i < 8) {
            topRow.appendChild(btn);
        } else {
            bottomRow.appendChild(btn);
        }
    }
}

function blowSingleCandle(index) {
    if (!candleStates[index]) return;
    candleStates[index] = false;

    const flame = document.getElementById(`flame-${index}`);
    const smoke = document.getElementById(`smoke-${index}`);

    if (flame) flame.classList.add('extinguished');
    if (smoke) {
        smoke.classList.remove('hidden');
        smoke.classList.add('smoke-puff');
    }

    const remaining = candleStates.filter(Boolean).length;
    const statusText = document.getElementById('candle-status-text');

    if (remaining === 0) {
        onAllTwentyCandlesBlown();
    } else {
        statusText.textContent = `${remaining} candle${remaining === 1 ? '' : 's'} left glowing. Keep going, Joyce.`;
    }
}

function blowAllCandles() {
    let delay = 0;
    for (let i = 0; i < TOTAL_CANDLES; i++) {
        if (candleStates[i]) {
            setTimeout(() => blowSingleCandle(i), delay);
            delay += 45;
        }
    }
}

function onAllTwentyCandlesBlown() {
    const statusText = document.getElementById('candle-status-text');
    statusText.textContent = 'Make Your 20th Wish, Joyce. Every desire is yours this year.';
    statusText.classList.add('celebrated');

    burstGlitter(window.innerWidth / 2, window.innerHeight * 0.55, 180, true);
    showToast('Make Your 20th Wish, Joyce! Happy 20th Birthday! 🥂💜', '🎉');

    document.getElementById('blow-all-btn').classList.add('hidden');
    document.getElementById('relight-btn').classList.remove('hidden');
}

function relightCandles() {
    for (let i = 0; i < TOTAL_CANDLES; i++) {
        candleStates[i] = true;
        const flame = document.getElementById(`flame-${i}`);
        const smoke = document.getElementById(`smoke-${i}`);
        if (flame) flame.classList.remove('extinguished');
        if (smoke) {
            smoke.classList.add('hidden');
            smoke.classList.remove('smoke-puff');
        }
    }

    const statusText = document.getElementById('candle-status-text');
    statusText.textContent = 'All 20 candles relit. Tap individual candles or blow them all out again.';
    statusText.classList.remove('celebrated');

    document.getElementById('blow-all-btn').classList.remove('hidden');
    document.getElementById('relight-btn').classList.add('hidden');
}

/* -------------------------------------------------------------------
   7. HAPPY BIRTHDAY JINGLE & AMBIENT CHIMES (Web Audio API)
------------------------------------------------------------------- */
let isPlayingMusic = false;
let melodyTimer = null;

function playBirthdayJingle() {
    try {
        ensureAudioReady();
        const now = audioCtx.currentTime;

        const jingleNotes = [
            { f: 261.63, t: 0.00, d: 0.32 },
            { f: 261.63, t: 0.36, d: 0.22 },
            { f: 293.66, t: 0.62, d: 0.55 },
            { f: 261.63, t: 1.22, d: 0.55 },
            { f: 349.23, t: 1.82, d: 0.55 },
            { f: 329.63, t: 2.42, d: 0.95 },

            { f: 261.63, t: 3.55, d: 0.32 },
            { f: 261.63, t: 3.91, d: 0.22 },
            { f: 293.66, t: 4.17, d: 0.55 },
            { f: 261.63, t: 4.77, d: 0.55 },
            { f: 392.00, t: 5.37, d: 0.55 },
            { f: 349.23, t: 5.97, d: 0.95 },

            { f: 261.63, t: 7.10, d: 0.32 },
            { f: 261.63, t: 7.46, d: 0.22 },
            { f: 523.25, t: 7.72, d: 0.55 },
            { f: 440.00, t: 8.32, d: 0.55 },
            { f: 349.23, t: 8.92, d: 0.52 },
            { f: 329.63, t: 9.48, d: 0.52 },
            { f: 293.66, t: 10.04, d: 0.85 },

            { f: 466.16, t: 11.05, d: 0.32 },
            { f: 466.16, t: 11.41, d: 0.22 },
            { f: 440.00, t: 11.67, d: 0.55 },
            { f: 349.23, t: 12.27, d: 0.55 },
            { f: 392.00, t: 12.87, d: 0.55 },
            { f: 349.23, t: 13.47, d: 1.15 }
        ];

        jingleNotes.forEach(n => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + n.t);

            gain.gain.setValueAtTime(0.001, now + n.t);
            gain.gain.exponentialRampToValueAtTime(0.14, now + n.t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + n.t);
            osc.stop(now + n.t + n.d + 0.15);
        });

        burstGlitter(window.innerWidth / 2, window.innerHeight * 0.5, 75, true);
        showToast('Playing your Happy Birthday jingle, Joyce! 🎂🎶', '🎵');
    } catch (err) {
        showToast('Tap again to hear the birthday jingle. 🎵', '💜');
    }
}

const sensualChimes = [
    { freq: 220.00, dur: 0.6 },
    { freq: 261.63, dur: 0.6 },
    { freq: 329.63, dur: 0.6 },
    { freq: 392.00, dur: 0.9 },
    { freq: 493.88, dur: 1.2 },
    { freq: 0,      dur: 0.3 },
    { freq: 261.63, dur: 0.45 },
    { freq: 261.63, dur: 0.45 },
    { freq: 293.66, dur: 0.85 },
    { freq: 261.63, dur: 0.85 },
    { freq: 349.23, dur: 0.85 },
    { freq: 329.63, dur: 1.4 },
    { freq: 0,      dur: 0.6 }
];

let noteIndex = 0;

function playVelvetNote(freq, duration) {
    if (!audioCtx || freq === 0) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const subOsc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 0.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.0);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 1.05);
    subOsc.stop(now + duration + 1.05);
}

function scheduleNextNote() {
    if (!isPlayingMusic) return;
    const current = sensualChimes[noteIndex];
    playVelvetNote(current.freq, current.dur);
    noteIndex = (noteIndex + 1) % sensualChimes.length;
    melodyTimer = setTimeout(scheduleNextNote, current.dur * 1000);
}

function toggleMusic() {
    const btn = document.getElementById('music-toggle-btn');
    const label = document.getElementById('music-label');

    if (!isPlayingMusic) {
        ensureAudioReady();
        isPlayingMusic = true;
        noteIndex = 0;
        btn.classList.add('music-playing');
        label.textContent = 'Pause Vibe';
        scheduleNextNote();
        showToast('Ambient chimes playing for Joyce 🎶', '💜');
    } else {
        isPlayingMusic = false;
        clearTimeout(melodyTimer);
        btn.classList.remove('music-playing');
        label.textContent = 'Ambient Vibe';
    }
}

/* -------------------------------------------------------------------
   8. AMBIENT BOKEH & GLITTER BURST CANVAS ANIMATION
------------------------------------------------------------------- */
const particleCanvas = document.getElementById('particle-canvas');
const pCtx = particleCanvas.getContext('2d');
const glitterCanvas = document.getElementById('glitter-canvas');
const gCtx = glitterCanvas.getContext('2d');

let ambientParticles = [];
let glitterPieces = [];

function resizeCanvases() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    glitterCanvas.width = window.innerWidth;
    glitterCanvas.height = window.innerHeight;
}

class AmbientBokeh {
    constructor() {
        this.reset(true);
    }
    reset(initial = false) {
        this.x = Math.random() * particleCanvas.width;
        this.y = initial ? Math.random() * particleCanvas.height : particleCanvas.height + 20;
        this.isBokeh = Math.random() > 0.45;
        this.size = this.isBokeh ? Math.random() * 12 + 5 : Math.random() * 2.2 + 0.8;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.speedX = (Math.random() - 0.5) * 0.3;
        const colors = ['#7c3aed', '#a855f7', '#581c87', '#a1a1aa', '#e4e4e7'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = this.isBokeh ? Math.random() * 0.14 + 0.04 : Math.random() * 0.5 + 0.2;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.18;
        if (this.y < -25) this.reset(false);
    }
    draw() {
        pCtx.save();
        pCtx.globalAlpha = this.opacity;
        pCtx.fillStyle = this.color;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
    }
}

function burstGlitter(originX, originY, count = 90, includeEmojis = true) {
    const palette = ['#a855f7', '#d8b4fe', '#f0abfc', '#e4e4e7', '#ffffff', '#7c3aed'];
    const symbols = ['💋', '💜', '✨'];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 11 + 3;
        const isEmoji = includeEmojis && i % 11 === 0;

        glitterPieces.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3.5,
            size: isEmoji ? 16 : Math.random() * 4.5 + 2,
            color: palette[Math.floor(Math.random() * palette.length)],
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.25 + 0.1,
            gravity: isEmoji ? 0.14 : 0.22,
            opacity: 1,
            isEmoji,
            symbol: symbols[Math.floor(Math.random() * symbols.length)]
        });
    }
}

function animateLoop() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    ambientParticles.forEach(p => {
        p.update();
        p.draw();
    });

    gCtx.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);
    glitterPieces = glitterPieces.filter(g => g.opacity > 0.02);

    glitterPieces.forEach(g => {
        g.x += g.vx;
        g.y += g.vy;
        g.vy += g.gravity;
        g.vx *= 0.97;
        g.twinkle += g.twinkleSpeed;
        g.opacity -= 0.015;

        gCtx.save();
        if (g.isEmoji) {
            gCtx.globalAlpha = Math.max(0, g.opacity);
            gCtx.font = `${g.size}px sans-serif`;
            gCtx.fillText(g.symbol, g.x, g.y);
        } else {
            const shimmerAlpha = Math.max(0, g.opacity * (0.65 + 0.35 * Math.sin(g.twinkle)));
            gCtx.globalAlpha = shimmerAlpha;
            gCtx.fillStyle = g.color;
            gCtx.shadowBlur = 8;
            gCtx.shadowColor = g.color;

            gCtx.translate(g.x, g.y);
            gCtx.rotate(g.twinkle * 0.4);
            gCtx.beginPath();
            gCtx.moveTo(0, -g.size);
            gCtx.lineTo(g.size * 0.45, 0);
            gCtx.lineTo(0, g.size);
            gCtx.lineTo(-g.size * 0.45, 0);
            gCtx.closePath();
            gCtx.fill();
        }
        gCtx.restore();
    });

    requestAnimationFrame(animateLoop);
}

window.addEventListener('resize', resizeCanvases);
window.onload = function () {
    resizeCanvases();
    buildTwentyCandles();
    buildTwentyBalloons();
    restoreSavedPhoto();

    const count = window.innerWidth < 640 ? 24 : 40;
    for (let i = 0; i < count; i++) {
        ambientParticles.push(new AmbientBokeh());
    }
    animateLoop();
};