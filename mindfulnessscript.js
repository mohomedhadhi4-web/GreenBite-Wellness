  /* MINDFULNESS PAGE SCRIPT */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
let breathInterval = null;
let breathPhase = 0; // 0 inhale, 1 hold, 2 exhale, ... simple inhale/exhale cycle
let sessionTimer = null;
let sessionRemaining = 0;
let ambientAudio = null;
const SESS_KEY = 'greenbite_sessions';

function startBreathing(){
    stopBreathing();
    const seconds = Number($('#breath-length').value) || 5;
    const circle = $('#breath-circle');
    // simple cycle: inhale (scale up) -> exhale (scale down)
    let state = 'inhale';
    circle.textContent = 'Inhale';
    circle.classList.add('breath-in');
    breathInterval = setInterval(() => {
      if(state === 'inhale'){
        circle.textContent = 'Exhale';
        circle.classList.remove('breath-in');
        circle.classList.add('breath-out');
        state = 'exhale';
      } else {
        circle.textContent = 'Inhale';
        circle.classList.remove('breath-out');
        circle.classList.add('breath-in');
        state = 'inhale';
      }
    }, seconds * 1000);
}
function stopBreathing(){
    if(breathInterval) clearInterval(breathInterval);
    breathInterval = null;
    const circle = $('#breath-circle');
    if(circle){
      circle.classList.remove('breath-in','breath-out');
      circle.textContent = 'Breathe';
    }
}

// Session timer
function startSession(){
    stopSession();
    const type = $('#session-type').value;
    let mins = Number($('#session-mins').value) || 10;
    if(type === 'pom'){
      // standard pomodoro 25/5 if user chooses pom and hasn't set mins
      if($('#session-mins').value === '10' || !$('#session-mins').value) mins = 25;
    }
    sessionRemaining = mins * 60;
    $('#session-display').textContent = formatTime(sessionRemaining);
    $('#session-status').textContent = 'In progress...';
    sessionTimer = setInterval(()=>{
      sessionRemaining--;
      $('#session-display').textContent = formatTime(sessionRemaining);
      if(sessionRemaining <= 0){
        clearInterval(sessionTimer); sessionTimer = null;
        sessionComplete();
      }
    }, 1000);
}
function stopSession(){
    if(sessionTimer) clearInterval(sessionTimer);
    sessionTimer = null;
    $('#session-status').textContent = 'Stopped.';
}

function sessionComplete(){
    $('#session-status').textContent = 'Session complete — well done!';
    incrementSessions();
    // short audio cue
    simpleBeep(880, 0.12);
}

function formatTime(sec){
    if(sec <= 0) return '00:00';
    const mm = String(Math.floor(sec/60)).padStart(2,'0');
    const ss = String(sec % 60).padStart(2,'0');
    return `${mm}:${ss}`;
}

// store completed sessions count
function incrementSessions(){
    const cur = Number(localStorage.getItem(SESS_KEY) || 0) + 1;
    localStorage.setItem(SESS_KEY, cur);
    updateSessionCount();
}
function updateSessionCount(){
    $('#completed-count').textContent = localStorage.getItem(SESS_KEY) || '0';
}
function clearSessions(){
    localStorage.removeItem(SESS_KEY);
    updateSessionCount();
}

// Ambient sounds using Audio element
function playAmbient(src, btn){
    stopAmbient();
    if(!src) return;
    ambientAudio = new Audio(src);
    ambientAudio.loop = true;
    ambientAudio.volume = 0.5;
    ambientAudio.play().catch(()=>{/* allow autoplay prevention */});
    // UI hint
    $$('.sound-btn').forEach(b => b.classList.remove('sound-active'));
    if(btn) btn.classList.add('sound-active');
    $('#session-status').textContent = 'Ambient playing';
}
function stopAmbient(){
    if(ambientAudio){ ambientAudio.pause(); ambientAudio = null; }
    $$('.sound-btn').forEach(b => b.classList.remove('sound-active'));
    $('#session-status').textContent = 'Ambient stopped';
}
// small beep for completion
function simpleBeep(freq=880, duration=0.07){
    try{
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine'; o.frequency.value = freq;
        g.gain.value = 0.0001;
        o.start();
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        setTimeout(()=> { o.stop(); ctx.close(); }, duration*1000 + 50);
    }catch(e){}
}
// events
document.addEventListener('DOMContentLoaded', ()=>{
    $('#start-breath').addEventListener('click', startBreathing);
    $('#stop-breath').addEventListener('click', stopBreathing);
    $('#start-session').addEventListener('click', startSession);
    $('#stop-session').addEventListener('click', stopSession);
    $('#clear-sessions').addEventListener('click', clearSessions);
    $$('.sound-btn').forEach(btn => btn.addEventListener('click', () => playAmbient(btn.dataset.src, btn)));
    $('#stop-sound').addEventListener('click', stopAmbient);
    updateSessionCount();
});


