// Função para comprimir arquivos de imagem usando browser-image-compression
export async function compressFile(file) {
  if (!file.type.startsWith("image/")) return file; // Só comprime imagens
  const options = {
    maxSizeMB: 0.5, // máx 500KB
    maxWidthOrHeight: 1280, // redimensiona se maior que isso
    useWebWorker: true
  };
  try {
    return await window.imageCompression(file, options);
  } catch (e) {
    // Se der erro na compressão, envia original mesmo
    return file;
  }
}