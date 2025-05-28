// ...após render do grid...
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
      const commentDiv = document.createElement("div");
      commentDiv.className = "w-full mt-4";
      commentDiv.innerHTML = `
        <div class="font-bold text-orange-400 mb-1">Comentários:</div>
        <div id="comentarioCliente" class="bg-gray-800 text-white px-3 py-2 rounded text-sm min-h-[2em]">Carregando...</div>
      `;
      grid.parentElement.appendChild(commentDiv);
      // Busca o comentário salvo no storage
      storage.ref(`${placa}/${aba}/Comentario.txt`).getDownloadURL()
        .then(url => fetch(url).then(r => r.text()).then(txt => {
          document.getElementById('comentarioCliente').textContent = txt || "(Sem comentários)";
        }))
        .catch(() => document.getElementById('comentarioCliente').textContent = "(Sem comentários)");
    }
  });
}