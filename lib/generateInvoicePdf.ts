// lib/generateInvoicePdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;       // e.g. "17 December 2025"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCountry: string;
  passportId: string;
  courseName: string;
  slotName: string;
  slotTime: string;
  quantity: number;
  unitPrice: number;
  vatAmount: number;
  totalAmount: number;
  bookingCode: string;
}

export function generateInvoicePdf(data: InvoiceData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const purple = [107, 82, 174] as [number, number, number];
  const lightPurple = [232, 224, 247] as [number, number, number];

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(...purple);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Abbreviated Tax Invoice / Receipt", pageW / 2, 12, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Nai Baan Studio Co., Ltd.", pageW / 2, 20, { align: "center" });
  doc.text("35 Moo 11, Bang Kru, Phra Pradaeng, Samut Prakan  |  Tax ID: 0115567006780", pageW / 2, 25, { align: "center" });

  // ── Invoice meta (top-right) ─────────────────────────────
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice No: ${data.invoiceNumber}`, pageW - 14, 36, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${data.invoiceDate}`, pageW - 14, 41, { align: "right" });
  doc.text(`Booking Code: ${data.bookingCode}`, pageW - 14, 46, { align: "right" });

  // ── Bill To ──────────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...purple);
  doc.text("Bill To", 14, 36);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const billLines = [
    `${data.customerName}`,
    `Email: ${data.customerEmail}`,
    `Phone: ${data.customerPhone}`,
    `Passport / ID: ${data.passportId}`,
    `${data.customerAddress}, ${data.customerCountry}`,
  ];
  billLines.forEach((line, i) => doc.text(line, 14, 42 + i * 5));

  // ── Items table ──────────────────────────────────────────
  autoTable(doc, {
    startY: 72,
    head: [["#", "Description", "Qty", "Unit Price (THB)", "Amount (THB)"]],
    body: [
      [
        "1",
        `${data.courseName}\n${data.slotName}${data.slotTime ? ` (${data.slotTime})` : ""}\nDate: ${data.invoiceDate}`,
        data.quantity,
        data.unitPrice.toLocaleString("en-US", { minimumFractionDigits: 2 }),
        (data.unitPrice * data.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 }),
      ],
    ],
    headStyles: {
      fillColor: purple,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "center", cellWidth: 15 },
      3: { halign: "right", cellWidth: 35 },
      4: { halign: "right", cellWidth: 35 },
    },
    alternateRowStyles: { fillColor: [250, 248, 255] },
    margin: { left: 14, right: 14 },
  });

  // ── Totals ───────────────────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 4;
  const subtotal = data.unitPrice * data.quantity;
  const colX = pageW - 14;

  const totalsRows: [string, string][] = [
    ["Subtotal:", `฿${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
    ["VAT 7%:", `฿${data.vatAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`],
  ];

  doc.setFontSize(9);
  totalsRows.forEach(([label, value], i) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(label, colX - 45, finalY + i * 6, { align: "left" });
    doc.text(value, colX, finalY + i * 6, { align: "right" });
  });

  // Total row with bg
  const totalY = finalY + totalsRows.length * 6 + 2;
  doc.setFillColor(...lightPurple);
  doc.roundedRect(pageW - 80, totalY - 5, 66, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...purple);
  doc.setFontSize(10);
  doc.text("Total (THB):", colX - 45, totalY + 1.5, { align: "left" });
  doc.text(
    `฿${data.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    colX,
    totalY + 1.5,
    { align: "right" }
  );

  // ── Signature line ───────────────────────────────────────
  const sigY = totalY + 22;
  doc.setDrawColor(...purple);
  doc.setLineWidth(0.3);
  doc.line(14, sigY, 70, sigY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Authorized Signature", 14, sigY + 5);

  // ── Footer ───────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFillColor(...purple);
  doc.rect(0, footerY - 4, pageW, 16, "F");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for booking with Nai Baan Studio!", pageW / 2, footerY + 2, { align: "center" });
  doc.text("For inquiries: info@naibaanstudio.com", pageW / 2, footerY + 6.5, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}