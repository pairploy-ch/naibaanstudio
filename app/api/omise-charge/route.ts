import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, amount, paymentMethod, description } = body

  const secretKey = process.env.OMISE_SECRET_KEY!
  const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')

  try {
    if (paymentMethod === 'credit-card') {
      const res = await fetch('https://api.omise.co/charges', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(amount * 100).toString(),
          currency: 'thb',
          card: token,
          description,
          capture: 'true',
          return_uri: body.returnUri ?? `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/complete`, // ✅ เพิ่ม
        }),
      })
      const charge = await res.json()

      if (charge.object === 'error') {
        return NextResponse.json({ success: false, message: charge.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        chargeId: charge.id,
        status: charge.status,
        authorizeUri: charge.authorize_uri || null,   // ✅ เพิ่ม — URL หน้า OTP
        failureMessage: charge.failure_message || null, // ✅ เพิ่ม — เหตุผลที่ decline
      })

    } else if (paymentMethod === 'qr-promptpay') {
      const sourceRes = await fetch('https://api.omise.co/sources', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(amount * 100).toString(),
          currency: 'thb',
          type: 'promptpay',
        }),
      })
      const source = await sourceRes.json()

      if (source.object === 'error') {
        return NextResponse.json({ success: false, message: source.message }, { status: 400 })
      }

      const chargeRes = await fetch('https://api.omise.co/charges', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: Math.round(amount * 100).toString(),
          currency: 'thb',
          source: source.id,
          description,
          return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/complete`,
        }),
      })
      const charge = await chargeRes.json()

      if (charge.object === 'error') {
        return NextResponse.json({ success: false, message: charge.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        chargeId: charge.id,
        status: charge.status,
        qrCodeUrl: charge.source?.scannable_code?.image?.download_uri || null,
      })
    }

    return NextResponse.json({ success: false, message: 'Invalid payment method' }, { status: 400 })

  } catch (error: any) {
    console.error('Omise API error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}