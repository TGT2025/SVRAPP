import { AppState, renderApp, goCliente, goHome } from './main.js';
import { compressFile } from './compress.js';
import { showModal } from './modal.js';

// HOME: Só logo, Quality Control, input placa, avançar
export function showClienteHome() {
  const flow = document.getElementById('flowArea');
  flow.innerHTML = `
    <div class="w-full min-h-screen flex flex-col justify-center items-center">
      <img src="logo-svr.png" class="w-24 mx-auto mb-5 mt-16" alt="SVR">
      <h1 class="text-2xl font-bold mb-2 text-orange-500 tracking-wide">SVR LAB</h1>
      <div class="text-lg text-gray-100 mb-6">Quality Control</div>
      <input id="placaClienteHomeInput" type="text" maxlength="8" placeholder="Placa" class="w-72 max-w-full bg-gray-800 rounded px-3 py-3 mb-4 text-center outline-none text-white text-xl tracking-widest uppercase">
      <button class="w-72 max-w-full btn-grad py-3 rounded text-lg font-bold mb-2" id="btnAvancarPlacaClienteHome">Avançar</button>
    </div>
  `;
  document.getElementById('placaClienteHomeInput').focus();
  document.getElementById('btnAvancarPlacaClienteHome').onclick = () => {
    const placa = document.getElementById('placaClienteHomeInput').value.trim().toUpperCase();
    if (!placa) return alert("Digite a placa!");
    AppState.placa = placa;
    AppState.aba = "";
    AppState.tela = "cliente";
    renderApp();
  };
}

// FLUXO CLIENTE comum (depois de placa)
export function showClienteFlow() {
  const flow = document.getElementById('flowArea');
  if (!AppState.placa) {
    goHome(); // fallback segurança
    return;
  }

  if (!AppState.aba) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 class="text-orange-400 font-bold mb-3 text-lg">Selecione o tipo de mídia</h2>
        <div class="flex w-full flex-col gap-3 mb-4">
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="CheckIN">CheckIN</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="CheckOUT">CheckOUT</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="Processos">Processos</button>
          <button class="btn-grad w-full py-4 text-lg font-bold" data-aba="ShowOff">ShowOff</button>
        </div>
        <button class="w-full bg-gray-800 text-white py-2 rounded" id="btnSairAbaCliente">Voltar</button>
      </div>
    `;
    flow.querySelectorAll('[data-aba]').forEach(btn => {
      btn.onclick = () => {
        AppState.aba = btn.getAttribute('data-aba');
        renderApp();
      };
    });
    document.getElementById('btnSairAbaCliente').onclick = goHome;
    return;
  }

  // Grid de mídia para o Cliente (igual Equipe)
  flow.innerHTML = `
    <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center">
      <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
      <h1 class="text-xl font-bold mb-5 text-orange-500">Cliente - ${AppState.aba}</h1>
      <input id="placaCliente" type="text" maxlength="8" placeholder="Digite a placa" class="w-full bg-gray-800 rounded px-3 py-2 mb-4 text-center outline-none text-white text-xl tracking-widest uppercase" value="${AppState.placa||""}" disabled>
      <div id="uploadCliente" class="w-full flex flex-col items-center mb-4">
        <input id="fileCliente" type="file" accept="image/*,video/*" multiple class="fileinput w-full mb-2">
        <button class="w-full btn-grad py-3 rounded text-lg font-bold" id="btnEnviarCliente">Enviar Mídia</button>
        <div id="statusCliente" class="text-sm text-center mt-1 mb-2 text-green-400"></div>
      </div>
      <div id="gridCliente" class="w-full grid grid-cols-2 gap-2 mt-2"></div>
      <div id="boxComentarioCliente"></div>
      <button class="w-full bg-gray-800 text-white mt-6 py-2 rounded" id="btnSairClienteGrid">Voltar</button>
    </div>
  `;
  renderClienteGrid();
  document.getElementById('btnEnviarCliente').onclick = handleClienteUpload;
  document.getElementById('btnSairClienteGrid').onclick = () => {
    AppState.aba = "";
    renderApp();
  };
}

async function handleClienteUpload() {
  const placa = AppState.placa;
  const aba = AppState.aba;
  const files = document.getElementById('fileCliente').files;
  if (!placa) return alert("Digite a placa primeiro.");
  if (!files.length) return alert("Escolha pelo menos um arquivo.");
  const btn = document.getElementById('btnEnviarCliente');
  btn.disabled = true;
  btn.textContent = "Enviando...";
  const status = document.getElementById('statusCliente');
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
  document.getElementById('fileCliente').value = "";
  status.textContent = "✅ Mídia(s) enviada(s)!";
  renderClienteGrid();
}

function renderClienteGrid() {
  const placa = AppState.placa;
  const aba = AppState.aba;
  const grid = document.getElementById('gridCliente');
  if (!grid) return;
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
    // Adiciona o box de comentário se for CheckIN ou CheckOUT
    if (aba === "CheckIN" || aba === "CheckOUT") {
      const boxComentario = document.getElementById("boxComentarioCliente");
      boxComentario.innerHTML = `
        <div class="w-full mt-4">
          <div class="font-bold text-orange-400 mb-1">Comentários:</div>
          <div id="comentarioCliente" class="bg-gray-800 text-white px-3 py-2 rounded text-sm min-h-[2em]">Carregando...</div>
        </div>
      `;
      // Busca o comentário salvo no storage
      storage.ref(`${placa}/${aba}/Comentario.txt`).getDownloadURL()
        .then(url => fetch(url).then(r => r.text()).then(txt => {
          document.getElementById('comentarioCliente').textContent = txt || "(Sem comentários)";
        }))
        .catch(() => document.getElementById('comentarioCliente').textContent = "(Sem comentários)");
    }
  });
}