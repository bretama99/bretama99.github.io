(() => {
 'use strict';
 const root=document.documentElement;
 root.dataset.theme='light';
 const themeButton=document.getElementById('theme-button');
 const meta=document.querySelector('meta[name="theme-color"]');
 function updateTheme(){const dark=root.dataset.theme==='dark';themeButton.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} theme`);meta.content=dark?'#101d19':'#f7f9f8';}
 updateTheme();themeButton.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';updateTheme()});
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

(() => {
 'use strict';
 const dataNode=document.getElementById('project-galleries');
 const dialog=document.getElementById('screen-dialog');
 if(!dataNode||!dialog)return;
 const galleries=JSON.parse(dataNode.textContent);
 let activeProject=null,activeIndex=0;
 function selectCard(project,index){
  const gallery=galleries[project];const figure=document.querySelector(`[data-project-gallery="${project}"]`);if(!gallery||!figure)return;
  const screen=gallery.screens[index];const image=figure.querySelector('.screen-main');image.src=screen.src;image.alt=screen.alt;
  figure.querySelector('.screen-preview').href=screen.src;
  figure.querySelector('.screen-title').textContent=screen.title;
  figure.querySelector('.screen-position').textContent=`${index+1} / ${gallery.screens.length}`;
  figure.querySelectorAll('[data-screen]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.screen)===index)));
  figure.dataset.activeScreen=String(index);
 }
 function renderDialog(){
  const gallery=galleries[activeProject];const screen=gallery.screens[activeIndex];
  document.getElementById('screen-dialog-title').textContent=gallery.title+' | Product demo';
  document.getElementById('dialog-screen-title').textContent=screen.title;
  const image=document.getElementById('dialog-screen-image');image.src=screen.src;image.alt=screen.alt;
  document.getElementById('dialog-screen-count').textContent=`${activeIndex+1} / ${gallery.screens.length}`;
 }
 function move(direction){if(!activeProject)return;const n=galleries[activeProject].screens.length;activeIndex=(activeIndex+direction+n)%n;renderDialog();selectCard(activeProject,activeIndex);}
 document.querySelectorAll('.screen-thumbnails').forEach(el=>el.hidden=false);
 document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>selectCard(button.dataset.project,Number(button.dataset.screen))));
 document.querySelectorAll('[data-open-gallery]').forEach(link=>link.addEventListener('click',event=>{
  if(typeof dialog.showModal!=='function')return;
  event.preventDefault();activeProject=link.dataset.openGallery;
  activeIndex=Number(link.closest('[data-project-gallery]').dataset.activeScreen||0);
  renderDialog();dialog.showModal();
 }));
 document.getElementById('close-screen-dialog').addEventListener('click',()=>dialog.close());
 document.getElementById('previous-screen').addEventListener('click',()=>move(-1));
 document.getElementById('next-screen').addEventListener('click',()=>move(1));
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}});
})();
