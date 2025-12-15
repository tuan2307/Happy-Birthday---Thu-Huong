// Editable URL for QR generation.
// Đổi giá trị này sang liên kết bạn deploy (VD: https://yourname.github.io/happy-birthday)
const PAGE_URL = 'https://example.com/happy-birthday';
const MUSIC_SRC = 'https://cdn.pixabay.com/download/audio/2022/08/23/audio_8b9c31b5bf.mp3?filename=the-lounge-110039.mp3';

const qrImage = document.getElementById('qr-image');
const giftButton = document.getElementById('gift-button');
const balloonLayer = document.querySelector('.floating-balloons');
const heartLayer = document.querySelector('.floating-hearts');
const boxCard = document.querySelector('.box-card');
const boxMessage = document.getElementById('box-message');
const cakePopup = document.getElementById('cake-popup');
const gifs = document.querySelectorAll('.gif-grid img');
const blowButton = document.getElementById('blow-button');
const countdownText = document.getElementById('countdown-text');
const congratsText = document.getElementById('congrats-text');
const popupFlame = document.querySelector('.cake-popup .flame');
const heroFlame = document.querySelector('.hero .flame');
const darkOverlay = document.getElementById('dark-overlay');
const body = document.body;

// Simple looping audio; replace MUSIC_SRC with bài hát bạn thích.
const bgAudio = new Audio(MUSIC_SRC);
bgAudio.loop = true;
bgAudio.volume = 0.45;
let isMusicPlaying = false;
let blowTimer = null;

function generateQR() {
  const encoded = encodeURIComponent(PAGE_URL);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encoded}`;
  qrImage.src = url;
}

function spawnBalloons(amount = 12) {
  for (let i = 0; i < amount; i++) {
    const balloon = document.createElement('span');
    balloon.className = 'balloon';
    const size = 24 + Math.random() * 36;
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 8 + Math.random() * 6;

    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.3}px`;
    balloon.style.left = `${left}%`;
    balloon.style.animation = `float-up ${duration}s linear ${delay}s infinite`;
    balloon.style.background = `linear-gradient(140deg, rgba(255,122,217,0.8), rgba(122,214,255,0.8))`;
    balloonLayer.appendChild(balloon);

    setTimeout(() => balloon.remove(), (duration + delay) * 1000);
  }
}

function spawnHearts(amount = 18) {
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    const size = 10 + Math.random() * 20;
    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 5;
    const delay = Math.random() * 1.4;

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animation = `heart-float ${duration}s ease-in ${delay}s infinite`;
    heart.style.background = Math.random() > 0.5 ? '#ff7ad9' : '#7ad6ff';
    heartLayer.appendChild(heart);

    setTimeout(() => heart.remove(), (duration + delay) * 1000);
  }
}

function burstConfetti() {
  // Minimal confetti without external libs: tiny colored bars that fade.
  const colors = ['#ff7ad9', '#7ad6ff', '#ffe08a', '#9d7aff'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.background = colors[i % colors.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = '50%';
    const rotate = Math.random() * 360;
    piece.style.transform = `rotate(${rotate}deg)`;
    const duration = 2 + Math.random() * 1.5;
    piece.style.animation = `confetti-fall ${duration}s ease-out`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000);
  }
}

function openBoxOnce() {
  if (boxCard?.classList.contains('open')) return;
  boxCard?.classList.add('open', 'locked');
  boxMessage?.classList.add('hidden');
  boxMessage.textContent = '';
  burstConfetti();
  burstFireworks();
  cakePopup?.setAttribute('aria-hidden', 'false');
  cakePopup?.classList.add('show-big');
  setTimeout(() => boxCard?.classList.add('vanish'), 400);
  resetCandleState();
}

async function tryPlayMusic() {
  if (isMusicPlaying) return;
  try {
    await bgAudio.play();
    isMusicPlaying = true;
  } catch (err) {
    console.warn('Không thể phát nhạc tự động, sẽ thử lại khi người dùng tương tác.', err);
  }
}

// Subtle drift for GIFs
function animateGifs() {
  gifs.forEach((img, idx) => {
    const delay = (idx % 5) * 0.8 + Math.random() * 0.6;
    const duration = 6 + Math.random() * 4;
    img.style.animationDelay = `${delay}s`;
    img.style.animationDuration = `${duration}s`;
  });
}

function resetCandleState() {
  if (blowTimer) {
    clearInterval(blowTimer);
    blowTimer = null;
  }
  if (popupFlame) popupFlame.style.display = 'block';
  if (heroFlame) heroFlame.style.display = 'block';
  countdownText.textContent = '';
  congratsText?.classList.remove('show');
}

function turnOffAllCandles() {
  if (popupFlame) popupFlame.style.display = 'none';
  if (heroFlame) heroFlame.style.display = 'none';
}

function startBlowCountdown() {
  resetCandleState();
  // Bật hiệu ứng đèn tắt và tắt ngọn nến ngay lập tức
  if (darkOverlay) {
    darkOverlay.classList.add('active');
  }
  // Tắt tất cả ngọn nến khi đèn tắt
  turnOffAllCandles();
  
  let remaining = 1;
  countdownText.textContent = `Đếm ngược: ${remaining}s`;
  blowTimer = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      countdownText.textContent = `Đếm ngược: ${remaining}s`;
    } else {
      clearInterval(blowTimer);
      blowTimer = null;
      countdownText.textContent = '🎂';
      congratsText?.classList.add('show');
      burstConfetti();
      
      // Tắt đèn sau 1.5 giây để hiệu ứng đẹp hơn
      setTimeout(() => {
        if (darkOverlay) {
          darkOverlay.classList.remove('active');
        }
      }, 1500);
    }
  }, 1000);
}

function burstFireworks(count = 8) {
  const colors = ['#ff7ad9', '#7ad6ff', '#ffe08a', '#9d7aff'];
  for (let i = 0; i < count; i++) {
    const fw = document.createElement('span');
    fw.className = 'firework';
    const x = 40 + Math.random() * 20; // center-ish
    const y = 35 + Math.random() * 30;
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    fw.style.left = `${x + Math.random() * 4 - 2}%`;
    fw.style.top = `${y + Math.random() * 4 - 2}%`;
    fw.style.background = colors[i % colors.length];
    fw.style.setProperty('--fw-x', `${dx}px`);
    fw.style.setProperty('--fw-y', `${dy}px`);
    fw.style.setProperty('--fw-scale', (4 + Math.random() * 2.5).toFixed(1));
    body.appendChild(fw);
    setTimeout(() => fw.remove(), 1200);
  }
}

// Build hearts & balloons at load
spawnBalloons(18);
spawnHearts(22);
burstConfetti();
setInterval(() => burstConfetti(), 1000);
animateGifs();

// Copy link vào clipboard khi click nút copy
const copyLinkBtn = document.getElementById('copy-link-btn');
const giftLink = 'https://panbap.github.io/Myheart/index.html?id=N4IgtgpgzlCGDm0QC4DaIDCALAXwYwAIxBrvADt4CoBLUrA2wWrwAXAgFSwFcCAFLQBsBAhYDkQAXQA0IKmARI04kFgiwATkwwB7ADbrlKEAGIAZoYCcABnMgJYDtTx6oAOjAAHAMwgAvkA';

copyLinkBtn?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(giftLink);
    const originalText = copyLinkBtn.textContent;
    copyLinkBtn.textContent = '✅ Đã copy!';
    copyLinkBtn.style.background = 'linear-gradient(120deg, #4ade80, #22c55e)';
    setTimeout(() => {
      copyLinkBtn.textContent = originalText;
      copyLinkBtn.style.background = '';
    }, 2000);
  } catch (err) {
    // Fallback cho trình duyệt không hỗ trợ clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = giftLink;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = '✅ Đã copy!';
      copyLinkBtn.style.background = 'linear-gradient(120deg, #4ade80, #22c55e)';
      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
        copyLinkBtn.style.background = '';
      }, 2000);
    } catch (e) {
      alert('Không thể copy link. Vui lòng copy thủ công:\n' + giftLink);
    }
    document.body.removeChild(textArea);
  }
});

boxCard?.addEventListener('click', openBoxOnce);
blowButton?.addEventListener('click', startBlowCountdown);

// Xóa code iframe không cần thiết

generateQR();
// Auto music on load and retry on first interaction if blocked.
window.addEventListener('load', () => {
  setTimeout(tryPlayMusic, 300);
});
['click', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, tryPlayMusic, { once: true });
});