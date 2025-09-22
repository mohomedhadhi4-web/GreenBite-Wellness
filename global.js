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
  const stored = localStorage.getItem('greenbite_newsletter');
  if(stored) msg.textContent = `You are subscribed as ${stored}`;
}

// Footer year
function updateFooterYear(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', ()=>{
  bindHamburgers();
  bindNewsletter();
  updateFooterYear();
});