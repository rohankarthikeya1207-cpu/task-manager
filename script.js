// 8-Bit Web Audio Synthesizer for Authentic Retro Sound Effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playMcSound(type = 'click') {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } else if (type === 'claim') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.28);
    } else if (type === 'complete' || type === 'emerald' || type === 'levelup') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.42);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.42);
    }
  } catch (e) {
    // Fallback silently if audio context is blocked
  }
}

// Initial Seed Users
const INITIAL_USERS = [
  {
    user_id: "11111111-1111-1111-1111-111111111111",
    name: "Rohan Verma (1st Year CSE)",
    hostel_room: "Boys Hostel 1, Room 108",
    phone_number: "919876543210"
  },
  {
    user_id: "22222222-2222-2222-2222-222222222222",
    name: "Priya Nair (2nd Year ECE)",
    hostel_room: "Girls Hostel 2, Room 215",
    phone_number: "919812345678"
  },
  {
    user_id: "33333333-3333-3333-3333-333333333333",
    name: "Arjun Mehta (Final Year Senior)",
    hostel_room: "Boys Hostel 4, Room 501",
    phone_number: "919765432109"
  },
  {
    user_id: "44444444-4444-4444-4444-444444444444",
    name: "Neha Gupta (3rd Year Senior)",
    hostel_room: "Girls Hostel 1, Room 304",
    phone_number: "919876123450"
  }
];

// Initial Seed Tasks
const INITIAL_TASKS = [
  {
    task_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    buyer_id: "11111111-1111-1111-1111-111111111111",
    seller_id: null,
    title: "Print 35-page Lab Manual & deliver outside Lab 4",
    description: "Double-sided black & white print. Please staple it and drop off by 2:00 PM outside Computer Lab 4.",
    bribe_amount: 70,
    status: "PENDING",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    task_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    buyer_id: "22222222-2222-2222-2222-222222222222",
    seller_id: null,
    title: "Grab Iced Caramel Macchiato from Nescafe",
    description: "Extra ice, no sugar. Drop it outside the Central Library ground floor entrance.",
    bribe_amount: 50,
    status: "PENDING",
    created_at: new Date(Date.now() - 2400000).toISOString()
  },
  {
    task_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    buyer_id: "11111111-1111-1111-1111-111111111111",
    seller_id: null,
    title: "Pick up Amazon parcel from Main Campus Gate 1",
    description: "OTP is 4821. Small package from Amazon locker. Bring it to BH-1 entrance.",
    bribe_amount: 80,
    status: "PENDING",
    created_at: new Date(Date.now() - 1200000).toISOString()
  },
  {
    task_id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    buyer_id: "22222222-2222-2222-2222-222222222222",
    seller_id: "33333333-3333-3333-3333-333333333333",
    title: "Lend Engineering Graphics Drafter for 3rd period",
    description: "Need standard mini-drafter for engineering graphics exam from 11 AM - 1 PM.",
    bribe_amount: 100,
    status: "ACCEPTED",
    created_at: new Date(Date.now() - 5400000).toISOString()
  },
  {
    task_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    buyer_id: "11111111-1111-1111-1111-111111111111",
    seller_id: "44444444-4444-4444-4444-444444444444",
    title: "Drop chemistry assignment in HOD drop-box",
    description: "Red spiral notebook with assignment 3. Slid into box outside Room 204.",
    bribe_amount: 60,
    status: "COMPLETED",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// State Variables
let users = [];
let tasks = [];
let currentUserId = null;
let currentFilter = "PENDING";
let isApiConnected = false;

// Elements
const currentUserSelect = document.getElementById("current-user-select");
const taskBuyerSelect = document.getElementById("task-buyer");
const tasksFeed = document.getElementById("tasks-feed");
const claimedFeed = document.getElementById("claimed-tasks-feed");
const postTaskForm = document.getElementById("post-task-form");
const refreshBtn = document.getElementById("refresh-feed-btn");
const resetBtn = document.getElementById("reset-db-btn");
const modeText = document.getElementById("mode-text");
const toast = document.getElementById("toast");

// Pitch Script & Metric Elements
const statPending = document.getElementById("stat-pending");
const statAccepted = document.getElementById("stat-accepted");
const statCompleted = document.getElementById("stat-completed");
const statVolume = document.getElementById("stat-volume");
const pitchTotal = document.getElementById("pitch-total");
const pitchCompleted = document.getElementById("pitch-completed");
const pitchVolume = document.getElementById("pitch-volume");
const pitchScriptTotal = document.getElementById("pitch-script-total");
const pitchScriptCompleted = document.getElementById("pitch-script-completed");
const pitchScriptVolume = document.getElementById("pitch-script-volume");

// Toast Notification helper
function showToast(message, type = "success") {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `show ${type}`;
  setTimeout(() => {
    toast.className = "";
  }, 3000);
}

// Tab Switching
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    playMcSound('click');
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    
    btn.classList.add("active");
    const target = btn.dataset.tab;
    const content = document.getElementById(target);
    if (content) content.classList.add("active");

    if (target === "feed-tab") renderTasks();
    if (target === "my-tasks-tab") renderClaimedTasks();
    if (target === "pitch-tab") updateStats();
  });
});

// Filter Pills
document.querySelectorAll(".pill-filter").forEach(pill => {
  pill.addEventListener("click", () => {
    playMcSound('click');
    document.querySelectorAll(".pill-filter").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentFilter = pill.dataset.filter;
    renderTasks();
  });
});

// Customer Money Finalizer State for Post Form
let finalizerBase = 70;
let finalizerUrgency = 0;
let finalizerEffort = 0;

window.adjustBribe = function(delta) {
  playMcSound('click');
  const input = document.getElementById("task-bribe");
  let cur = parseInt(input.value, 10) || 70;
  cur = Math.max(10, Math.min(10000, cur + delta));
  input.value = cur;
  finalizerBase = cur;
  recalcFinalizer();
};

window.setPresetBribe = function(val, el) {
  playMcSound('click');
  document.querySelectorAll(".preset-chip").forEach(c => c.classList.remove("active"));
  if (el) el.classList.add("active");
  const input = document.getElementById("task-bribe");
  if (input) input.value = val;
  finalizerBase = val;
  recalcFinalizer();
};

window.setUrgency = function(bonus, el) {
  playMcSound('click');
  document.querySelectorAll('input[name="urgency"]').forEach(r => {
    r.checked = (parseInt(r.value, 10) === bonus);
  });
  document.querySelectorAll('.modifier-btn').forEach(btn => {
    if (btn.querySelector('input[name="urgency"]')) {
      btn.classList.toggle("active", btn.contains(el) || btn === el);
    }
  });
  finalizerUrgency = bonus;
  recalcFinalizer();
};

window.setEffort = function(bonus, el) {
  playMcSound('click');
  document.querySelectorAll('input[name="effort"]').forEach(r => {
    r.checked = (parseInt(r.value, 10) === bonus);
  });
  document.querySelectorAll('.modifier-btn').forEach(btn => {
    if (btn.querySelector('input[name="effort"]')) {
      btn.classList.toggle("active", btn.contains(el) || btn === el);
    }
  });
  finalizerEffort = bonus;
  recalcFinalizer();
};

window.recalcFinalizer = function() {
  const input = document.getElementById("task-bribe");
  if (input) {
    finalizerBase = parseInt(input.value, 10) || 70;
  }
  const total = Math.max(10, finalizerBase + finalizerUrgency + finalizerEffort);
  const hudBase = document.getElementById("hud-base");
  const hudUrgency = document.getElementById("hud-urgency");
  const hudEffort = document.getElementById("hud-effort");
  const hudTotal = document.getElementById("hud-total");

  if (hudBase) hudBase.textContent = `₹${finalizerBase}`;
  if (hudUrgency) hudUrgency.textContent = `+₹${finalizerUrgency}`;
  if (hudEffort) hudEffort.textContent = `+₹${finalizerEffort}`;
  if (hudTotal) hudTotal.textContent = `₹${total}`;
};

// Modal State & Functions
let activeModalTaskId = null;
let activeModalMode = 'settle'; // 'adjust' or 'settle'
let baseSettleAmount = 70;

window.openFinalizerModal = function(taskId, mode = 'settle') {
  playMcSound('click');
  const task = tasks.find(t => t.task_id === taskId);
  if (!task) return;

  activeModalTaskId = taskId;
  activeModalMode = mode;
  baseSettleAmount = task.bribe_amount || 70;

  const modal = document.getElementById("money-finalizer-modal");
  const titleEl = document.getElementById("modal-header-title");
  const taskTitleEl = document.getElementById("settle-task-title");
  const taskMetaEl = document.getElementById("settle-task-meta");
  const amountInput = document.getElementById("settle-final-amount");
  const tipOptions = document.getElementById("settle-tip-options");
  const amountLabel = document.getElementById("settle-amount-label");
  const confirmBtn = document.getElementById("settle-confirm-btn");

  taskTitleEl.textContent = task.title;
  amountInput.value = baseSettleAmount;

  if (mode === 'adjust') {
    titleEl.textContent = "💰 Money Finalizer: Adjust Bounty";
    amountLabel.textContent = "Customer Finalized Bounty (₹)";
    taskMetaEl.textContent = `Current Bounty: ₹${task.bribe_amount} | Status: ${task.status}`;
    tipOptions.style.display = "none";
    confirmBtn.innerHTML = "⚡ Save & Update Bounty";
    confirmBtn.className = "btn btn-primary";
  } else {
    titleEl.textContent = "💎 Quest Settlement & Money Finalizer";
    amountLabel.textContent = "Final Settlement Payout (₹)";
    const seniorName = users.find(u => u.user_id === task.seller_id)?.name || "Senior Runner";
    taskMetaEl.textContent = `Delivered By: ${seniorName} | Original Bounty: ₹${task.bribe_amount}`;
    tipOptions.style.display = "block";
    confirmBtn.innerHTML = "💎 Finalize & Release Payment";
    confirmBtn.className = "btn btn-complete";
  }

  updateSettleTotal();
  modal.style.display = "flex";
};

window.closeFinalizerModal = function() {
  playMcSound('click');
  const modal = document.getElementById("money-finalizer-modal");
  if (modal) modal.style.display = "none";
  activeModalTaskId = null;
};

window.adjustSettleAmount = function(delta) {
  playMcSound('click');
  const input = document.getElementById("settle-final-amount");
  let cur = parseInt(input.value, 10) || baseSettleAmount;
  cur = Math.max(10, Math.min(100000, cur + delta));
  input.value = cur;
  updateSettleTotal();
};

window.addTipToSettle = function(tip) {
  playMcSound('click');
  const input = document.getElementById("settle-final-amount");
  input.value = baseSettleAmount + tip;
  updateSettleTotal();
};

window.updateSettleTotal = function() {
  const input = document.getElementById("settle-final-amount");
  const displayTotal = document.getElementById("settle-display-total");
  const amount = parseInt(input.value, 10) || baseSettleAmount;
  if (displayTotal) displayTotal.textContent = `₹${amount}`;
};

window.confirmFinalizeMoney = async function() {
  if (!activeModalTaskId) return;
  const task = tasks.find(t => t.task_id === activeModalTaskId);
  if (!task) return;

  const finalAmount = parseInt(document.getElementById("settle-final-amount").value, 10) || task.bribe_amount;

  if (activeModalMode === 'adjust') {
    playMcSound('claim');
    task.bribe_amount = finalAmount;
    saveData();
    showToast(`💰 Bounty finalized to ₹${finalAmount}! Broadcast updated.`, "success");

    if (isApiConnected) {
      fetch(`/api/tasks/${task.task_id}/finalize-money`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_amount: finalAmount, mark_completed: false })
      }).catch(() => {});
    }
  } else {
    // Settlement mode: mark completed with finalized money
    playMcSound('emerald');
    task.bribe_amount = finalAmount;
    task.status = "COMPLETED";
    saveData();
    showToast(`🎉 Achievement Get! ₹${finalAmount} finalized & released to senior.`, "success");

    if (isApiConnected) {
      fetch(`/api/tasks/${task.task_id}/finalize-money`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ final_amount: finalAmount, mark_completed: true })
      }).catch(() => {});
    }
  }

  closeFinalizerModal();
  renderTasks();
  renderClaimedTasks();
  updateStats();
};

// Backward-compatible quick bribe helper
window.setBribe = function(val) {
  playMcSound('click');
  const input = document.getElementById("task-bribe");
  if (input) input.value = val;
  finalizerBase = val;
  recalcFinalizer();
};

// Download HTML File Action
window.downloadHtmlFile = function() {
  playMcSound('claim');
  const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'task_manager.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📦 Downloaded task_manager.html!', 'success');
};

// Copy File Path Action
window.copyFilePath = function() {
  playMcSound('click');
  const path = "c:\\ALGOKAV\\task_manager.html";
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(path).then(() => {
      showToast(`📋 Copied path: ${path}`, 'info');
    }).catch(() => {
      prompt('File path:', path);
    });
  } else {
    prompt('File path:', path);
  }
};

// Initialize App
document.addEventListener("DOMContentLoaded", async () => {
  // Check if backend API is reachable
  await detectBackend();

  // Load Users and Data
  loadData();
  populateUserSelectors();
  updateStats();
  renderTasks();
});

// Backend Detection
async function detectBackend() {
  try {
    const res = await fetch("/api/stats", { method: "GET", headers: { "Accept": "application/json" } });
    if (res.ok) {
      isApiConnected = true;
      if (modeText) modeText.textContent = "Live Backend";
      return;
    }
  } catch (e) {
    // Fallback to localStorage mode
  }
  isApiConnected = false;
  if (modeText) modeText.textContent = "Offline/Local";
}

// Load Data from LocalStorage or Seeds
function loadData() {
  const storedUsers = localStorage.getItem("tm_users") || localStorage.getItem("bms_users");
  const storedTasks = localStorage.getItem("tm_tasks") || localStorage.getItem("bms_tasks");

  users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
  tasks = storedTasks ? JSON.parse(storedTasks) : [...INITIAL_TASKS];

  if (!storedUsers) localStorage.setItem("tm_users", JSON.stringify(users));
  if (!storedTasks) localStorage.setItem("tm_tasks", JSON.stringify(tasks));
}

function saveData() {
  localStorage.setItem("tm_tasks", JSON.stringify(tasks));
  localStorage.setItem("tm_users", JSON.stringify(users));
  updateStats();
}

// Populate User Dropdowns
function populateUserSelectors() {
  currentUserSelect.innerHTML = "";
  taskBuyerSelect.innerHTML = "";

  users.forEach(u => {
    const opt1 = document.createElement("option");
    opt1.value = u.user_id;
    opt1.textContent = `${u.name} (${u.hostel_room})`;
    currentUserSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = u.user_id;
    opt2.textContent = `${u.name} (${u.hostel_room})`;
    taskBuyerSelect.appendChild(opt2);
  });

  // Default Senior (Arjun) as active persona
  currentUserId = users[2] ? users[2].user_id : users[0].user_id;
  currentUserSelect.value = currentUserId;

  // Default Fresher (Rohan) as task buyer
  taskBuyerSelect.value = users[0].user_id;

  currentUserSelect.addEventListener("change", (e) => {
    playMcSound('click');
    currentUserId = e.target.value;
    const activeUser = users.find(u => u.user_id === currentUserId);
    showToast(`Playing as ${activeUser ? activeUser.name : 'Player'}`, "info");
    renderTasks();
    renderClaimedTasks();
  });
}

// Calculate & Update Metrics
function updateStats() {
  const pending = tasks.filter(t => t.status === "PENDING").length;
  const accepted = tasks.filter(t => t.status === "ACCEPTED").length;
  const completed = tasks.filter(t => t.status === "COMPLETED").length;
  const totalVolume = tasks.reduce((sum, t) => sum + (t.bribe_amount || 0), 0);
  const totalCount = tasks.length;

  if (statPending) statPending.textContent = pending;
  if (statAccepted) statAccepted.textContent = accepted;
  if (statCompleted) statCompleted.textContent = completed;
  if (statVolume) statVolume.textContent = `₹${totalVolume}`;

  if (pitchTotal) pitchTotal.textContent = totalCount;
  if (pitchCompleted) pitchCompleted.textContent = completed;
  if (pitchVolume) pitchVolume.textContent = `₹${totalVolume}`;

  if (pitchScriptTotal) pitchScriptTotal.textContent = totalCount;
  if (pitchScriptCompleted) pitchScriptCompleted.textContent = completed;
  if (pitchScriptVolume) pitchScriptVolume.textContent = totalVolume;
}

// Render Live Feed
function renderTasks() {
  if (!tasksFeed) return;

  let filtered = tasks;
  if (currentFilter !== "ALL") {
    filtered = tasks.filter(t => t.status === currentFilter);
  }

  if (filtered.length === 0) {
    tasksFeed.innerHTML = `
      <div class="empty-state">
        <h3>No quests in this view!</h3>
        <p>Post a new micro-task or change filter to see all quests.</p>
      </div>
    `;
    return;
  }

  tasksFeed.innerHTML = filtered.map(t => createTaskCard(t, false)).join("");
}

// Render My Claimed Tasks
function renderClaimedTasks() {
  if (!claimedFeed) return;

  const myTasks = tasks.filter(t => t.seller_id === currentUserId);

  if (myTasks.length === 0) {
    claimedFeed.innerHTML = `
      <div class="empty-state">
        <h3>You haven't claimed any quests yet!</h3>
        <p>Go to the <strong>Live Task Feed</strong> and click "⚡ Claim Quest" to earn emeralds/cash.</p>
      </div>
    `;
    return;
  }

  claimedFeed.innerHTML = myTasks.map(t => createTaskCard(t, true)).join("");
}

// Helper: Create HTML for Task Card
function createTaskCard(task, isClaimedView) {
  const buyer = users.find(u => u.user_id === task.buyer_id) || {
    name: "Student",
    hostel_room: "Campus",
    phone_number: "919876543210"
  };

  const isMineAsBuyer = task.buyer_id === currentUserId;
  const isMineAsSeller = task.seller_id === currentUserId;
  const statusLower = task.status.toLowerCase();

  const waText = encodeURIComponent(`Hey ${buyer.name}! I saw your quest on Task Manager: "${task.title}". I'm on it!`);
  const waLink = `https://wa.me/${buyer.phone_number.replace(/\D/g, '')}?text=${waText}`;

  let actionButtons = "";

  if (task.status === "PENDING") {
    if (isMineAsBuyer) {
      actionButtons = `
        <div class="task-actions">
          <button class="btn btn-outline-sm btn-block" disabled>📌 Your Quest (Waiting for Senior)</button>
          <button class="btn btn-stepper btn-block" onclick="openFinalizerModal('${task.task_id}', 'adjust')">
            💰 Money Finalizer: Adjust Bounty
          </button>
        </div>
      `;
    } else {
      actionButtons = `
        <button class="btn btn-claim" onclick="claimTask('${task.task_id}')">
          <!-- Pixel Diamond Sword -->
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0h2v2h-2zM12 2h2v2h-2zM10 4h2v2h-2zM8 6h2v2H8zM6 8h2v2H6z" fill="#55ffff"/>
            <path d="M13 1h2v1h-2zM11 3h2v1h-2zM9 5h2v1H9zM7 7h2v1H7z" fill="#ffffff"/>
            <path d="M4 10h2v2H4z" fill="#855b38"/>
            <path d="M2 12h2v2H2z" fill="#583c25"/>
            <path d="M0 14h2v2H0z" fill="#362517"/>
          </svg>
          Claim Quest & Earn ₹${task.bribe_amount}
        </button>
      `;
    }
  } else if (task.status === "ACCEPTED") {
    if (isMineAsBuyer) {
      actionButtons = `
        <div class="task-actions">
          <a href="${waLink}" target="_blank" class="btn btn-whatsapp" onclick="playMcSound('click')">
            💬 Coordinate Delivery
          </a>
          <button class="btn btn-complete" onclick="openFinalizerModal('${task.task_id}', 'settle')">
            💎 Money Finalizer: Settle & Release ₹${task.bribe_amount}
          </button>
        </div>
      `;
    } else if (isMineAsSeller || isClaimedView) {
      actionButtons = `
        <div class="task-actions">
          <a href="${waLink}" target="_blank" class="btn btn-whatsapp" onclick="playMcSound('click')">
            💬 WhatsApp Buyer (${buyer.phone_number})
          </a>
          <button class="btn btn-complete" onclick="openFinalizerModal('${task.task_id}', 'settle')">
            ✨ Mark Complete & Finalize Payout (₹${task.bribe_amount})
          </button>
        </div>
      `;
    } else {
      actionButtons = `<button class="btn btn-outline-sm btn-block" disabled>🔒 Claimed by another player</button>`;
    }
  } else if (task.status === "COMPLETED") {
    actionButtons = `<button class="btn btn-outline-sm btn-block" disabled style="color: var(--mc-emerald);">🌟 Quest Fulfilled & Paid (₹${task.bribe_amount})</button>`;
  }

  return `
    <div class="task-card">
      <div>
        <div class="task-card-header">
          <h3 class="task-title">${escapeHtml(task.title)}</h3>
          <div class="bribe-badge">
            <!-- Pixel Gold Ingot -->
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4h10v2h2v6h-2v2H3v-2H1V6h2V4z" fill="#c48a12"/>
              <path d="M3 5h9v1h2v5h-2v1H4v-1H2V6h1V5z" fill="#fcd835"/>
              <path d="M4 5h7v1h1v3H4V5z" fill="#fff59d"/>
              <path d="M4 6h5v1H4V6z" fill="#ffffff"/>
            </svg>
            ₹${task.bribe_amount}
          </div>
        </div>
        <p class="task-desc">${escapeHtml(task.description)}</p>
      </div>

      <div>
        <div class="task-meta">
          <div class="meta-row">
            <span>Poster:</span>
            <span class="meta-val">${escapeHtml(buyer.name)}</span>
          </div>
          <div class="meta-row">
            <span>Drop Point:</span>
            <span class="meta-val">📍 ${escapeHtml(buyer.hostel_room)}</span>
          </div>
          <div class="meta-row">
            <span>Status:</span>
            <span class="status-badge ${statusLower}">${task.status}</span>
          </div>
        </div>
        <div style="margin-top: 0.85rem;">
          ${actionButtons}
        </div>
      </div>
    </div>
  `;
}

// Action: Claim Task
window.claimTask = function(taskId) {
  const task = tasks.find(t => t.task_id === taskId);
  if (!task) return;

  if (task.buyer_id === currentUserId) {
    showToast("You cannot claim your own quest!", "warning");
    return;
  }

  if (task.status !== "PENDING") {
    showToast("Quest already taken by another player!", "warning");
    return;
  }

  playMcSound('claim');
  task.status = "ACCEPTED";
  task.seller_id = currentUserId;
  saveData();

  showToast(`⚡ Quest accepted! Open WhatsApp to coordinate delivery.`, "success");
  renderTasks();
  renderClaimedTasks();

  // If backend API exists, sync asynchronously
  if (isApiConnected) {
    fetch(`/api/tasks/${taskId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seller_id: currentUserId })
    }).catch(() => {});
  }
};

// Action: Mark Complete (Direct Fallback)
window.completeTask = function(taskId) {
  openFinalizerModal(taskId, 'settle');
};

// Action: Post Task
if (postTaskForm) {
  postTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-desc").value.trim();
    const baseAmount = parseInt(document.getElementById("task-bribe").value, 10);
    const buyerId = document.getElementById("task-buyer").value;

    if (!title || !description || isNaN(baseAmount)) return;

    const totalBribe = Math.max(10, baseAmount + finalizerUrgency + finalizerEffort);

    playMcSound('claim');
    const newTask = {
      task_id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      buyer_id: buyerId,
      seller_id: null,
      title: title,
      description: description,
      bribe_amount: totalBribe,
      status: "PENDING",
      created_at: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveData();

    showToast(`⚔️ Quest broadcasted! Final bounty: ₹${totalBribe}`, "success");
    postTaskForm.reset();
    document.getElementById("task-bribe").value = "70";
    finalizerUrgency = 0;
    finalizerEffort = 0;
    recalcFinalizer();

    // Switch to Live Feed tab
    document.querySelector('.tab-btn[data-tab="feed-tab"]').click();

    // If backend API exists, sync
    if (isApiConnected) {
      fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_id: buyerId,
          title: title,
          description: description,
          bribe_amount: totalBribe
        })
      }).catch(() => {});
    }
  });
}

// Action: Reset Database
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    playMcSound('click');
    if (!confirm("Respawn database to clean pitch demo state with sample campus quests?")) return;

    tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
    users = JSON.parse(JSON.stringify(INITIAL_USERS));
    saveData();
    populateUserSelectors();
    renderTasks();
    renderClaimedTasks();

    showToast("World reset to clean demo state!", "info");

    if (isApiConnected) {
      fetch("/api/reset", { method: "POST" }).catch(() => {});
    }
  });
}

// Refresh Feed
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    playMcSound('click');
    loadData();
    renderTasks();
    updateStats();
    showToast("Notice board refreshed", "info");
  });
}

// Sync Backend Button
const syncBtn = document.getElementById("sync-backend-btn");
if (syncBtn) {
  syncBtn.addEventListener("click", async () => {
    playMcSound('click');
    await detectBackend();
    showToast(`Mode: ${isApiConnected ? "Connected to Server" : "Standalone Offline"}`, "info");
  });
}

// HTML Escaper
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>\'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
