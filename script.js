(() => {
 'use strict';
 const root=document.documentElement;
 const themeButton=document.getElementById('theme-button');
 const meta=document.querySelector('meta[name="theme-color"]');
 function updateTheme(){const dark=root.dataset.theme==='dark';themeButton.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} theme`);meta.content=dark?'#101d19':'#f7f9f8';}
 updateTheme();themeButton.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('btg-theme',root.dataset.theme)}catch(e){}updateTheme()});
 const menuButton=document.getElementById('menu-button');const nav=document.getElementById('site-nav');
 function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation')}
 menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=nav.classList.contains('open');closeMenu();if(open)menuButton.focus()}});
 document.addEventListener('click',e=>{if(!nav.contains(e.target)&&!menuButton.contains(e.target))closeMenu()});
 window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu()});
 const filters=[...document.querySelectorAll('[data-filter]')];const projects=[...document.querySelectorAll('[data-category]')];
 filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});let visible=0;projects.forEach(p=>{p.hidden=button.dataset.filter!=='all'&&p.dataset.category!==button.dataset.filter;if(!p.hidden)visible++});document.getElementById('project-count').textContent=`${visible} project${visible===1?'':'s'}`;}));
 document.getElementById('year').textContent=new Date().getFullYear();
})();
