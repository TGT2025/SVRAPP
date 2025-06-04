import { AppState, renderApp } from './main.js';
import { compressFile } from './compress.js';
import { showModal } from './modal.js';

const etapas = [
  "Frente","Lateral Direita","Traseira","Teto","Lateral Esquerda",
  "Interior Traseiro","Interior Dianteiro","Porta Luva","Consola",
  "Painel Carro Ligado","Motor","Avarias","Comentários"
];
const senhaEquipe = "2707";

export function showEquipeFlow() {
  const flow = document.getElementById('flowArea');
  if (!AppState.equipeLogada) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
        <h1 class="text-xl font-bold mb-2 text-orange-500">SVR LAB</h1>
        <input id="senhaEquipeInput" type="password" placeholder="Senha equipe" class="w-full bg-gray-800 rounded px-3 py-2 mb-3 text-center outline-none">
        <button id="btnLoginEquipe" class="w-full btn-grad py-2 rounded mb-2">Entrar</button>
        <div id="loginEquipeMsg" class="min-h-[1.2em] text-red-400 text-sm"></div>
      </div>
    `;
    document.getElementById('senhaEquipeInput').focus();
    document.getElementById('btnLoginEquipe').onclick = () => {
      const senha = document.getElementById('senhaEquipeInput').value;
      if (senha === senhaEquipe) {
        AppState.equipeLogada = true;
        AppState.placa = "";
        AppState.aba = "";
        AppState.etapa = 0;
        renderApp();
      } else {
        document.getElementById('loginEquipeMsg').textContent = "Senha inválida!";
      }
    };
    return;
  }

  // FLUXO: Digitar placa
  if (!AppState.placa) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
        <h1 class="text-xl font-bold mb-5 text-orange-500">Equipe - Digite a placa</h1>
        <input id="placaEquipeInput" type="text" maxlength="8" placeholder="Placa" class="w-full bg-gray-800 rounded px-3 py-2 mb-4 text-center outline-none text-white text-xl tracking-widest uppercase">
        <button class="w-full btn-grad py-2 rounded mb-2" id="btnAvancarPlacaEquipe">Avançar</button>
        <button class="w-full bg-gray-800 py-2 rounded" id="btnSairEquipePlaca">Voltar</button>
      </div>
    `;
    document.getElementById('placaEquipeInput').focus();
    document.getElementById('btnAvancarPlacaEquipe').onclick = () => {
      const placa = document.getElementById('placaEquipeInput').value.trim().toUpperCase();
      if (!placa) return alert("Digite a placa!");
      AppState.placa = placa;
      AppState.aba = "";
      AppState.etapa = 0;
      renderApp();
    };
    document.getElementById('btnSairEquipePlaca').onclick = () => {
      AppState.equipeLogada = false;
      renderApp();
    };
    return;
  }

  // FLUXO: Selecionar aba
  if (!AppState.aba) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 class="text-orange-400 font-bold mb-3 text-lg">Selecione o tipo de mídia</h2>
        <div class="flex w-full flex-col gap-3 mb-4">
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="CheckIN">Check-IN</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="CheckOUT">Check-OUT</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="Processos">Processos</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="ShowOff">Show Off</button>
        </div>
        <button class="w-full bg-gray-800 py-2 rounded" id="btnSairAbaEquipe">Voltar</button>
      </div>
    `;
    flow.querySelectorAll('[data-aba]').forEach(btn => {
      btn.onclick = () => {
        AppState.aba = btn.getAttribute('data-aba');
        AppState.etapa = 0;
        renderApp();
      };
    });
    document.getElementById('btnSairAbaEquipe').onclick = () => {
      AppState.placa = "";
      renderApp();
    };
    return;
  }

  // FLUXO: CheckIN/CheckOUT (etapas) ou grid Processos/ShowOff
  if (["CheckIN", "CheckOUT"].includes(AppState.aba)) {
    renderEtapas(flow);
    return;
  }
  renderGridEquipe(flow);
}

// ======== ETAPAS DE CHECKIN/CHECKOUT ========
function renderEtapas(flow) {
  const etapaAtual = AppState.etapa || 0;
  const aba = AppState.aba;
  const placa = AppState.placa;
  flow.innerHTML = `
    <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
      <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
      <h1 class="text-xl font-bold mb-2 text-orange-500">${aba} (${etapaAtual+1}/${etapas.length})</h1>
      <div id="passoContainerEquipe" class="w-full"></div>
      <button class="w-full bg-gray-800 py-2 rounded mt-4" id="btnSairEtapasEquipe">Cancelar</button>
    </div>
  `;
  document.getElementById('btnSairEtapasEquipe').onclick = () => {
    AppState.aba = "";
    renderApp();
  };

  const container = document.getElementById('passoContainerEquipe');
  if (etapaAtual < 11) {
    const nome = etapas[etapaAtual];
    container.innerHTML = `
      <div class="mb-2 text-center text-white text-lg">Foto do ${nome.toLowerCase()}</div>
      <input type="file" id="inputFileEquipe" accept="image/*" class="fileinput w-full mb-3">
      <button class="w-full btn-grad py-2 rounded" id="btnEnviarEquipeFoto">Enviar Foto</button>
      <div id="statusEtapa" class="text-green-400 text-center mb-2"></div>
    `;
    document.getElementById('btnEnviarEquipeFoto').onclick = async () => {
      const file = document.getElementById('inputFileEquipe').files[0];
      if (!file) return alert("Selecione uma imagem!");
      document.getElementById('btnEnviarEquipeFoto').disabled = true;
      const compressed = await compressFile(file);
      await storage.ref(`${placa}/${aba}/${nome}.jpg`).put(compressed);
      document.getElementById('statusEtapa').textContent = "Foto salva!";
      AppState.etapa = etapaAtual + 1;
      salvarProgressoEquipe(AppState.etapa);
      setTimeout(renderApp, 500);
    };
  } else if (etapaAtual === 11) {
    // Avarias: múltiplas imagens
    container.innerHTML = `
      <div class="mb-2 text-center text-white text-lg">Avarias</div>
      <input type="file" id="inputAvariaEquipe" accept="image/*" class="fileinput w-full mb-2">
      <div id="avariaGridEquipe" class="grid grid-cols-2 gap-2 mb-2"></div>
      <button class="w-full btn-grad py-2 rounded" id="btnProxAvariaEquipe">Finalizar Avarias</button>
    `;
    listarAvarias(placa, aba);
    document.getElementById('inputAvariaEquipe').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fname = `${Date.now()}.jpg`;
      const compressed = await compressFile(file);
      await storage.ref(`${placa}/${aba}/Avarias/${fname}`).put(compressed);
      renderApp();
    };
    document.getElementById('btnProxAvariaEquipe').onclick = () => {
      AppState.etapa = etapaAtual + 1;
      salvarProgressoEquipe(AppState.etapa);
      renderApp();
    };
  } else if (etapaAtual === 12) {
    container.innerHTML = `
      <div class="mb-2 text-center text-white text-lg">Comentários</div>
      <textarea id="inputComentarioEquipe" class="w-full bg-gray-800 rounded px-3 py-2 mb-3 text-white" rows="4" placeholder="Digite comentários finais"></textarea>
      <button class="w-full btn-grad py-2 rounded mb-2" id="btnEnviarComentarioEquipe">Finalizar ${aba}</button>
    `;
    document.getElementById('btnEnviarComentarioEquipe').onclick = async () => {
      const comentario = document.getElementById('inputComentarioEquipe').value;
      await storage.ref(`${placa}/${aba}/Comentario.txt`).putString(comentario);
      AppState.etapa = etapaAtual + 1;
      salvarProgressoEquipe(AppState.etapa);
      renderApp();
    };
  } else {
    container.innerHTML = `<div class="text-center text-green-400 text-2xl font-bold mb-8">${aba} Completo!</div>`;
  }
}

function listarAvarias(placa, aba) {
  const avariaGrid = document.getElementById('avariaGridEquipe');
  storage.ref(`${placa}/${aba}/Avarias/`).listAll().then(list => {
    avariaGrid.innerHTML = "";
    list.items.forEach(async item => {
      const url = await item.getDownloadURL();
      let div = document.createElement("div");
      div.innerHTML = `<img src="${url}" class="media-thumb cursor-pointer" data-url="${url}">`;
      div.querySelector('img').onclick = () => showModal(url, "img");
      avariaGrid.appendChild(div);
    });
  });
}

function salvarProgressoEquipe(idx) {
  localStorage.setItem(`fluxo_${AppState.placa}_${AppState.aba}`, idx);
}

// =========== GRID PROCESSOS/SHOWOFF ===========
function renderGridEquipe(flow) {
  flow.innerHTML = `
    <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
      <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
      <h1 class="text-xl font-bold mb-5 text-orange-500">Equipe - ${AppState.aba}</h1>
      <input id="placaEquipe" type="text" maxlength="8" placeholder="Digite a placa" class="w-full bg-gray-800 rounded px-3 py-2 mb-4 text-center outline-none text-white text-xl tracking-widest uppercase" value="${AppState.placa||""}" disabled>
      <div id="uploadEquipe" class="w-full flex flex-col items-center mb-4">
        <input id="fileEquipe" type="file" accept="image/*,video/*" multiple class="fileinput w-full mb-2">
        <button class="w-full btn-grad py-2 rounded" id="btnEnviarEquipe">Enviar Mídia</button>
        <div id="statusEquipe" class="text-sm text-center mt-1 mb-2 text-green-400"></div>
      </div>
      <div id="gridEquipe" class="w-full grid grid-cols-2 gap-2 mt-2"></div>
      <button class="w-full bg-gray-800 mt-6 py-2 rounded" id="btnSairEquipeGrid">Voltar</button>
    </div>
  `;
  renderEquipeGrid();
  document.getElementById('btnEnviarEquipe').onclick = handleEquipeUpload;
  document.getElementById('btnSairEquipeGrid').onclick = () => {
    AppState.aba = "";
    renderApp();
  };
}

async function handleEquipeUpload() {
  const placa = AppState.placa;
  const aba = AppState.aba;
  const files = document.getElementById('fileEquipe').files;
  if (!placa) return alert("Digite a placa primeiro.");
  if (!files.length) return alert("Escolha pelo menos um arquivo.");
  const btn = document.getElementById('btnEnviarEquipe');
  btn.disabled = true;
  btn.textContent = "Enviando...";
  const status = document.getElementById('statusEquipe');
  status.textContent = "";
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let ext = file.name.split('.').pop().toLowerCase();
    let name = `${Date.now()}_${Math.floor(Math.random()*99999)}.${ext}`;
    let path = `${placa}/${aba}/${name}`;
    try {
      if (file.type.startsWith("image/")) file = await compressFile(file);
      await storage.ref(path).put(file);
    } catch (e) {
      status.textContent = "❌ Erro ao enviar algum arquivo";
    }
  }
  btn.disabled = false;
  btn.textContent = "Enviar Mídia";
  status.textContent = "✅ Mídia(s) enviada(s)!";
  document.getElementById('fileEquipe').value = "";
  renderEquipeGrid();
}

function renderEquipeGrid() {
  const placa = AppState.placa;
  const aba = AppState.aba;
  const grid = document.getElementById('gridEquipe');
  grid.innerHTML = "";
  storage.ref(`${placa}/${aba}`).listAll().then(list => {
    for (const item of list.items) {
      item.getDownloadURL().then(url => {
        const ext = item.name.split('.').pop().toLowerCase();
        let html = "";
        if(['mp4','webm','mov','avi'].includes(ext)) {
          html = `<video src="${url}" controls class="media-thumb" data-url="${url}"></video>`;
        } else {
          html = `<img src="${url}" class="media-thumb" data-url="${url}">`;
        }
        let div = document.createElement("div");
        div.className = "rounded bg-gray-900 overflow-hidden";
        div.innerHTML = html;
        let mediaEl = div.querySelector('img,video');
        mediaEl.onclick = () => showModal(url, ext.match(/mp4|webm|mov|avi/) ? "video" : "img");
        grid.appendChild(div);
      });
    }
  });
}