// Shared JS for navigation, hero slogans, daily tip, newsletter, recipes and calculator

// NAV TOGGLING
function bindHamburgers(){
  document.querySelectorAll('.hamburger').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = btn.previousElementSibling || document.querySelector('.nav');
      if(!nav) return;
      const shown = getComputedStyle(nav).display !== 'none' && nav.style.display === 'flex';
      if(window.innerWidth <= 700){
        nav.style.display = shown ? 'none' : 'flex';
      }
    });
  });
}

// HERO SLOGANS (auto-rotate)
const SLOGANS = [
  'Small steps every day = big changes over time.',
  'Nourish your body. Calm your mind. Move with joy.',
  'Choose whole foods — your future self will thank you.',
  'Hydrate, breathe, and take one mindful bite at a time.'
];
let sloganIndex = 0;
function rotateSlogans(){
  const el = document.getElementById('slogan');
  if(!el) return;
  el.textContent = SLOGANS[sloganIndex];
  sloganIndex = (sloganIndex + 1) % SLOGANS.length;
  setTimeout(rotateSlogans, 4500);
}

// DAILY TIP (date-based)
const TIPS = [
  'Start your day with a glass of water before coffee.',
  'Add one extra portion of vegetables to your lunch today.',
  'Take a 10-minute walk after dinner to support digestion.',
  'Swap one processed snack for a piece of fruit today.',
  'Try a 5-minute body-scan meditation this evening.'
];
function showDailyTip(){
  const el = document.getElementById('daily-tip');
  if(!el) return;
  const day = new Date().getDate();
  el.textContent = TIPS[day % TIPS.length];
}

// NEWSLETTER (localStorage)
function bindNewsletter(){
  const form = document.getElementById('newsletter-form');
  if(!form) return;
  const emailInput = document.getElementById('newsletter-email');
  const msg = document.getElementById('newsletter-msg');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = emailInput.value.trim();
    if(!email) return;
    localStorage.setItem('greenbite_newsletter', email);
    msg.textContent = 'Thanks! Subscription saved locally.';
    form.reset();
  });
  // show stored
  const stored = localStorage.getItem('greenbite_newsletter');
  if(stored) msg.textContent = `You are subscribed as ${stored}`;
}

// RECIPES PAGE
function initRecipes(){
  if(typeof RECIPES === 'undefined') return;
  const grid = document.getElementById('recipes-grid');
  const search = document.getElementById('search');
  const filter = document.getElementById('category-filter');
  if(!grid) return;

  function render(list){
    grid.innerHTML = '';
    if(list.length===0){ grid.innerHTML = '<p class="muted">No recipes found.</p>'; return; }
    list.forEach(r=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${r.img}" alt="${r.title}">
        <div style="padding:0.75rem">
          <h3>${r.title}</h3>
          <p class="muted">${r.short}</p>
          <div style="margin-top:0.6rem"><button class="btn" data-id="${r.id}">View Recipe</button></div>
        </div>`;
      grid.appendChild(card);
    });
    // bind view buttons
    grid.querySelectorAll('button[data-id]').forEach(b=>b.addEventListener('click', ()=>openRecipeModal(b.dataset.id)));
  }

  function applyFilters(){
    const q = (search?.value || '').toLowerCase();
    const cat = filter?.value || 'all';
    const results = RECIPES.filter(r=>{
      const okCat = cat==='all' ? true : r.category===cat;
      const okQ = q ? (r.title.toLowerCase().includes(q) || r.short.toLowerCase().includes(q)) : true;
      return okCat && okQ;
    });
    render(results);
  }

  search?.addEventListener('input', applyFilters);
  filter?.addEventListener('change', applyFilters);
  applyFilters();
}

function openRecipeModal(id){
  const r = RECIPES.find(x=>x.id===id); if(!r) return;
  const modal = document.getElementById('recipe-modal');
  const body = document.getElementById('modal-body');
  modal.setAttribute('aria-hidden','false');
  body.innerHTML = `
    <h2>${r.title}</h2>
    <img src="${r.img}" alt="${r.title}" style="width:100%;height:220px;object-fit:cover;border-radius:8px">
    <p class="muted">${r.short}</p>
    <h4>Ingredients</h4>
    <ul>${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
    <h4>Steps</h4>
    <ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <h4>Nutrition</h4>
    <table style="width:100%;border-collapse:collapse">
      <tr><th style="text-align:left;padding:6px;border-bottom:1px solid #eee">Calories</th><td style="padding:6px">${r.nutrition.calories} kcal</td></tr>
      <tr><th style="text-align:left;padding:6px;border-bottom:1px solid #eee">Carbs</th><td style="padding:6px">${r.nutrition.carbs} g</td></tr>
      <tr><th style="text-align:left;padding:6px;border-bottom:1px solid #eee">Protein</th><td style="padding:6px">${r.nutrition.protein} g</td></tr>
      <tr><th style="text-align:left;padding:6px;border-bottom:1px solid #eee">Fat</th><td style="padding:6px">${r.nutrition.fat} g</td></tr>
    </table>
  `;
  document.getElementById('modal-close').focus();
}

function bindModal(){
  const modal = document.getElementById('recipe-modal');
  if(!modal) return;
  document.getElementById('modal-close').addEventListener('click', ()=>modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true') });
}




// CALCULATOR
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
    // macros
    const carbs_g = Math.round((tdee * 0.5)/4);
    const prot_g = Math.round((tdee * 0.2)/4);
    const fat_g = Math.round((tdee * 0.3)/9);

    bmrEl.textContent = bmr;
    tdeeEl.textContent = tdee;
    carbVal.textContent = carbs_g;
    protVal.textContent = prot_g;
    fatVal.textContent = fat_g;
    res.hidden = false;

    // animate bars relative to reasonable maximums
    const maxCarb = Math.max(carbs_g, 200);
    const maxProt = Math.max(prot_g, 150);
    const maxFat = Math.max(fat_g, 80);
    carbBar.style.width = Math.min(100, Math.round((carbs_g/maxCarb)*100)) + '%';
    protBar.style.width = Math.min(100, Math.round((prot_g/maxProt)*100)) + '%';
    fatBar.style.width = Math.min(100, Math.round((fat_g/maxFat)*100)) + '%';

    // smooth counter animation (simple)
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

// INIT on DOM ready
window.addEventListener('DOMContentLoaded', ()=>{
  bindHamburgers();
  rotateSlogans();
  showDailyTip();
  bindNewsletter();
  bindModal();
  initRecipes();
  bindCalculator();
  // footer year
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
});


