// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const DAYS = 1356;
const TOTAL_MS = DAYS * 24 * 60 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// Firebase refs
// ─────────────────────────────────────────────────────────────

const database = firebase.database();
const countdownRef = database.ref("countdown");
const participantsRef = database.ref("participants");

// ─────────────────────────────────────────────────────────────
// DOM elements
// ─────────────────────────────────────────────────────────────

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const statusEl = document.getElementById("status");
const joinSection = document.querySelector(".join");
const joinForm = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const joinBtn = document.getElementById("joinBtn");
const joinCount = document.getElementById("joinCount");
const recentJoiners = document.getElementById("recentJoiners");

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const pad2 = (n) => String(n).padStart(2, "0");
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// ─────────────────────────────────────────────────────────────
// Countdown logic
// ─────────────────────────────────────────────────────────────

let cachedStartTimestamp = null;

// tracks previous values to trigger css animation only on change
let previousValues = { days: null, hours: null, minutes: null, seconds: null };

function updateNumber(element, newValue, key) {
  if (previousValues[key] === newValue) return;
  element.classList.add("updating");
  element.textContent = newValue;
  previousValues[key] = newValue;
  setTimeout(() => element.classList.remove("updating"), 400);
}

function tick(startTimestamp) {
  if (!startTimestamp) {
    progressFill.style.width = "0%";
    progressText.textContent = "0.00000000%";
    daysEl.textContent = "0000";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    statusEl.textContent = "Waiting to start...";
    return;
  }

  const now = Date.now();
  const remaining = startTimestamp + TOTAL_MS - now;
  const elapsed = now - startTimestamp;
  const progress = clamp01(elapsed / TOTAL_MS);

  progressFill.style.width = `${(progress * 100).toFixed(8)}%`;
  progressText.textContent = `${(progress * 100).toFixed(8)}%`;

  if (remaining <= 0) {
    statusEl.textContent = "Countdown complete";
    updateNumber(daysEl, "0000", "days");
    updateNumber(hoursEl, "00", "hours");
    updateNumber(minutesEl, "00", "minutes");
    updateNumber(secondsEl, "00", "seconds");
    progressFill.style.width = "100%";
    progressText.textContent = "100.00000000%";
    return;
  }

  statusEl.textContent = "In Progress";

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  updateNumber(daysEl, String(days).padStart(4, "0"), "days");
  updateNumber(hoursEl, pad2(hours), "hours");
  updateNumber(minutesEl, pad2(minutes), "minutes");
  updateNumber(secondsEl, pad2(seconds), "seconds");
}

// realtime listener caches timestamp, local interval does the ticking
countdownRef.on(
  "value",
  (snap) => {
    const data = snap.val();
    cachedStartTimestamp = data?.startTimestamp ?? null;
    tick(cachedStartTimestamp);
  },
  (err) => {
    console.error("countdown listener error:", err);
    statusEl.textContent = "Connection error";
  }
);

setInterval(() => tick(cachedStartTimestamp), 250);

// ─────────────────────────────────────────────────────────────
// Participant system
// ─────────────────────────────────────────────────────────────

// generates a persistent client id using crypto for better entropy
function getClientId() {
  const stored = localStorage.getItem("project1356-client-id");
  if (stored) return stored;

  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const id = `client_${Array.from(bytes, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")}`;
  localStorage.setItem("project1356-client-id", id);
  return id;
}

function disableJoinForm() {
  joinSection.classList.add("is-joined");
  joinForm.classList.add("is-disabled");
  joinBtn.disabled = true;
  nameInput.disabled = true;
  joinBtn.textContent = "Joined";
}

function enableJoinForm() {
  joinSection.classList.remove("is-joined");
  joinForm.classList.remove("is-disabled");
  joinBtn.disabled = false;
  nameInput.disabled = false;
  joinBtn.textContent = "Join";
}

async function joinCountdown(name) {
  const clientId = getClientId();
  const displayName = name || "Anonymous";

  // check if already joined
  const existing = await participantsRef.child(clientId).once("value");
  if (existing.val()) {
    return "already"; // already joined
  }

  await participantsRef.child(clientId).set({
    name: displayName,
    joinedAt: firebase.database.ServerValue.TIMESTAMP,
  });

  firebase
    .analytics?.()
    .logEvent("joined_countdown", { named: displayName !== "Anonymous" });
  return "joined";
}

// uses dom apis instead of innerhtml to prevent xss
function renderRecentJoiners(entries) {
  recentJoiners.innerHTML = "";

  if (entries.length === 0) {
    const placeholder = document.createElement("li");
    placeholder.className = "join-item placeholder";
    placeholder.textContent = "Waiting for the first joiner...";
    recentJoiners.appendChild(placeholder);
    return;
  }

  for (const entry of entries) {
    const li = document.createElement("li");
    li.className = "join-item join-item-animate";

    const nameSpan = document.createElement("span");
    nameSpan.className = "join-name";
    nameSpan.textContent = entry.name || "Anonymous";

    const timeSpan = document.createElement("span");
    timeSpan.className = "join-time";
    timeSpan.textContent = formatDate(entry.joinedAt);

    li.append(nameSpan, timeSpan);
    recentJoiners.appendChild(li);
  }
}

// ─────────────────────────────────────────────────────────────
// Firebase listeners for participants
// ─────────────────────────────────────────────────────────────

participantsRef.on(
  "value",
  (snap) => {
    const data = snap.val() || {};
    const count = Object.keys(data).length;
    joinCount.textContent = `${count} joined`;

    const entries = [];
    snap.forEach((child) => {
      const val = child.val();
      if (val && typeof val.joinedAt === "number") entries.push(val);
    });
    entries.sort((a, b) => a.joinedAt - b.joinedAt);
    renderRecentJoiners(entries.slice(-5).reverse());
  },
  (err) => console.error("participants count error:", err)
);

// ─────────────────────────────────────────────────────────────
// Form handling & init
// ─────────────────────────────────────────────────────────────

let joinInFlight = false;

joinForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (joinInFlight) return;
  joinInFlight = true;
  disableJoinForm();

  try {
    const result = await joinCountdown(nameInput.value.trim());
    if (result === "already") disableJoinForm();
    else disableJoinForm();
  } catch (err) {
    console.error("error joining:", err);
    enableJoinForm();
  } finally {
    joinInFlight = false;
  }
});

// check if user already joined on page load
const clientId = getClientId();
participantsRef
  .child(clientId)
  .once("value")
  .then((snap) => {
    if (snap.val()) disableJoinForm();
  })
  .catch((err) => console.error("failed to check join status:", err));
