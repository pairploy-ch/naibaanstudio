// ไฟล์: app/api/send-confirmation-email/route.ts

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, customerName, courseName, bookingDate, classTime, quantity, totalPrice, bookingId } = body

    // สร้าง transporter สำหรับส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // แปลง classTime เป็นภาษาอังกฤษ
    // const classTimeText = {
    //   morning: 'Morning Class (9:00 AM - 12:00 PM)',
    //   afternoon: 'Afternoon Class (2:00 PM - 5:00 PM)',
    //   fullday: 'Full Day Class (9:00 AM - 5:00 PM)'
    // }[classTime] || classTime

    // สร้างเนื้อหาอีเมล
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'pairploy.chp@gmail.com',
      cc: to,
      subject: `🎉 Booking Confirmation - ${courseName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #8B7355 0%, #6d5a45 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px 25px;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #333;
            }
            .booking-details {
              background-color: #f5f1ec;
              padding: 20px;
              margin: 25px 0;
              border-left: 4px solid #8B7355;
              border-radius: 4px;
            }
            .booking-details h3 {
              margin-top: 0;
              color: #8B7355;
              font-size: 20px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #ddd;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: 600;
              color: #555;
            }
            .detail-value {
              color: #333;
              text-align: right;
            }
            .total-row {
              background-color: #fff;
              margin-top: 15px;
              padding: 15px;
              border-radius: 4px;
              font-size: 18px;
              font-weight: bold;
            }
            .total-row .detail-label {
              color: #8B7355;
            }
            .total-row .detail-value {
              color: #8B7355;
              font-size: 20px;
            }
            .info-section {
              margin: 25px 0;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 4px;
            }
            .info-section h4 {
              margin-top: 0;
              color: #8B7355;
              font-size: 16px;
            }
            .info-section ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .info-section li {
              margin: 8px 0;
              color: #555;
            }
            .contact-info {
              background-color: #fff3e0;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
              border-left: 3px solid #ff9800;
            }
            .footer {
              text-align: center;
              padding: 25px 20px;
              background-color: #f5f5f5;
              color: #666;
              font-size: 13px;
              border-top: 1px solid #e0e0e0;
            }
            .footer p {
              margin: 5px 0;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 10px;
                border-radius: 0;
              }
              .content {
                padding: 20px 15px;
              }
              .detail-row {
                flex-direction: column;
                gap: 5px;
              }
              .detail-value {
                text-align: left;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for choosing us</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                <strong>Dear ${customerName},</strong>
              </div>
              
              <p>Thank you for booking with us! Your reservation has been successfully confirmed.</p>
              
              <div class="booking-details">
                <h3>📋 Booking Details</h3>
                
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value"><strong>${bookingId}</strong></span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Course:</span>
                  <span class="detail-value">${courseName}</span>
                </div>
                
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${bookingDate}</span>
                </div>
                
            
                <div class="detail-row">
                  <span class="detail-label">Participants:</span>
                  <span class="detail-value">${quantity} person${quantity > 1 ? 's' : ''}</span>
                </div>
                
                <div class="total-row detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value">฿${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div class="info-section">
                <h4>📍 Location & Arrival</h4>
                <p><strong>Address:</strong> [Your Cooking School Address]</p>
                <p>Please arrive 15 minutes before the class starts.</p>
              </div>
              
              <div class="info-section">
                <h4>👕 What to Bring</h4>
                <ul>
                  <li>Comfortable clothing suitable for cooking</li>
                  <li>Closed-toe shoes (required for safety)</li>
                  <li>Hair tie (if you have long hair)</li>
                  <li>Your enthusiasm to learn!</li>
                </ul>
                <p><em>* Aprons and cooking equipment will be provided</em></p>
              </div>
              
              <div class="contact-info">
                <strong>📞 Need to make changes?</strong><br>
                Please contact us at least 24 hours before your class:<br>
                Phone: [Your Phone Number]<br>
                Email: [Your Email Address]
              </div>
              
              <p style="margin-top: 25px;">We're excited to have you join us and can't wait to share our passion for Thai cuisine with you!</p>
              
              <p style="margin-top: 20px;">
                <strong>Best regards,</strong><br>
                <strong style="color: #8B7355;">Your Cooking School Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p><strong>This is an automated confirmation email.</strong></p>
              <p>Please do not reply directly to this email.</p>
              <p style="margin-top: 15px;">© ${new Date().getFullYear()} Your Cooking School. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // ส่งอีเมล
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully:', info.messageId)

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    })

  } catch (error: any) {
    console.error('❌ Error sending email:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send email'
      },
      { status: 500 }
    )
  }
}