/* =============================================
   FENCING PERFORMANCE PLANNER — app.js
   Part 1: Data, State, Storage
   ============================================= */

// ── Training Programme Data ──────────────────
const PROGRAMME = [
  {
    id: 'mon',
    day: 'Monday',
    short: 'Mon',
    title: 'Lower Body Strength + Plyometrics',
    type: 'strength',
    sections: [
      {
        heading: 'Plyometrics',
        exercises: [
          { name: 'Pogo Jumps', sets: '2 × 20' },
          { name: 'Broad Jumps', sets: '3 × 3' },
          { name: 'Skater Bounds', sets: '2 × 5 per side' }
        ]
      },
      {
        heading: 'Strength',
        exercises: [
          { name: 'Back Squat', sets: '4 × 5' },
          { name: 'Romanian Deadlift', sets: '3 × 6-8' },
          { name: 'Bulgarian Split Squat', sets: '3 × 8 per side' },
          { name: 'Standing Calf Raises', sets: '3 × 15' },
          { name: 'Copenhagen Plank', sets: '3 × 20-30 sec per side' }
        ]
      }
    ],
    focus: ['Force production', 'Single leg strength', 'Lower body robustness']
  },
  {
    id: 'tue',
    day: 'Tuesday',
    short: 'Tue',
    title: 'Garmin Base Run',
    type: 'running',
    sections: [
      {
        heading: 'Run',
        exercises: [
          { name: 'Garmin prescribed easy run', sets: '' }
        ]
      },
      {
        heading: 'Optional Plyometrics',
        exercises: [
          { name: 'Pogo Jumps', sets: '2 × 20' },
          { name: 'Line Hops', sets: '2 × 20' }
        ]
      }
    ],
    focus: ['Aerobic development', 'Recovery', 'Foot and ankle stiffness']
  },
  {
    id: 'wed',
    day: 'Wednesday',
    short: 'Wed',
    title: 'Fencing',
    type: 'fencing',
    sections: [
      {
        heading: 'Session',
        exercises: [
          { name: 'Technical work', sets: '' },
          { name: 'Tactical work', sets: '' },
          { name: 'Footwork drills', sets: '' },
          { name: 'Sparring', sets: '' }
        ]
      }
    ],
    focus: ['Skill development', 'Speed', 'Tactical improvement']
  },
  {
    id: 'thu',
    day: 'Thursday',
    short: 'Thu',
    title: 'Upper Body Strength',
    type: 'strength',
    sections: [
      {
        heading: 'Strength',
        exercises: [
          { name: 'Bench Press', sets: '4 × 5' },
          { name: 'Pull-Ups', sets: '4 × 6-8' },
          { name: 'Overhead Press', sets: '3 × 8' },
          { name: 'Chest Supported Row', sets: '3 × 8-10' },
          { name: 'Face Pulls', sets: '3 × 15' },
          { name: 'Pallof Press', sets: '3 × 10-12 per side' },
          { name: 'Farmer Carry', sets: '3 × 30-40m' }
        ]
      }
    ],
    focus: ['Upper back strength', 'Shoulder health', 'Core stability', 'Weapon control']
  },
  {
    id: 'fri',
    day: 'Friday',
    short: 'Fri',
    title: 'Garmin Speed Session + Plyometrics',
    type: 'plyometrics',
    sections: [
      {
        heading: 'Plyometrics',
        exercises: [
          { name: 'Bounds', sets: '3 × 20m' },
          { name: 'Split Squat Jumps', sets: '3 × 5 per side' },
          { name: 'Lateral Bounds', sets: '3 × 5 per side' }
        ]
      },
      {
        heading: 'Run',
        exercises: [
          { name: 'Garmin prescribed interval session', sets: '' },
          { name: 'e.g. 30s hard / 90s easy', sets: '' },
          { name: 'e.g. 200m repeats', sets: '' },
          { name: 'e.g. Tempo intervals', sets: '' }
        ]
      }
    ],
    focus: ['Explosiveness', 'Repeat sprint ability', 'Anaerobic conditioning']
  },
  {
    id: 'sat',
    day: 'Saturday',
    short: 'Sat',
    title: 'Fencing',
    type: 'fencing',
    sections: [
      {
        heading: 'Session',
        exercises: [
          { name: 'Competition style fencing', sets: '' },
          { name: 'Sparring', sets: '' },
          { name: 'Tactical drills', sets: '' },
          { name: 'Footwork', sets: '' }
        ]
      }
    ],
    focus: ['Performance', 'Tactical execution']
  },
  {
    id: 'sun',
    day: 'Sunday',
    short: 'Sun',
    title: 'Rest Day',
    type: 'rest',
    sections: [
      {
        heading: 'Activities',
        exercises: [
          { name: 'Walking', sets: '' },
          { name: 'Stretching', sets: '' },
          { name: 'Mobility', sets: '' },
          { name: 'Foam rolling', sets: '' }
        ]
      }
    ],
    focus: ['Recovery', 'Preparation for next week']
  }
];

const TYPE_COLORS = {
  strength: '#3b82f6',
  running: '#22c55e',
  fencing: '#ef4444',
  plyometrics: '#f97316',
  recovery: '#a855f7',
  rest: '#6b7280'
};

// ── Storage helpers ───────────────────────────
const store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};

// ── State ─────────────────────────────────────
let activeTab = 'dashboard';
let expandedDay = null;
let activeLogTab = 'strength';
let charts = {};

// ── Week helpers ──────────────────────────────
function getMondayOfWeek(d) {
  const dt = new Date(d);
  const day = dt.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0,0,0,0);
  return dt;
}

function getWeekKey(d) {
  const m = getMondayOfWeek(d || new Date());
  return m.toISOString().slice(0,10);
}

function todayKey() {
  return new Date().toISOString().slice(0,10);
}

function dayIndexForDate(d) {
  const day = (new Date(d)).getDay();
  // 0=Sun → 6, 1=Mon → 0, etc.
  return day === 0 ? 6 : day - 1;
}

// ── Completions ───────────────────────────────
function getCompletions() {
  return store.get('completions', {});
}

function setCompletion(weekKey, dayId, val) {
  const c = getCompletions();
  if (!c[weekKey]) c[weekKey] = {};
  c[weekKey][dayId] = val;
  store.set('completions', c);
}

function isCompleted(weekKey, dayId) {
  const c = getCompletions();
  return !!(c[weekKey] && c[weekKey][dayId]);
}

// ── Streak ────────────────────────────────────
function calcStreak() {
  const c = getCompletions();
  let streak = 0;
  let check = new Date();
  check.setHours(0,0,0,0);

  for (let i = 0; i < 365; i++) {
    const wk = getWeekKey(check);
    const di = dayIndexForDate(check);
    const dayId = PROGRAMME[di].id;
    const done = c[wk] && c[wk][dayId];
    const isRest = PROGRAMME[di].type === 'rest';
    if (done || isRest) {
      streak++;
    } else {
      if (i === 0) { check.setDate(check.getDate() - 1); continue; }
      break;
    }
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

// ── Navigation ────────────────────────────────
function navigate(tab) {
  if (tab === activeTab) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${tab}"]`).classList.add('active');
  activeTab = tab;
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'plan') renderPlan();
  if (tab === 'log') renderLogs();
  if (tab === 'recovery') renderRecovery();
  if (tab === 'analytics') renderAnalytics();
}

// ── Toast ─────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Date helpers ──────────────────────────────
function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Dashboard ─────────────────────────────────
function renderDashboard() {
  const today = new Date();
  const wk = getWeekKey(today);
  const completions = getCompletions();
  const weekDone = completions[wk] || {};

  // Date header
  document.getElementById('dashboard-date').textContent = today.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
  document.getElementById('greeting-text').textContent = getGreeting();

  // Streak
  document.getElementById('streak-count').textContent = calcStreak();

  // Next workout
  const todayIdx = dayIndexForDate(today);
  let nextIdx = -1;
  for (let i = 0; i < 7; i++) {
    const idx = (todayIdx + i) % 7;
    if (!weekDone[PROGRAMME[idx].id]) {
      nextIdx = idx;
      break;
    }
  }
  if (nextIdx !== -1) {
    const nw = PROGRAMME[nextIdx];
    document.getElementById('next-workout-title').textContent = nw.title;
    document.getElementById('next-workout-day').textContent = nextIdx === todayIdx ? 'Today' : nw.day;
    document.getElementById('next-workout-dot').style.background = TYPE_COLORS[nw.type];
  } else {
    document.getElementById('next-workout-title').textContent = 'All sessions complete!';
    document.getElementById('next-workout-day').textContent = 'Great week 🎉';
    document.getElementById('next-workout-dot').style.background = '#22c55e';
  }

  // Progress ring (7 days, rest counts as complete)
  const totalSessions = PROGRAMME.filter(d => d.type !== 'rest').length;
  const doneSessions = PROGRAMME.filter(d => d.type !== 'rest' && weekDone[d.id]).length;
  const pct = totalSessions > 0 ? Math.round((doneSessions / totalSessions) * 100) : 0;
  document.getElementById('week-pct').textContent = pct + '%';
  document.getElementById('stat-completed').textContent = doneSessions;
  document.getElementById('stat-remaining').textContent = totalSessions - doneSessions;

  const circ = 2 * Math.PI * 42;
  const fill = document.getElementById('progress-ring-fill');
  fill.style.strokeDasharray = circ;
  fill.style.strokeDashoffset = circ - (circ * pct / 100);

  // Summary counts (this week)
  const allLogs = {
    strength: store.get('strengthLogs', []),
    running: store.get('runningLogs', []),
    fencing: store.get('fencingLogs', []),
    recovery: store.get('recoveryLogs', [])
  };
  const monday = getMondayOfWeek(today);
  const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
  const inWeek = iso => {
    const d = new Date(iso + 'T00:00:00');
    return d >= monday && d <= sunday;
  };
  document.getElementById('sum-strength').textContent = allLogs.strength.filter(e => inWeek(e.date)).length;
  document.getElementById('sum-running').textContent = allLogs.running.filter(e => inWeek(e.date)).length;
  document.getElementById('sum-fencing').textContent = allLogs.fencing.filter(e => inWeek(e.date)).length;
  document.getElementById('sum-recovery').textContent = allLogs.recovery.filter(e => inWeek(e.date)).length;

  // Week schedule list
  const list = document.getElementById('week-schedule-list');
  list.innerHTML = '';
  PROGRAMME.forEach(day => {
    const done = !!weekDone[day.id];
    const row = document.createElement('div');
    row.className = 'schedule-row';
    row.innerHTML = `
      <div class="schedule-dot" style="background:${TYPE_COLORS[day.type]}"></div>
      <span class="schedule-day">${day.short}</span>
      <span class="schedule-title">${day.title}</span>
      <div class="schedule-check ${done ? 'done' : ''}">${done ? '✓' : ''}</div>
    `;
    list.appendChild(row);
  });
}

// ── Training Plan ─────────────────────────────
function renderPlan() {
  const wk = getWeekKey(new Date());
  const list = document.getElementById('training-plan-list');
  list.innerHTML = '';

  PROGRAMME.forEach((day, i) => {
    const done = isCompleted(wk, day.id);
    const card = document.createElement('div');
    card.className = 'plan-day-card' + (expandedDay === day.id ? ' expanded' : '');
    card.dataset.id = day.id;

    const wk = getWeekKey(new Date());
    let sectionsHTML = '';
    day.sections.forEach((sec, sIdx) => {
      const { exercises, guests } = getEffectiveExercises(day.id, sIdx, wk);

      const renderEx = (ex, origSecIdx, origExIdx, isGuest) => {
        const ticked = isExTicked(wk, isGuest ? ex.fromDay : day.id, origSecIdx, origExIdx);
        const guestLabel = isGuest ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px">(from ${PROGRAMME.find(d=>d.id===ex.fromDay).short})</span>` : '';
        return `
          <div class="exercise-item ${ticked ? 'ticked' : ''}">
            <button class="exercise-tick ${ticked ? 'done' : ''}"
              onclick="toggleExTick('${isGuest ? ex.fromDay : day.id}',${origSecIdx},${origExIdx})">
              ${ticked ? '✓' : ''}
            </button>
            <span class="exercise-name">${ex.name}${guestLabel}</span>
            ${ex.sets ? `<span class="exercise-sets">${ex.sets}</span>` : ''}
            <button class="exercise-move-btn"
              onclick="showMoveModal('${isGuest ? ex.fromDay : day.id}',${origSecIdx},${origExIdx},'${ex.name.replace(/'/g,"\\'")}','${ex.sets}','${sec.heading}')">
              ⇄
            </button>
          </div>
        `;
      };

      const exHTML = exercises.map(ex => renderEx(ex, ex.origSecIdx, ex.origExIdx, false)).join('');
      const guestHTML = guests.map(ex => renderEx(ex, ex.origSecIdx, ex.origExIdx, true)).join('');

      sectionsHTML += `
        <div>
          <div class="plan-section-title">${sec.heading}</div>
          <div class="exercise-list">${exHTML}${guestHTML}</div>
        </div>
        <div class="divider"></div>
      `;
    });

    const focusHTML = day.focus.map(f => `<div class="focus-item">${f}</div>`).join('');

    card.innerHTML = `
      <div class="plan-day-header">
        <div class="plan-day-color" style="background:${TYPE_COLORS[day.type]}"></div>
        <div class="plan-day-meta">
          <div class="plan-day-name">${day.day}</div>
          <div class="plan-day-title">${day.title}</div>
        </div>
        <button class="plan-day-complete-btn ${done ? 'done' : ''}" data-id="${day.id}" onclick="toggleDayComplete(event,'${day.id}')">${done ? '✓' : ''}</button>
        <svg class="plan-day-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="plan-day-body">
        <div class="plan-day-content">
          ${sectionsHTML}
          <div>
            <div class="plan-section-title">Focus</div>
            <div class="focus-list">${focusHTML}</div>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.plan-day-header').addEventListener('click', (e) => {
      if (e.target.closest('.plan-day-complete-btn')) return;
      toggleExpand(day.id);
    });

    list.appendChild(card);
  });
}

function toggleExpand(id) {
  expandedDay = expandedDay === id ? null : id;
  renderPlan();
}

function toggleDayComplete(e, id) {
  e.stopPropagation();
  const wk = getWeekKey(new Date());
  const current = isCompleted(wk, id);
  setCompletion(wk, id, !current);
  showToast(!current ? 'Session marked complete ✓' : 'Marked incomplete');
  renderPlan();
  if (activeTab === 'dashboard') renderDashboard();
}

// ── Exercise Ticks ────────────────────────────
// Key: exerciseTicks → { "weekKey:dayId:sectionIdx:exIdx": true }
function getExTicks() {
  return store.get('exerciseTicks', {});
}

function exTickKey(wk, dayId, secIdx, exIdx) {
  return `${wk}:${dayId}:${secIdx}:${exIdx}`;
}

function toggleExTick(dayId, secIdx, exIdx) {
  const wk = getWeekKey(new Date());
  const ticks = getExTicks();
  const key = exTickKey(wk, dayId, secIdx, exIdx);
  if (ticks[key]) delete ticks[key];
  else ticks[key] = true;
  store.set('exerciseTicks', ticks);
  renderPlan();
}

function isExTicked(wk, dayId, secIdx, exIdx) {
  const ticks = getExTicks();
  return !!ticks[exTickKey(wk, dayId, secIdx, exIdx)];
}

// ── Move Exercise ─────────────────────────────
// Moved exercises stored per week: movedExercises → { weekKey: [{name,sets,fromDay,toDay,secHeading},...] }
function getMovedExercises(wk) {
  return store.get('movedExercises', {})[wk] || [];
}

function saveMovedExercises(wk, arr) {
  const all = store.get('movedExercises', {});
  all[wk] = arr;
  store.set('movedExercises', all);
}

function showMoveModal(dayId, secIdx, exIdx, exName, exSets, secHeading) {
  // Remove existing modal if any
  const existing = document.getElementById('move-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'move-modal';

  const otherDays = PROGRAMME.filter(d => d.id !== dayId);
  const daysHTML = otherDays.map(d => `
    <button class="modal-day-btn" onclick="moveExercise('${dayId}','${secIdx}','${exIdx}','${d.id}')">
      <div class="modal-day-dot" style="background:${TYPE_COLORS[d.type]}"></div>
      <span class="modal-day-name">${d.day} — ${d.title}</span>
    </button>
  `).join('');

  backdrop.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-title">Move "${exName}"</div>
      <div class="modal-subtitle">Choose which day to move it to</div>
      <div class="modal-day-list">${daysHTML}</div>
      <button class="modal-cancel" onclick="closeMoveModal()">Cancel</button>
    </div>
  `;

  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeMoveModal(); });
  document.body.appendChild(backdrop);
}

function closeMoveModal() {
  const m = document.getElementById('move-modal');
  if (m) m.remove();
}

function moveExercise(fromDayId, secIdx, exIdx, toDayId) {
  const wk = getWeekKey(new Date());
  const fromDay = PROGRAMME.find(d => d.id === fromDayId);
  const sec = fromDay.sections[secIdx];
  const ex = sec.exercises[exIdx];

  const moved = getMovedExercises(wk);
  // Check if already moved from this exact slot — if so, update destination
  const existing = moved.findIndex(m => m.fromDay === fromDayId && m.secIdx == secIdx && m.exIdx == exIdx);
  if (existing !== -1) moved.splice(existing, 1);

  moved.push({
    name: ex.name,
    sets: ex.sets,
    fromDay: fromDayId,
    secIdx: parseInt(secIdx),
    exIdx: parseInt(exIdx),
    toDay: toDayId,
    secHeading: sec.heading
  });

  saveMovedExercises(wk, moved);
  closeMoveModal();
  showToast(`Moved to ${PROGRAMME.find(d => d.id === toDayId).day}`);
  renderPlan();
}

// Build the effective exercise list for a day, applying moves
function getEffectiveExercises(dayId, secIdx, wk) {
  const day = PROGRAMME.find(d => d.id === dayId);
  const sec = day.sections[secIdx];
  const moved = getMovedExercises(wk);

  // Start with base exercises, filter out moved-away ones
  let exercises = sec.exercises.map((ex, i) => {
    const movedAway = moved.find(m => m.fromDay === dayId && m.secIdx === secIdx && m.exIdx === i);
    return movedAway ? null : { ...ex, origSecIdx: secIdx, origExIdx: i, isGuest: false };
  }).filter(Boolean);

  // Add exercises moved INTO this day (append at end)
  const guests = moved
    .filter(m => m.toDay === dayId)
    .map(m => ({
      name: m.name,
      sets: m.sets,
      origSecIdx: m.secIdx,
      origExIdx: m.exIdx,
      fromDay: m.fromDay,
      isGuest: true,
      secHeading: m.secHeading
    }));

  return { exercises, guests };
}

// ── Log Tab Switching ─────────────────────────
function switchLogTab(tab) {
  activeLogTab = tab;
  document.querySelectorAll('.log-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.log === tab);
  });
  document.querySelectorAll('.log-form-section').forEach(s => {
    s.classList.toggle('hidden', !s.id.endsWith(tab));
  });
}

// ── Strength Log ──────────────────────────────
function saveStrengthLog() {
  const date = document.getElementById('str-date').value;
  const exercise = document.getElementById('str-exercise').value.trim();
  if (!date || !exercise) { showToast('Please fill in date and exercise'); return; }
  const entry = {
    id: Date.now(),
    date,
    exercise,
    weight: document.getElementById('str-weight').value || '',
    sets: document.getElementById('str-sets').value || '',
    reps: document.getElementById('str-reps').value || '',
    notes: document.getElementById('str-notes').value.trim()
  };
  const logs = store.get('strengthLogs', []);
  logs.unshift(entry);
  store.set('strengthLogs', logs);
  document.getElementById('str-exercise').value = '';
  document.getElementById('str-weight').value = '';
  document.getElementById('str-sets').value = '';
  document.getElementById('str-reps').value = '';
  document.getElementById('str-notes').value = '';
  showToast('Strength entry saved');
  renderStrengthLogs();
}

function renderStrengthLogs() {
  const logs = store.get('strengthLogs', []);
  const el = document.getElementById('strength-log-list');
  if (!logs.length) { el.innerHTML = '<p class="log-empty">No entries yet</p>'; return; }
  el.innerHTML = logs.slice(0, 20).map(e => `
    <div class="log-entry">
      <div class="log-entry-main">
        <div class="log-entry-title">${e.exercise}</div>
        <div class="log-entry-meta">${[e.weight ? e.weight+'kg' : '', e.sets ? e.sets+' sets' : '', e.reps ? e.reps+' reps' : ''].filter(Boolean).join(' · ')}</div>
        ${e.notes ? `<div class="log-entry-meta" style="margin-top:4px;font-style:italic">${e.notes}</div>` : ''}
      </div>
      <div class="log-entry-date">${formatDate(e.date)}</div>
    </div>
  `).join('');
}

// ── Running Log ───────────────────────────────
function saveRunningLog() {
  const date = document.getElementById('run-date').value;
  if (!date) { showToast('Please select a date'); return; }
  const entry = {
    id: Date.now(),
    date,
    distance: document.getElementById('run-distance').value || '',
    duration: document.getElementById('run-duration').value || '',
    pace: document.getElementById('run-pace').value.trim(),
    rpe: document.getElementById('run-rpe').value || '',
    notes: document.getElementById('run-notes').value.trim()
  };
  const logs = store.get('runningLogs', []);
  logs.unshift(entry);
  store.set('runningLogs', logs);
  document.getElementById('run-distance').value = '';
  document.getElementById('run-duration').value = '';
  document.getElementById('run-pace').value = '';
  document.getElementById('run-rpe').value = '';
  document.getElementById('run-notes').value = '';
  showToast('Run saved');
  renderRunningLogs();
}

function renderRunningLogs() {
  const logs = store.get('runningLogs', []);
  const el = document.getElementById('running-log-list');
  if (!logs.length) { el.innerHTML = '<p class="log-empty">No runs logged yet</p>'; return; }
  el.innerHTML = logs.slice(0, 20).map(e => `
    <div class="log-entry">
      <div class="log-entry-main">
        <div class="log-entry-title">${e.distance ? e.distance+'km' : 'Run'}</div>
        <div class="log-entry-meta">${[e.duration ? e.duration+'min' : '', e.pace ? e.pace+'/km' : '', e.rpe ? 'RPE '+e.rpe : ''].filter(Boolean).join(' · ')}</div>
        ${e.notes ? `<div class="log-entry-meta" style="margin-top:4px;font-style:italic">${e.notes}</div>` : ''}
      </div>
      <div class="log-entry-date">${formatDate(e.date)}</div>
    </div>
  `).join('');
}

// ── Fencing Log ───────────────────────────────
function saveFencingLog() {
  const date = document.getElementById('fen-date').value;
  if (!date) { showToast('Please select a date'); return; }
  const entry = {
    id: Date.now(),
    date,
    technical: document.getElementById('fen-technical').value || '',
    tactical: document.getElementById('fen-tactical').value || '',
    footwork: document.getElementById('fen-footwork').value || '',
    notes: document.getElementById('fen-notes').value.trim()
  };
  const logs = store.get('fencingLogs', []);
  logs.unshift(entry);
  store.set('fencingLogs', logs);
  document.getElementById('fen-technical').value = '';
  document.getElementById('fen-tactical').value = '';
  document.getElementById('fen-footwork').value = '';
  document.getElementById('fen-notes').value = '';
  showToast('Fencing session saved');
  renderFencingLogs();
}

function renderFencingLogs() {
  const logs = store.get('fencingLogs', []);
  const el = document.getElementById('fencing-log-list');
  if (!logs.length) { el.innerHTML = '<p class="log-empty">No sessions logged yet</p>'; return; }
  el.innerHTML = logs.slice(0, 20).map(e => `
    <div class="log-entry">
      <div class="log-entry-main">
        <div class="log-entry-title">Fencing Session</div>
        <div class="log-entry-meta">${[e.technical ? 'Tech '+e.technical : '', e.tactical ? 'Tact '+e.tactical : '', e.footwork ? 'Foot '+e.footwork : ''].filter(Boolean).join(' · ')}</div>
        ${e.notes ? `<div class="log-entry-meta" style="margin-top:4px;font-style:italic">${e.notes}</div>` : ''}
      </div>
      <div class="log-entry-date">${formatDate(e.date)}</div>
    </div>
  `).join('');
}

function renderLogs() {
  renderStrengthLogs();
  renderRunningLogs();
  renderFencingLogs();
  // Set today's date on all log date inputs if empty
  const today = todayKey();
  ['str-date','run-date','fen-date'].forEach(id => {
    const el = document.getElementById(id);
    if (!el.value) el.value = today;
  });
}

// ── Recovery ──────────────────────────────────
function saveRecovery() {
  const date = document.getElementById('rec-date').value;
  if (!date) { showToast('Please select a date'); return; }
  const entry = {
    id: Date.now(),
    date,
    sleep: document.getElementById('rec-sleep').value || '',
    energy: document.getElementById('rec-energy').value || '',
    fatigue: document.getElementById('rec-fatigue').value || '',
    weight: document.getElementById('rec-weight').value || '',
    notes: document.getElementById('rec-notes').value.trim()
  };
  const logs = store.get('recoveryLogs', []);
  // Replace same-day entry if exists
  const idx = logs.findIndex(e => e.date === date);
  if (idx !== -1) logs.splice(idx, 1);
  logs.unshift(entry);
  store.set('recoveryLogs', logs);
  document.getElementById('rec-notes').value = '';
  showToast('Recovery entry saved');
  renderRecovery();
}

function renderRecovery() {
  const today = todayKey();
  const el = document.getElementById('rec-date');
  if (!el.value) el.value = today;

  const logs = store.get('recoveryLogs', []);
  // Pre-fill today if entry exists
  const todayEntry = logs.find(e => e.date === today);
  if (todayEntry) {
    document.getElementById('rec-sleep').value = todayEntry.sleep;
    document.getElementById('rec-energy').value = todayEntry.energy;
    document.getElementById('rec-fatigue').value = todayEntry.fatigue;
    document.getElementById('rec-weight').value = todayEntry.weight;
    document.getElementById('rec-notes').value = todayEntry.notes;
  }

  const listEl = document.getElementById('recovery-log-list');
  if (!logs.length) { listEl.innerHTML = '<p class="log-empty">No recovery entries yet</p>'; return; }
  listEl.innerHTML = logs.slice(0, 14).map(e => `
    <div class="recovery-entry">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:14px;font-weight:600">${formatDate(e.date)}</span>
        ${e.weight ? `<span style="font-size:13px;color:var(--text-secondary)">${e.weight}kg</span>` : ''}
      </div>
      <div class="recovery-row">
        ${e.sleep ? `<div class="recovery-metric"><span class="recovery-metric-value">${e.sleep}h</span><span class="recovery-metric-label">Sleep</span></div>` : ''}
        ${e.energy ? `<div class="recovery-metric"><span class="recovery-metric-value">${e.energy}/10</span><span class="recovery-metric-label">Energy</span></div>` : ''}
        ${e.fatigue ? `<div class="recovery-metric"><span class="recovery-metric-value">${e.fatigue}/10</span><span class="recovery-metric-label">Fatigue</span></div>` : ''}
      </div>
      ${e.notes ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:6px;font-style:italic">${e.notes}</div>` : ''}
    </div>
  `).join('');
}

// ── Analytics ─────────────────────────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { labels: { color: '#8888a0', font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: '#55556a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#55556a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } }
  }
};

function destroyChart(key) {
  if (charts[key]) { charts[key].destroy(); delete charts[key]; }
}

function getWeekKeys(n) {
  const keys = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() - i * 7);
    keys.push(getWeekKey(dt));
  }
  return keys;
}

function renderAnalytics() {
  const completions = getCompletions();
  const strengthLogs = store.get('strengthLogs', []);
  const runningLogs = store.get('runningLogs', []);
  const fencingLogs = store.get('fencingLogs', []);
  const recoveryLogs = store.get('recoveryLogs', []);

  const nonRest = PROGRAMME.filter(d => d.type !== 'rest').length; // 6 sessions

  // Chart 1: Weekly adherence %
  destroyChart('adherence');
  const wkKeys = getWeekKeys(8);
  const adherenceData = wkKeys.map(wk => {
    const done = Object.keys(completions[wk] || {}).filter(id => {
      const d = PROGRAMME.find(p => p.id === id);
      return d && d.type !== 'rest';
    }).length;
    return Math.round((done / nonRest) * 100);
  });
  const wkLabels = wkKeys.map(k => {
    const d = new Date(k + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  });
  charts.adherence = new Chart(document.getElementById('chart-adherence'), {
    type: 'bar',
    data: {
      labels: wkLabels,
      datasets: [{
        label: 'Adherence %',
        data: adherenceData,
        backgroundColor: 'rgba(59,130,246,0.7)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, max: 100, min: 0 } }
    }
  });

  // Chart 2: Workout types (all time)
  destroyChart('types');
  charts.types = new Chart(document.getElementById('chart-types'), {
    type: 'doughnut',
    data: {
      labels: ['Strength', 'Running', 'Fencing'],
      datasets: [{
        data: [strengthLogs.length, runningLogs.length, fencingLogs.length],
        backgroundColor: ['rgba(59,130,246,0.8)', 'rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)'],
        borderColor: ['#3b82f6','#22c55e','#ef4444'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#8888a0', font: { size: 11 } } } }
    }
  });

  // Chart 3: Recovery scores last 14 days
  destroyChart('recovery');
  const last14 = recoveryLogs.slice(0, 14).reverse();
  charts.recovery = new Chart(document.getElementById('chart-recovery'), {
    type: 'line',
    data: {
      labels: last14.map(e => {
        const d = new Date(e.date + 'T00:00:00');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      }),
      datasets: [
        {
          label: 'Energy',
          data: last14.map(e => e.energy || null),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 3
        },
        {
          label: 'Fatigue',
          data: last14.map(e => e.fatigue || null),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 3
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 10 } }
    }
  });

  // Chart 4: Running distance per week (last 8 weeks)
  destroyChart('running');
  const runDistData = wkKeys.map(wk => {
    const monday = new Date(wk + 'T00:00:00');
    const sunday = new Date(monday); sunday.setDate(sunday.getDate() + 6);
    const total = runningLogs
      .filter(e => { const d = new Date(e.date + 'T00:00:00'); return d >= monday && d <= sunday; })
      .reduce((sum, e) => sum + (parseFloat(e.distance) || 0), 0);
    return Math.round(total * 10) / 10;
  });
  charts.running = new Chart(document.getElementById('chart-running'), {
    type: 'bar',
    data: {
      labels: wkLabels,
      datasets: [{
        label: 'Distance (km)',
        data: runDistData,
        backgroundColor: 'rgba(34,197,94,0.7)',
        borderColor: '#22c55e',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: CHART_DEFAULTS
  });
}

// ── Init ──────────────────────────────────────
function init() {
  // Bottom nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  // Log tabs
  document.querySelectorAll('.log-tab').forEach(btn => {
    btn.addEventListener('click', () => switchLogTab(btn.dataset.log));
  });

  // Render initial dashboard
  renderDashboard();
}

document.addEventListener('DOMContentLoaded', init);
