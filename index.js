// HERO SLOGANS
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

// DAILY TIP
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

window.addEventListener('DOMContentLoaded', ()=>{
  rotateSlogans();
  showDailyTip();
});