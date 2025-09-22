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

  if (search)search.addEventListener('input', applyFilters);
  if (filter) filter.addEventListener('change', applyFilters);
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

window.addEventListener('DOMContentLoaded', ()=>{
  initRecipes();
  bindModal();
});

const RECIPES = [
  {
    id: 'r1',
    title: 'Oats Breakfast Bowl',
    category: 'breakfast',
    img: 'images/r1.jpg',
    short: 'Warm oats with berries, nuts and a drizzle of honey.',
    ingredients: [
      '1 cup rolled oats',
      '1 1/2 cup milk (or plant milk)',
      'Handful mixed berries',
      '1 tbsp honey',
      '1 tbsp chopped walnuts'
    ],
    steps: [
      'Bring oats and milk to a simmer.',
      'Cook 5–7 minutes until creamy.',
      'Top with berries, honey, and walnuts.'
    ],
    nutrition: {calories:420, carbs:60, protein:12, fat:12}
  },
  {
    id: 'r2',
    title: 'Quinoa & Chickpea Salad',
    category: 'lunch',
    img: 'images/r2.jpg',
    short: 'Protein-rich salad with citrus dressing.',
    ingredients: [
      '1 cup cooked quinoa',
      '1 cup cooked chickpeas',
      '1/2 cup cherry tomatoes',
      'Handful parsley',
      'Dressing: olive oil, lemon, salt'
    ],
    steps: [
      'Combine quinoa, chickpeas, and veggies.',
      'Whisk dressing and toss.',
      'Serve chilled or room temp.'
    ],
    nutrition:{calories:550, carbs:64, protein:20, fat:18}
  },
  {
    id: 'r3',
    title: 'Grilled Salmon & Veggies',
    category: 'dinner',
    img: 'images/r3.jpg',
    short: 'Lean protein with seasonal vegetables.',
    ingredients: ['150g salmon fillet', 'Assorted vegetables', 'Olive oil', 'Salt & pepper'],
    steps: ['Season salmon and grill 4–6 min per side.', 'Roast or grill veggies.', 'Serve with lemon.'],
    nutrition: {calories:480, carbs:20, protein:42, fat:24}
  },
  {
    id: 'r4',
    title: 'Nutty Energy Bites',
    category: 'snack',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60&auto=format&fit=crop',
    short: 'No-bake bites for quick energy.',
    ingredients: ['1 cup dates', '1/2 cup almonds', '2 tbsp cocoa powder', 'Pinch salt'],
    steps: ['Pulse dates and nuts', 'Form into balls', 'Chill and enjoy'],
    nutrition: {calories:120, carbs:16, protein:3, fat:6}
  }
];