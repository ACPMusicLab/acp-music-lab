/* ACP Music Lab shared exercise engine v1 — teacher-supervised, no accounts. */
(function(root){'use strict';
const NOTE_Y=Object.freeze({C:140,D:130,E:120,F:110,G:100});
const EIGHTH_NOTE='<svg viewBox="0 0 100 125" width="27" height="35" aria-hidden="true"><ellipse cx="39" cy="91" rx="18" ry="13" transform="rotate(-20 39 91)" fill="currentColor"/><path d="M55 87 L55 25" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M55 25 C55 42 83 47 83 67 C83 76 80 81 77 84 C82 65 70 58 55 50 Z" fill="currentColor"/></svg>';
function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function balanced(notes,count){if(!Array.isArray(notes)||!notes.length||!Number.isInteger(count)||count<1)throw Error('Invalid notes/count');const out=[];for(let i=0;i<count;i++)out.push(notes[i%notes.length]);return shuffle(out)}
function drawNote(parts,n){const y=NOTE_Y[n];if(y===undefined)throw Error('Unsupported note '+n);parts.head.setAttribute('cy',y);parts.head.setAttribute('transform','rotate(-20 168 '+y+')');parts.stem.setAttribute('y1',y-3);parts.stem.setAttribute('y2',y-53);if(parts.ledger)parts.ledger.style.display=n==='C'?'':'none'}
function addNoteParts(board){
  board.insertAdjacentHTML('beforeend',
    '<line x1="151" x2="185" y1="140" y2="140" stroke="#444568" stroke-width="2"/>'+
    '<ellipse cx="168" rx="13" ry="10.5" fill="#444568"/>'+
    '<line x1="179" x2="179" stroke="#444568" stroke-width="2.8"/>');
  const stem=board.lastElementChild;
  const head=stem.previousElementSibling;
  return {head,stem,ledger:head.previousElementSibling};
}
function paintRewards(container,score,count){container.innerHTML=Array.from({length:count},(_,i)=>'<span aria-hidden="true" style="color:'+(i<score?'#DAA520':'#D6D9E5')+';opacity:1;display:inline-flex">'+EIGHTH_NOTE+'</span>').join('');container.setAttribute('aria-label',score+' of '+count+' golden eighth notes earned')}
function createNoteGame(options){
const {board,buttons,parts,rewards,feedback,scoreLabel,targetLabel,finished,replay,sequenceForLength,getLength}=options;
if(!board||!buttons?.length||!parts||!rewards||!feedback||!sequenceForLength||!getLength)throw Error('Missing exercise elements');
const prompt=options.prompt ?? (()=>'Tap the correct letter.');
const completionMessage=options.completionMessage ?? 'Wonderful! One golden star!';
let seq=[],index=0,score=0,locked=false,done=false,epoch=0,wrongTimer=null,advanceTimer=null;
const listeners=[];
function emit(){const snapshot={index,score,length:seq.length,locked,done,note:seq[Math.min(index,seq.length-1)]};options.onChange?.(snapshot)}
function render(){drawNote(parts,seq[Math.min(index,seq.length-1)]);if(scoreLabel)scoreLabel.textContent=score;if(targetLabel)targetLabel.textContent=seq.length;paintRewards(rewards,score,seq.length);buttons.forEach(b=>b.disabled=locked||done);emit()}
function clearTimers(){clearTimeout(wrongTimer);clearTimeout(advanceTimer);wrongTimer=advanceTimer=null}
function reset(){epoch++;clearTimers();const requested=getLength();const notes=sequenceForLength(requested);seq=options.shuffleSequence===false?[...notes]:shuffle(notes);if(seq.length!==requested)throw Error('Sequence length mismatch');index=0;score=0;locked=false;done=false;board.classList.remove('note-correct','note-wrong');finished?.classList.add('hidden');replay?.classList.add('hidden');feedback.textContent=prompt(score,seq.length);render()}
function answer(n){if(locked||done)return false;const correct=n===seq[index];if(correct){locked=true;clearTimeout(wrongTimer);board.classList.remove('note-wrong');board.classList.add('note-correct');feedback.textContent='✓ Correct! That is '+n+'.';buttons.forEach(b=>b.disabled=true);const ticket=epoch;advanceTimer=setTimeout(()=>{if(ticket!==epoch)return;board.classList.remove('note-correct');score++;locked=false;if(score>=seq.length){done=true;finished?.classList.remove('hidden');replay?.classList.remove('hidden');feedback.textContent=completionMessage}else{index++;feedback.textContent=prompt(score,seq.length)}render()},650)}else{board.classList.remove('note-correct');board.classList.add('note-wrong');feedback.textContent='Try another answer!';clearTimeout(wrongTimer);const ticket=epoch;wrongTimer=setTimeout(()=>{if(ticket===epoch)board.classList.remove('note-wrong')},350)}return correct}
buttons.forEach(b=>{const fn=()=>answer(b.dataset.note||b.dataset.answer||b.dataset.n);b.addEventListener('click',fn);listeners.push([b,fn])});
if(replay){replay.addEventListener('click',reset);listeners.push([replay,reset])}
reset();
return Object.freeze({reset,answer,getState:()=>({index,score,length:seq.length,locked,done,sequence:[...seq]}),destroy(){epoch++;clearTimers();for(const [el,fn]of listeners)el.removeEventListener('click',fn);board.classList.remove('note-correct','note-wrong')}});
}
root.ACPExercise=Object.freeze({shuffle,balanced,drawNote,addNoteParts,paintRewards,createNoteGame,NOTE_Y});
})(window);
