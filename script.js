// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

function fmtDate(d){
  return d.toLocaleDateString(undefined, { weekday:"long", year:"numeric", month:"long", day:"numeric" });
}

function rand(min, max){ return Math.random() * (max - min) + min; }

// ---------- Date + year ----------
$("today").textContent = fmtDate(new Date());
$("year").textContent = new Date().getFullYear();

// ---------- Floating background hearts ----------
(function makeBackgroundHearts(){
  const layer = document.querySelector(".floating-hearts");
  const count = 18;

  for(let i=0;i<count;i++){ 
    const s = document.createElement("span");
    s.textContent = Math.random() > 0.2 ? "♡" : "♥";
    s.style.position = "absolute";
    s.style.left = rand(0, 100) + "vw";
    s.style.top = rand(0, 100) + "vh";
    s.style.fontSize = rand(14, 28) + "px";
    s.style.transform = `rotate(${rand(-18, 18)}deg)`;
    s.style.opacity = rand(0.25, 0.85);

    const dur = rand(6, 12);
    s.animate([
      { transform: `translateY(0px) rotate(${rand(-18, 18)}deg)` },
      { transform: `translateY(${rand(-40, -120)}px) rotate(${rand(-18, 18)}deg)` }
    ], { duration: dur * 1000, direction:"alternate", iterations: Infinity, easing:"ease-in-out" });

    layer.appendChild(s);
  }
})();

// ---------- Tabs ----------
const tabMap = [
  { tab: "tab-story", panel: "panel-story" },
  { tab: "tab-gallery", panel: "panel-gallery" },
  { tab: "tab-notes", panel: "panel-notes" },
];

tabMap.forEach(({tab}) => {
  $(tab).addEventListener("click", () => setTab(tab));
});

function setTab(activeTabId){
  tabMap.forEach(({tab, panel}) => {
    const isActive = tab === activeTabId;
    $(tab).classList.toggle("active", isActive);
    $(tab).setAttribute("aria-selected", isActive ? "true" : "false");
    $(panel).classList.toggle("active", isActive);
  });
}

// ---------- Valentine buttons ----------
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const resetBtn = $("resetBtn");
const status = $("status");
const result = $("result");

const loveLines = [
  "Then it’s settled. My heart knows exactly where it belongs. 💖",
  "You choosing me is everything I hoped for — and more. 🌹",
  "Come closer. This is where love begins. 💘",
  "I promise you tenderness, laughter, and devotion — always. 💞",
];

yesBtn.addEventListener("click", () => {
  status.textContent = "she said yes 💖";
  result.textContent = loveLines[Math.floor(Math.random()*loveLines.length)];
  celebrate(34);
  noBtn.disabled = true;
  noBtn.style.filter = "grayscale(1)";
});

function dodge(){
  const dx = rand(-90, 90);
  const dy = rand(-35, 35);
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
}

noBtn.addEventListener("mouseenter", () => {
  if (!noBtn.disabled) dodge();
});

noBtn.addEventListener("click", () => {
  if (!noBtn.disabled){
    dodge();
    status.textContent = "try again 😇";
    result.textContent = "That button is feeling shy today.";
  }
});

resetBtn.addEventListener("click", () => {
  status.textContent = "waiting…";
  result.textContent = "";
  noBtn.disabled = false;
  noBtn.style.filter = "";
  noBtn.style.transform = "";
});

// heart confetti
function celebrate(count){
  for(let i=0;i<count;i++){ 
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "confetti";
      h.textContent = Math.random() > 0.2 ? "💖" : "💘";

      const x = rand(5, 95) + "vw";
      const y = rand(10, 85) + "vh";
      h.style.setProperty("--x", x);
      h.style.setProperty("--y", y);
      h.style.setProperty("--dx", rand(-140, 140) + "px");
      h.style.setProperty("--dy", rand(-260, -70) + "px");

      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }, i * 22);
  }
}

// ---------- Our Story (localStorage) ----------
const STORY_KEY = "tilly_fancy_story_v1";

const storyTitle = $("storyTitle");
const storyVibe  = $("storyVibe");
const storyText  = $("storyText");
const saveStory  = $("saveStory");
const clearStory = $("clearStory");
const demoStory  = $("demoStory");
const storyStatus = $("storyStatus");
const storyPreview = $("storyPreview");

const DEFAULT_TITLE = "Well, where do I begin?";
const DEFAULT_VIBE  = "steady love + real growth + choosing each other, daily 💞";
const DEFAULT_TEXT = `Well, where do I begin?

Our journey began in the spring of 2020 — quietly, almost unexpectedly. It blossomed in the summer of 2021, took flight in the fall of that same year, and has remained deeply engaging ever since. What we’ve built hasn’t been perfect, and it was never meant to be. Like every real connection, it has come with its own roller coaster of emotions — moments of closeness, moments of distance, moments that tested us. And still, we have held on to each other in every way possible.

Here we are in 2026, and if there is one thing I know with certainty, it’s that this is real. This isn’t habit or comfort — it’s choice. I choose you every single day, even on the difficult ones, and I make sure you know that, mi amor. I choose you in the quiet moments, in the laughter, in the pauses where words aren’t needed. I choose the way your presence feels like home, and the way your closeness still softens me.

And as long as this heart continues to beat, I will keep choosing you — tenderly, deliberately, and without hesitation.
`;

function renderPreview(){
  const t = storyTitle.value.trim();
  const v = storyVibe.value.trim();
  const s = storyText.value.trim();

  let out = "";
  if (t) out += t + "\n\n";
  if (v) out += "Our vibe: " + v + "\n\n";
  out += s || "Start writing your story above…";
  storyPreview.textContent = out;
}

[storyTitle, storyVibe, storyText].forEach(el => el.addEventListener("input", renderPreview));

saveStory.addEventListener("click", () => {
  const payload = {
    title: storyTitle.value.trim(),
    vibe: storyVibe.value.trim(),
    text: storyText.value.trim(),
    savedAt: Date.now()
  };
  localStorage.setItem(STORY_KEY, JSON.stringify(payload));
  storyStatus.textContent = "Saved on this device 💾";
  celebrate(12);
});

clearStory.addEventListener("click", () => {
  localStorage.removeItem(STORY_KEY);
  storyTitle.value = "";
  storyVibe.value = "";
  storyText.value = "";
  storyStatus.textContent = "Cleared.";
  renderPreview();
});

demoStory.addEventListener("click", () => {
  storyTitle.value = DEFAULT_TITLE;
  storyVibe.value  = DEFAULT_VIBE;
  storyText.value  = DEFAULT_TEXT;
  renderPreview();
});

(function loadStory(){
  const raw = localStorage.getItem(STORY_KEY);
  if(!raw){
    // Pre-fill with your story by default (still editable)
    storyTitle.value = DEFAULT_TITLE;
    storyVibe.value = DEFAULT_VIBE;
    storyText.value = DEFAULT_TEXT;
    storyStatus.textContent = "Loaded your story (edit anytime) ✨";
    renderPreview();
    return;
  }
  try{
    const data = JSON.parse(raw);
    storyTitle.value = data.title || "";
    storyVibe.value  = data.vibe || "";
    storyText.value  = data.text || "";
    storyStatus.textContent = "Loaded from this device ✅";
    renderPreview();
  }catch{
    storyStatus.textContent = "Saved story couldn’t be read (corrupted).";
    storyTitle.value = DEFAULT_TITLE;
    storyVibe.value = DEFAULT_VIBE;
    storyText.value = DEFAULT_TEXT;
    renderPreview();
  }
})();

// ---------- Gallery (local preview only) ----------
const photos = $("photos");
const videos = $("videos");
const gallery = $("gallery");

const modal = $("modal");
const modalTitle = $("modalTitle");
const modalBody = $("modalBody");
const closeModal = $("closeModal");

closeModal.addEventListener("click", () => setModal(false));
modal.addEventListener("click", (e) => { if(e.target === modal) setModal(false); });
window.addEventListener("keydown", (e) => { if(e.key === "Escape") setModal(false); });

photos.addEventListener("change", () => handleFiles(photos.files, "image"));
videos.addEventListener("change", () => handleFiles(videos.files, "video"));

function handleFiles(list, kind){
  const files = Array.from(list || []);
  for(const file of files){
    const url = URL.createObjectURL(file);

    const tile = document.createElement("div");
    tile.className = "tile";
    tile.tabIndex = 0;

    let media;
    if(kind === "image"){
      media = document.createElement("img");
      media.src = url;
      media.alt = file.name;
    }else{
      media = document.createElement("video");
      media.src = url;
      media.controls = false;
      media.preload = "metadata";
      media.muted = true;
      media.playsInline = true;
    }

    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = file.name;

    tile.appendChild(media);
    tile.appendChild(cap);
    gallery.prepend(tile);

    tile.addEventListener("click", () => openPreview(kind, url, file.name));
    tile.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") openPreview(kind, url, file.name);
    });
  }

  if(kind === "image") photos.value = "";
  else videos.value = "";
}

function openPreview(kind, url, name){
  modalTitle.textContent = name || "Preview";
  modalBody.innerHTML = "";

  if(kind === "image"){
    const img = document.createElement("img");
    img.src = url;
    img.alt = name || "Image preview";
    modalBody.appendChild(img);
  }else{
    const vid = document.createElement("video");
    vid.src = url;
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    modalBody.appendChild(vid);
  }
  setModal(true);
}

function setModal(open){
  modal.classList.toggle("open", open);
  modal.setAttribute("aria-hidden", open ? "false" : "true");
  if(!open) modalBody.innerHTML = "";
}

// ---------- Custom Notes ----------
const NOTE_KEY = "tilly_fancy_notes_v1";
const customNotes = $("customNotes");
const addNoteBtn = $("addNote");

addNoteBtn.addEventListener("click", () => {
  const text = prompt("Write a short note for Tilly (sweet + romantic):");
  if(!text) return;
  const notes = loadNotes();
  notes.push(text.trim());
  localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
  renderNotes();
  celebrate(10);
});

function loadNotes(){
  const raw = localStorage.getItem(NOTE_KEY);
  if(!raw) return [];
  try { return JSON.parse(raw) || []; } catch { return []; }
}

function renderNotes(){
  const notes = loadNotes();
  customNotes.innerHTML = "";
  for(const n of notes){
    const div = document.createElement("div");
    div.className = "note";
    div.textContent = n;
    customNotes.appendChild(div);
  }
}
renderNotes();
