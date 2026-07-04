const messages = [
  { text: "Te amo", image: null },
  { text: "Gracias por existir", image: null },
  { text: "Mi niña", image: "../IMG/foto1.jpeg" },
  { text: "Eres increíble", image: null },
  { text: "Siempre", image: "../IMG/foto2.jpeg" },
  { text: "Mi hogar", image: "../IMG/foto8.jpeg" },
  { text: "Sabes cuando digo que me encanta tu sonrisa es verdad", image: "../IMG/foto3.jpeg" },
  { text: "Gracias por cuidarme incluso cuando no te lo pedía", image: null },
  { text: "Contigo todo se siente mejor", image: "../IMG/foto6.jpeg" },
  { text: "Eres mi persona favorita", image: null },
  { text: "Me gusta verte disfrutar", image: "../IMG/foto7.jpeg" },
  { text: "Me haces muy feliz", image: "../IMG/foto4.jpeg" },
  { text: "Me encanta pasar el tiempo contigo", image: "../IMG/foto5.jpeg" }
];

const letterParts = [
  {
    text: `Hola mi amor, ¿cómo estás?

Jaja... esas palabras que te digo cada que te hablo me recuerdan lo mucho que te quiero y lo importante que eres para mí.`,
  },
  {
    text: `Hoy es tu cumpleaños y quiero que sepas que tú eres especial.

No importa qué esté pasando, ni siquiera si el mundo se está destruyendo a nuestro alrededor.`,
  },
  {
    text: `Tú eres la persona más especial del mundo, porque tú eres mi mundo.

Y puedo prometerte algo: siempre estaré a tu lado para cuidarte, protegerte y amarte.`,
  },
  {
    text: `Te amo mi amor, y espero que este día sea tan especial como tú lo eres para mí.

Y aunque tal vez este año no pueda estar contigo, quiero que sepas que siempre estaré pensando en ti y que siempre te llevaré en mi corazón.`,
  }
];

const birthdaySong = document.getElementById("birthdaySong");
const heartSound = document.getElementById("heartSound");
const startDate = new Date("2025-11-18T20:00:00");

const movingContainer = document.getElementById("movingMessages");
const savedContainer = document.getElementById("savedMessages");
const button = document.getElementById("mainBtn");
const mainScreen = document.getElementById("mainScreen");
const letterScreen = document.getElementById("letterScreen");
const typedLetter = document.getElementById("typedLetter");
const letterPhoto = document.getElementById("letterPhoto");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseScreen = document.getElementById("surpriseScreen");
const finalBtn = document.getElementById("finalBtn");
const finalScreen = document.getElementById("finalScreen");
const bgMusic = document.getElementById("bgMusic");
const openSound = document.getElementById("openSound");

let availableMessages = [...messages];
let movingElementsByText = {};
let savedBoxes = [];
let finalMode = false;
let counterInterval = null;

heartSound.loop = true;
heartSound.volume = 0.08;


function createBackgroundMessages() {
  messages.forEach((msg) => {
    movingElementsByText[msg.text] = [];

    for (let i = 0; i < 12; i++) {
      const item = document.createElement("div");
      item.className = "moving";
      item.textContent = msg.text;

      item.style.top = Math.random() * 94 + "vh";
      item.style.left = Math.random() * 100 + "vw";

      const driftDuration = Math.random() * 16 + 10;
      item.style.animationDuration = `${driftDuration}s, 4s, 6s`;
      item.style.animationDelay = `${Math.random() * -24}s, ${Math.random() * -4}s, ${Math.random() * -6}s`;

      item.style.letterSpacing = Math.random() * 8 + 2 + "px";

      movingContainer.appendChild(item);
      movingElementsByText[msg.text].push(item);
    }
  });
}

function createParticles() {
  setInterval(() => {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "105vh";
    p.style.animationDuration = Math.random() * 4 + 4 + "s";

    document.getElementById("particles").appendChild(p);

    setTimeout(() => p.remove(), 8000);
  }, 180);
}

finalBtn.addEventListener("click", () => {
  surpriseScreen.classList.add("fade-out");
  fotoAudio.pause();
  bgMusic.pause();
  bgMusic.currentTime = 0;

  birthdaySong.volume = 0.07;
  birthdaySong.play().catch(() => {});
  setTimeout(() => {
    surpriseScreen.style.display = "none";
    finalScreen.classList.remove("hidden");
    startHeartRain();
  }, 900);
});


document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.45) return;

  const heart = document.createElement("div");
  heart.className = "trail-heart";
  heart.textContent = "💗";
  heart.style.left = e.clientX + "px";
  heart.style.top = e.clientY + "px";

  document.getElementById("heartTrail").appendChild(heart);

  setTimeout(() => heart.remove(), 1200);
});

button.addEventListener("click", () => {
  bgMusic.volume = 0.25;
  bgMusic.play().catch(() => {});

  if (heartSound.paused) {
    heartSound.play().catch(() => {});
  }

  if (finalMode) {
    openLetter();
    return;
  }

  stopRandomMessage();
});

function stopRandomMessage() {
  if (availableMessages.length === 0) {
    activateFinalButton();
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableMessages.length);
  const msg = availableMessages.splice(randomIndex, 1)[0];

  removeBackgroundCopies(msg.text);

  const box = document.createElement("div");
  box.className = "saved";

  if (msg.image) {
    box.classList.add("with-image");
    box.innerHTML = `
      <img src="${msg.image}" alt="Recuerdo bonito">
      <span>${msg.text}</span>
    `;
  } else {
    box.textContent = msg.text;
  }

  savedContainer.appendChild(box);

  const position = findFreePosition(box);

  box.style.left = position.x + "px";
  box.style.top = position.y + "px";

  savedBoxes.push({
    x: position.x,
    y: position.y,
    w: box.offsetWidth,
    h: box.offsetHeight
  });

  if (availableMessages.length === 0) {
    setTimeout(activateFinalButton, 600);
  }
}

function removeBackgroundCopies(text) {
  const copies = movingElementsByText[text] || [];

  copies.forEach(copy => {
    copy.classList.add("disappear");
    setTimeout(() => copy.remove(), 600);
  });

  movingElementsByText[text] = [];
}

function findFreePosition(element) {
  const padding = 24;

  const centerSafeZone = {
    x: window.innerWidth * 0.23,
    y: window.innerHeight * 0.22,
    w: window.innerWidth * 0.54,
    h: window.innerHeight * 0.5
  };

  for (let i = 0; i < 600; i++) {
    const w = element.offsetWidth || 340;
    const h = element.offsetHeight || 110;

    const x = Math.random() * (window.innerWidth - w - padding * 2) + padding;
    const y = Math.random() * (window.innerHeight - h - padding * 2) + padding;

    const newBox = { x, y, w, h };

    const collidesSaved = savedBoxes.some(box => isColliding(newBox, box));
    const collidesCenter = isColliding(newBox, centerSafeZone);

    if (!collidesSaved && !collidesCenter) {
      return { x, y };
    }
  }

  return getGridFallbackPosition(element);
}

function getGridFallbackPosition(element) {
  const padding = 18;
  const w = element.offsetWidth || 340;
  const h = element.offsetHeight || 110;

  const columns = Math.max(1, Math.floor(window.innerWidth / (w + padding)));
  const index = savedBoxes.length;

  const x = padding + (index % columns) * (w + padding);
  const y = padding + Math.floor(index / columns) * (h + padding);

  return {
    x: Math.min(x, window.innerWidth - w - padding),
    y: Math.min(y, window.innerHeight - h - padding)
  };
}

function isColliding(a, b) {
  const gap = 22;

  return !(
    a.x + a.w + gap < b.x ||
    a.x > b.x + b.w + gap ||
    a.y + a.h + gap < b.y ||
    a.y > b.y + b.h + gap
  );
}

function openLetter() {
  fadeOutAudio(heartSound, 1300);
  setTimeout(() => {
    openSound.volume = 0.8;
    openSound.play().catch(() => {});
  }, 500);

  mainScreen.classList.add("fade-out");
  movingContainer.classList.add("fade-out");
  savedContainer.classList.add("fade-out");
  document.getElementById("aurora").style.opacity = "0";

  setTimeout(() => {
    mainScreen.style.display = "none";
    movingContainer.style.display = "none";
    savedContainer.style.display = "none";

    letterScreen.classList.remove("hidden");
    typeLetterParts();
  }, 50);
}

async function typeLetterParts() {
  typedLetter.textContent = "";

  for (const part of letterParts) {
    await typeText(part.text + "\n\n");

    if (part.image) {
      letterPhoto.src = part.image;
      letterPhoto.classList.remove("hidden");

      await wait(200);

      letterPhoto.classList.add("hidden");
      await wait(50);
    }
  }

  surpriseBtn.classList.remove("hidden");
}

async function typeText(text) {
  for (let i = 0; i < text.length; i++) {
    typedLetter.textContent += text[i];

    let delay = 65;

    if (text[i] === ",") delay = 280;
    if (text[i] === ".") delay = 650;
    if (text[i] === "?" || text[i] === "!") delay = 750;
    if (text[i] === "\n") delay = 900;

    await wait(delay);
  }
}

surpriseBtn.addEventListener("click", () => {
  letterScreen.classList.add("fade-out");
  fotoAudio.volume = 0.25;
  fotoAudio.play().catch(() => {});

  setTimeout(() => {
    letterScreen.style.display = "none";
    surpriseScreen.classList.remove("hidden");
    startCounter();
  }, 900);
});

function startCounter() {
  if (counterInterval) clearInterval(counterInterval);

  counterInterval = setInterval(() => {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("loveCounter").innerHTML = `
      ${months} meses<br>
      ${remainingDays} días<br>
      ${hours} horas<br>
      ${minutes} minutos<br>
      ${seconds} segundos
    `;
  }, 1000);
}

function activateFinalButton() {
  finalMode = true;
  button.textContent = "❤️ Toma mi amor para ti...";
  button.classList.add("final-btn");
  document.querySelector(".hint").textContent = "Cuando estés lista, presiónalo.";
}

function startHeartRain() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "rain-heart";
    heart.textContent = Math.random() > 0.5 ? "❤️" : "🌸";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 24 + 18 + "px";
    heart.style.animationDuration = Math.random() * 3 + 4 + "s";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 8000);
  }, 160);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

createBackgroundMessages();
createParticles();

function fadeOutAudio(audio, duration = 1000) {

    const step = 50;
    const volumeStep = audio.volume / (duration / step);

    const fade = setInterval(() => {

        audio.volume = Math.max(0, audio.volume - volumeStep);

        if (audio.volume <= 0.01) {
            clearInterval(fade);
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0.18;
        }

    }, step);

}