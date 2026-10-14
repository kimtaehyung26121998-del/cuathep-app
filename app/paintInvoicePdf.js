import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";

// Build individual A4 pages before capture so long orders do not create a
// canvas larger than mobile browsers can handle. Keep each product row intact.
export async function savePaintInvoicePdf(invoice, orientation, brand) {
  const pdf = new jsPDF({ orientation, unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - 10;
  const contentHeight = pageHeight - 12;
  const captureWidth = orientation === "landscape" ? 1123 : 794;
  const maxHeight = captureWidth * contentHeight / contentWidth;
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-20000px;top:0;pointer-events:none;background:#fff;";
  document.body.appendChild(host);

  try {
    if (document.fonts?.ready) await document.fonts.ready;
    const template = invoice.cloneNode(true);
    template.classList.add("paint-invoice-exporting");
    template.style.width = `${captureWidth}px`;
    template.style.maxWidth = `${captureWidth}px`;
    const originalRows = Array.from(template.querySelectorAll("tbody tr"));
    const summary = template.querySelector(".paint-invoice-summary-new");
    const signature = template.querySelector(".paint-invoice-signature");
    summary.remove();
    signature.remove();
    template.querySelector(".paint-invoice-summary")?.remove();
    template.querySelector(".paint-invoice-mobile-cards")?.remove();
    template.querySelector("tbody").replaceChildren();

    const pages = [];
    const makePage = () => {
      const page = template.cloneNode(true);
      if (pages.length) {
        page.querySelector(".paint-invoice-header")?.remove();
        page.querySelector(".paint-invoice-customer")?.remove();
      }
      host.appendChild(page);
      pages.push(page);
      return page;
    };
    let page = makePage();
    for (const row of originalRows) {
      const body = page.querySelector("tbody");
      body.appendChild(row);
      if (page.getBoundingClientRect().height > maxHeight) {
        row.remove();
        // Retain the company/customer header on page one even when the first
        // product must start on the following page.
        if (!body.children.length) page.querySelector(".paint-invoice-table-wrap").remove();
        page = makePage();
        page.querySelector("tbody").appendChild(row);
        if (page.getBoundingClientRect().height > maxHeight) {
          throw new Error("Một dòng sản phẩm quá dài để vừa trang A4.");
        }
      }
    }

    // Payment and signatures travel together and appear only at the end.
    page.append(summary, signature);
    if (page.getBoundingClientRect().height > maxHeight) {
      summary.remove();
      signature.remove();
      page = makePage();
      page.querySelector(".paint-invoice-table-wrap").remove();
      page.append(summary, signature);
    }
    if (pages.some((item) => item.getBoundingClientRect().height > maxHeight)) {
      throw new Error("Thông tin hóa đơn quá dài để vừa trang A4.");
    }

    await Promise.all(Array.from(host.querySelectorAll("img")).map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }
      await image.decode?.().catch(() => undefined);
    }));

    for (const [index, item] of pages.entries()) {
      const canvas = await toCanvas(item, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
      });
      if (index) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 5, 5,
        contentWidth, canvas.height * contentWidth / canvas.width, undefined, "FAST");
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Trang ${index + 1}/${pages.length}`, pageWidth / 2, pageHeight - 3, { align: "center" });
      canvas.width = 0;
      canvas.height = 0;
    }
    const today = new Date();
    const date = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    pdf.save(`hoa-don-son-${brand}-${date}-${Date.now()}.pdf`);
  } finally {
    host.remove();
  }
}
