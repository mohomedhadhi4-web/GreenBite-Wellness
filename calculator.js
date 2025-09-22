function bindCalculator(){
  const form = document.getElementById('calc-form');
  if(!form) return;
  const res = document.getElementById('results');
  const bmrEl = document.getElementById('bmr-val');
  const tdeeEl = document.getElementById('tdee-val');
  const carbVal = document.getElementById('carb-val');
  const protVal = document.getElementById('prot-val');
  const fatVal = document.getElementById('fat-val');
  const carbBar = document.getElementById('carb-bar');
  const protBar = document.getElementById('prot-bar');
  const fatBar = document.getElementById('fat-bar');

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const age = Number(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = Number(document.getElementById('height').value);
    const weight = Number(document.getElementById('weight').value);
    const activity = Number(document.getElementById('activity').value);
    if(!age||!height||!weight) return;
    let bmr = 10*weight + 6.25*height - 5*age + (gender==='male'?5:-161);
    bmr = Math.round(bmr);
    const tdee = Math.round(bmr * activity);
    const carbs_g = Math.round((tdee * 0.5)/4);
    const prot_g = Math.round((tdee * 0.2)/4);
    const fat_g = Math.round((tdee * 0.3)/9);

    bmrEl.textContent = bmr;
    tdeeEl.textContent = tdee;
    carbVal.textContent = carbs_g;
    protVal.textContent = prot_g;
    fatVal.textContent = fat_g;
    res.hidden = false;

    carbBar.style.width = Math.min(100, Math.round((carbs_g/200)*100)) + '%';
    protBar.style.width = Math.min(100, Math.round((prot_g/150)*100)) + '%';
    fatBar.style.width = Math.min(100, Math.round((fat_g/80)*100)) + '%';

    animateCounter(bmrEl,0,bmr,600);
    animateCounter(tdeeEl,0,tdee,600);
    animateCounter(carbVal,0,carbs_g,600);
    animateCounter(protVal,0,prot_g,600);
    animateCounter(fatVal,0,fat_g,600);
  });

  document.getElementById('reset-btn').addEventListener('click', ()=>{
    form.reset(); res.hidden = true;
  });
}

function animateCounter(el, from, to, duration){
  const start = performance.now();
  function step(now){
    const elapsed = now - start;
    const pct = Math.min(1, elapsed / duration);
    const val = Math.round(from + (to - from) * pct);
    el.textContent = val;
    if(pct<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener('DOMContentLoaded', bindCalculator);
