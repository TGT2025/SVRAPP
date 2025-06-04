import { showEquipeFlow } from './modEquipe.js';
import { showClienteFlow } from './modCliente.js';

export const AppState = {
  userType: "cliente", // "cliente" ou "equipe"
  placa: "",
  aba: "",
  etapa: 0,
  equipeLogada: false
};

export function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="w-full max-w-md mx-auto p-4">
      <div class="flex mb-6 rounded-xl overflow-hidden border border-gray-600">
        <button class="flex-1 py-3 text-lg font-bold transition ${AppState.userType === "cliente" ? "bg-orange-500 text-white" : "bg-[#263722] text-gray-300"}" id="tabCliente">Cliente</button>
        <button class="flex-1 py-3 text-lg font-bold transition ${AppState.userType === "equipe" ? "bg-orange-500 text-white" : "bg-[#263722] text-gray-300"}" id="tabEquipe">Equipe</button>
      </div>
      <div id="flowArea" class="rounded-xl bg-[#1e2a1e] p-4 shadow-xl"></div>
      <div class="footer-nav mt-6 text-center">
        <button class="text-orange-400 underline" id="tabEquipeFooter">Área da Equipe</button>
      </div>
    </div>
  `;

  document.getElementById('tabCliente').onclick = () => changeTab('cliente');
  document.getElementById('tabEquipe').onclick = () => changeTab('equipe');
  document.getElementById('tabEquipeFooter').onclick = () => changeTab('equipe');

  if (AppState.userType === 'cliente') {
    showClienteFlow();
  } else {
    showEquipeFlow();
  }
}

export function changeTab(tab) {
  AppState.userType = tab;
  AppState.placa = "";
  AppState.aba = "";
  AppState.etapa = 0;
  if (tab === "equipe") {
    AppState.equipeLogada = false; // obriga login sempre que troca para equipe
  }
  renderApp();
}

// Inicialização
window.addEventListener("DOMContentLoaded", renderApp);