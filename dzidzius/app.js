/* =========================================================
   Dzidziuś — logika aplikacji.
   Kolejność: konfiguracja → czas i doba → dane → bramki →
   render → arkusze → stepper → synchronizacja.
   ========================================================= */

(function () {
'use strict';

var CFG = window.DZIDZIUS_CONFIG || {};

/* Hasło trzymane jako kody znaków, żeby nie leżało otwartym tekstem w źródle.
   To zamek w drzwiach, nie sejf — patrz README. */
var PASS = String.fromCharCode(102, 97, 102, 108, 117, 110, 100, 111);

var K_AUTH  = 'dz.auth';
var K_DATA  = 'dz.events';
var K_QUEUE = 'dz.queue';

var $  = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

/* =========================================================
   1. CZAS I DOBA
   ========================================================= */

var BIRTH = new Date(CFG.birth);
var DAY_H = typeof CFG.dayStartHour === 'number' ? CFG.dayStartHour : 4;

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function fmtTime(d) { return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); }

function fmtDate(d) { return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1); }

/* Początek doby, do której należy dany moment. Doba startuje o DAY_H. */
function dayStart(d) {
  var s = new Date(d.getFullYear(), d.getMonth(), d.getDate(), DAY_H, 0, 0, 0);
  if (d < s) s.setDate(s.getDate() - 1);
  return s;
}

/* Różnica w dobach liczona po dacie kalendarzowej — odporna na zmianę czasu. */
function daysBetween(a, b) {
  var ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ua - ub) / 86400000);
}

function dayOfLife(d) {
  return daysBetween(dayStart(d), dayStart(BIRTH)) + 1;
}

function suggestedMl(day) {
  if (!(day >= 1)) day = 1;
  var v = (day + (CFG.mlOffset || 0)) * (CFG.mlStep || 10);
  return Math.min(v, CFG.mlMax || 100);
}

/* „2 godz. 40 min" — jednostka, której realnie się szuka w nocy. */
function ago(from, now) {
  var mins = Math.max(0, Math.floor((now - from) / 60000));
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  if (h === 0) return m + ' min';
  return h + ' godz. ' + pad2(m) + ' min';
}

/* =========================================================
   2. DANE
   ========================================================= */

var events = [];

function loadLocal() {
  try { events = JSON.parse(localStorage.getItem(K_DATA)) || []; }
  catch (e) { events = []; }
}

function saveLocal() {
  try { localStorage.setItem(K_DATA, JSON.stringify(events)); } catch (e) {}
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function live() {
  return events.filter(function (e) { return !e.deleted; })
               .sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
}

function byId(id) {
  for (var i = 0; i < events.length; i++) if (events[i].id === id) return events[i];
  return null;
}

function upsert(ev) {
  ev.updated_at = new Date().toISOString();
  var old = byId(ev.id);
  if (old) { for (var k in ev) old[k] = ev[k]; }
  else { events.push(ev); }
  saveLocal();
  queuePush(ev.id);
}

function lastOfType(type) {
  var l = live();
  for (var i = 0; i < l.length; i++) if (l[i].type === type) return l[i];
  return null;
}

/* =========================================================
   3. BRAMKI: HASŁO I IMIĘ
   ========================================================= */

function start() {
  if (localStorage.getItem(K_AUTH) === 'ok') boot();
  else showGate();
}

function showGate() {
  $('#gate').hidden = false;
  setTimeout(function () { $('#gateInput').focus(); }, 60);

  $('#gateForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('#gateInput').value.trim();
    if (v === PASS) {
      localStorage.setItem(K_AUTH, 'ok');
      $('#gate').hidden = true;
      boot();
    } else {
      $('#gateError').hidden = false;
      $('#gateInput').value = '';
      $('#gateInput').focus();
    }
  });
}

/* =========================================================
   4. RENDER
   ========================================================= */

var view = 'today';

function render() {
  var now = new Date();
  var day = dayOfLife(now);

  $('#dayLabel').textContent = (CFG.babyName || 'Dziecko') + ' · ' + day + '. doba';
  $('#sugLabel').textContent = 'Sugerowana ilość: ' + suggestedMl(day) + ' ml';
  paintSyncStatus();

  $$('[data-clock]').forEach(function (el) { el.textContent = fmtTime(now); });

  renderStat('feed', $('#lastFeedAgo'), $('#lastFeedMeta'), now);
  renderStat('diaper', $('#lastDiaperAgo'), $('#lastDiaperMeta'), now);

  renderToday(now);
  renderHistory(now);
}

function renderStat(type, agoEl, metaEl, now) {
  var e = lastOfType(type);
  if (!e) { agoEl.textContent = '—'; metaEl.textContent = 'brak wpisów'; return; }
  var at = new Date(e.at);
  agoEl.textContent = ago(at, now) + ' temu';
  metaEl.textContent = fmtTime(at) + ' · ' + describe(e);
}

function describe(e) {
  if (e.type === 'feed') {
    var s = (e.amount_ml != null ? e.amount_ml : 0) + ' ml';
    var extra = [];
    if (e.burped) extra.push('odbiło się');
    if (e.spit_up) extra.push('ulało się');
    return extra.length ? s + ' · ' + extra.join(' · ') : s;
  }
  var p = [];
  if (e.pee) p.push('siku');
  if (e.poop) p.push('kupa');
  return p.length ? p.join(' + ') : 'czysta';
}

function makeRow(e, prevSameType) {
  var at = new Date(e.at);
  var btn = document.createElement('button');
  btn.className = 'log-item';
  btn.type = 'button';
  btn.setAttribute('data-id', e.id);

  var dot = document.createElement('span');
  dot.className = 'log-dot' + (e.type === 'feed' ? ' milk' : '');

  var tm = document.createElement('span');
  tm.className = 'log-time';
  tm.textContent = fmtTime(at);

  var body = document.createElement('span');
  body.className = 'log-body';

  var ttl = document.createElement('span');
  ttl.className = 'log-title';
  ttl.textContent = (e.type === 'feed' ? 'Karmienie · ' : 'Pielucha · ') + describe(e);

  var bits = [];
  if (prevSameType) bits.push('przerwa ' + ago(new Date(prevSameType.at), at));
  if (e.note) bits.push(e.note);

  body.appendChild(ttl);
  if (bits.length) {
    var sub = document.createElement('span');
    sub.className = 'log-sub';
    sub.textContent = bits.join(' · ');
    body.appendChild(sub);
  }
  btn.appendChild(dot);
  btn.appendChild(tm);
  btn.appendChild(body);

  btn.addEventListener('click', function () { openSheet(e.type, e.id); });
  return btn;
}

/* Poprzedni wpis tego samego typu — do policzenia przerwy. */
function prevSame(list, i) {
  for (var j = i + 1; j < list.length; j++) if (list[j].type === list[i].type) return list[j];
  return null;
}

function summarize(list) {
  var feeds = list.filter(function (e) { return e.type === 'feed'; });
  var ml = feeds.reduce(function (s, e) { return s + (e.amount_ml || 0); }, 0);
  var diapers = list.length - feeds.length;
  return feeds.length + ' karm. · ' + ml + ' ml · ' + diapers + ' piel.';
}

function renderToday(now) {
  var start = dayStart(now);
  var list = live().filter(function (e) { return new Date(e.at) >= start; });

  $('#todayTitle').textContent = dayOfLife(now) + '. doba';
  $('#todaySum').textContent = list.length ? summarize(list) : '—';

  var box = $('#todayLog');
  box.textContent = '';
  list.forEach(function (e, i) { box.appendChild(makeRow(e, prevSame(list, i))); });
  $('#todayEmpty').hidden = list.length > 0;
}

function renderHistory(now) {
  var todayStart = dayStart(now);
  var older = live().filter(function (e) { return new Date(e.at) < todayStart; });

  var box = $('#historyList');
  box.textContent = '';
  $('#historyEmpty').hidden = older.length > 0;
  if (!older.length) return;

  var groups = [];
  var index = {};
  older.forEach(function (e) {
    var key = dayStart(new Date(e.at)).getTime();
    if (!index[key]) { index[key] = { key: key, items: [] }; groups.push(index[key]); }
    index[key].items.push(e);
  });

  groups.forEach(function (g) {
    var s = new Date(g.key);
    var wrap = document.createElement('div');
    wrap.className = 'day-group';

    var head = document.createElement('div');
    head.className = 'log-head';

    var t = document.createElement('span');
    t.textContent = dayOfLife(s) + '. doba';

    var sum = document.createElement('span');
    sum.className = 'log-sum';
    sum.textContent = fmtDate(s) + ' · ' + summarize(g.items);

    head.appendChild(t);
    head.appendChild(sum);
    wrap.appendChild(head);

    var log = document.createElement('div');
    log.className = 'log';
    g.items.forEach(function (e, i) { log.appendChild(makeRow(e, prevSame(g.items, i))); });
    wrap.appendChild(log);
    box.appendChild(wrap);
  });
}

function setView(v) {
  view = v;
  $('#viewToday').hidden = v !== 'today';
  $('#viewHistory').hidden = v !== 'history';
  $$('.tab').forEach(function (b) { b.classList.toggle('is-on', b.dataset.view === v); });
}

/* =========================================================
   5. STEPPER — jeden wzorzec dla czasu i ilości
   ========================================================= */

function Stepper(root, opts) {
  var numEl = $('.value-num', root);
  var unitEl = $('.value-unit', root);
  var valueBtn = $('[data-role="value"]', root);
  var val = opts.initial;
  var editing = false;

  function paint() {
    if (editing) return;
    numEl.textContent = opts.format(val);
    if (opts.onChange) opts.onChange(val);
  }

  function bump(delta) {
    if (editing) commit();
    val = opts.clamp(opts.add(val, delta));
    paint();
  }

  /* Przytrzymanie przycisku powtarza krok — przy ±1 ml to różnica. */
  $$('.step', root).forEach(function (b) {
    var timer = null, repeat = null;
    var delta = parseInt(b.dataset.step, 10);

    function down(e) {
      e.preventDefault();
      bump(delta);
      timer = setTimeout(function () {
        repeat = setInterval(function () { bump(delta); }, 90);
      }, 450);
    }
    function up() {
      clearTimeout(timer);
      clearInterval(repeat);
      timer = repeat = null;
    }

    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointerleave', up);
    b.addEventListener('pointercancel', up);
  });

  function commit() {
    if (!editing) return;
    var input = $('.value-input', root);
    if (input) {
      var parsed = opts.parse(input.value, val);
      if (parsed != null) val = opts.clamp(parsed);
      input.remove();
    }
    editing = false;
    numEl.hidden = false;
    unitEl.hidden = false;
    paint();
  }

  valueBtn.addEventListener('click', function () {
    if (editing) return;
    editing = true;
    numEl.hidden = true;
    unitEl.hidden = true;

    var input = document.createElement('input');
    input.className = 'value-input';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.value = opts.editValue(val);
    input.maxLength = opts.maxLength;
    valueBtn.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    });
    input.addEventListener('blur', commit);
  });

  paint();

  return {
    get: function () { commit(); return val; },
    set: function (v) { val = opts.clamp(v); paint(); }
  };
}

/* --- czas: ±5 min, wpis w formacie 3:12 / 312 / 0312 --- */
function timeStepper(root, initial, onChange) {
  return Stepper(root, {
    initial: initial,
    format: function (d) { return fmtTime(d); },
    editValue: function (d) { return fmtTime(d); },
    maxLength: 5,
    add: function (d, m) { return new Date(d.getTime() + m * 60000); },
    clamp: function (d) { return d; },
    parse: function (s, current) {
      var digits = s.replace(/\D/g, '');
      if (digits.length < 3 || digits.length > 4) return null;
      if (digits.length === 3) digits = '0' + digits;
      var h = parseInt(digits.slice(0, 2), 10);
      var m = parseInt(digits.slice(2), 10);
      if (h > 23 || m > 59) return null;
      var d = new Date(current);
      d.setHours(h, m, 0, 0);
      /* Wpisana godzina późniejsza niż teraz o ponad 2 h = to było wczoraj. */
      if (d - new Date() > 2 * 3600000) d.setDate(d.getDate() - 1);
      return d;
    },
    onChange: onChange
  });
}

/* --- ilość: ±1 / ±5 ml --- */
function mlStepper(root, initial, onChange) {
  return Stepper(root, {
    initial: initial,
    format: function (v) { return String(v); },
    editValue: function (v) { return String(v); },
    maxLength: 3,
    add: function (v, d) { return v + d; },
    clamp: function (v) {
      var lo = CFG.mlMin != null ? CFG.mlMin : 0;
      var hi = CFG.mlHardMax || 500;
      return Math.max(lo, Math.min(hi, Math.round(v)));
    },
    parse: function (s) {
      var d = s.replace(/\D/g, '');
      return d === '' ? null : parseInt(d, 10);
    },
    onChange: onChange
  });
}

/* =========================================================
   6. ARKUSZE
   ========================================================= */

var sheet = { at: new Date(), editingId: null, type: null };
var ctlFeedTime, ctlFeedMl, ctlDiaperTime;

function flagsOf(rootSel) { return $$(rootSel + ' .toggle'); }

function setToggle(btn, on) { btn.classList.toggle('is-on', !!on); }

function openSheet(type, id) {
  sheet.type = type;
  sheet.editingId = id || null;

  var ev = id ? byId(id) : null;
  sheet.at = ev ? new Date(ev.at) : new Date();

  if (type === 'feed') {
    var last = lastOfType('feed');
    var amount = ev ? (ev.amount_ml || 0)
                    : (last ? (last.amount_ml || 0) : suggestedMl(dayOfLife(sheet.at)));

    $('#feedTitle').textContent = ev ? 'Edytuj karmienie' : 'Karmienie';
    $('#feedSave').textContent = ev ? 'Zapisz zmiany' : 'Zapisz karmienie';
    $('#feedDelete').hidden = !ev;
    $('#feedNote').value = ev ? (ev.note || '') : '';

    flagsOf('#sheetFeed').forEach(function (b) {
      setToggle(b, ev ? !!ev[b.dataset.flag] : false);
    });

    $('#sheetFeed').hidden = false;
    ctlFeedTime.set(sheet.at);
    ctlFeedMl.set(amount);
    paintSuggest();

  } else {
    $('#diaperTitle').textContent = ev ? 'Edytuj pieluchę' : 'Pielucha';
    $('#diaperSave').textContent = ev ? 'Zapisz zmiany' : 'Zapisz pieluchę';
    $('#diaperDelete').hidden = !ev;
    $('#diaperNote').value = ev ? (ev.note || '') : '';

    flagsOf('#sheetDiaper').forEach(function (b) {
      var f = b.dataset.flag;
      var on = ev ? (f === 'clean' ? (!ev.pee && !ev.poop) : !!ev[f]) : (f === 'pee');
      setToggle(b, on);
    });

    $('#sheetDiaper').hidden = false;
    ctlDiaperTime.set(sheet.at);
  }
}

function paintSuggest() {
  var d = dayOfLife(sheet.at);
  $('#feedSuggest').textContent =
    'Sugerowana ilość mleczka: ' + suggestedMl(d) + ' ml · ' + d + '. doba';
}

function closeSheets() {
  $('#sheetFeed').hidden = true;
  $('#sheetDiaper').hidden = true;
  $('#sheetSettings').hidden = true;
  sheet.editingId = null;
}

function saveFeed() {
  var at = ctlFeedTime.get();
  var ml = ctlFeedMl.get();
  var isNew = !sheet.editingId;

  var ev = {
    id: sheet.editingId || uid(),
    type: 'feed',
    at: at.toISOString(),
    amount_ml: ml,
    burped: $('#sheetFeed .toggle[data-flag="burped"]').classList.contains('is-on'),
    spit_up: $('#sheetFeed .toggle[data-flag="spit_up"]').classList.contains('is-on'),
    pee: false,
    poop: false,
    note: $('#feedNote').value.trim() || null,
    deleted: false
  };
  if (isNew) ev.created_at = new Date().toISOString();

  upsert(ev);
  closeSheets();
  setView('today');
  render();
  showToast('Zapisano ' + fmtTime(at) + ' · ' + ml + ' ml', isNew ? ev.id : null);
  sync();
}

function saveDiaper() {
  var at = ctlDiaperTime.get();
  var isNew = !sheet.editingId;
  var pee = $('#sheetDiaper .toggle[data-flag="pee"]').classList.contains('is-on');
  var poop = $('#sheetDiaper .toggle[data-flag="poop"]').classList.contains('is-on');

  var ev = {
    id: sheet.editingId || uid(),
    type: 'diaper',
    at: at.toISOString(),
    amount_ml: null,
    burped: false,
    spit_up: false,
    pee: pee,
    poop: poop,
    note: $('#diaperNote').value.trim() || null,
    deleted: false
  };
  if (isNew) ev.created_at = new Date().toISOString();

  upsert(ev);
  closeSheets();
  setView('today');
  render();
  showToast('Zapisano ' + fmtTime(at) + ' · ' + describe(ev), isNew ? ev.id : null);
  sync();
}

function removeEvent(id) {
  var ev = byId(id);
  if (!ev) return;
  ev.deleted = true;
  upsert(ev);
  closeSheets();
  render();
  showToast('Wpis usunięty', null);
  sync();
}

/* =========================================================
   7. TOAST Z COFNIJ
   ========================================================= */

var toastTimer = null;
var undoId = null;

function showToast(text, idToUndo) {
  undoId = idToUndo;
  $('#toastText').textContent = text;
  $('#toastUndo').hidden = !idToUndo;
  $('#toast').hidden = false;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 10000);
}

function hideToast() {
  $('#toast').hidden = true;
  undoId = null;
}

/* =========================================================
   8. SYNCHRONIZACJA (opcjonalna, Supabase REST)
   ========================================================= */

function syncOn() { return !!(CFG.supabaseUrl && CFG.supabaseKey); }

function api(path, opts) {
  opts = opts || {};
  opts.headers = Object.assign({
    'apikey': CFG.supabaseKey,
    'Authorization': 'Bearer ' + CFG.supabaseKey,
    'Content-Type': 'application/json'
  }, opts.headers || {});
  return fetch(CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1/' + path, opts);
}

function queueGet() {
  try { return JSON.parse(localStorage.getItem(K_QUEUE)) || []; } catch (e) { return []; }
}

function queueSet(q) {
  try { localStorage.setItem(K_QUEUE, JSON.stringify(q)); } catch (e) {}
}

function queuePush(id) {
  if (!syncOn()) return;
  var q = queueGet();
  if (q.indexOf(id) === -1) { q.push(id); queueSet(q); }
}

var syncing = false;
var syncState = 'off';   // off | ok | pending | error
var lastPull = null;

/* Wysyła to, co czeka w kolejce, i pobiera wszystko z bazy.
   Wołane po każdym zapisie, przy powrocie do aplikacji i co 20 s. */
function sync(silent) {
  if (!syncOn()) { syncState = 'off'; paintSyncStatus(); return Promise.resolve(); }
  if (syncing) return Promise.resolve();
  if (!navigator.onLine) { syncState = 'pending'; paintSyncStatus(); return Promise.resolve(); }

  syncing = true;
  if (!silent) paintSyncStatus();

  var rows = queueGet().map(byId).filter(Boolean);

  var push = rows.length
    ? api(CFG.supabaseTable, {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(rows)
      }).then(function (r) {
        if (!r.ok) throw new Error('push ' + r.status);
        queueSet([]);
      })
    : Promise.resolve();

  return push
    .then(function () { return api(CFG.supabaseTable + '?select=*'); })
    .then(function (r) {
      if (!r.ok) throw new Error('pull ' + r.status);
      return r.json();
    })
    .then(function (remote) {
      var changed = false;

      remote.forEach(function (r) {
        var local = byId(r.id);
        if (!local) { events.push(r); changed = true; return; }
        /* Przy konflikcie wygrywa nowsza zmiana. */
        if (new Date(r.updated_at || 0) > new Date(local.updated_at || 0)) {
          for (var k in r) local[k] = r[k];
          changed = true;
        }
      });

      if (changed) { saveLocal(); render(); }
      syncState = queueGet().length ? 'pending' : 'ok';
      lastPull = new Date();
    })
    .catch(function () {
      /* Brak sieci, zła godzina na serwerze, literówka w kluczu — cokolwiek.
         Dane są bezpieczne lokalnie, spróbujemy przy następnym odświeżeniu. */
      syncState = queueGet().length ? 'pending' : 'error';
    })
    .then(function () {
      syncing = false;
      paintSyncStatus();
    });
}

function paintSyncStatus() {
  var pending = queueGet().length;
  var dot = $('#syncDot');
  var word = $('#syncWord');

  var label, cls;
  if (!syncOn())            { label = 'lokalnie'; cls = 'is-off'; }
  else if (syncing)         { label = 'synchr...'; cls = 'is-pending'; }
  else if (pending)         { label = pending + ' w kolejce'; cls = 'is-pending'; }
  else if (syncState === 'error') { label = 'brak łączności'; cls = 'is-error'; }
  else                      { label = 'zsynchr.'; cls = 'is-ok'; }

  if (word) word.textContent = label;
  if (dot) dot.className = 'sync-dot ' + cls;

  var el = $('#setSync');
  if (!el) return;

  if (!syncOn()) {
    el.textContent = 'Wyłączona — dane są tylko na tym telefonie.';
    $('#setSyncHint').hidden = false;
    $('#btnRefresh').hidden = true;
  } else {
    $('#setSyncHint').hidden = true;
    $('#btnRefresh').hidden = false;
    if (pending) {
      el.textContent = 'Włączona · ' + pending + ' wpisów czeka na wysłanie';
    } else if (syncState === 'error') {
      el.textContent = 'Włączona · nie udało się połączyć z bazą. Wpisy są zapisane tutaj i polecą, gdy wróci internet.';
    } else {
      el.textContent = 'Włączona · wszystko zsynchronizowane'
        + (lastPull ? ' (ostatnio ' + fmtTime(lastPull) + ')' : '');
    }
  }
}

/* =========================================================
   9. START
   ========================================================= */

function boot() {
  loadLocal();
  $('#app').hidden = false;

  /* Steppery powstają raz — inaczej każde otwarcie arkusza dokładałoby
     kolejny komplet handlerów i jeden dotyk zmieniałby wartość kilka razy. */
  ctlFeedTime = timeStepper($('#feedTime'), new Date(), function (d) {
    sheet.at = d;
    if (sheet.type === 'feed') paintSuggest();
  });
  ctlFeedMl = mlStepper($('#feedAmount'), suggestedMl(dayOfLife(new Date())));
  ctlDiaperTime = timeStepper($('#diaperTime'), new Date(), function (d) {
    sheet.at = d;
  });

  $('#btnFeed').addEventListener('click', function () { openSheet('feed'); });
  $('#btnDiaper').addEventListener('click', function () { openSheet('diaper'); });
  $('#feedSave').addEventListener('click', saveFeed);
  $('#diaperSave').addEventListener('click', saveDiaper);
  $('#feedDelete').addEventListener('click', function () { removeEvent(sheet.editingId); });
  $('#diaperDelete').addEventListener('click', function () { removeEvent(sheet.editingId); });

  $$('[data-close]').forEach(function (b) { b.addEventListener('click', closeSheets); });

  $$('.tab').forEach(function (b) {
    b.addEventListener('click', function () { setView(b.dataset.view); });
  });

  /* Karmienie: dwa niezależne przełączniki. */
  flagsOf('#sheetFeed').forEach(function (b) {
    b.addEventListener('click', function () { setToggle(b, !b.classList.contains('is-on')); });
  });

  /* Pielucha: siku + kupa mogą być razem, „czysta" je wyklucza. */
  flagsOf('#sheetDiaper').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.flag;
      var all = flagsOf('#sheetDiaper');
      if (f === 'clean') {
        all.forEach(function (o) { setToggle(o, o.dataset.flag === 'clean'); });
      } else {
        setToggle(b, !b.classList.contains('is-on'));
        var clean = all.filter(function (o) { return o.dataset.flag === 'clean'; })[0];
        var any = all.some(function (o) {
          return o.dataset.flag !== 'clean' && o.classList.contains('is-on');
        });
        setToggle(clean, !any);
      }
    });
  });

  $('#toastUndo').addEventListener('click', function () {
    if (undoId) removeEvent(undoId);
    hideToast();
  });

  /* Ustawienia */
  $('#btnSettings').addEventListener('click', function () {
    $('#setBirth').textContent =
      (CFG.babyName || 'Dziecko') + ' · ur. ' + fmtDate(BIRTH) + '.' + BIRTH.getFullYear() +
      ' o ' + fmtTime(BIRTH) + ' · doba zaczyna się o ' + pad2(DAY_H) + ':00';
    paintSyncStatus();
    $('#sheetSettings').hidden = false;
  });

  $('#btnRefresh').addEventListener('click', function () {
    sync().then(function () {
      showToast(syncState === 'ok' ? 'Pobrano wpisy' : 'Nie udało się połączyć', null);
    });
  });

  $('#btnExport').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dzidzius-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  $('#btnLogout').addEventListener('click', function () {
    localStorage.removeItem(K_AUTH);
    location.reload();
  });

  setView('today');
  render();
  sync();

  /* Licznik „ile temu" i zegar na przyciskach muszą iść same. */
  setInterval(render, 30000);

  /* Drugi telefon dopisuje wpisy w tle — sprawdzamy co 20 s, dopóki
     aplikacja jest na wierzchu. Dzięki temu nie trzeba nic odświeżać. */
  setInterval(function () {
    if (!document.hidden) sync(true);
  }, 20000);

  window.addEventListener('online', function () { sync(); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { render(); sync(); }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
}

start();

})();
