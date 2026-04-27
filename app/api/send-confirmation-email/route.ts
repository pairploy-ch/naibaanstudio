import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const resend = new Resend(process.env.RESEND_API_KEY)

function formatDate(dateString: string) {
  let date: Date
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/")
    date = new Date(`${year}-${month}-${day}`)
  } else {
    date = new Date(dateString)
  }
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  })
}

// ── amountInWords (matches TaxInvoiceForm logic) ──
function amountInWords(amount: number): string {
  if (amount === 0) return "Zero Baht Only"
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  const convertBelow1000 = (n: number): string => {
    if (n === 0) return ""
    if (n < 20) return ones[n] + " "
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "") + " "
    return ones[Math.floor(n / 100)] + " Hundred " + convertBelow1000(n % 100)
  }

  const convert = (n: number): string => {
    if (n === 0) return ""
    if (n < 1000) return convertBelow1000(n)
    if (n < 1_000_000) return convertBelow1000(Math.floor(n / 1000)) + "Thousand " + convertBelow1000(n % 1000)
    if (n < 1_000_000_000) return convertBelow1000(Math.floor(n / 1_000_000)) + "Million " + convert(n % 1_000_000)
    return convertBelow1000(Math.floor(n / 1_000_000_000)) + "Billion " + convert(n % 1_000_000_000)
  }

  const intPart = Math.floor(amount)
  const decPart = Math.round((amount - intPart) * 100)
  let result = convert(intPart).trim() + " Baht"
  if (decPart > 0) result += " and " + convert(decPart).trim() + " Satang"
  else result += " Only"
  return result
}

async function generateBookingPDF(data: {
  customerName: string
  to: string
  courseName: string
  bookingDate: string
  slotName: string
  classTime: string
  quantity: number
  totalPrice: number
  bookingCode: string
  bookingId: string
  customerPhone?: string
  customerAddress?: string
  customerCountry?: string
  passportId?: string
  unitPrice?: number
  vatAmount?: number
   menus?: string[]
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // ── Color palette (matches TaxInvoiceForm: purple theme) ──
  const colorPurple      = rgb(0.420, 0.322, 0.682) // #6B52AE
  const colorDarkPurple  = rgb(0.239, 0.180, 0.478) // #3D2E7A
  const colorLightPurple = rgb(0.910, 0.878, 0.969) // #E8E0F7
  const colorRowAlt      = rgb(0.973, 0.969, 1.000) // #F8F5FF
  const colorBorder      = rgb(0.612, 0.518, 0.820) // #9B87D4
  const colorBorderLight = rgb(0.839, 0.804, 0.941) // #D6CDF0
  const colorBlack       = rgb(0.102, 0.102, 0.102) // #1A1A1A
  const colorGray        = rgb(0.333, 0.333, 0.333) // #555
  const colorLightGray   = rgb(0.400, 0.400, 0.400) // #666
  const colorWhite       = rgb(1, 1, 1)
  const colorBg          = rgb(0.941, 0.937, 0.961) // #F0EFF5

  const margin  = 40
  const contentW = width - margin * 2  // 515

  // ─────────────────────────────────────────────
  // PAGE BACKGROUND
  // ─────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height, color: colorBg })
  // White card inset
  page.drawRectangle({ x: margin - 8, y: 30, width: contentW + 16, height: height - 60, color: colorWhite })

  // ─────────────────────────────────────────────
  // TITLE  "Abbreviated Tax Invoice / Receipt"
  // ─────────────────────────────────────────────
  const title = 'Abbreviated Tax Invoice / Receipt'
  const titleSize = 14
  const titleW = fontBold.widthOfTextAtSize(title, titleSize)
  page.drawText(title, {
    x: width / 2 - titleW / 2,
    y: height - 58,
    size: titleSize,
    font: fontBold,
    color: colorPurple,
  })

  // ─────────────────────────────────────────────
  // HEADER GRID  (company left | meta right)
  // matches: .header-grid  grid-template-columns: 1fr 280px
  // ─────────────────────────────────────────────
  const headerTop = height - 78
  const metaColX  = width - margin - 200  // right column ~200px wide

  // Company block (left)
  page.drawText('Nai Baan Studio Co., Ltd.', {
    x: margin, y: headerTop, size: 11, font: fontBold, color: colorBlack,
  })
  const companyLines = [
    '35 Moo 11, Bang Kru Sub-district, Phra Pradaeng District',
    'Samut Prakan Province',
    'Tax Identification Number  0115567006780 (Head Office)',
  ]
  let compY = headerTop - 14
  for (let i = 0; i < companyLines.length; i++) {
    const isLast = i === companyLines.length - 1
    page.drawText(companyLines[i], {
      x: margin, y: compY, size: 8,
      font: isLast ? fontBold : fontReg,
      color: isLast ? colorBlack : colorGray,
    })
    compY -= 12
  }

  // Meta block (right) — No. / Date / Booking Code
  const now = new Date()
const thaiYear = now.getFullYear() + 543
const mm = String(now.getMonth() + 1).padStart(2, '0')
const dd = String(now.getDate()).padStart(2, '0')
const invoiceNo = `IV${thaiYear}${mm}${dd}`
  const metaRows: [string, string][] = [
    ['No. :', invoiceNo],
    ['Date :', new Date().toLocaleDateString('en-GB', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Bangkok'
})],
    ['Booking Code :', data.bookingCode || data.bookingId],
  ]
  let metaY = headerTop
  for (const [label, value] of metaRows) {
    const labelW = fontBold.widthOfTextAtSize(label, 9)
    page.drawText(label, { x: metaColX, y: metaY, size: 9, font: fontBold, color: colorBlack })
    // Underline (border-bottom: 1.5px solid #c9b8f0)
    const fieldX = metaColX + labelW + 4
    const fieldW = width - margin - fieldX
    page.drawLine({
      start: { x: fieldX, y: metaY - 3 },
      end: { x: fieldX + fieldW, y: metaY - 3 },
      thickness: 0.8,
      color: rgb(0.788, 0.722, 0.941),
    })
    page.drawText(value, { x: fieldX + 2, y: metaY, size: 9, font: fontReg, color: colorBlack })
    metaY -= 16
  }

  // ─────────────────────────────────────────────
  // DIVIDER after header
  // ─────────────────────────────────────────────
  const dividerY = headerTop - 58
  page.drawLine({
    start: { x: margin, y: dividerY },
    end: { x: width - margin, y: dividerY },
    thickness: 0.5,
    color: colorBorderLight,
  })

  // ─────────────────────────────────────────────
  // CUSTOMER ROW  (.customer-row)
  // ─────────────────────────────────────────────
  const custY = dividerY - 16
  page.drawText('Customer :', { x: margin, y: custY, size: 9, font: fontBold, color: colorBlack })
  const custLabelW = fontBold.widthOfTextAtSize('Customer :', 9)
  const custFieldX = margin + custLabelW + 6
  // underline
  page.drawLine({
    start: { x: custFieldX, y: custY - 3 },
    end: { x: width - margin, y: custY - 3 },
    thickness: 0.8,
    color: rgb(0.788, 0.722, 0.941),
  })
  // customer name + email + phone (compact)
  const custDetail = `${data.customerName}   |   ${data.to}   |   ${data.customerPhone || '-'}   |   Passport: ${data.passportId || '-'}`
  page.drawText(custDetail, { x: custFieldX + 2, y: custY, size: 8, font: fontReg, color: colorBlack })

  // ─────────────────────────────────────────────
  // ITEMS TABLE  (.table-wrapper  table)
  // ─────────────────────────────────────────────
  const tableTop = custY - 20

  // Column definitions (matches: #, Description, Qty, Unit, Unit Price, Amount, [remove])
  // We drop the remove button column; add Unit column
  const cols = [
    { label: '#',               x: margin,       w: 22,  align: 'center' },
    { label: 'Description',     x: margin + 22,  w: 222, align: 'left'   },
    { label: 'Qty',             x: margin + 244, w: 42,  align: 'center' },
    { label: 'Unit',            x: margin + 286, w: 42,  align: 'center' },
    { label: 'Unit Price',      x: margin + 328, w: 82,  align: 'right'  },
    { label: 'Amount',          x: margin + 410, w: 105, align: 'right'  },
  ]
  const tableW = contentW // full width

  // ── thead  (background: #E8E0F7, text: #3D2E7A)
  const theadH = 22
  page.drawRectangle({
    x: margin, y: tableTop - theadH,
    width: tableW, height: theadH,
    color: colorLightPurple,
    borderColor: colorBorder,
    borderWidth: 0.8,
  })
  for (const col of cols) {
    const tSize = 8
    let tx: number
    if (col.align === 'center') tx = col.x + col.w / 2 - fontBold.widthOfTextAtSize(col.label, tSize) / 2
    else if (col.align === 'right') tx = col.x + col.w - fontBold.widthOfTextAtSize(col.label, tSize) - 4
    else tx = col.x + 4
    page.drawText(col.label, { x: tx, y: tableTop - theadH + 7, size: tSize, font: fontBold, color: colorDarkPurple })
    // vertical dividers between columns (border-right: 1px solid)
    if (col !== cols[cols.length - 1]) {
      page.drawLine({
        start: { x: col.x + col.w, y: tableTop },
        end: { x: col.x + col.w, y: tableTop - theadH },
        thickness: 0.5,
        color: rgb(0.765, 0.706, 0.918), // #C3B4EA
      })
    }
  }

  // ── tbody row  (alternate: #F8F5FF)
 const totalPrice = Number(data.totalPrice)
const vatAmount  = Math.round((totalPrice / 1.07) * 0.07 * 100) / 100
const subtotal   = Math.round((totalPrice / 1.07) * 100) / 100
const unitPrice  = subtotal / (data.quantity || 1)
const quantity   = data.quantity

  // Description lines (multi-line like the original)
  const descLines = [
    { text: data.courseName, bold: true },
    { text: data.slotName, bold: false },
    ...(data.classTime ? [{ text: `Time: ${data.classTime}`, bold: false }] : []),
    { text: `Date: ${formatDate(data.bookingDate)}`, bold: false },
    ...(data.menus?.length
  ? [{ text: `Menu: ${data.menus.join(", ")}`, bold: false }]
  : []),
    
  ]

  const rowLineH = 13
  const rowPadV  = 6
  const rowH = rowPadV * 2 + descLines.length * rowLineH

  const rowY = tableTop - theadH

  // Row background (alternate shade)
  page.drawRectangle({
    x: margin, y: rowY - rowH,
    width: tableW, height: rowH,
    color: colorRowAlt,
    borderColor: colorBorderLight,
    borderWidth: 0.5,
  })

  // Row vertical dividers
  for (const col of cols) {
    if (col !== cols[cols.length - 1]) {
      page.drawLine({
        start: { x: col.x + col.w, y: rowY },
        end: { x: col.x + col.w, y: rowY - rowH },
        thickness: 0.5,
        color: colorBorderLight,
      })
    }
  }

  // Cell: #
  const idxX = cols[0].x + cols[0].w / 2 - fontReg.widthOfTextAtSize('1', 8) / 2
  page.drawText('1', { x: idxX, y: rowY - rowPadV - rowLineH / 2 + 3, size: 8, font: fontReg, color: colorLightGray })

  // Cell: Description (multi-line)
  const descX = cols[1].x + 4
  for (let i = 0; i < descLines.length; i++) {
    const line = descLines[i]
    page.drawText(line.text, {
      x: descX,
      y: rowY - rowPadV - i * rowLineH - 2,
      size: i === 0 ? 9 : 8,
      font: line.bold ? fontBold : fontReg,
      color: colorBlack,
    })
  }

  // Cell: Qty
  const qtyStr = `${quantity}`
  const qtyX = cols[2].x + cols[2].w / 2 - fontReg.widthOfTextAtSize(qtyStr, 9) / 2
  page.drawText(qtyStr, { x: qtyX, y: rowY - rowPadV - 2, size: 9, font: fontReg, color: colorBlack })

  // Cell: Unit
  const unitStr = 'course'

  const unitX = cols[3].x + cols[3].w / 2 - fontReg.widthOfTextAtSize(unitStr, 9) / 2
  page.drawText(unitStr, { x: unitX, y: rowY - rowPadV - 2, size: 9, font: fontReg, color: colorBlack })

  // Cell: Unit Price (right-aligned)
  const upStr = unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
  page.drawText(upStr, {
    x: cols[4].x + cols[4].w - fontReg.widthOfTextAtSize(upStr, 9) - 4,
    y: rowY - rowPadV - 2, size: 9, font: fontReg, color: colorBlack,
  })

  // Cell: Amount (right-aligned)
  const amtStr = subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })
  page.drawText(amtStr, {
    x: cols[5].x + cols[5].w - fontReg.widthOfTextAtSize(amtStr, 9) - 4,
    y: rowY - rowPadV - 2, size: 9, font: fontReg, color: colorBlack,
  })

  // ─────────────────────────────────────────────
  // FOOTER TABLE  (.footer-table)
  // Layout: left cell (Remarks) | label | value
  // ─────────────────────────────────────────────
  const ftTop    = rowY - rowH
  const ftLabelX = margin + tableW * 0.55
  const ftValueX = margin + tableW * 0.75
  const ftValueW = width - margin - ftValueX
  const ftRowH   = 18
  const footerRows: Array<{ label: string; value: string; bold?: boolean; total?: boolean }> = [
    { label: 'Subtotal', value: `${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'VAT 7%',   value: `${vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    { label: 'Net Total', value: `${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, bold: true, total: true },
  ]

  // Remarks cell spans full height
  const ftTotalH = ftRowH * footerRows.length
  page.drawRectangle({
    x: margin, y: ftTop - ftTotalH,
    width: tableW, height: ftTotalH,
    color: colorWhite,
    borderColor: colorBorder,
    borderWidth: 0.8,
  })

  // Remarks label + value
  page.drawText('Remarks:', { x: margin + 4, y: ftTop - 6, size: 8, font: fontBold, color: colorDarkPurple })
  // Amount in words (matches footer total-row in TaxInvoiceForm)
  const words = amountInWords(totalPrice)
  page.drawText(`(${words})`, { x: margin + 4, y: ftTop - 17, size: 7, font: fontReg, color: colorGray })

  // Subtotal / VAT / Net Total rows
  for (let i = 0; i < footerRows.length; i++) {
    const row = footerRows[i]
    const fy  = ftTop - i * ftRowH

    // Total row background (#E8E0F7)
    if (row.total) {
      page.drawRectangle({
        x: margin, y: fy - ftRowH,
        width: tableW, height: ftRowH,
        color: colorLightPurple,
      })
    }

    // Row top border
    page.drawLine({
      start: { x: margin, y: fy },
      end: { x: width - margin, y: fy },
      thickness: row.total ? 0.8 : 0.5,
      color: row.total ? colorBorder : colorBorderLight,
    })

    // Vertical divider between label and value columns
    page.drawLine({
      start: { x: ftLabelX, y: fy },
      end: { x: ftLabelX, y: fy - ftRowH },
      thickness: 0.5,
      color: colorBorderLight,
    })
    page.drawLine({
      start: { x: ftValueX, y: fy },
      end: { x: ftValueX, y: fy - ftRowH },
      thickness: 0.5,
      color: colorBorderLight,
    })

    // Label (right-aligned in label cell)
    const lblW = (row.bold ? fontBold : fontReg).widthOfTextAtSize(row.label, 9)
    page.drawText(row.label, {
      x: ftValueX - lblW - 6,
      y: fy - ftRowH + 5,
      size: 9,
      font: row.bold ? fontBold : fontReg,
      color: colorDarkPurple,
    })

    // Value (right-aligned in value cell)
    const valW = (row.bold ? fontBold : fontReg).widthOfTextAtSize(row.value, 9)
    page.drawText(row.value, {
      x: width - margin - valW - 4,
      y: fy - ftRowH + 5,
      size: 9,
      font: row.bold ? fontBold : fontReg,
      color: colorBlack,
    })
  }

  // ─────────────────────────────────────────────
  // SIGNATURE  (.signature-area  .signature-block)
  // ─────────────────────────────────────────────
  const sigY = ftTop - ftTotalH - 28
  page.drawLine({
    start: { x: margin, y: sigY },
    end: { x: margin + 160, y: sigY },
    thickness: 0.8,
    color: colorBorder,
    dashArray: [4, 3],
  })
  page.drawText('Authorized Signature', {
    x: margin, y: sigY - 12, size: 8, font: fontReg, color: colorLightGray,
  })

  // ─────────────────────────────────────────────
  // NOTE
  // ─────────────────────────────────────────────


  // ─────────────────────────────────────────────
  // FOOTER BAR  (matches .footer in TaxInvoiceForm: background: #CCC3B2)
  // ─────────────────────────────────────────────


  return pdfDoc.save()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      to,
      customerName,
      courseName,
      bookingDate,
      slotName,
      classTime,
      quantity,
      totalPrice,
      bookingId,
      bookingCode,
      customerPhone,
      customerAddress,
      customerCountry,
      passportId,
      unitPrice,
      vatAmount,
      menus,
    } = body

    const formattedDate = formatDate(bookingDate)

    // ── สร้าง PDF ──
    const pdfBytes = await generateBookingPDF({
      to, customerName, courseName, bookingDate, slotName, classTime,
      quantity, totalPrice, bookingId, bookingCode,
      customerPhone, customerAddress, customerCountry,
      passportId, unitPrice, vatAmount, menus,
    })

    const pdfBase64 = Buffer.from(pdfBytes).toString('base64')

    const { data, error } = await resend.emails.send({
      from: 'Nai Baan Studio <booking@naibaanstudio.com>',
      to: [to],
      cc: ['naibaanstudio@gmail.com'],
      subject: `Booking Confirmed – Nai Baan Studio`,
      attachments: [
        {
          filename: `booking-${bookingCode || bookingId}.pdf`,
          content: pdfBase64,
        },
      ],
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; background: #CCC3B2; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; overflow: hidden; }
              .header { background: #8D9075; padding: 32px; text-align: center; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { color: #666; font-size: 14px; }
              .value { font-weight: bold; color: #333; font-size: 14px; }
              .total-row { display: flex; justify-content: space-between; padding: 16px 0; }
              .total-label { font-size: 16px; font-weight: bold; }
              .total-value { font-size: 16px; font-weight: bold; color: #8B7355; }
              .footer { background: #CCC3B2; padding: 20px; text-align: center; font-size: 12px; color: #fff; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://naibaanstudio.com/logo-nb-wh.png" alt="Logo" style="max-width: 120px;" />
              </div>
              <div style="padding: 32px;">
                <p>Dear <strong>${customerName}</strong>,</p>
                <p>Thank you for booking with us! Your booking confirmation is attached as a PDF. Here's a summary:</p>

                <div class="row"><span class="label">Booking Code</span><span class="value">${bookingCode}</span></div>
                <div class="row"><span class="label">Course</span><span class="value">${courseName}</span></div>
                <div class="row">
  <span class="label">Menu</span>
  <span class="value">${menus && menus.length > 0 ? menus.join(", ") : "-"}</span>
</div>
                <div class="row"><span class="label">Date</span><span class="value">${formattedDate}</span></div>
                <div class="row"><span class="label">Time</span><span class="value">${classTime}</span></div>
                <div class="row"><span class="label">Class</span><span class="value">${slotName}</span></div>
                <div class="row"><span class="label">Quantity</span><span class="value">${quantity} ticket(s)</span></div>
                <div class="total-row">
                  <span class="total-label">Total Paid</span>
                  <span class="total-value">฿${Number(totalPrice).toLocaleString()}.00</span>
                </div>

                <p style="margin-top: 24px; color: #666; font-size: 14px;">
                  Please arrive 10 minutes before the class starts. See you soon! 🙏
                </p>
              </div>

              <div style="padding:32px; border-top:1px solid #eee; text-align:center;">
                <h3 style="margin:0 0 12px 0; font-size:16px; color:#333;">Location</h3>
                <img src="https://naibaanstudio.com/maps-lo.png" alt="Location Map"
                  style="max-width:100%; border-radius:6px; margin-bottom:12px;" />
                <p style="font-size:13px; color:#666; margin:0 0 16px 0; line-height:1.6;">
                  2nd floor 230 Nares Road, Si Phraya,<br/>Bang Rak, Bangkok 10500, Thailand
                </p>
                <a href="https://www.google.com/maps/place/Naibaan+Studio/@13.7284673,100.5238057,17z"
                  style="display:inline-block;margin-bottom:20px;padding:10px 18px;background:#8D9075;color:white;text-decoration:none;border-radius:4px;font-size:13px;font-weight:bold;">
                  Open in Google Maps
                </a>
                <p style="font-size:13px; color:#333; font-weight:bold; margin-bottom:8px;">Distance from Nai Baan Studio</p>
                <p style="font-size:13px; color:#666; line-height:1.6; margin:0;">
                  2 km to River City Bangkok<br/>2.6 km to Talat Noi<br/>
                  3.1 km to Central Yaowarat<br/>4.4 km to Central Songwat
                </p>
              </div>

              <div class="footer">Nai Baan Studio · If you have questions, reply to this email.</div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('Email route error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}