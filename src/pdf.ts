import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportPagePdf(page: HTMLElement, filename: string) {
  await document.fonts.ready;

  const canvas = await html2canvas(page, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    ignoreElements: (node) =>
      node instanceof HTMLElement &&
      (node.classList.contains("zoom-btn") ||
        node.classList.contains("line-remove") ||
        node.classList.contains("add-item")),
  });

  const image = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  pdf.addImage(image, "JPEG", 0, 0, 210, 297);
  pdf.save(filename);
}
