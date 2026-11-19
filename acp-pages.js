/* ACP Music Lab — per-activity navigation and engraved notation. */
(()=>{'use strict';
const page=location.pathname.split('/').pop();
const pages={'unit1.html':'Unit 1','unit2.html':'Unit 2','unit3.html':'Unit 3','unit4.html':'Unit 4','unit5.html':'Unit 5','review1.html':'Review 1'};
if(!pages[page])return;
const cards=[...document.querySelectorAll('main .card')];
if(!cards.length)return;
document.body.classList.add('acp-screen-layout');
const view=document.createElement('nav');view.className='acp-pagebar';view.setAttribute('aria-label','Activity navigation');
view.innerHTML='<a class="acp-home" href="index.html">⌂ Home</a><button type="button" class="acp-prev">← Previous</button><span class="acp-step-label"></span><div class="acp-progress-track" aria-hidden="true"><div></div></div><select class="acp-step-picker" aria-label="Teacher activity choice"></select><button type="button" class="acp-next">Next →</button>';
document.querySelector('main')?.before(view);
const title=card=>card.querySelector('h2')?.textContent.trim().replace(/^\d+\s*/,'')||'Activity';
const picker=view.querySelector('select'),label=view.querySelector('.acp-step-label'),prev=view.querySelector('.acp-prev'),next=view.querySelector('.acp-next'),track=view.querySelector('.acp-progress-track div');
const hasRecap=page==='review1.html',total=cards.length+(hasRecap?1:0);
for(let i=0;i<cards.length;i++){const option=document.createElement('option');option.value=String(i+1);option.textContent=(i+1)+'. '+title(cards[i]);picker.append(option)}
let recap;
if(hasRecap){
 recap=document.createElement('section');recap.className='acp-recap';recap.innerHTML='<img src="fox-approved.png" alt="Friendly fox celebrating musical progress"><h2>Wonderful discoveries!</h2><div class="acp-recap-stars" aria-hidden="true">★ ★ ★</div><div class="acp-recap-number" aria-live="polite">0 stars collected!</div><p>Look how much music you have explored! You can return to any activity whenever you wish.</p>';
 document.querySelector('main')?.append(recap);
 const option=document.createElement('option');option.value=String(total);option.textContent=total+'. Fox celebration';picker.append(option);
}
function showRecap(){
 if(!recap)return;
 let saved={};try{saved=JSON.parse(localStorage.getItem('acp-stars-v1')||'{}')||{}}catch(e){}
 const limits={'unit1.html':3,'unit2.html':2,'unit3.html':1,'unit4.html':2,'unit5.html':2,'review1.html':5};
 const sum=Object.entries(limits).reduce((a,[k,m])=>a+Math.min(m,Math.max(0,Number(saved[k])||0)),0);
 recap.querySelector('.acp-recap-number').textContent=sum+' stars collected!';
}
function parseStep(){const n=Number(new URL(location.href).searchParams.get('step')||1);return Number.isInteger(n)?Math.max(1,Math.min(total,n)):1}
let current=0;
function show(n,updateURL=true){
 n=Math.max(1,Math.min(total,n));current=n;
 cards.forEach((card,i)=>{const yes=i+1===n;card.classList.toggle('acp-screen-active',yes);card.setAttribute('aria-hidden',yes?'false':'true')});
 if(recap){recap.classList.toggle('acp-screen-active',n===total);recap.setAttribute('aria-hidden',n===total?'false':'true');if(n===total)showRecap()}
 label.textContent=pages[page]+' · '+n+' / '+total;
 picker.value=String(n);track.style.width=(n/total*100)+'%';
 prev.textContent=n===1?'← Home':'← Previous';
 next.textContent=n===total?(hasRecap?'Continue to Unit 6 →':'Finish activity →'):'Next →';
 if(updateURL){const url=new URL(location.href);url.searchParams.set('step',String(n));history.pushState({step:n},'',url)}
 window.scrollTo(0,0);
}
prev.onclick=()=>{if(current===1)location.href='index.html';else show(current-1)};
next.onclick=()=>{if(current<total)show(current+1);else if(hasRecap)location.href='unit6.html';else{const order=['unit1.html','unit2.html','unit3.html','unit4.html','unit5.html','review1.html'];location.href=order[Math.min(order.length-1,order.indexOf(page)+1)]}};
picker.onchange=()=>show(Number(picker.value));
window.addEventListener('popstate',()=>show(parseStep(),false));
show(parseStep(),false);
// Professional engraved glyph as an SVG image, never the student tracing model.
const targets={
 'unit3.html':['.note-reference-grid svg','.activities>.card:nth-child(2) .board svg'],
 'unit4.html':['.note-reference-grid svg','#newboard svg','#reviewboard svg'],
 'unit5.html':['.reference-grid svg','#practiceStaff','#reviewStaff'],
 'review1.html':['#find-svg']
};
const selector=(targets[page]||[]).join(',');
function attachClef(svg){
 if(!svg||svg.querySelector('.acp-music-clef'))return;
 const vb=svg.viewBox?.baseVal;
 if(!vb||!vb.width||!vb.height)return;
 const image=document.createElementNS('http://www.w3.org/2000/svg','image');
 image.setAttribute('class','acp-music-clef');image.setAttribute('href','treble-clef-engraved.svg');
 // All these staves use five lines at y=40,60,80,100,120.
 image.setAttribute('x','12');image.setAttribute('y','4');image.setAttribute('width','65');image.setAttribute('height','159');
 image.setAttribute('preserveAspectRatio','xMidYMid meet');
 svg.append(image);
}
function scan(){if(selector)document.querySelectorAll(selector).forEach(attachClef)}
scan();
let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;scan()})});
observer.observe(document.querySelector('main')||document.body,{subtree:true,childList:true});
})();
