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
 const nextPage={'unit1.html':'Unit 2','unit2.html':'Unit 3','unit3.html':'Unit 4','unit4.html':'Unit 5','unit5.html':'Review 1'};next.textContent=n===total?(hasRecap?'Continue to Unit 6 →':'Continue to '+(nextPage[page]||'next unit')+' →'):'Next →';
 if(updateURL){const url=new URL(location.href);url.searchParams.set('step',String(n));history.pushState({step:n},'',url)}
 window.scrollTo(0,0);
}
prev.onclick=()=>{if(current===1)location.href='index.html';else show(current-1)};
next.onclick=()=>{if(current<total)show(current+1);else if(hasRecap)location.href='unit6.html';else{const order=['unit1.html','unit2.html','unit3.html','unit4.html','unit5.html','review1.html'];location.href=order[Math.min(order.length-1,order.indexOf(page)+1)]}};
picker.onchange=()=>show(Number(picker.value));
window.addEventListener('popstate',()=>show(parseStep(),false));
show(parseStep(),false);

// Contextual notes for the activity currently selected, never generic unit-wide advice.
const teacherGuidance={
 'unit1.html':[
  {goal:'Recognise the five lines and count upwards from the bottom.',teach:'Point to the bottom line and say “line one”. Count all five together before the child begins. Encourage dragging the numbered tiles; tapping a tile and then a circle is a valid alternative.',watch:'Check that the child starts at the bottom, not the top. If they guess, slowly count the lines aloud together.',success:'All five circles are correctly numbered. Offer another quick count without touching the screen.'},
  {goal:'Experience the five parallel lines of a musical staff through movement.',teach:'Show the five dotted guides. Invite the child to trace each one from left to right with a finger or Apple Pencil. Model one line before asking the child to continue.',watch:'Look for five individual, mostly horizontal strokes that follow the guides. The automated check is deliberately forgiving; coach the child rather than demanding perfect straightness.',success:'Press “Check my lines” after all five are drawn. Encourage a calm retry if necessary.'},
  {goal:'Recognise a musical staff as five straight, evenly spaced, parallel lines.',teach:'Ask “Which picture has five straight lines?” Let the child compare the three pictures before touching one.',watch:'Some children count lines accurately but overlook sloping lines. Encourage them to look both at the number of lines and at their direction.',success:'The child selects the five-straight-line staff and can explain or show why the others differ.'}
 ],
 'unit2.html':[
  {goal:'Identify and number the four spaces between five staff lines.',teach:'Show the bottom space first. Count each space upwards, placing numbers 1 to 4. The child may tap or drag the numbers.',watch:'Distinguish spaces from lines; use your finger to point between the lines without covering them.',success:'All four spaces are numbered bottom to top. Repeat together verbally if useful.'},
  {goal:'Become familiar with the shape and movement of the treble clef.',teach:'Start with “Watch”, then offer “Slowly” if needed. Use “Trace” with a finger or Apple Pencil before optionally trying “Draw independently”.',watch:'The aim is a confident continuous gesture, not exact engraving. Avoid insisting on independent drawing before the child is ready. Teacher approval is intentional.',success:'Accept a genuine attempt using the teacher button. Five accepted attempts earn a star; the child can repeat for practice.'}
 ],
 'unit3.html':[
  {goal:'Discover the positions and sounds of C, D and E.',teach:'Point to each note and tap to play its piano sound. Explain that C sits on a short extra line, D is below the staff, and E sits on the bottom line.',watch:'Use the position on the staff rather than letter shape alone. Invite the child to compare the three heights.',success:'The child can point to C, D or E when asked, with the models still visible.'},
  {goal:'Identify C, D and E independently on a treble-clef staff.',teach:'Choose five questions for a short practice or ten for a longer one. Ask the child to look at the notehead’s vertical position before choosing a letter.',watch:'Allow a return to the reference-note activity whenever needed. Wrong answers are opportunities to compare positions, not penalties.',success:'Complete the chosen round to earn the available golden star.'}
 ],
 'unit4.html':[
  {goal:'Meet F as the note in the first space of the treble-clef staff.',teach:'Compare familiar E on the bottom line with F in the space immediately above it. Tap both notes to hear the piano sound.',watch:'Ask whether the notehead sits on a line or between two lines.',success:'The child can point to E and F and describe their relative positions.'},
  {goal:'Distinguish E from F on a staff.',teach:'Choose five or ten notes. Start with a simple verbal cue: E is on the bottom line; F is in the first space.',watch:'If the child answers by guessing, revisit the reference notes and visually identify the line or space.',success:'Finish the chosen E/F recognition round to earn a star.'},
  {goal:'Keep recognising C, D and E while learning new notes.',teach:'Use five questions for a quick review or ten for extended practice. Begin by recalling the ledger line for C and the bottom line for E.',watch:'Do not assume previous learning is fully secure; let the child revisit Unit 3 as often as necessary.',success:'Complete the C–E round to earn its star.'}
 ],
 'unit5.html':[
  {goal:'Meet G on the second line of the treble-clef staff.',teach:'Compare E on the bottom line, F in the first space and G on the second line. Tap each note to hear its sound.',watch:'Keep the child’s attention on the alternating line–space–line pattern.',success:'The child can identify G in relation to E and F.'},
  {goal:'Recognise E, F and G in mixed order.',teach:'Choose five or ten notes. Encourage the child to say “line, space, line” as they compare each note with the models.',watch:'Correct errors by pointing to the staff position rather than giving the answer immediately.',success:'Complete the round to earn the first star.'},
  {goal:'Consolidate C, D, E, F and G.',teach:'Choose five for a short session or ten for full practice. Invite the child to use the treble clef and read from lower to higher positions.',watch:'C uses a ledger line below the staff; D sits underneath and E sits on the bottom line. Let the child revise any uncertain note.',success:'Complete the selected round to earn the second star.'}
 ],
 'review1.html':[
  {goal:'Revisit line and space numbering as two related skills.',teach:'Start with five lines, counting from the bottom. Then switch to four spaces. Encourage the child to move or tap the numbers rather than guess.',watch:'Check whether the child understands that line numbers and space numbers form separate sequences.',success:'Both line and space activities are completed for this review task.'},
  {goal:'Revisit the treble-clef drawing motion.',teach:'Watch the shape first, then trace it. Allow independent drawing only when the child is ready. Approve attempts yourself rather than relying on automatic shape judgment.',watch:'Look for increasing control and confidence. The model is a learning guide, not a professional engraving test.',success:'Three accepted drawings earn the review star.'},
  {goal:'Read the notes C, D, E, F and G.',teach:'Choose five or ten notes depending on the child’s attention. Ask where the notehead lies on the staff before selecting its letter.',watch:'Offer comparison with familiar staff positions when needed, especially C on its ledger line.',success:'Finish the chosen note-reading round.'},
  {goal:'Put C, D, E, F and G in ascending order.',teach:'Ask the child to say or sing the note names from low to high before tapping them in order.',watch:'Distinguish alphabetic order from musical pitch order. Encourage thinking aloud rather than rapid guesses.',success:'The five note names are placed in ascending sequence.'},
  {goal:'Combine familiar concepts without introducing new material.',teach:'Read each short question aloud if necessary. Give the child time to recall notes and staff positions independently.',watch:'If one question proves difficult, briefly revisit that earlier activity; the review is diagnostic as well as celebratory.',success:'Complete the mixed challenge, then move to the fox’s star celebration. Unfinished earlier units do not block progress.'},
  {goal:'Celebrate musical progress across Units 1–5 and Review 1.',teach:'Show the fox and total stars collected. Talk about a skill the child enjoyed or improved. Invite them to choose what to practise next.',watch:'Do not compare totals between children or suggest that missing stars are failures.',success:'The child leaves with a positive sense of progress; any unit remains available to revisit.'}
 ]
};
function createTeacherNotes(){
 const intro=document.querySelector('main .intro');
 if(!intro)return;
 let button=document.getElementById('unit1-teacher-notes');
 if(button){const clean=button.cloneNode(true);button.replaceWith(clean);button=clean}
 else{button=document.createElement('button');button.type='button';button.id='unit1-teacher-notes';button.textContent='▤ Teacher notes';intro.append(button)}
 button.setAttribute('aria-haspopup','dialog');
 const overlay=document.createElement('div');overlay.className='acp-teacher-overlay';overlay.hidden=true;
 overlay.innerHTML='<section class="acp-teacher-panel" role="dialog" aria-modal="true" aria-labelledby="acp-teacher-title"><div class="acp-teacher-top"><div><div class="acp-teacher-eyebrow"></div><h2 id="acp-teacher-title"></h2></div><button class="acp-teacher-close" type="button" aria-label="Close teacher notes">✕</button></div><div class="acp-teacher-body"><h3>Learning goal</h3><p data-field="goal"></p><h3>How to guide the activity</h3><p data-field="teach"></p><h3>What to watch for</h3><p data-field="watch"></p><h3>What counts as success</h3><p data-field="success"></p></div><button class="acp-teacher-done" type="button">Back to activity</button></section>';
 document.body.append(overlay);
 let oldFocus=null;
 const close=()=>{if(overlay.hidden)return;overlay.hidden=true;document.body.classList.remove('acp-teacher-visible');(oldFocus||button).focus()};
 const open=()=>{
   const step=current;
   const note=teacherGuidance[page]?.[step-1]||{goal:'Support the child at their own pace.',teach:'Offer a short demonstration, then let the child try.',watch:'Encourage exploration without pressure.',success:'Notice the child’s progress.'};
   const currentTitle=step<=cards.length?title(cards[step-1]):'Fox celebration';
   overlay.querySelector('.acp-teacher-eyebrow').textContent=pages[page]+' · Activity '+step+' of '+total;
   overlay.querySelector('#acp-teacher-title').textContent=currentTitle;
   for(const key of ['goal','teach','watch','success'])overlay.querySelector('[data-field="'+key+'"]').textContent=note[key];
   oldFocus=document.activeElement;
   overlay.hidden=false;document.body.classList.add('acp-teacher-visible');
   overlay.querySelector('.acp-teacher-close').focus();
 };
 button.onclick=open;
 overlay.querySelector('.acp-teacher-close').onclick=close;
 overlay.querySelector('.acp-teacher-done').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape'){e.preventDefault();close()}});
}
createTeacherNotes();

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
