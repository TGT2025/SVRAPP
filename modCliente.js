import { AppState, renderApp } from './main.js';
import { compressFile } from './compress.js';
import { showModal } from './modal.js';

export function showClienteFlow() {
  const flow = document.getElementById('flowArea');

  if (!AppState.placa) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 flex flex-col items-center text-white">
        <img src="logo-svr.png" class="w-20 mx-auto mb-4" alt="SVR">
        <h1 class="text-xl font-bold mb-5 text-orange-500">Cliente - Digite a placa</h1>
        <input id="placaClienteInput" type="text" maxlength="8" placeholder="Placa" class="w-full bg-gray-800 rounded px-3 py-2 mb-4 text-center outline-none text-white text-xl tracking-widest uppercase">
        <button class="w-full btn-grad py-2 rounded mb-2" id="btnAvancarPlacaCliente">Avançar</button>
        <button class="w-full bg-gray-800 py-2 rounded" id="btnSairClientePlaca">Voltar</button>
      </div>
    `;
    document.getElementById('btnAvancarPlacaCliente').onclick = () => {
      const placa = document.getElementById('placaClienteInput').value.trim().toUpperCase();
      if (!placa) return alert("Digite a placa!");
      AppState.placa = placa;
      renderApp();
    };
    document.getElementById('btnSairClientePlaca').onclick = () => {
      AppState.placa = "";
      renderApp();
    };
    return;
  }

  if (!AppState.etapa) {
    flow.innerHTML = `
      <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-8 text-white">
        <h2 class="text-orange-400 font-bold mb-3 text-lg text-center">Escolha a etapa</h2>
        <div class="flex w-full flex-wrap gap-2 mb-4">
          <button class="btn-grad flex-1" data-etapa="CheckIN">CheckIN</button>
          <button class="btn-grad flex-1" data-etapa="CheckOUT">CheckOUT</button>
        </div>
        <button class="w-full bg-gray-800 py-2 rounded" id="btnSairEtapaCliente">Voltar</button>
      </div>
    `;
    flow.querySelectorAll('[data-etapa]').forEach(btn => {
      btn.onclick = () => {
        AppState.etapa = btn.getAttribute('data-etapa');
        renderApp();
      };
    });
    document.getElementById('btnSairEtapaCliente').onclick = () => {
      AppState.placa = "";
      renderApp();
    };
    return;
  }

  // Carrega e exibe o checklist salvo
  flow.innerHTML = `
    <div class="w-full max-w-md mx-auto bg-[#263722] rounded-xl shadow-lg p-6 text-white">
      <h2 class="text-orange-400 text-2xl font-bold mb-4 text-center">Checklist - ${AppState.etapa}</h2>
      <div id="checklistCliente" class="grid grid-cols-2 gap-3"></div>
      <button class="w-full bg-gray-800 mt-6 py-2 rounded" id="btnVoltarCliente">Voltar</button>
    </div>
  `;

  const grid = document.getElementById('checklistCliente');
  const path = `${AppState.placa}/${AppState.etapa}/checklist.json`;

  storage.ref(path).getDownloadURL()
    .then(url => fetch(url))
    .then(r => r.json())
    .then(checked => {
      fetch('checklist-itens.json')
        .then(r => r.json())
        .then(data => {
          data.itens.forEach(item => {
            const div = document.createElement('div');
            div.className = `py-2 px-3 border rounded-xl text-center ${checked.includes(item) ? 'bg-orange-500 text-white font-bold' : 'bg-gray-800 text-gray-400'}`;
            div.textContent = item;
            grid.appendChild(div);
          });
        });
    })
    .catch(() => {
      grid.innerHTML = '<p class="text-center text-red-400 col-span-2">Checklist ainda não preenchido pela equipe.</p>';
    });

  document.getElementById('btnVoltarCliente').onclick = () => {
    AppState.etapa = "";
    renderApp();
  };
}
