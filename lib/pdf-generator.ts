import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { type Expense, MONTHS } from "./types"

export function generateMonthlyPDF(expenses: Expense[], month: number, year: number, farmName: string): void {
  const doc = new jsPDF()

  const monthName = MONTHS[month - 1].toUpperCase()
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const division = total / 2

  const numExpenses = expenses.length
  let fontSize = 9
  let cellPadding = 4
  let startY = 75

  if (numExpenses > 20) {
    fontSize = 7
    cellPadding = 2
    startY = 70
  } else if (numExpenses > 15) {
    fontSize = 8
    cellPadding = 3
    startY = 72
  }

  // Header con color primario - más compacto
  doc.setFillColor(45, 120, 80)
  doc.rect(0, 0, 210, 45, "F")

  // Logo circular moderno
  doc.setFillColor(255, 255, 255)
  doc.circle(105, 15, 10, "F")
  doc.setFillColor(45, 120, 80)
  doc.circle(105, 15, 7, "F")

  // Icono de hoja simplificado
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(1.2)
  doc.line(103, 12, 105, 18)
  doc.line(105, 14, 107, 17)

  // Nombre de la app
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.text("AgroGestión", 105, 33, { align: "center" })

  // Nombre de la finca
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(farmName, 105, 41, { align: "center" })

  // Título del informe
  doc.setFontSize(14)
  doc.setTextColor(45, 120, 80)
  doc.setFont("helvetica", "bold")
  doc.text(`INFORME DE GASTOS - ${monthName} ${year}`, 105, 58, { align: "center" })

  // Línea decorativa
  doc.setDrawColor(45, 120, 80)
  doc.setLineWidth(0.5)
  doc.line(50, 63, 160, 63)

  const tableData = expenses.map((e) => [
    e.description,
    e.invoiceNumber || "-",
    `${e.amount.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`,
  ])

  autoTable(doc, {
    startY: startY,
    head: [["Descripción", "Nº Factura", "Importe"]],
    body: tableData,
    theme: "plain",
    headStyles: {
      fillColor: [45, 120, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: fontSize + 1,
      cellPadding: cellPadding,
      halign: "left",
    },
    bodyStyles: {
      fontSize: fontSize,
      cellPadding: cellPadding,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248],
    },
    styles: {
      lineColor: [230, 230, 230],
      lineWidth: 0.1,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 40, halign: "center" },
      2: { cellWidth: 40, halign: "right", fontStyle: "bold" },
    },
    margin: { bottom: 70 },
  })

  const finalY = (doc as any).lastAutoTable.finalY || 120

  const totalsY = Math.min(finalY + 8, 220)

  // Caja de totales más compacta
  doc.setFillColor(248, 250, 248)
  doc.roundedRect(105, totalsY, 90, 40, 3, 3, "F")

  doc.setDrawColor(45, 120, 80)
  doc.setLineWidth(0.5)
  doc.roundedRect(105, totalsY, 90, 40, 3, 3, "S")

  // Total
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.setFont("helvetica", "normal")
  doc.text("TOTAL", 115, totalsY + 12)

  doc.setFontSize(16)
  doc.setTextColor(45, 120, 80)
  doc.setFont("helvetica", "bold")
  doc.text(`${total.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`, 188, totalsY + 12, { align: "right" })

  // Línea separadora
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(115, totalsY + 20, 188, totalsY + 20)

  // División debajo del total
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.setFont("helvetica", "normal")
  doc.text("DIVISIÓN (÷2)", 115, totalsY + 32)

  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.setFont("helvetica", "bold")
  doc.text(`${division.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`, 188, totalsY + 32, { align: "right" })

  // Footer
  doc.setFillColor(45, 120, 80)
  doc.rect(0, 280, 210, 17, "F")

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(255, 255, 255)
  doc.text(`Generado por AgroGestión`, 20, 290)
  doc.text(`${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`, 190, 290, {
    align: "right",
  })

  doc.save(`Facturacion_${monthName}_${year}.pdf`)
}
