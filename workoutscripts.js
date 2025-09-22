const EXERCISES = [
    { id:'w1', name:'Push-ups', parts:['upper','arms','full'], equipment:['none'] },
    { id:'w2', name:'Bodyweight Squats', parts:['lower','legs','full'], equipment:['none'] },
    { id:'w3', name:'Plank', parts:['core','full'], equipment:['none'] },
    { id:'w4', name:'Dumbbell Rows', parts:['upper','arms'], equipment:['dumbbell'] },
    { id:'w5', name:'Walking Lunges', parts:['lower','legs'], equipment:['none','dumbbell'] },
    { id:'w6', name:'Bicycle Crunches', parts:['core'], equipment:['none'] },
    { id:'w7', name:'Kettlebell Swings', parts:['full','lower'], equipment:['kettlebell'] },
    { id:'w8', name:'Overhead Press', parts:['upper','arms'], equipment:['dumbbell'] },
    { id:'w9', name:'Glute Bridge', parts:['lower'], equipment:['none'] },
    { id:'w10', name:'Band Pull Apart', parts:['upper','arms'], equipment:['band'] },
    { id:'w11', name:'Triceps Dips', parts:['arms','upper'], equipment:['none'] },
    { id:'w12', name:'Calf Raises', parts:['legs'], equipment:['none'] }
  ];
  // helpers
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const formatTime = sec => {
    const mm = String(Math.floor(sec/60)).padStart(2,'0');
    const ss = String(sec%60).padStart(2,'0');
    return `${mm}:${ss}`;
  };

    // timer audio (small beep using WebAudio)
  function beep(freq=880, duration=0.07){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type='sine';
      g.gain.value = 0.0001;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      setTimeout(()=>{ o.stop(); ctx.close(); }, duration*1000 + 50);
    }catch(e){ /* AudioContext not available */ }
  }

  let plan = [];
  let index = 0;
  let timer = null;
  let remaining = 0;

  function generatePlan(){
    const selected = $$('input[name="body"]:checked').map(i=>i.value);
    const equip = $('#equipment').value;
    const count = Math.max(1, Number($('#count').value) || 6);
    const duration = Math.max(10, Number($('#ex-duration').value) || 45);

    // filter pool
    const pool = EXERCISES.filter(ex => {
      const okEquip = ex.equipment.includes(equip) || ex.equipment.includes('none') || equip === 'none';
      const okPart = selected.length === 0 ? true : ex.parts.some(p => selected.includes(p));
      return okEquip && okPart;
    });

    if(pool.length === 0){
      $('#workout-area').hidden = true;
      $('#workout-msg').textContent = 'No exercises match your choices. Try selecting "none" equipment or broader body parts.';
      return;
    }

    // pick random unique exercises (shuffle)
    const shuffled = pool.slice().sort(()=> Math.random() - 0.5);
    plan = shuffled.slice(0, Math.min(count, shuffled.length)).map(ex => ({ ...ex, duration }));
    index = 0;
    renderPlan();
  }

  function renderPlan(){
    const list = $('#workout-list');
    list.innerHTML = '';
    plan.forEach((ex, i) => {
      const li = document.createElement('li');
      li.id = 'ex-' + i;
      li.innerHTML = `<div><strong>${ex.name}</strong><div class="muted" style="font-size:0.9rem">${ex.parts.join(', ')} • ${ex.equipment.join('/')}</div></div><div>${ex.duration}s</div>`;
      if(i === index) li.classList.add('active');
      list.appendChild(li);
    });
    $('#workout-area').hidden = false;
    $('#workout-msg').textContent = 'Ready — press Start to begin.';
    remaining = plan[index].duration;
    $('#countdown').textContent = formatTime(remaining);
  }

   function highlight(){
    $$('#workout-list li').forEach((li,i) => li.classList.toggle('active', i === index));
  }

  function startStop(){
    if(timer){
      clearInterval(timer); timer = null; $('#start-ex').textContent = 'Start'; $('#workout-msg').textContent = 'Paused.'; return;
    }
    if(!plan.length) return;
    $('#start-ex').textContent = 'Pause';
    $('#workout-msg').textContent = 'In progress...';
    remaining = remaining || plan[index].duration;
    // add simple animation to countdown
    $('#countdown').classList.add('pulse');
    timer = setInterval(()=> {
      remaining--;
      $('#countdown').textContent = formatTime(remaining);
      if(remaining <= 0){
        clearInterval(timer); timer = null;
        $('#countdown').classList.remove('pulse');
        beep(880, 0.12);
        $('#workout-msg').textContent = 'Exercise complete';
        // auto-advance after short rest
        setTimeout(()=> next(true), 900);
      }
    }, 1000);
    beep(660, 0.08);
  }

  function next(auto=false){
    if(timer){ clearInterval(timer); timer = null; $('#countdown').classList.remove('pulse'); }
    if(index < plan.length - 1){
      index++;
      remaining = plan[index].duration;
      highlight();
      $('#countdown').textContent = formatTime(remaining);
      if(auto) startStop(); // start auto if requested
    } else {
      $('#workout-msg').textContent = 'Workout complete — great job!';
      index = plan.length - 1;
      remaining = 0;
      $('#countdown').textContent = '00:00';
      beep(1100, 0.2);
    }
  }

  function prev(){
    if(timer){ clearInterval(timer); timer = null; $('#countdown').classList.remove('pulse'); }
    if(index > 0){
      index--;
      remaining = plan[index].duration;
      highlight();
      $('#countdown').textContent = formatTime(remaining);
    }
  }

  // events
  document.addEventListener('DOMContentLoaded', ()=>{
    $('#generate-btn').addEventListener('click', e => { e.preventDefault(); generatePlan(); });
    $('#shuffle-btn').addEventListener('click', ()=> { if(plan.length) { plan = plan.sort(()=>Math.random()-0.5); renderPlan(); } else generatePlan(); });
    $('#start-ex').addEventListener('click', startStop);
    $('#next-ex').addEventListener('click', ()=> next(false));
    $('#prev-ex').addEventListener('click', prev);
    // small keyboard shortcuts
    document.addEventListener('keydown', (e)=> {
      if(e.key === ' '){ e.preventDefault(); startStop(); }
      if(e.key === 'ArrowRight') next(false);
      if(e.key === 'ArrowLeft') prev();
    });
  });