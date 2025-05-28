// --- FUNDO HEXÁGONOS MODERNOS ---
const hexCanvas = document.getElementById('hex-bg');
const ctx = hexCanvas.getContext('2d');
let hexW, hexH, hexGrid = [];
const hexColors = [
  'rgba(253,125,28,0.13)',      // laranja translúcido
  'rgba(164,177,138,0.12)',     // musgo translúcido
  'rgba(35,50,28,0.09)',        // musgo escuro
  'rgba(253,125,28,0.07)',      // laranja mais fraco
  'rgba(255,255,255,0.07)'      // branco sutil
];

function resizeHexCanvas() {
  hexCanvas.width = window.innerWidth;
  hexCanvas.height = window.innerHeight;
  hexW = hexCanvas.width;
  hexH = hexCanvas.height;
  initHexGrid();
}
function initHexGrid() {
  hexGrid = [];
  const hexSize = Math.max(hexW,hexH)/17; // grandes
  const hexGap = 18;
  const cols = Math.ceil(hexW/(hexSize * 1.15));
  const rows = Math.ceil(hexH/(hexSize * 1.05));
  for(let y=0; y<rows; y++) {
    for(let x=0; x<cols; x++) {
      let xx = x*(hexSize+hexGap) + ((y%2)?hexSize/2:0);
      let yy = y*(hexSize*0.90+hexGap/2);
      let color = hexColors[Math.floor(Math.random()*hexColors.length)];
      hexGrid.push({
        x: xx + Math.random()*7-3.5,
        y: yy + Math.random()*7-3.5,
        size: hexSize + Math.random()*5-2.5,
        color,
        alpha: .34 + Math.random()*0.18,
        phase: Math.random()*Math.PI*2
      });
    }
  }
}
function drawHex(x, y, size, color, alpha=1, phase=0, t=0) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.1;
  ctx.beginPath();
  for(let i=0; i<6; i++) {
    let angle = Math.PI/3*i + t*0.2 + phase;
    let px = x + size * Math.cos(angle);
    let py = y + size * Math.sin(angle);
    if(i===0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.restore();
}
function animateHex(ts=0) {
  ctx.clearRect(0,0,hexW,hexH);
  for(const h of hexGrid) {
    drawHex(
      h.x + Math.sin(ts/1700+h.phase)*3,
      h.y + Math.cos(ts/1800+h.phase)*3,
      h.size + Math.sin(ts/1100+h.phase)*2,
      h.color, h.alpha, h.phase, ts/1000
    );
  }
  requestAnimationFrame(animateHex);
}
window.addEventListener('resize', resizeHexCanvas);
resizeHexCanvas();
animateHex();

// --- EFEITO TYPING EM "QUALITY CONTROL" ---
function typeEffect(el, text, speed=68) {
  el.textContent = '';
  let i = 0;
  function type() {
    if(i<=text.length) {
      el.textContent = text.slice(0,i);
      i++; setTimeout(type, speed + Math.random()*28);
    }
  }
  setTimeout(type, 350);
}
const typingEl = document.getElementById('typing-text');
typeEffect(typingEl, 'Quality Control');

// --- FLUXO INICIAL / NAVEGAÇÃO ---
const inputPlaca = document.getElementById('inputPlaca');
const btnVerMidia = document.getElementById('btnVerMidia');
const btnEquipe = document.getElementById('btnEquipe');
const mainWelcome = document.getElementById('main-welcome');
const modalSenhaEquipe = document.getElementById('modalSenhaEquipe');
const senhaEquipeInput = document.getElementById('senhaEquipeInput');
const senhaEquipeConfirmar = document.getElementById('senhaEquipeConfirmar');
const senhaEquipeCancelar = document.getElementById('senhaEquipeCancelar');
const senhaEquipeMsg = document.getElementById('senhaEquipeMsg');

const areaCliente = document.getElementById('areaCliente');
const areaEquipeAdmin = document.getElementById('areaEquipeAdmin');

let userTipo = null; // "cliente" | "equipe" | "admin"
let userPlaca = null;

// --- PLACA: ENTER ou Ver Mídia ---
inputPlaca.addEventListener('keydown', e=>{
  if(e.key==='Enter') submitCliente();
});
btnVerMidia.addEventListener('click', submitCliente);
function submitCliente() {
  const placa = inputPlaca.value.trim().toUpperCase();
  if(!placa || placa.length<4) {
    inputPlaca.classList.add('shake');
    setTimeout(()=>inputPlaca.classList.remove('shake'),250);
    return;
  }
  userTipo = 'cliente';
  userPlaca = placa;
  mainWelcome.classList.add('hidden');
  renderAreaCliente();
}

// --- BOTÃO EQUIPE: MODAL SENHA ---
btnEquipe.addEventListener('click', ()=>{
  modalSenhaEquipe.classList.remove('hidden');
  senhaEquipeInput.value = '';
  senhaEquipeMsg.textContent = '';
  setTimeout(()=>senhaEquipeInput.focus(), 150);
});
senhaEquipeCancelar.addEventListener('click', ()=>{
  modalSenhaEquipe.classList.add('hidden');
});
senhaEquipeConfirmar.addEventListener('click', submitSenhaEquipe);
senhaEquipeInput.addEventListener('keydown', e=>{
  if(e.key==='Enter') submitSenhaEquipe();
});
function submitSenhaEquipe() {
  if(senhaEquipeInput.value==='2707') {
    modalSenhaEquipe.classList.add('hidden');
    userTipo = 'equipe';
    mainWelcome.classList.add('hidden');
    renderAreaEquipeAdmin();
  } else {
    senhaEquipeMsg.textContent = 'Senha incorreta';
    senhaEquipeInput.classList.add('shake');
    setTimeout(()=>senhaEquipeInput.classList.remove('shake'),250);
  }
}

// --- ÁREA CLIENTE (GRID, GALERIA, ETC) ---
function renderAreaCliente() {
  areaCliente.innerHTML = '';
  areaCliente.classList.remove('hidden');
  const title = document.createElement('div');
  title.className = 'main-card';
  title.innerHTML = `
    <h2 class="font-bold text-xl mb-2 text-[#fd7d1c]">Mídias do Veículo</h2>
    <div class="mb-1 text-[#a4b18a]">Placa: <span class="font-bold">${userPlaca}</span></div>
    <div class="mb-3 text-[#a4b18a]">Selecione a etapa para ver imagens:</div>
    <div class="grid-steps"></div>
    <div class="cliente-galeria-area mt-4"></div>
    <button class="nova-consulta mt-6 text-[#fd7d1c] underline text-sm">Nova Consulta</button>
  `;
  areaCliente.appendChild(title);

  // Etapas grid - agora botões grandes e separados
  const grid = title.querySelector('.grid-steps');
  const etapas = ['Check-IN','Check-OUT','Processos','Show Off'];
  etapas.forEach(etapa=>{
    const btn = document.createElement('button');
    btn.className = 'grid-step-btn';
    btn.textContent = etapa;
    btn.onclick = ()=>loadClienteEtapa(etapa, title);
    grid.appendChild(btn);
  });

  // Nova consulta
  title.querySelector('.nova-consulta').onclick = ()=>{
    areaCliente.classList.add('hidden');
    mainWelcome.classList.remove('hidden');
    inputPlaca.value = '';
    userTipo = null;
    userPlaca = null;
    inputPlaca.focus();
  }
}
function loadClienteEtapa(etapa, container) {
  const galeria = container.querySelector('.cliente-galeria-area');
  galeria.innerHTML = `<div class="text-[#a4b18a] mb-2">Carregando ${etapa}...</div>`;
  const path = `${userPlaca}/${etapa}/`;
  storage.ref(path).listAll().then(res=>{
    galeria.innerHTML = `<div class="grid-gallery"></div>`;
    const grid = galeria.querySelector('.grid-gallery');
    if(res.items.length===0) {
      galeria.innerHTML += `<div class="text-[#fd7d1c] mt-2">Nenhuma mídia encontrada.</div>`;
    }
    res.items.forEach(item=>{
      item.getDownloadURL().then(url=>{
        if(item.name.match(/\.(mp4|webm|mov)$/i)) {
          const vid = document.createElement('video');
          vid.src = url;
          vid.controls = false;
          vid.muted = true;
          vid.autoplay = false;
          vid.loop = false;
          vid.onclick = ()=>openLightbox(url, 'video');
          grid.appendChild(vid);
        } else {
          const img = document.createElement('img');
          img.src = url;
          img.alt = etapa;
          img.onclick = ()=>openLightbox(url, 'img');
          grid.appendChild(img);
        }
      });
    });
    storage.ref(`${userPlaca}/${etapa}/comentario.txt`).getDownloadURL().then(url=>{
      fetch(url).then(r=>r.text()).then(txt=>{
        galeria.innerHTML += `<div class="mt-3 mb-1 px-2 text-[#fd7d1c] text-sm">Comentário da equipe: ${txt}</div>`;
      });
    }).catch(()=>{});
  });
}

// --- ÁREA EQUIPE/ADMIN (MESMO FLUXO, ABAS, ETC) ---
function renderAreaEquipeAdmin() {
  areaEquipeAdmin.innerHTML = '';
  areaEquipeAdmin.classList.remove('hidden');
  // Tabs
  const tabBox = document.createElement('div');
  tabBox.className = 'flex justify-center gap-3 mb-3';
  tabBox.innerHTML = `
    <button class="tab-btn tab-active" data-tab="equipe">Equipe</button>
    <button class="tab-btn" data-tab="admin">Admin</button>
  `;
  areaEquipeAdmin.appendChild(tabBox);

  // Content areas
  const equipeArea = document.createElement('div');
  const adminArea = document.createElement('div');
  equipeArea.className = 'main-card';
  adminArea.className = 'main-card hidden';
  areaEquipeAdmin.appendChild(equipeArea);
  areaEquipeAdmin.appendChild(adminArea);

  // Tab switching
  tabBox.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick = ()=>{
      tabBox.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('tab-active'));
      btn.classList.add('tab-active');
      if(btn.dataset.tab==='equipe') {
        equipeArea.classList.remove('hidden');
        adminArea.classList.add('hidden');
      } else {
        equipeArea.classList.add('hidden');
        adminArea.classList.remove('hidden');
      }
    }
  });

  // Equipe flow
  renderEquipe(equipeArea);
  // Admin flow
  renderAdmin(adminArea);
}
function renderEquipe(container) {
  container.innerHTML = `
    <h2 class="font-bold text-xl mb-2 text-[#fd7d1c]">Equipe</h2>
    <input type="text" id="equipePlaca" placeholder="Digite a placa" class="welcome-placa mb-2" maxlength="8"/>
    <div class="grid-steps mb-2"></div>
    <div class="equipe-upload-area mt-3"></div>
  `;
  const etapas = ['Check-IN','Check-OUT','Processos','Show Off'];
  const grid = container.querySelector('.grid-steps');
  etapas.forEach(etapa=>{
    const btn = document.createElement('button');
    btn.className = 'grid-step-btn';
    btn.textContent = etapa;
    btn.onclick = ()=>loadEquipeUpload(etapa, container);
    grid.appendChild(btn);
  });
}
function loadEquipeUpload(etapa, container) {
  const placa = container.querySelector('#equipePlaca').value.trim().toUpperCase();
  if(!placa) {
    container.querySelector('#equipePlaca').classList.add('shake');
    setTimeout(()=>container.querySelector('#equipePlaca').classList.remove('shake'),250);
    return;
  }
  const uploadArea = container.querySelector('.equipe-upload-area');
  uploadArea.innerHTML = `
    <h3 class="font-bold mb-2">Enviar mídia para <span class="text-[#fd7d1c]">${etapa}</span></h3>
    <input type="file" id="equipeFile" accept="image/*,video/*" class="mb-2"/>
    <button id="equipeEnviar" class="btn-equipe mt-1 mb-1">Enviar</button>
    <div id="equipeStatus" class="mb-2 text-center"></div>
    <textarea id="equipeComentario" rows="2" class="w-full mb-2" placeholder="Comentário (opcional)"></textarea>
    <button id="equipeSalvarComentario" class="btn-equipe mb-1">Salvar Comentário</button>
  `;
  const fileInput = uploadArea.querySelector('#equipeFile');
  const btnEnviar = uploadArea.querySelector('#equipeEnviar');
  const status = uploadArea.querySelector('#equipeStatus');
  const btnComentario = uploadArea.querySelector('#equipeSalvarComentario');
  btnEnviar.onclick = ()=>{
    const file = fileInput.files[0];
    if(!file) {
      status.textContent = 'Selecione um arquivo.';
      return;
    }
    const ref = storage.ref(`${placa}/${etapa}/${file.name}`);
    ref.put(file).then(()=>{
      status.textContent = 'Enviado!';
      fileInput.value = '';
    }).catch(e=>{
      status.textContent = 'Erro ao enviar.';
    });
  };
  btnComentario.onclick = ()=>{
    const txt = uploadArea.querySelector('#equipeComentario').value;
    if(!txt) {status.textContent = 'Digite o comentário.'; return;}
    const blob = new Blob([txt], {type:'text/plain'});
    const ref = storage.ref(`${placa}/${etapa}/comentario.txt`);
    ref.put(blob).then(()=>{
      status.textContent = 'Comentário salvo!';
      uploadArea.querySelector('#equipeComentario').value = '';
    }).catch(()=>{status.textContent='Erro ao salvar comentário.'});
  };
}
function renderAdmin(container) {
  container.innerHTML = `
    <h2 class="font-bold text-xl mb-2 text-[#fd7d1c]">Admin</h2>
    <input type="text" id="adminPlaca" placeholder="Digite a placa" class="welcome-placa mb-2" maxlength="8"/>
    <button id="adminBuscar" class="btn-equipe mb-2">Buscar</button>
    <div class="admin-galeria-area mt-3"></div>
  `;
  const btnBuscar = container.querySelector('#adminBuscar');
  btnBuscar.onclick = ()=>{
    const placa = container.querySelector('#adminPlaca').value.trim().toUpperCase();
    if(!placa) {
      container.querySelector('#adminPlaca').classList.add('shake');
      setTimeout(()=>container.querySelector('#adminPlaca').classList.remove('shake'),250);
      return;
    }
    loadAdminGaleria(placa, container);
  }
}
function loadAdminGaleria(placa, container) {
  const area = container.querySelector('.admin-galeria-area');
  area.innerHTML = `<div class="grid-steps mb-2"></div><div class="admin-grid-galeria"></div>`;
  const etapas = ['Check-IN','Check-OUT','Processos','Show Off'];
  const grid = area.querySelector('.grid-steps');
  etapas.forEach(etapa=>{
    const btn = document.createElement('button');
    btn.className = 'grid-step-btn';
    btn.textContent = etapa;
    btn.onclick = ()=>loadAdminEtapa(placa, etapa, area);
    grid.appendChild(btn);
  });
}
function loadAdminEtapa(placa, etapa, area) {
  const galeria = area.querySelector('.admin-grid-galeria');
  galeria.innerHTML = `<div class="text-[#a4b18a] mb-2">Carregando ${etapa}...</div>`;
  const path = `${placa}/${etapa}/`;
  storage.ref(path).listAll().then(res=>{
    galeria.innerHTML = `<div class="grid-gallery"></div>`;
    const grid = galeria.querySelector('.grid-gallery');
    if(res.items.length===0) {
      galeria.innerHTML += `<div class="text-[#fd7d1c] mt-2">Nenhuma mídia encontrada.</div>`;
    }
    res.items.forEach(item=>{
      item.getDownloadURL().then(url=>{
        if(item.name.match(/\.(mp4|webm|mov)$/i)) {
          const vid = document.createElement('video');
          vid.src = url;
          vid.controls = false;
          vid.muted = true;
          vid.autoplay = false;
          vid.loop = false;
          vid.onclick = ()=>openLightbox(url, 'video');
          grid.appendChild(vid);
        } else {
          const img = document.createElement('img');
          img.src = url;
          img.alt = etapa;
          img.onclick = ()=>openLightbox(url, 'img');
          grid.appendChild(img);
        }
      });
    });
    storage.ref(`${placa}/${etapa}/comentario.txt`).getDownloadURL().then(url=>{
      fetch(url).then(r=>r.text()).then(txt=>{
        galeria.innerHTML += `<div class="mt-3 mb-1 px-2 text-[#fd7d1c] text-sm">Comentário da equipe: ${txt}</div>`;
      });
    }).catch(()=>{});
  });
}

// --- LIGHTBOX PARA IMAGENS/VIDEO ---
const lightbox = document.getElementById('lightbox');
const lightboxBg = document.getElementById('lightbox-bg');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxDownload = document.getElementById('lightbox-download');
function openLightbox(url, tipo='img') {
  lightbox.classList.add('show');
  lightboxContent.innerHTML = '';
  lightboxDownload.href = url;
  if(tipo==='img') {
    const img = document.createElement('img');
    img.src = url; img.alt = '';
    lightboxContent.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = url; vid.controls = true; vid.autoplay = true;
    lightboxContent.appendChild(vid);
  }
}
function closeLightbox() {
  lightbox.classList.remove('show');
  setTimeout(()=>{lightboxContent.innerHTML='';}, 300);
}
lightboxBg.onclick = closeLightbox;
lightboxClose.onclick = closeLightbox;
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeLightbox();
});

// --- UX extra: foco inicial no input placa ---
window.onload = ()=>{ try{inputPlaca.focus();}catch{} };

// --- SHAKE ANIMATION, TABS CSS ---
const style = document.createElement('style');
style.textContent = `
.shake { animation: shake .25s; }
@keyframes shake { 0%{transform:translateX(0);} 30%{transform:translateX(-6px);} 60%{transform:translateX(6px);} 100%{transform:translateX(0);} }
.tab-btn { background:#232b1c;color:#a4b18a;border:none;padding:9px 29px 9px 29px;border-radius:13px;font-weight:700;font-size:1.08rem;cursor:pointer;margin:0 8px;transition:background 0.15s;}
.tab-btn.tab-active { background:#fd7d1c;color:#fff;}
`;
document.head.appendChild(style);