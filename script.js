// Plan de estudios interactivo
// - Modo oscuro + acento verde azulado
// - Flechas SVG entre correlativas
// - Click para "Aprobada"; guarda estado en localStorage
// - Búsqueda, exportar/importar progreso
// - Listo para GitHub Pages (estático)

(function(){
  // ====== Datos ======
  // Columnas = 5 años x 2 semestres (1..10)
  // Cada materia: {code, name, year, semester, order, prereq: [codes]}
  // Nota: Algunas correlativas pueden requerir ajuste fino. Editá este bloque si tu plan oficial difiere.
  const PLAN = [
    // 1° Año - Sem 1
    {code:1,  name:"Algoritmos y Estructuras de Datos I", year:1, semester:1, order:1, prereq:[]},
    {code:2,  name:"Programación I",                        year:1, semester:1, order:2, prereq:[]},
    {code:3,  name:"Introducción a los Sistemas",          year:1, semester:1, order:3, prereq:[]},
    {code:4,  name:"Matemática Básica",                    year:1, semester:1, order:4, prereq:[]},
    {code:5,  name:"Arquitectura de Computadoras I",       year:1, semester:1, order:5, prereq:[]},
    // 1° Año - Sem 2
    {code:9,  name:"Bases de Datos I",                      year:1, semester:2, order:1, prereq:[2]},
    {code:10, name:"Programación II",                       year:1, semester:2, order:2, prereq:[2]},
    {code:11, name:"Álgebra I",                             year:1, semester:2, order:3, prereq:[4]},
    {code:12, name:"Ingeniería de Requisitos",              year:1, semester:2, order:4, prereq:[3]},
    {code:13, name:"Sistemas Operativos I",                 year:1, semester:2, order:5, prereq:[5]},

    // 2° Año - Sem 1
    {code:6,  name:"Programación III",                      year:2, semester:1, order:1, prereq:[1,10]},
    {code:7,  name:"Álgebra II",                            year:2, semester:1, order:2, prereq:[11]},
    {code:8,  name:"Bases de Datos II",                     year:2, semester:1, order:3, prereq:[9]},
    // 2° Año - Sem 2
    {code:14, name:"Programación IV",                       year:2, semester:2, order:1, prereq:[6]},
    {code:15, name:"Cálculo I",                             year:2, semester:2, order:2, prereq:[11]},
    {code:16, name:"Redes I",                               year:2, semester:2, order:3, prereq:[5]},
    {code:17, name:"Sistemas Operativos II",                year:2, semester:2, order:4, prereq:[13]},

    // 3° Año - Sem 1
    {code:20, name:"Programación V",                        year:3, semester:1, order:1, prereq:[14]},
    {code:21, name:"Cálculo II",                            year:3, semester:1, order:2, prereq:[15]},
    {code:22, name:"Redes II",                              year:3, semester:1, order:3, prereq:[16]},
    {code:23, name:"Algoritmos y Estructuras de Datos II",  year:3, semester:1, order:4, prereq:[1,10]},

    // 3° Año - Sem 2
    {code:24, name:"Probabilidad y Estadística",            year:3, semester:2, order:1, prereq:[15]},
    {code:31, name:"Teoría de la Computación I",            year:3, semester:2, order:2, prereq:[23]},
    {code:32, name:"Arquitectura de Computadoras II",       year:3, semester:2, order:3, prereq:[5]},
    {code:33, name:"Bases de Datos III",                    year:3, semester:2, order:4, prereq:[8]},
    {code:34, name:"Aspectos Profesionales I",              year:3, semester:2, order:5, prereq:[]},

    // 4° Año - Sem 1
    {code:25, name:"Teoría de la Computación II",           year:4, semester:1, order:1, prereq:[31]},
    {code:26, name:"Auditoría",                             year:4, semester:1, order:2, prereq:[12]},
    {code:30, name:"Programación VI",                       year:4, semester:1, order:3, prereq:[20]},
    // Requisito adicional
    {code:29, name:"Inglés (Requisito)",                    year:4, semester:1, order:4, prereq:[]},

    // 4° Año - Sem 2
    {code:35, name:"Teoría de la Computación III",          year:4, semester:2, order:1, prereq:[25]},
    {code:36, name:"Gestión de Proyectos",                  year:4, semester:2, order:2, prereq:[12]},
    {code:37, name:"Arquitecturas de Sistemas",             year:4, semester:2, order:3, prereq:[17,33]},
    {code:38, name:"Seguridad",                             year:4, semester:2, order:4, prereq:[22]},

    // 5° Año - Sem 1
    {code:40, name:"Aspectos Profesionales II",             year:5, semester:1, order:1, prereq:[34,29]},
    {code:41, name:"Metodología de la Investigación",       year:5, semester:1, order:2, prereq:[]},
    {code:42, name:"Práctica Profesional Supervisada",      year:5, semester:1, order:3, prereq:[34]},
    {code:43, name:"Optativa",                              year:5, semester:1, order:4, prereq:[]},
    // 5° Año - Tesina (Anual)
    {code:44, name:"Tesina de Licenciatura",                year:5, semester:2, order:1, prereq:"ALL"} // requiere todas
  ];

  
  // ====== Utilidades ======
  const key = "plan-estudios-progress-v1";
  const $ = (q,ctx=document)=>ctx.querySelector(q);
  const $$ = (q,ctx=document)=>Array.from(ctx.querySelectorAll(q));

  function colIndexOf(node){
    // 10 columnas: (year-1)*2 + semester
    return (node.year-1)*2 + node.semester;
  }

  function loadProgress(){
    try{ return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch{ return {}; }
  }
  function saveProgress(state){
    localStorage.setItem(key, JSON.stringify(state));
  }

  function prereqSatisfied(node, state){
    if(node.prereq === "ALL"){
      // Tesina: requiere todas las materias "aprobadas" salvo ella
      return PLAN.filter(n=>n.code!==node.code).every(n=>state[n.code]);
    }
    if(!node.prereq || node.prereq.length===0) return true;
    return node.prereq.every(code => !!state[code]);
  }

  function nameByCode(code){
    const n = PLAN.find(x=>x.code===code);
    return n ? n.name : `#${code}`;
  }

  // ====== Render ======
  const grid = document.getElementById("grid");

  const edgesSvg = document.getElementById("edges");

  // Col titles
  const colNames = [
    "1° Año – 1° Sem", "1° Año – 2° Sem",
    "2° Año – 1° Sem", "2° Año – 2° Sem",
    "3° Año – 1° Sem", "3° Año – 2° Sem",
    "4° Año – 1° Sem", "4° Año – 2° Sem",
    "5° Año – 1° Sem", "5° Año – 2° Sem / Anual"
  ];
  colNames.forEach(name=>{
    const t = document.createElement("div");
    t.className = "col-title";
    t.textContent = name;
    grid.appendChild(t);
  });

  const state = loadProgress();

  // Ordenar por columnas y orden interno
  const byCol = {};
  PLAN.forEach(n=>{
    const col = colIndexOf(n);
    byCol[col] ||= [];
    byCol[col].push(n);
  });
  Object.values(byCol).forEach(arr=>arr.sort((a,b)=>a.order-b.order));

  // Crear tarjetas
  PLAN.forEach(node=>{
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.code = node.code;

    card.dataset.col = colIndexOf(node);
    card.innerHTML = `
      <div class="code">#${node.code}</div>

      <div class="name">${node.name}</div>

      <div class="meta">
        <span class="badge">Año ${node.year}</span>
        <span class="badge">${node.semester===1?"1° Sem":"2° Sem"}</span>
      </div>
      <div class="small prereq">${
        node.prereq==="ALL" ? "Correlativa: TODAS las materias" :
        (node.prereq && node.prereq.length? "Correlativas: "+node.prereq.map(c=>`#${c}`).join(", ") : "Sin correlativas")
      }</div>
    `;
    card.addEventListener("click", ()=>{
      // Toggle done
      const newVal = !state[node.code];
      state[node.code] = newVal;
      saveProgress(state);
      applyStatus();
      drawEdges();
    });
    grid.appendChild(card);
  });

  function applyStatus(){
    $$(".card").forEach(el=>{
      el.classList.remove("done","locked");
      const code = Number(el.dataset.code);
      const node = PLAN.find(n=>n.code===code);
      const done = !!state[code];
      const open = prereqSatisfied(node, state);
      if(done) el.classList.add("done");
      else if(!open) el.classList.add("locked");
    });
  }

  function layoutGrid(){
    // Colocar cada card dentro de su columna (grid-auto-flow row; usamos order via CSS grid-row)
    const columns = 10;
    con
      st colHeights = Array.from({length:columns}, ()=>0);
    // Seed positions in DOM order by col then internal order
    const all = PLAN.slice().sort((a,b)=>{
      const ca = colIndexOf(a), cb = colIndexOf(b);
      if(ca!==cb) return ca-cb;
      return a.order-b.order;
    });
    all.forEach(n=>{
      const col = colIndexOf(n);
      const row = ++colHeights[col]; // 1-based
      const card = $(`.card[data-code="${n.code}"]`);
      card.style.gridColumn = (col+1);
      card.style.gridRow = row + 1; // +1 por títulos de columna
    });
  }

  function clearEdges(){
    edgesSvg.innerHTML = `
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"></path>
        </marker>
      </defs>
    `;
  }

  function drawEdges(){
    clearEdges();
    const svgRect = edgesSvg.getBoundingClientRect();
    const toSvg = (x,y)=>({ x: x - svgRect.left, y: y - svgRect.top });

    PLAN.forEach(node=>{
      if(node.prereq && node.prereq!=="ALL"){
        node.prereq.forEach(p=>{
          const from = $(`.card[data-code="${p}"]`);
          const to = $(`.card[data-code="${node.code}"]`);
          if(!from || !to) return;

          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const start = toSvg(a.right, a.top + a.height/2);
          const end   = toSvg(b.left,  b.top + b.height/2);
          const midX  = (start.x + end.x)/2;

          const path = document.createElementNS("http://www.w3.org/2000/svg","path");
          const c1 = `${midX},${start.y}`;
          const c2 = `${midX},${end.y}`;
          path.setAttribute("d", `M ${start.x},${start.y} C ${c1} ${c2} ${end.x},${end.y}`);
          const open = prereqSatisfied(node, loadProgress());
          path.setAttribute("stroke", open ? "var(--edge)" : "var(--edge-locked)");
          path.setAttribute("fill", "none");
          path.setAttribute("stroke-width","2");
          path.setAttribute("marker-end","url(#arrow)");
          edgesSvg.appendChild(path);
        });
      }
    });
  }

  function onResize(){
    // Redibujar flechas al cambiar layout
    drawEdges();
  }

  // ====== Búsqueda ======
  const search = document.getElementById("search");
  search.addEventListener("input", ()=>{
    const q = search.value.trim().toLowerCase();
    $$(".card").forEach(c=>{
      const name = $(".name", c).textContent.toLowerCase();
      const code = c.dataset.code;
      c.style.outline = "";
      c.style.opacity = "";
      if(!q){ return; }
      if(name.includes(q) || String(code)===q){
        c.style.outline = "2px solid var(--teal)";
      }else{
        c.style.opacity = ".5";
      }
    });
    drawEdges();
  });

  // ====== Export / Import ======
  document.getElementById("btn-export").addEventListener("click", ()=>{
    const blob = new Blob([JSON.stringify(loadProgress(), null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "progreso-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  document.getElementById("file-import").addEventListener("change", (ev)=>{
    const file = ev.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(String(reader.result||"{}"));
        localStorage.setItem(key, JSON.stringify(data));
        Object.keys(data).length && alert("Progreso importado correctamente.");
   
        applyStatus(); drawEdges();
      }catch(e){
        alert("No se pudo importar el JSON.");
      }
    };
    reader.readAsText(file);
    ev.target.value = "";
  });
  document.getElementById("btn-reset").addEventListener("click", ()=>{
    if(confirm("¿Seguro que querés reiniciar el progreso?")){
      localStorage.removeItem(key);
      applyStatus(); drawEdges();
    }
  });

  // ====== Inicialización ======
  layoutGrid();
  applyStatus();
  // timeout para asegurar layout listo antes de medir
  setTimeout(drawEdges, 50);
  window.addEventListener("resize", onResize);
})();
// ====== Datos ======
