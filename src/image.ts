export function readImageFile(file: File, maxEdge = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const image = new Image();
      image.onerror = () => reject(new Error("Could not decode image"));
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        if (scale === 1 && raw.length < 1_200_000) {
          resolve(raw);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(raw);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const type = file.type === "image/png" ? "image/png" : "image/jpeg";
        resolve(canvas.toDataURL(type, 0.9));
      };
      image.src = raw;
    };
    reader.readAsDataURL(file);
  });
}
