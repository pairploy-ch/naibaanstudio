import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const {
      to,
      customerName,
      courseName,
      bookingDate,
      slotName,
      quantity,
      totalPrice,
      bookingId,
    } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'Thai Cooking Class <booking@naibaanstudio.com>', // ✅ ใส่ domain ที่ verify ใน Resend
      to: [to],
      subject: `Booking Confirmed – Nai Baan Studio`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; background: #f5f1ec; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; }
              .header { background: #8B7355; padding: 32px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .body { padding: 32px; }
              .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .label { color: #666; font-size: 14px; }
              .value { font-weight: bold; color: #333; font-size: 14px; }
              .total-row { display: flex; justify-content: space-between; padding: 16px 0; }
              .total-label { font-size: 16px; font-weight: bold; }
              .total-value { font-size: 16px; font-weight: bold; color: #8B7355; }
              .footer { background: #f5f1ec; padding: 20px; text-align: center; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
              <img 
    src="https://naibaanstudio.com/logo-nb-wh.png" 
    alt="Logo" 
    style="max-width: 120px; margin-bottom: 12px;"
  />
            
              </div>
              <div class="body">
                <p>Dear <strong>${customerName}</strong>,</p>
                <p>Thank you for booking with us! Here are your booking details:</p>

                <div class="row">
                  <span class="label">Booking ID</span>
                  <span class="value">#${bookingId}</span>
                </div>
                <div class="row">
                  <span class="label">Course</span>
                  <span class="value">${courseName}</span>
                </div>
                <div class="row">
                  <span class="label">Date</span>
                  <span class="value">${bookingDate}</span>
                </div>
                <div class="row">
                  <span class="label">Class</span>
                  <span class="value">${slotName}</span>
                </div>
                <div class="row">
                  <span class="label">Quantity</span>
                  <span class="value">${quantity} ticket(s)</span>
                </div>
                <div class="total-row">
                  <span class="total-label">Total Paid</span>
                  <span class="total-value">฿${Number(totalPrice).toLocaleString()}.00</span>
                </div>

                <p style="margin-top: 24px; color: #666; font-size: 14px;">
                  Please arrive 10 minutes before the class starts. See you soon! 🙏
                </p>
              </div>
              <div class="footer">
                Thai Cooking Class · If you have questions, reply to this email.
              </div>
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