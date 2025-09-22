/* CONTACT PAGE SCRIPT */
const $ = s => document.querySelector(s);
const KEY = 'greenbite_feedback';

function validateEmail(email){
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', ()=>{
    const form = $('#feedback-form');
    const msg = $('#fb-msg');
    const confirmBox = $('#fb-confirm');

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = $('#fb-name').value.trim();
        const email = $('#fb-email').value.trim();
        const message = $('#fb-message').value.trim();

      // custom validation messages
        if(!name){
            showErr('Please enter your name', $('#fb-name'));
            return;
        }
        if(!email || !validateEmail(email)){
            showErr('Please provide a valid email', $('#fb-email'));
            return;
        }
        if(!message || message.length < 6){
            showErr('Please provide a message (6+ characters)', $('#fb-message'));
            return;
        }

        // store
        const entry = { name, email, message, when: new Date().toISOString() };
        const store = JSON.parse(localStorage.getItem(KEY) || '[]');
        store.push(entry);
        localStorage.setItem(KEY, JSON.stringify(store));

        // UI feedback
        msg.textContent = '';
        confirmBox.style.display = 'block';
        form.reset();
        setTimeout(()=> confirmBox.style.display = 'none', 5000);
    });

    // accordion
    document.querySelectorAll('.acc-toggle').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            btn.classList.toggle('open');
            const panel = btn.nextElementSibling;
            if(panel.style.maxHeight){
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        });

    });

    function showErr(text, el){
        msg.textContent = text;
        msg.style.color = 'crimson';
        el.focus();
        setTimeout(()=>{ msg.textContent = ''; msg.style.color = ''; }, 4000);
    }





});