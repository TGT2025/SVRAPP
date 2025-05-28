export function showModal(url, tipo = "img") {
  let old = document.getElementById('modal-viewer');
  if (old) old.remove();
  let modal = document.createElement('div');
  modal.className = "modal";
  modal.id = 'modal-viewer';
  modal.innerHTML = `
    <div class="flex flex-col items-center">
      ${tipo === "video"
        ? `<video src="${url}" controls autoplay class="rounded-xl shadow-lg mb-2" style="max-width:90vw;max-height:70vh"></video>`
        : `<img src="${url}" class="rounded-xl shadow-lg mb-2" style="max-width:90vw;max-height:70vh">`
      }
      <button class="btn-grad px-8 py-2 rounded" id="btnFecharModal">Fechar</button>
    </div>
  `;
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  document.body.appendChild(modal);
  document.getElementById('btnFecharModal').onclick = () => modal.remove();
}