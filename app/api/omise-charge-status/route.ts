import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const chargeId = req.nextUrl.searchParams.get('chargeId')
  if (!chargeId) return NextResponse.json({ error: 'Missing chargeId' }, { status: 400 })

  const secretKey = process.env.OMISE_SECRET_KEY!
  const authHeader = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')

  const res = await fetch(`https://api.omise.co/charges/${chargeId}`, {
    headers: { 'Authorization': authHeader },
  })
  const charge = await res.json()

  return NextResponse.json({ status: charge.status }) // 'pending' | 'successful' | 'failed'
}
// ```

// ---

// ## สรุป Flow
// ```
// Credit Card:
// กรอกฟอร์ม → Submit → OmiseCard Popup → สร้าง Token → API /omise-charge → Charge → บันทึก Supabase ✅

// QR PromptPay:
// กรอกฟอร์ม → Submit → API /omise-charge → QR Modal → poll /omise-charge-status ทุก 3 วิ → สแกนจ่าย → บันทึก Supabase ✅