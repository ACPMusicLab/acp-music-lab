/* ACP Music Lab: focus modes for note-reading exercises. */
(()=>{'use strict';
const notesY={C:140,D:130,E:120,F:110,G:100};
const positions={
 'unit3.html':[{selector:'.activities>.card:nth-child(2)',notes:'CDE'}],
 'unit4.html':[{selector:'.activities>.card:nth-child(2)',notes:'EF'},{selector:'.activities>.card:nth-child(3)',notes:'CDE'}],
 'unit5.html':[{selector:'.activities>.card:nth-child(2)',notes:'EFG'},{selector:'.activities>.card:nth-child(3)',notes:'CDEFG'}],
 'review1.html':[{selector:'article.card:nth-of-type(3)',notes:'CDEFG'}]
};
const page=location.pathname.split('/').pop()||'index.html';
const items=positions[page]||[];
let active=null;
function model(note){
 const y=notesY[note],ledger=note==='C'?'<path d="M43 140H91" stroke="#4d5571" stroke-width="2"/>':'';
 return '<svg viewBox="0 0 135 165" role="img" aria-label="Note '+note+' on the staff"><path d="M10 40H125 M10 60H125 M10 80H125 M10 100H125 M10 120H125" stroke="#9ba6bb" stroke-width="1.5"/>'+ledger+'<ellipse cx="67" cy="'+y+'" rx="11" ry="8.5" transform="rotate(-20 67 '+y+')" fill="#444568"/><path d="M77 '+(y-3)+'V'+(y-48)+'" stroke="#444568" stroke-width="2.5"/></svg>';
}
function exit(){
 if(!active)return;
 const {card,placeholder,overlay,button,priorScroll}=active;
 placeholder.replaceWith(card);
 overlay.remove();
 document.body.classList.remove('acp-note-focus-open');
 button.textContent='⛶ Focus Mode';button.setAttribute('aria-pressed','false');
 active=null;
 window.scrollTo(0,priorScroll);
}
function open(card,button,letters){
 if(active)exit();
 const placeholder=document.createComment('note-reading original position');
 card.parentNode.insertBefore(placeholder,card);
 const overlay=document.createElement('div');overlay.className='acp-note-focus-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Note-reading focus mode');
 const top=document.createElement('div');top.className='acp-focus-top';
 top.innerHTML='<strong>Note reading · Focus Mode</strong><button type="button" class="acp-focus-close">✕ Exit Focus Mode</button>';
 const refs=document.createElement('div');refs.className='acp-focus-references';refs.setAttribute('aria-label','Model notes');
 refs.innerHTML='<strong class="acp-focus-reference-title">Model notes · tap to hear</strong><div class="acp-focus-note-grid">'+[...letters].map(n=>'<button type="button" class="acp-focus-note" data-note="'+n+'" aria-label="Play note '+n+'"><strong>'+n+'</strong>'+model(n)+'</button>').join('')+'</div>';
 overlay.append(top,refs,card);document.body.append(overlay);
 top.querySelector('button').addEventListener('click',exit);
 document.body.classList.add('acp-note-focus-open');
 active={card,placeholder,overlay,button,priorScroll:window.scrollY};
 button.textContent='✕ Exit Focus Mode';button.setAttribute('aria-pressed','true');
 overlay.scrollTop=0;
}
items.forEach(({selector,notes})=>{
 const card=document.querySelector(selector);
 if(!card)return;
 const button=document.createElement('button');button.type='button';button.className='acp-note-focus-button';button.textContent='⛶ Focus Mode';button.setAttribute('aria-pressed','false');
 const picker=card.querySelector('.acp-length-picker');
 if(picker)picker.insertAdjacentElement('afterend',button);
 else {const heading=card.querySelector('.heading,h2');heading?.insertAdjacentElement('afterend',button)}
 button.addEventListener('click',()=>{if(active?.card===card)exit();else open(card,button,notes)});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&active)exit()});
})();
