const DAYS = 1356;
const TOTAL_MS = DAYS * 24 * 60 * 60 * 1000;

const database = firebase.database();
const countdownRef = database.ref("countdown");
const participantsRef = database.ref("participants");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const statusEl = document.getElementById("status");
const joinForm = document.getElementById("joinForm");
const nameInput = document.getElementById("nameInput");
const joinStatus = document.getElementById("joinStatus");
const joinCount = document.getElementById("joinCount");
const recentJoiners = document.getElementById("recentJoiners");

let previousValues = {
  days: null,
  hours: null,
  minutes: null,
  seconds: null,
};

let cachedStartTimestamp = null;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function updateNumber(element, newValue, key) {
  if (previousValues[key] !== newValue) {
    element.classList.add("updating");
    element.textContent = newValue;
    previousValues[key] = newValue;

    setTimeout(() => {
      element.classList.remove("updating");
    }, 400);
  }
}

function tick(startTimestamp) {
  if (!startTimestamp) {
    progressFill.style.width = "0%";
    progressText.textContent = "0.00%";
    daysEl.textContent = "0000";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    statusEl.textContent = "Waiting to start...";
    return;
  }

  const endTimestamp = startTimestamp + TOTAL_MS;
  const now = Date.now();
  const remaining = endTimestamp - now;
  const elapsed = now - startTimestamp;

  const progress = clamp01(elapsed / TOTAL_MS);
  progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
  progressText.textContent = `${(progress * 100).toFixed(2)}%`;

  if (remaining <= 0) {
    statusEl.textContent = "Countdown complete";
    updateNumber(daysEl, "0000", "days");
    updateNumber(hoursEl, "00", "hours");
    updateNumber(minutesEl, "00", "minutes");
    updateNumber(secondsEl, "00", "seconds");
    progressFill.style.width = "100%";
    progressText.textContent = "100.00%";
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

countdownRef.on(
  "value",
  (snapshot) => {
    const data = snapshot.val();
    cachedStartTimestamp = data ? data.startTimestamp : null;
    tick(cachedStartTimestamp);
  },
  (error) => {
    console.error("Countdown listener error:", error);
    statusEl.textContent = "Connection error";
  }
);

// Local interval for smooth countdown updates (no Firebase calls)
setInterval(() => {
  tick(cachedStartTimestamp);
}, 250);

function getClientId() {
  const existing = localStorage.getItem("project1356-client-id");
  if (existing) return existing;
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  const created = `client_${Array.from(array, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("")}`;
  localStorage.setItem("project1356-client-id", created);
  return created;
}

async function joinCountdown(name) {
  const clientId = getClientId();
  const displayName = name || "Anonymous";
  await participantsRef.child(clientId).set({
    name: displayName,
    joinedAt: firebase.database.ServerValue.TIMESTAMP,
  });
  if (firebase.analytics) {
    firebase.analytics().logEvent("joined_countdown", {
      named: displayName !== "Anonymous",
    });
  }
  joinStatus.textContent = "You joined the countdown";
}

participantsRef.on(
  "value",
  (snapshot) => {
    const data = snapshot.val() || {};
    const count = Object.keys(data).length;
    joinCount.textContent = `${count} joined`;
  },
  (error) => {
    console.error("Participants count error:", error);
  }
);

function renderRecentJoiners(entries) {
  recentJoiners.innerHTML = "";

  if (entries.length === 0) {
    const placeholder = document.createElement("li");
    placeholder.className = "join-item placeholder";
    placeholder.textContent = "Waiting for the first joiner...";
    recentJoiners.appendChild(placeholder);
    return;
  }

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "join-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "join-name";
    nameSpan.textContent = entry.name || "Anonymous";

    const timeSpan = document.createElement("span");
    timeSpan.className = "join-time";
    timeSpan.textContent = formatDate(entry.joinedAt);

    li.appendChild(nameSpan);
    li.appendChild(timeSpan);
    recentJoiners.appendChild(li);
  });
}

participantsRef
  .orderByChild("joinedAt")
  .limitToLast(5)
  .on(
    "value",
    (snapshot) => {
      const entries = [];
      snapshot.forEach((child) => {
        entries.push(child.val());
      });
      // Reverse to show most recent first
      entries.reverse();
      renderRecentJoiners(entries);
    },
    (error) => {
      console.error("Recent joiners error:", error);
    }
  );

joinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  try {
    await joinCountdown(name);
  } catch (error) {
    console.error("Error joining countdown:", error);
    joinStatus.textContent = "Join failed, try again";
  }
});

const clientId = getClientId();
participantsRef
  .child(clientId)
  .once("value")
  .then((snapshot) => {
    if (snapshot.val()) {
      joinStatus.textContent = "You joined the countdown";
    }
  })
  .catch((error) => {
    console.error("Failed to check join status:", error);
  });
