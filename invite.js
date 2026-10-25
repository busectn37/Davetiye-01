const $ = (id) => document.getElementById(id);
let eventData = {};
let countdownTimer = null;
let petalTimer = null;

async function loadEvent() {
  try {
    const response = await fetch('data/event.json');
    if (!response.ok) throw new Error('event.json yüklenemedi');
    eventData = await response.json();
  } catch (error) {
    console.error(error);
    eventData = { names: 'İsimleriniz', date: '2027-06-12', time: '19.00' };
  }
  renderEvent();
  setupPetals();
  setupMusic();
  setupCountdown();
}

function renderEvent() {
  const names = eventData.names || 'İsimleriniz';
  $('couple-names').textContent = names;
  $('content-names').textContent = names;
  $('letter-eyebrow').textContent = eventData.eyebrow || 'Bu özel günümüzde';
  $('invite-line').textContent = eventData.inviteLine || 'Mutluluğumuzu paylaşmanız dileğiyle...';
  $('event-description').textContent = eventData.description || 'Hayatımızın bu güzel başlangıcında mutluluğumuzu sizinle paylaşmak isteriz.';
  $('venue-name').textContent = eventData.venueName || 'Mekân adı';
  $('venue-address').textContent = eventData.venueAddress || '';
  $('footer-note').textContent = eventData.footerNote || 'Sevgiyle…';

  const date = parseEventDate();
  const dateText = date ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : 'Tarih ekleyin';
  $('letter-date').textContent = `${dateText} • ${eventData.time || ''}`;
  $('event-date').textContent = dateText;
  $('event-time').textContent = eventData.time || '';

  const mapUrl = eventData.mapsUrl || (eventData.venueAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.venueAddress)}` : '');
  $('maps-link').href = mapUrl || '#';
  $('maps-link').hidden = !mapUrl;
  $('calendar-link').hidden = eventData.calendarEnabled === false;
  $('calendar-link').href = makeCalendarUrl(date);
}

function parseEventDate() {
  if (!eventData.date) return null;
  const parts = eventData.date.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
}

function makeCalendarUrl(date) {
  if (!date) return '#';
  const start = new Date(`${eventData.date}T${to24Hour(eventData.time || '19:00')}:00`);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const title = encodeURIComponent(`${eventData.names || 'Davet'}`);
  const details = encodeURIComponent(eventData.description || 'Dijital davetiye');
  const location = encodeURIComponent([eventData.venueName, eventData.venueAddress].filter(Boolean).join(', '));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${details}&location=${location}`;
}

function to24Hour(value) {
  const match = String(value).match(/(\d{1,2})[:.](\d{2})/);
  return match ? `${String(Number(match[1])).padStart(2, '0')}:${match[2]}` : '19:00';
}

function openEnvelope() {
  const envelope = $('envelope');
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  $('tap-hint').textContent = 'Davetiye açılıyor…';
  $('open-envelope').setAttribute('aria-expanded', 'true');
  window.setTimeout(() => {
    $('invitation-content').classList.add('visible');
    $('invitation-content').setAttribute('aria-hidden', 'false');
    $('tap-hint').textContent = 'Davetiyeniz hazır ♡';
    $('invitation-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 800);
}

function replayEnvelope() {
  $('invitation-content').classList.remove('visible');
  $('invitation-content').setAttribute('aria-hidden', 'true');
  $('envelope').classList.remove('open');
  $('open-envelope').setAttribute('aria-expanded', 'false');
  $('tap-hint').textContent = 'Mührü açmak için dokun ♡';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupPetals() {
  if (eventData.petalsEnabled === false) return;
  const field = $('petal-field');
  const symbols = ['✿', '❀', '✧', '·'];
  const addPetal = () => {
    if (document.hidden) return;
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${10 + Math.random() * 16}px`;
    petal.style.setProperty('--drift', `${Math.round(Math.random() * 160 - 80)}px`);
    petal.style.animationDuration = `${7 + Math.random() * 7}s`;
    field.appendChild(petal);
    window.setTimeout(() => petal.remove(), 15000);
  };
  for (let i = 0; i < 12; i++) window.setTimeout(addPetal, i * 280);
  petalTimer = window.setInterval(addPetal, 900);
}

function setupMusic() {
  const audio = $('invite-audio');
  const button = $('music-toggle');
  if (!eventData.musicUrl) {
    button.textContent = '♫ MÜZİK DOSYASI EKLE';
    button.title = 'assets/music.mp3 dosyasını ekleyebilir veya data/event.json içindeki musicUrl değerini değiştirebilirsin.';
    button.addEventListener('click', () => alert('Müziği etkinleştirmek için bir MP3 dosyasını assets/music.mp3 adıyla ekle veya data/event.json içindeki musicUrl değerini değiştir.'));
    return;
  }
  audio.src = eventData.musicUrl;
  button.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        button.textContent = '♫ MÜZİĞİ DURDUR';
        button.setAttribute('aria-pressed', 'true');
      } catch (error) {
        alert('Müzik dosyası bulunamadı. assets/music.mp3 dosyasını ekleyebilir veya data/event.json içindeki musicUrl değerini değiştirebilirsin.');
      }
    } else {
      audio.pause();
      button.textContent = '♫ MÜZİĞİ AÇ';
      button.setAttribute('aria-pressed', 'false');
    }
  });
}

function setupCountdown() {
  if (eventData.countdownEnabled === false) return;
  const date = parseEventDate();
  if (!date) return;
  $('countdown').hidden = false;
  const target = new Date(`${eventData.date}T${to24Hour(eventData.time || '19:00')}:00`).getTime();
  const update = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      $('countdown').hidden = true;
      if (countdownTimer) clearInterval(countdownTimer);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $('cd-days').textContent = String(days).padStart(2, '0');
    $('cd-hours').textContent = String(hours).padStart(2, '0');
    $('cd-minutes').textContent = String(minutes).padStart(2, '0');
    $('cd-seconds').textContent = String(seconds).padStart(2, '0');
  };
  update();
  countdownTimer = setInterval(update, 1000);
}

$('open-envelope').addEventListener('click', openEnvelope);
$('details-button').addEventListener('click', openEnvelope);
$('replay-button').addEventListener('click', replayEnvelope);
loadEvent();
