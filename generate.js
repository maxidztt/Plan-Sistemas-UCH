(function(){
const customPlan = [];
const stateKey = 'customPlanState';
let done = new Set();
const form = document.getElementById('subject-form');
const grid = document.getElementById('grid');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const code = parseInt(document.getElementById('code').value, 10);
  const name = document.getElementById('name').value.trim();
  const year = parseInt(document.getElementById('year').value, 10);
  const semester = parseInt(document.getElementById('semester').value, 10);
  const prereq = document.getElementById('prereq').value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  const order = customPlan.filter(m => m.year === year && m.semester === semester).length + 1;
  customPlan.push({code, name, year, semester, order, prereq});
  form.reset();
  save();
  render();
});

function save(){
  localStorage.setItem(stateKey, JSON.stringify({plan: customPlan, done: Array.from(done)}));
}

function load(){
  const data = JSON.parse(localStorage.getItem(stateKey) || '{}');
  if(data.plan){
    customPlan.push(...data.plan);
  }
  if(data.done){
    done = new Set(data.done);
  }
}

function render(){
  grid.innerHTML = '';
  const years = Math.max(5, ...customPlan.map(m => m.year));
  for(let y = 1; y <= years; y++){
    for(let s = 1; s <= 2; s++){
      const header = document.createElement('div');
      header.className = 'column-header';
      header.style.gridColumn = ((y - 1) * 2 + s);
      header.style.gridRow = 1;
      header.textContent = `${y}° Año - Sem ${s}`;
      grid.appendChild(header);
      const items = customPlan.filter(m => m.year === y && m.semester === s).sort((a,b) => a.order - b.order);
      items.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.code = item.code;
        card.dataset.prereq = item.prereq.join(',');
        card.style.gridColumn = ((y - 1) * 2 + s);
        card.style.gridRow = (idx + 2);
        const nameEl = document.createElement('div');
        nameEl.className = 'name';
        nameEl.textContent = item.name;
        const codeEl = document.createElement('div');
        codeEl.className = 'code';
        codeEl.textContent = item.code;
        card.appendChild(nameEl);
        card.appendChild(codeEl);
        grid.appendChild(card);
      });
    }
  }
  applyStatus();
}

function applyStatus(){
  const cards = grid.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.remove('done');
    card.classList.remove('locked');
    const code = parseInt(card.dataset.code, 10);
    if(done.has(code)){
      card.classList.add('done');
    }
  });
  cards.forEach(card => {
    const code = parseInt(card.dataset.code, 10);
    const prereq = card.dataset.prereq ? card.dataset.prereq.split(',').filter(p => p).map(n => parseInt(n, 10)) : [];
    const open = prereq.every(p => done.has(p));
    if(!done.has(code) && !open){
      card.classList.add('locked');
    }
  });
  cards.forEach(card => {
    card.onclick = function(){
      const code = parseInt(this.dataset.code, 10);
      const prereq = this.dataset.prereq ? this.dataset.prereq.split(',').filter(p => p).map(n => parseInt(n, 10)) : [];
      if(done.has(code)){
        done.delete(code);
      } else if(prereq.every(p => done.has(p))){
        done.add(code);
      }
      save();
      applyStatus();
    };
  });
}

load();
render();
})();
