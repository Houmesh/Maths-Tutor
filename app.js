'use strict';

const STORAGE_KEY = 'my-maths-tutor-v1';
const todayKey = () => new Date().toISOString().slice(0,10);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a,b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a,b) => Math.abs(a*b)/gcd(a,b);
const round = (n, dp=2) => Number(n.toFixed(dp));

const chapters = [
  {id:1,title:'Large Numbers Around Us',topics:['place value','Indian & international notation','estimation'],lesson:'Read, compare and estimate large numbers. Place value tells what a digit is worth because of its position.',example:'In 47,36,215, the digit 7 is in the lakh place, so its value is 7,00,000.'},
  {id:2,title:'Arithmetic Expressions',topics:['order of operations','brackets','multi-step arithmetic'],lesson:'Arithmetic expressions combine numbers and operations. Work through brackets and operations in the correct order.',example:'18 − 3 × 4 = 18 − 12 = 6, because multiplication is done before subtraction.'},
  {id:3,title:'A Peek Beyond the Point',topics:['tenths & hundredths','decimal comparison','decimal addition/subtraction'],lesson:'Decimals extend place value to the right of the decimal point: tenths, hundredths and beyond.',example:'3.47 = 3 ones + 4 tenths + 7 hundredths.'},
  {id:4,title:'Expressions using Letter-Numbers',topics:['variables','forming expressions','substitution'],lesson:'A letter-number represents a quantity that can vary. Expressions describe relationships using numbers, letters and operations.',example:'If x = 4, then 3x + 2 = 3 × 4 + 2 = 14.'},
  {id:5,title:'Parallel and Intersecting Lines',topics:['angles','transversals','parallel lines'],lesson:'Intersecting and parallel lines create angle relationships. Vertically opposite angles are equal; angles on a straight line add to 180°.',example:'If one angle at an intersection is 65°, its vertically opposite angle is also 65°.'},
  {id:6,title:'Number Play',topics:['patterns','divisibility','number properties'],lesson:'Number patterns and divisibility rules help us reason without doing long calculations.',example:'A number is divisible by 3 when the sum of its digits is divisible by 3.'},
  {id:7,title:'A Tale of Three Intersecting Lines',topics:['triangles','angle sum','exterior angles'],lesson:'Three intersecting lines can form triangles. The interior angles of any triangle add to 180°.',example:'If two angles of a triangle are 50° and 60°, the third is 180° − 110° = 70°.'},
  {id:8,title:'Working with Fractions',topics:['equivalent fractions','addition/subtraction','multiplication'],lesson:'Fractions name equal parts of a whole. For addition and subtraction, first express fractions with a common denominator.',example:'1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.'},
  {id:9,title:'Geometric Twins',topics:['congruence','SSS/SAS/ASA/RHS','corresponding parts'],lesson:'Congruent figures have the same shape and the same size. Triangle congruence can be established using valid criteria such as SSS, SAS, ASA and RHS.',example:'Two triangles with all three corresponding sides equal are congruent by SSS.'},
  {id:10,title:'Operations with Integers',topics:['positive & negative numbers','addition/subtraction','multiplication/division'],lesson:'Integers include positive numbers, zero and negative numbers. Sign rules matter in every operation.',example:'(−6) × (−4) = +24, while (−6) × 4 = −24.'},
  {id:11,title:'Finding Common Ground',topics:['factors','HCF','LCM'],lesson:'HCF is the greatest common factor; LCM is the least positive common multiple. Prime factorisation can help find both.',example:'HCF(18, 24) = 6 and LCM(18, 24) = 72.'},
  {id:12,title:'Another Peek Beyond the Point',topics:['decimal multiplication','decimal division','fractions & decimals'],lesson:'Decimal multiplication and division follow whole-number operations while carefully tracking place value.',example:'2.5 × 0.4 = 1.00 = 1.'},
  {id:13,title:'Connecting the Dots…',topics:['statistical questions','mean & median','data displays'],lesson:'Statistics helps us ask questions that involve variation, summarise data, and interpret patterns. Mean and median are two useful centres.',example:'For 2, 4, 4, 6, the mean is 16 ÷ 4 = 4, and the median is also 4.'},
  {id:14,title:'Constructions and Tilings',topics:['compass & ruler constructions','angle bisectors','tiling'],lesson:'Geometric constructions use precise relationships rather than measurement alone. Tilings cover a surface without gaps or overlaps.',example:'A perpendicular bisector cuts a segment into two equal parts at 90°.'},
  {id:15,title:'Finding the Unknown',topics:['equations','inverse operations','word problems'],lesson:'An equation says two expressions are equal. Keep the equation balanced by doing the same operation to both sides.',example:'3x + 5 = 20 → 3x = 15 → x = 5.'}
];

function makeQuestion(chapterId) {
  const c = chapterId;
  if (c === 1) {
    const mode = ri(1,3);
    if (mode === 1) {
      const digit = ri(2,9), zeros = choice([3,4,5,6]);
      const n = digit * 10**zeros + ri(10,999);
      return q(`What is the place value of ${digit} in ${n.toLocaleString('en-IN')}?`, String(digit*10**zeros), `The digit is ${zeros} places to the left of ones, so its value is ${digit} × 10^${zeros}.`, 'Find the position of the highlighted digit from the right.');
    }
    if (mode === 2) {
      const n = ri(120,989)*1000 + ri(0,999);
      const ans = Math.round(n/10000)*10000;
      return q(`Round ${n.toLocaleString('en-IN')} to the nearest ten thousand.`, String(ans), `Look at the thousands digit. It decides whether the ten-thousands digit stays or increases.`, 'Check the digit immediately to the right of the ten-thousands place.');
    }
    const a = ri(100000,9000000), b = ri(100000,9000000);
    return q(`Which number is greater?`, String(Math.max(a,b)), 'Compare the highest place values first.', 'Start comparing from the left-most digit.', [String(a),String(b)]);
  }
  if (c === 2) {
    const a=ri(8,30), b=ri(2,9), d=ri(2,8);
    const prompt = `${a} + ${b} × ${d}`;
    return q(`Evaluate: ${prompt}`, String(a+b*d), `Multiply first: ${b} × ${d} = ${b*d}. Then add ${a}.`, 'Which operation should be done first?');
  }
  if (c === 3) {
    const mode=ri(1,2), a=ri(10,999)/100, b=ri(10,999)/100;
    if(mode===1) return q(`Calculate: ${a.toFixed(2)} + ${b.toFixed(2)}`, (a+b).toFixed(2), 'Line up the decimal points and add corresponding place values.', 'Write the numbers so the decimal points are one under the other.');
    return q(`Which is greater?`, String(Math.max(a,b).toFixed(2)), 'Compare ones, then tenths, then hundredths.', 'Compare digits place by place.', [a.toFixed(2),b.toFixed(2)]);
  }
  if (c === 4) {
    const x=ri(2,12), a=ri(2,7), b=ri(1,15);
    return q(`If x = ${x}, find ${a}x + ${b}.`, String(a*x+b), `Substitute ${x} for x: ${a} × ${x} + ${b} = ${a*x+b}.`, 'Replace x with its given value before calculating.');
  }
  if (c === 5) {
    const angle=ri(4,14)*5;
    const mode=ri(1,2);
    if(mode===1) return q(`Two lines intersect. One angle is ${angle}°. What is its vertically opposite angle?`, String(angle), 'Vertically opposite angles are equal.', 'Look at the angle directly opposite, not the adjacent one.');
    return q(`An angle on a straight line is ${angle}°. What is the adjacent angle?`, String(180-angle), `Angles on a straight line add to 180°, so 180 − ${angle} = ${180-angle}.`, 'A straight angle measures 180°.');
  }
  if (c === 6) {
    const mode=ri(1,2);
    if(mode===1){
      const n=ri(100,999);
      const sum=[...String(n)].reduce((s,d)=>s+Number(d),0);
      const yes=sum%3===0?'Yes':'No';
      return q(`Is ${n} divisible by 3?`, yes, `Its digit sum is ${sum}. ${sum} ${sum%3===0?'is':'is not'} divisible by 3.`, 'Add the digits and test that sum for divisibility by 3.', ['Yes','No']);
    }
    const start=ri(1,12), step=ri(2,8);
    return q(`Continue the pattern: ${start}, ${start+step}, ${start+2*step}, ${start+3*step}, … What comes next?`, String(start+4*step), `The pattern increases by ${step} each time.`, 'Find the difference between consecutive terms.');
  }
  if (c === 7) {
    const a=ri(30,80), b=ri(30,80), maxB=140-a;
    const bb=Math.min(b,maxB);
    const third=180-a-bb;
    return q(`A triangle has angles ${a}° and ${bb}°. Find the third angle.`, String(third), `Triangle angles total 180°: 180 − ${a} − ${bb} = ${third}.`, 'All three interior angles of a triangle add to 180°.');
  }
  if (c === 8) {
    const d=choice([4,6,8,10,12]), n1=ri(1,d-1), n2=ri(1,d-1);
    const num=n1+n2, g=gcd(num,d), ans=`${num/g}/${d/g}`;
    return q(`Calculate and simplify: ${n1}/${d} + ${n2}/${d}`, ans, `Same denominator, so add numerators: ${num}/${d}. Divide top and bottom by ${g} to simplify.`, 'With equal denominators, add only the numerators.');
  }
  if (c === 9) {
    const criteria=['SSS','SAS','ASA','RHS']; const ans=choice(criteria);
    const prompts={SSS:'all three corresponding sides are equal',SAS:'two corresponding sides and the included angle are equal',ASA:'two corresponding angles and the included side are equal',RHS:'both are right triangles with equal hypotenuse and one corresponding side'};
    return q(`Two triangles are known to have ${prompts[ans]}. Which congruence criterion applies?`, ans, `${ans} is the criterion matching the given information.`, 'Identify exactly which sides/angles are given.', criteria);
  }
  if (c === 10) {
    const a=ri(-20,20), b=ri(-15,15); const op=choice(['+','−','×']);
    if(op==='+') return q(`Calculate: (${a}) + (${b})`, String(a+b), `Move ${b>=0?'right':'left'} ${Math.abs(b)} on the number line from ${a}.`, 'Think of a number line.');
    if(op==='−') return q(`Calculate: (${a}) − (${b})`, String(a-b), `Subtracting ${b} is the same as adding ${-b}.`, 'Change subtraction into addition of the opposite.');
    return q(`Calculate: (${a}) × (${b})`, String(a*b), `Multiply magnitudes, then apply the sign rule.`, 'Same signs give positive; different signs give negative.');
  }
  if (c === 11) {
    const a=choice([12,16,18,20,24,30,36]), b=choice([18,24,28,32,40,42,48]); const mode=ri(1,2);
    if(mode===1) return q(`Find the HCF of ${a} and ${b}.`, String(gcd(a,b)), `The greatest factor common to both numbers is ${gcd(a,b)}.`, 'List factors or use prime factorisation.');
    return q(`Find the LCM of ${a} and ${b}.`, String(lcm(a,b)), `The least positive common multiple is ${lcm(a,b)}.`, 'Prime factorisation can help you take the highest power of each prime.');
  }
  if (c === 12) {
    const a=ri(11,95)/10, b=ri(2,9)/10; const mode=ri(1,2);
    if(mode===1) return q(`Calculate: ${a.toFixed(1)} × ${b.toFixed(1)}`, String(round(a*b,2)), `Multiply as whole numbers, then place ${2} decimal places in the product.`, 'Count the total decimal places in both factors.');
    const dividend=round(a*b,2);
    return q(`Calculate: ${dividend} ÷ ${b.toFixed(1)}`, String(round(a,1)), `Multiplication and division are inverse operations: ${a.toFixed(1)} × ${b.toFixed(1)} = ${dividend}.`, 'Make the divisor a whole number by shifting both decimal points equally.');
  }
  if (c === 13) {
    const mode=ri(1,2);
    if(mode===1){
      const vals=[ri(2,10),ri(2,10),ri(2,10),ri(2,10)];
      const sum=vals.reduce((a,b)=>a+b,0); vals.push((5-(sum%5))%5 + ri(1,2)*5); // not necessarily integer mean, okay
      const mean=round(vals.reduce((a,b)=>a+b,0)/vals.length,2);
      return q(`Find the mean of: ${vals.join(', ')}`, String(mean), `Add all ${vals.length} values and divide by ${vals.length}.`, 'Mean = total of observations ÷ number of observations.');
    }
    const vals=Array.from({length:5},()=>ri(1,20)).sort((a,b)=>a-b);
    return q(`Find the median of: ${vals.join(', ')}`, String(vals[2]), 'With five ordered values, the median is the middle (third) value.', 'Put values in order and choose the middle one.');
  }
  if (c === 14) {
    const items=[
      q('What angle does a perpendicular bisector make with the segment it bisects?','90','A perpendicular bisector meets the segment at a right angle.','Perpendicular lines meet at a right angle.'),
      q('Which tool pair is traditionally used for exact geometric constructions?','Compass and ruler','Classical constructions use a compass and an unmarked ruler.','Think of tools used to transfer lengths and draw arcs.',['Compass and ruler','Calculator and ruler','Protractor only','Graph paper only']),
      q('A tiling covers a surface without what?','Gaps or overlaps','A valid tiling repeats shapes without gaps or overlaps.','Imagine floor tiles fitting perfectly.',['Gaps or overlaps','Angles','Straight lines','Equal sides'])
    ]; return choice(items);
  }
  if (c === 15) {
    const x=ri(2,15), a=ri(2,8), b=ri(1,12), rhs=a*x+b;
    return q(`Solve for x: ${a}x + ${b} = ${rhs}`, String(x), `Subtract ${b} from both sides, then divide by ${a}.`, 'Undo addition/subtraction first, then multiplication/division.');
  }
  return q('2 + 2 = ?', '4', '2 + 2 = 4.', 'Count two more from 2.');
}

function q(prompt, answer, explanation, hint, options=null){ return {prompt,answer:String(answer),explanation,hint,options}; }

function parseFraction(s){
  const m=String(s).trim().match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if(!m || Number(m[2])===0) return null;
  return Number(m[1])/Number(m[2]);
}
function answersEquivalent(user, expected){
  const u=String(user ?? '').trim().toLowerCase().replace(/,/g,'').replace(/°/g,'');
  const e=String(expected ?? '').trim().toLowerCase().replace(/,/g,'').replace(/°/g,'');
  if(u===e) return true;
  const uf=parseFraction(u), ef=parseFraction(e);
  const un=uf ?? Number(u), en=ef ?? Number(e);
  return Number.isFinite(un) && Number.isFinite(en) && Math.abs(un-en)<1e-6;
}

const defaultState = {
  profile:null,
  attempts:[],
  tests:[],
  activity:{},
  tutorHistory:[],
  currentChapter:1,
  speakReplies:true
};
let state = loadState();
let currentView='home';
let practiceQuestion=null;
let practiceChapter=state.currentChapter || 1;
let practiceAnswered=false;
let selectedPracticeAnswer='';
let testSession=null;
let parentUnlocked=false;
let deferredInstallPrompt=null;

function loadState(){
  try { return {...structuredClone(defaultState), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')}; }
  catch { return structuredClone(defaultState); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function markActivity(){
  const d=todayKey(); state.activity[d]=(state.activity[d]||0)+1; saveState();
}
function chapterMastery(id){
  const attempts=state.attempts.filter(a=>a.chapterId===id).slice(-30);
  if(!attempts.length) return 0;
  const acc=attempts.filter(a=>a.correct).length/attempts.length;
  const volume=Math.min(1, attempts.length/12);
  return Math.round(acc*(.55+.45*volume)*100);
}
function overallAccuracy(){
  if(!state.attempts.length) return 0;
  return Math.round(state.attempts.filter(a=>a.correct).length/state.attempts.length*100);
}
function streak(){
  let s=0; const d=new Date();
  for(let i=0;i<365;i++){
    const k=d.toISOString().slice(0,10);
    if(state.activity[k]) { s++; d.setDate(d.getDate()-1); }
    else if(i===0){ d.setDate(d.getDate()-1); }
    else break;
  }
  return s;
}
function todayAttempts(){ return state.activity[todayKey()] || 0; }
function weakChapters(){ return chapters.map(c=>({c,m:chapterMastery(c.id),n:state.attempts.filter(a=>a.chapterId===c.id).length})).filter(x=>x.n>=2).sort((a,b)=>a.m-b.m).slice(0,3); }
function recommendedChapter(){ const w=weakChapters(); return w.length ? w[0].c : chapters[state.currentChapter-1] || chapters[0]; }

const main=document.getElementById('main');
const setupDialog=document.getElementById('setupDialog');
const settingsDialog=document.getElementById('settingsDialog');

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>navigate(btn.dataset.view)));
document.getElementById('settingsBtn').addEventListener('click',openSettings);
document.getElementById('setupForm').addEventListener('submit',e=>{
  e.preventDefault();
  const pin=document.getElementById('pinInput').value.trim();
  if(!/^\d{4,8}$/.test(pin)) return toast('Parent PIN must be 4–8 digits.');
  state.profile={
    name:document.getElementById('studentNameInput').value.trim(),
    language:document.getElementById('languageInput').value,
    dailyGoal:Number(document.getElementById('goalInput').value),
    parentPin:pin
  };
  saveState(); setupDialog.close(); render();
});
document.getElementById('settingsForm').addEventListener('submit',e=>{
  e.preventDefault();
  if(!state.profile) return;
  state.profile.name=document.getElementById('settingsName').value.trim() || state.profile.name;
  state.profile.language=document.getElementById('settingsLanguage').value;
  state.profile.dailyGoal=Number(document.getElementById('settingsGoal').value);
  state.speakReplies=document.getElementById('settingsSpeak').checked;
  saveState(); settingsDialog.close(); render();
});

function openSettings(){
  if(!state.profile) return;
  document.getElementById('settingsName').value=state.profile.name;
  document.getElementById('settingsLanguage').value=state.profile.language;
  document.getElementById('settingsGoal').value=String(state.profile.dailyGoal);
  document.getElementById('settingsSpeak').checked=state.speakReplies !== false;
  settingsDialog.showModal();
}
function navigate(view){
  currentView=view;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  render(); window.scrollTo({top:0,behavior:'smooth'});
}
function render(){
  if(!state.profile){ main.innerHTML='<div class="card"><h2>Welcome to My Maths Tutor</h2><p>Complete the one-time setup to begin.</p></div>'; if(!setupDialog.open) setupDialog.showModal(); return; }
  const views={home:renderHome,learn:renderLearn,practice:renderPractice,test:renderTest,tutor:renderTutor,parent:renderParent};
  (views[currentView]||renderHome)();
}

function renderHome(){
  const goal=state.profile.dailyGoal || 15, done=todayAttempts(), pct=Math.min(100,Math.round(done/goal*100));
  const rec=recommendedChapter(); const weak=weakChapters();
  main.innerHTML=`
    <section class="hero">
      <div class="hero-card">
        <div class="eyebrow">YOUR DAILY MATHS</div>
        <h2>Hello, ${esc(state.profile.name)} 👋</h2>
        <p>Build understanding first, then speed. Today I recommend <strong>${esc(rec.title)}</strong>.</p>
        <div class="hero-actions">
          <button class="button primary" id="homePractice">Start practice</button>
          <button class="button secondary" id="homeTutor">Talk to tutor</button>
        </div>
        <div style="margin-top:20px"><div class="row between"><strong>Daily goal</strong><span>${done}/${goal} questions</span></div><div class="progress" style="margin-top:8px"><span style="width:${pct}%"></span></div></div>
      </div>
      <div class="card">
        <h3>This week</h3>
        <div class="grid two">
          <div class="stat"><div class="value">${overallAccuracy()}%</div><div class="label">Accuracy</div></div>
          <div class="stat"><div class="value">🔥 ${streak()}</div><div class="label">Day streak</div></div>
          <div class="stat"><div class="value">${state.attempts.length}</div><div class="label">Questions</div></div>
          <div class="stat"><div class="value">${state.tests.length}</div><div class="label">Tests</div></div>
        </div>
      </div>
    </section>
    <div class="section-title"><h2>Needs attention</h2><button class="button ghost" id="allChapters">All chapters</button></div>
    <section class="grid">
      ${(weak.length?weak:[{c:chapters[0],m:0},{c:chapters[1],m:0},{c:chapters[2],m:0}]).map(({c,m})=>chapterCard(c,m)).join('')}
    </section>
    <div class="section-title"><h2>Recent activity</h2></div>
    <section class="card">${activityStrip()}</section>`;
  document.getElementById('homePractice').onclick=()=>{practiceChapter=rec.id; practiceQuestion=null; navigate('practice');};
  document.getElementById('homeTutor').onclick=()=>navigate('tutor');
  document.getElementById('allChapters').onclick=()=>navigate('learn');
  attachChapterButtons();
}
function activityStrip(){
  const days=[];
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.toISOString().slice(0,10); days.push(`<div style="text-align:center"><span class="activity-dot ${state.activity[k]?'done':''}">${state.activity[k]||0}</span><div class="small muted">${d.toLocaleDateString(undefined,{weekday:'short'})}</div></div>`); }
  return `<div class="row" style="justify-content:space-between">${days.join('')}</div>`;
}
function chapterCard(c,m=chapterMastery(c.id)){
  return `<article class="card chapter-card"><span class="chapter-number">${c.id}</span><h3>${esc(c.title)}</h3><p>${esc(c.topics.join(' • '))}</p><div class="row between"><span class="tag">Mastery ${m}%</span><button class="button secondary chapter-open" data-chapter="${c.id}">Open</button></div></article>`;
}
function attachChapterButtons(){ document.querySelectorAll('.chapter-open').forEach(b=>b.onclick=()=>{state.currentChapter=Number(b.dataset.chapter); saveState(); currentView='learn'; render();}); }

function renderLearn(){
  const selected=chapters.find(c=>c.id===state.currentChapter) || chapters[0];
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">LEARN MODE</div><h2>Class 7 Chapters</h2></div></div>
    <section class="card" style="margin-bottom:16px">
      <div class="row between wrap"><div><span class="chapter-number">${selected.id}</span><h2 style="margin-bottom:6px">${esc(selected.title)}</h2><p class="muted">${esc(selected.topics.join(' • '))}</p></div><span class="tag">Mastery ${chapterMastery(selected.id)}%</span></div>
      <div class="callout"><strong>Core idea</strong><br>${esc(selected.lesson)}</div>
      <div class="lesson-example" style="margin-top:12px"><strong>Example</strong><br>${esc(selected.example)}</div>
      <div class="hero-actions"><button class="button primary" id="learnPractice">Practise this chapter</button><button class="button secondary" id="learnTutor">Ask tutor</button></div>
    </section>
    <section class="grid">${chapters.map(c=>chapterCard(c)).join('')}</section>`;
  document.getElementById('learnPractice').onclick=()=>{practiceChapter=selected.id; practiceQuestion=null; navigate('practice');};
  document.getElementById('learnTutor').onclick=()=>navigate('tutor');
  attachChapterButtons();
}

function renderPractice(){
  practiceChapter=practiceChapter || state.currentChapter || 1;
  if(!practiceQuestion){ practiceQuestion=makeQuestion(practiceChapter); practiceAnswered=false; selectedPracticeAnswer=''; }
  const c=chapters.find(x=>x.id===practiceChapter);
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">PRACTICE MODE</div><h2>${esc(c.title)}</h2></div><select id="practiceChapterSelect">${chapters.map(x=>`<option value="${x.id}" ${x.id===practiceChapter?'selected':''}>${x.id}. ${esc(x.title)}</option>`).join('')}</select></div>
    <section class="card">
      <div class="row between"><span class="tag">Mastery ${chapterMastery(c.id)}%</span><span class="muted small">Hints before answers</span></div>
      <div class="question-box" style="margin-top:14px">
        <div class="question">${esc(practiceQuestion.prompt)}</div>
        <div class="answer-area">${answerControl(practiceQuestion,'practice')}</div>
        <div class="row wrap"><button class="button secondary" id="hintBtn">Give me a hint</button><button class="button primary" id="checkBtn" ${practiceAnswered?'disabled':''}>Check answer</button>${practiceAnswered?'<button class="button good" id="nextBtn">Next question →</button>':''}</div>
        <div id="practiceFeedback"></div>
      </div>
    </section>`;
  document.getElementById('practiceChapterSelect').onchange=e=>{practiceChapter=Number(e.target.value); state.currentChapter=practiceChapter; saveState(); practiceQuestion=null; renderPractice();};
  bindAnswerControl('practice');
  document.getElementById('hintBtn').onclick=()=>toast(`Hint: ${practiceQuestion.hint}`,4200);
  document.getElementById('checkBtn').onclick=checkPracticeAnswer;
  if(practiceAnswered) document.getElementById('nextBtn').onclick=()=>{practiceQuestion=null; renderPractice();};
}
function answerControl(question,prefix){
  if(question.options){ return `<div class="options">${question.options.map(o=>`<button type="button" class="option ${selectedPracticeAnswer===o?'selected':''}" data-answer="${escAttr(o)}">${esc(o)}</button>`).join('')}</div>`; }
  return `<input id="${prefix}Answer" autocomplete="off" inputmode="text" placeholder="Type your answer" />`;
}
function bindAnswerControl(prefix){
  if(practiceQuestion.options){ document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{selectedPracticeAnswer=btn.dataset.answer; document.querySelectorAll('.option').forEach(x=>x.classList.toggle('selected',x===btn));}); }
  else { const inp=document.getElementById(`${prefix}Answer`); if(inp) inp.addEventListener('keydown',e=>{if(e.key==='Enter') checkPracticeAnswer();}); }
}
function checkPracticeAnswer(){
  if(practiceAnswered) return;
  const input=practiceQuestion.options ? selectedPracticeAnswer : (document.getElementById('practiceAnswer')?.value || '');
  if(!String(input).trim()) return toast('Enter or choose an answer first.');
  const correct=answersEquivalent(input,practiceQuestion.answer);
  const c=chapters.find(x=>x.id===practiceChapter);
  state.attempts.push({ts:Date.now(),date:todayKey(),chapterId:practiceChapter,correct,prompt:practiceQuestion.prompt,userAnswer:String(input),answer:practiceQuestion.answer});
  if(state.attempts.length>1200) state.attempts=state.attempts.slice(-1000);
  markActivity(); saveState(); practiceAnswered=true;
  const box=document.getElementById('practiceFeedback');
  box.innerHTML=`<div class="feedback ${correct?'good':'bad'}">${correct?'✓ Correct!':'Not yet.'} ${esc(practiceQuestion.explanation)}${!correct?`<br><span class="small">Correct answer: ${esc(practiceQuestion.answer)}</span>`:''}</div>`;
  document.getElementById('checkBtn').disabled=true;
  const next=document.createElement('button'); next.className='button good'; next.id='nextBtn'; next.textContent='Next question →'; next.onclick=()=>{practiceQuestion=null; renderPractice();};
  document.getElementById('checkBtn').parentElement.appendChild(next);
  if(state.speakReplies!==false) speak(correct?'Correct. '+practiceQuestion.explanation:'Try this idea. '+practiceQuestion.explanation);
}

function renderTest(){
  if(testSession) return renderActiveTest();
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">TEST MODE</div><h2>Practice tests</h2></div></div>
    <section class="grid two">
      <article class="card"><h3>Quick Test</h3><p class="muted">10 mixed questions. Good for daily revision.</p><button class="button primary start-test" data-count="10">Start 10 questions</button></article>
      <article class="card"><h3>Chapter Test</h3><p class="muted">10 questions from your currently selected chapter: <strong>${esc(chapters[state.currentChapter-1].title)}</strong>.</p><button class="button primary start-test" data-count="10" data-chapter="${state.currentChapter}">Start chapter test</button></article>
      <article class="card"><h3>Weekly Test</h3><p class="muted">20 mixed questions across the syllabus.</p><button class="button primary start-test" data-count="20">Start 20 questions</button></article>
      <article class="card"><h3>Weak Areas Test</h3><p class="muted">Targets chapters where recent accuracy is lowest.</p><button class="button primary" id="weakTest">Start targeted test</button></article>
    </section>
    <div class="section-title"><h2>Recent tests</h2></div>
    <section class="card">${state.tests.length?state.tests.slice(-5).reverse().map(t=>`<div class="dashboard-row"><div><strong>${esc(t.name)}</strong><div class="small muted">${new Date(t.ts).toLocaleDateString()}</div></div><strong>${t.score}/${t.total}</strong></div>`).join(''):'<p class="muted">No tests yet.</p>'}</section>`;
  document.querySelectorAll('.start-test').forEach(b=>b.onclick=()=>startTest(Number(b.dataset.count), b.dataset.chapter?Number(b.dataset.chapter):null));
  document.getElementById('weakTest').onclick=()=>startWeakTest();
}
function startTest(count,chapterId=null){
  const questions=Array.from({length:count},()=>makeQuestion(chapterId || ri(1,15)));
  testSession={name:chapterId?`${chapters[chapterId-1].title} Test`:`${count}-Question Mixed Test`,questions,index:0,score:0,answers:[],chapterId};
  renderTest();
}
function startWeakTest(){
  const weak=weakChapters().map(x=>x.c.id); const pool=weak.length?weak:[1,2,3,4,10];
  const questions=Array.from({length:10},()=>{const ch=choice(pool); const qq=makeQuestion(ch); qq.chapterId=ch; return qq;});
  testSession={name:'Weak Areas Test',questions,index:0,score:0,answers:[],chapterId:null}; renderTest();
}
function renderActiveTest(){
  const t=testSession, idx=t.index;
  if(idx>=t.questions.length) return finishTest();
  const question=t.questions[idx]; selectedPracticeAnswer='';
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">${esc(t.name.toUpperCase())}</div><h2>Question ${idx+1} of ${t.questions.length}</h2></div><strong>${t.score} correct</strong></div>
    <div class="progress" style="margin-bottom:14px"><span style="width:${Math.round(idx/t.questions.length*100)}%"></span></div>
    <section class="card"><div class="question-box"><div class="question">${esc(question.prompt)}</div><div class="answer-area">${answerControl(question,'test')}</div><button class="button primary" id="testSubmit">Submit answer</button></div></section>`;
  if(question.options){document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{selectedPracticeAnswer=btn.dataset.answer; document.querySelectorAll('.option').forEach(x=>x.classList.toggle('selected',x===btn));});}
  document.getElementById('testSubmit').onclick=()=>{
    const input=question.options?selectedPracticeAnswer:(document.getElementById('testAnswer')?.value||'');
    if(!String(input).trim()) return toast('Enter or choose an answer first.');
    const correct=answersEquivalent(input,question.answer); if(correct)t.score++;
    t.answers.push({prompt:question.prompt,user:String(input),answer:question.answer,correct}); t.index++; markActivity(); renderTest();
  };
  const inp=document.getElementById('testAnswer'); if(inp) inp.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('testSubmit').click();});
}
function finishTest(){
  const t=testSession; const pct=Math.round(t.score/t.questions.length*100);
  state.tests.push({ts:Date.now(),name:t.name,score:t.score,total:t.questions.length,answers:t.answers}); saveState();
  main.innerHTML=`<section class="card" style="max-width:760px;margin:auto"><div class="eyebrow">TEST COMPLETE</div><h2>${pct}%</h2><p>You got <strong>${t.score} of ${t.questions.length}</strong> correct.</p><div class="progress"><span style="width:${pct}%"></span></div><hr><h3>Review</h3>${t.answers.map((a,i)=>`<div class="dashboard-row"><div><strong>${i+1}. ${esc(a.prompt)}</strong><div class="small ${a.correct?'':'muted'}">Your answer: ${esc(a.user)} ${a.correct?'✓':`• Correct: ${esc(a.answer)}`}</div></div><span>${a.correct?'✅':'🔁'}</span></div>`).join('')}<div class="hero-actions"><button class="button primary" id="testAgain">New test</button><button class="button secondary" id="goPractice">Practice weak areas</button></div></section>`;
  testSession=null;
  document.getElementById('testAgain').onclick=()=>renderTest();
  document.getElementById('goPractice').onclick=()=>{practiceChapter=recommendedChapter().id;practiceQuestion=null;navigate('practice');};
}

function renderTutor(){
  const c=chapters[state.currentChapter-1] || chapters[0];
  if(!state.tutorHistory.length){state.tutorHistory.push({role:'tutor',text:`Hi ${state.profile.name}! I’m your Maths Tutor. Tell me what you are learning, or ask me a question. I’ll usually give you a hint before the final answer.`}); saveState();}
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">VOICE + CHAT TUTOR</div><h2>Ask naturally</h2></div><span class="tag">${esc(state.profile.language)}</span></div>
    <section class="tutor-layout">
      <div class="card">
        <div id="chat" class="chat">${state.tutorHistory.slice(-40).map(m=>`<div class="message ${m.role==='user'?'user':'tutor'}">${esc(m.text)}</div>`).join('')}</div>
        <div class="chat-compose"><input id="tutorInput" placeholder="e.g. Why does minus × minus become plus?" /><button class="icon-button mic" id="micBtn" title="Speak">🎤</button><button class="button primary send" id="sendTutor">Send</button></div>
        <div class="small muted" style="margin-top:8px">Voice recognition depends on browser support. Chrome/Edge usually work best. AI cloud mode is automatic when the secure Netlify function is configured; otherwise an offline tutor is used.</div>
      </div>
      <aside class="card"><h3>Current chapter</h3><select id="tutorChapter">${chapters.map(x=>`<option value="${x.id}" ${x.id===state.currentChapter?'selected':''}>${x.id}. ${esc(x.title)}</option>`).join('')}</select><p class="muted">${esc(c.lesson)}</p><button class="button secondary" id="askConcept">Teach this concept</button><hr><h3>Tutor rules</h3><p class="small muted">1. Check what the student understands.<br>2. Give a hint before a solution.<br>3. Use Class 7 language.<br>4. Ask a follow-up question.<br>5. Encourage reasoning, not guessing.</p></aside>
    </section>`;
  const chat=document.getElementById('chat'); chat.scrollTop=chat.scrollHeight;
  document.getElementById('tutorChapter').onchange=e=>{state.currentChapter=Number(e.target.value); saveState(); renderTutor();};
  document.getElementById('sendTutor').onclick=sendTutorMessage;
  document.getElementById('tutorInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendTutorMessage();});
  document.getElementById('micBtn').onclick=startVoiceRecognition;
  document.getElementById('askConcept').onclick=()=>{document.getElementById('tutorInput').value=`Teach me ${c.title} step by step, then ask me one question.`; sendTutorMessage();};
}
async function sendTutorMessage(){
  const input=document.getElementById('tutorInput'); if(!input) return;
  const text=input.value.trim(); if(!text) return;
  state.tutorHistory.push({role:'user',text}); state.tutorHistory=state.tutorHistory.slice(-50); saveState();
  input.value=''; renderTutor();
  const sendBtn=document.getElementById('sendTutor'); if(sendBtn){sendBtn.disabled=true;sendBtn.textContent='Thinking…';}
  let reply;
  try { reply=await cloudTutorReply(text); }
  catch { reply=offlineTutorReply(text); }
  state.tutorHistory.push({role:'tutor',text:reply}); state.tutorHistory=state.tutorHistory.slice(-50); saveState(); markActivity(); renderTutor();
  if(state.speakReplies!==false) speak(reply);
}
async function cloudTutorReply(message){
  const recent=state.tutorHistory.slice(-10);
  const performance=chapters.map(c=>({chapter:c.title,mastery:chapterMastery(c.id)})).filter(x=>x.mastery>0);
  const res=await fetch('/.netlify/functions/tutor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,recent,language:state.profile.language,studentName:state.profile.name,chapter:chapters[state.currentChapter-1].title,performance})});
  if(!res.ok) throw new Error('Cloud tutor unavailable');
  const data=await res.json(); if(!data.reply) throw new Error('No reply'); return data.reply;
}
function offlineTutorReply(message){
  const msg=message.toLowerCase(); const c=chapters[state.currentChapter-1] || chapters[0];
  if(/answer|solution|solve it|just tell/.test(msg)) return `I can help you get there, but first try one step: ${c.lesson} What part of the question do you already understand?`;
  if(/minus.*minus|negative.*negative/.test(msg)) return `Think of a sign as a direction. Multiplying by a negative reverses direction; doing that twice reverses it twice, bringing you back to positive. For example, (−3) × (−4) = +12. Now try this: what sign should (−5) × (−2) have, and why?`;
  if(/fraction/.test(msg)) return `Start by asking whether the denominators are the same. If they are different, find a common denominator before adding or subtracting. Try telling me: what common denominator could you use for 1/3 and 1/6?`;
  if(/equation|unknown|\bx\b/.test(msg)) return `Treat an equation like a balanced scale. Undo operations in reverse order, and whatever you do to one side, do to the other. If 3x + 5 = 20, what should we undo first: +5 or ×3?`;
  if(/angle|triangle/.test(msg)) return `A useful checkpoint: angles in a triangle add to 180°, and angles on a straight line add to 180°. Which of those two facts matches your question?`;
  return `Let’s work on ${c.title}. ${c.lesson} Instead of jumping to an answer, tell me what the question is asking you to find, and we’ll take the first step together.`;
}
function startVoiceRecognition(){
  const SR=window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR) return toast('Voice recognition is not available in this browser. Use Chrome or Edge, or type your question.',5000);
  const rec=new SR(); rec.lang=state.profile.language==='Hindi'?'hi-IN':'en-IN'; rec.interimResults=false; rec.maxAlternatives=1;
  const btn=document.getElementById('micBtn'); btn?.classList.add('listening');
  rec.onresult=e=>{const text=e.results[0][0].transcript; const input=document.getElementById('tutorInput'); if(input){input.value=text; sendTutorMessage();}};
  rec.onerror=()=>toast('I could not hear that clearly. Please try again.');
  rec.onend=()=>btn?.classList.remove('listening'); rec.start();
}
function speak(text){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel(); const utter=new SpeechSynthesisUtterance(text.replace(/[✓✅🔥]/g,'')); utter.lang=state.profile.language==='Hindi'?'hi-IN':'en-IN'; utter.rate=.96; speechSynthesis.speak(utter);
}

function renderParent(){
  if(!parentUnlocked){
    main.innerHTML=`<section class="card pin-gate"><div class="eyebrow">PARENT AREA</div><h2>Enter Parent PIN</h2><p class="muted">Progress details and settings are protected from the student view.</p><input id="parentPinEntry" type="password" inputmode="numeric" maxlength="8" /><div style="margin-top:12px"><button class="button primary" id="unlockParent">Open dashboard</button></div></section>`;
    document.getElementById('unlockParent').onclick=()=>{ if(document.getElementById('parentPinEntry').value===state.profile.parentPin){parentUnlocked=true;renderParent();} else toast('Incorrect PIN.');};
    document.getElementById('parentPinEntry').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('unlockParent').click();}); return;
  }
  const weak=weakChapters();
  main.innerHTML=`
    <div class="section-title"><div><div class="eyebrow">PARENT DASHBOARD</div><h2>${esc(state.profile.name)}’s progress</h2></div><button class="button ghost" id="lockParent">Lock</button></div>
    <section class="grid four">
      <div class="stat"><div class="value">${overallAccuracy()}%</div><div class="label">Overall accuracy</div></div>
      <div class="stat"><div class="value">${state.attempts.length}</div><div class="label">Questions attempted</div></div>
      <div class="stat"><div class="value">${state.tests.length}</div><div class="label">Tests completed</div></div>
      <div class="stat"><div class="value">🔥 ${streak()}</div><div class="label">Current streak</div></div>
    </section>
    <div class="section-title"><h2>Chapter mastery</h2></div>
    <section class="card">${chapters.map(c=>{const m=chapterMastery(c.id);return `<div class="dashboard-row"><div><strong>${c.id}. ${esc(c.title)}</strong><div class="small muted">${state.attempts.filter(a=>a.chapterId===c.id).length} practice attempts</div></div><div class="mastery"><div class="row between small"><span>${m}%</span></div><div class="progress"><span style="width:${m}%"></span></div></div></div>`;}).join('')}</section>
    <div class="section-title"><h2>Suggested focus</h2></div>
    <section class="card">${weak.length?weak.map(x=>`<div class="dashboard-row"><div><strong>${esc(x.c.title)}</strong><div class="small muted">Recent mastery ${x.m}%</div></div><button class="button secondary parent-practice" data-chapter="${x.c.id}">Assign practice</button></div>`).join(''):'<p class="muted">Not enough practice data yet. After a few sessions, weak areas will appear here.</p>'}</section>
    <div class="section-title"><h2>Last 7 days</h2></div><section class="card">${activityStrip()}</section>`;
  document.getElementById('lockParent').onclick=()=>{parentUnlocked=false;renderParent();};
  document.querySelectorAll('.parent-practice').forEach(b=>b.onclick=()=>{practiceChapter=Number(b.dataset.chapter);practiceQuestion=null;navigate('practice');});
}

function esc(s){ return String(s ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function escAttr(s){ return esc(s).replace(/`/g,'&#96;'); }
function toast(text,duration=2600){
  const el=document.createElement('div'); el.className='toast'; el.textContent=text; document.body.appendChild(el); setTimeout(()=>el.remove(),duration);
}

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault(); deferredInstallPrompt=e; document.getElementById('installBtn').classList.remove('hidden');});
document.getElementById('installBtn').addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.getElementById('installBtn').classList.add('hidden');});
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

render();
