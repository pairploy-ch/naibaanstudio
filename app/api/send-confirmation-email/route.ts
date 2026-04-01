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
      from: 'Nai Baan Studio <booking@naibaanstudio.com>', // ✅ ใส่ domain ที่ verify ใน Resend
      to: [to],
      subject: `Booking Confirmed – Nai Baan Studio`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial, sans-serif; background: #CCC3B2; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white;  overflow: hidden; }
              .header { background: #8D9075; padding: 32px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .body { padding: 32px; }
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
              <img 
    src="https://naibaanstudio.com/logo-nb-wh.png" 
    alt="Logo" 
    style="max-width: 120px;"
  />
            
              </div>
              <div class="body">
                <p>Dear <strong style="margin-left: 5px;">${customerName}</strong>,</p>
                <p>Thank you for booking with us! Here are your booking details:</p>

                <div class="row">
                  <span class="label">Booking ID</span>
                  <span class="value" style="margin-left: 5px;">#${bookingId}</span>
                </div>
                <div class="row">
                  <span class="label">Course</span>
                  <span class="value" style="margin-left: 5px;">${courseName}</span>
                </div>
                <div class="row">
                  <span class="label">Date</span>
                  <span class="value" style="margin-left: 5px;">${bookingDate}</span>
                </div>
                <div class="row">
                  <span class="label">Class</span>
                  <span class="value" style="margin-left: 5px;">${slotName}</span>
                </div>
                <div class="row">
                  <span class="label">Quantity</span>
                  <span class="value" style="margin-left: 5px;">${quantity} ticket(s)</span>
                </div>
                <div class="total-row">
                  <span class="total-label">Total Paid</span>
                  <span class="total-value" style="margin-left: 5px;">฿${Number(totalPrice).toLocaleString()}.00</span>
                </div>

                <p style="margin-top: 24px; color: #666; font-size: 14px;">
                  Please arrive 10 minutes before the class starts. See you soon! 🙏
                </p>
              </div>
              <div style="padding:32px; border-top:1px solid #eee; text-align:center;">
  <h3 style="margin:0 0 12px 0; font-size:16px; color:#333;">Location</h3>
 <img 
    src="https://naibaanstudio.com/logo-nb-wh.png"
    alt="Location Map"
    style="max-width:100%; border-radius:6px; margin-bottom:12px;"
  />
  <img 
    src="https://naibaanstudio.com/maps-lo.png"
    alt="Location Map"
    style="max-width:100%; border-radius:6px; margin-bottom:12px;"
  />

  <p style="font-size:13px; color:#666; margin:0 0 16px 0; line-height:1.6;">
    2nd floor 230 Nares Road, Si Phraya,<br/>
    Bang Rak, Bangkok 10500, Thailand
  </p>

  <a 
    href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.834112439908!2d100.52374499999999!3d13.728491199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e299004d4ab939%3A0xf672d0e1245ec4cb!2sNaibaan%20Studio!5e0!3m2!1sth!2sth!4v1770735032110!5m2!1sth!2sth"
    style="display:inline-block;margin-bottom:20px;padding:10px 18px;background:#8D9075;color:white;text-decoration:none;border-radius:4px;font-size:13px;font-weight:bold;">
    Open in Google Maps
  </a>

  <p style="font-size:13px; color:#333; font-weight:bold; margin-bottom:8px;">
    Distance from Nai Baan Studio
  </p>

  <p style="font-size:13px; color:#666; line-height:1.6; margin:0;">
    2 km to River City Bangkok<br/>
    2.6 km to Talat Noi<br/>
    3.1 km to Central Yaowarat<br/>
    4.4 km to Central Songwat
  </p>
</div>
              <div class="footer">
                Nai Baan Studio · If you have questions, reply to this email.
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