// ไฟล์: app/checkout/page.tsx

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient';

function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseName = searchParams.get('course') || 'Mastering Pad Thai Class'
  const date = searchParams.get('date') || '17/12/2025'
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const price = parseInt(searchParams.get('price') || '3000')
  const courseId = searchParams.get('courseId') || '2'
  const classTime = searchParams.get('classTime') || 'morning'

  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [showParticipants, setShowParticipants] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    passportId: '',
    country: '',
    address: '',
    email: '',
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    securityCode: ''
  })

  const [participantsData, setParticipantsData] = useState(
    Array.from({ length: quantity - 1 }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      phone: '',
      passportId: ''
    }))
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updatedParticipants = [...participantsData]
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    }
    setParticipantsData(updatedParticipants)
  }

  const isFormValid = () => {
    const mainFormValid = formData.firstName && formData.lastName && 
                          formData.phone && formData.passportId && 
                          formData.country && formData.address && formData.email

    const paymentValid = paymentMethod === 'qr-promptpay' || 
                        (formData.cardholderName && formData.cardNumber && 
                         formData.expirationDate && formData.securityCode)

    let participantsValid = true
    if (quantity > 1) {
      participantsValid = participantsData.every(p => 
        p.firstName && p.lastName && p.email && p.country && p.phone && p.passportId
      )
    }

    return mainFormValid && paymentValid && participantsValid
  }

  const subtotal = price * quantity
  const vat = subtotal * 0.07
  const total = subtotal + vat

  const convertDateFormat = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) return
    
    setIsSubmitting(true)

    try {
      const allEmails = [
        formData.email.trim(),
        ...participantsData.map(p => p.email.trim())
      ]

      const emailSet = new Set(allEmails)
      if (emailSet.size !== allEmails.length) {
        alert('มี email ซ้ำกันในฟอร์ม กรุณาใช้ email ที่ไม่ซ้ำกันสำหรับแต่ละคน')
        setIsSubmitting(false)
        return
      }

      const { data: existingCustomers, error: checkError } = await supabase
        .from('customers')
        .select('email')
        .in('email', allEmails)

      if (checkError) {
        console.error('Error checking existing emails:', checkError)
        throw checkError
      }

      if (existingCustomers && existingCustomers.length > 0) {
        const duplicateEmails = existingCustomers.map(c => c.email).join(', ')
        alert(`Email ต่อไปนี้มีในระบบแล้ว: ${duplicateEmails}\nกรุณาใช้ email อื่น`)
        setIsSubmitting(false)
        return
      }

      const mainCustomer = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        passport_num: formData.passportId.trim(),
        country: formData.country.trim(),
        address: formData.address.trim()
      }

      const { data: mainCustomerData, error: mainCustomerError } = await supabase
        .from('customers')
        .insert([mainCustomer])
        .select()

      if (mainCustomerError) {
        console.error('Error inserting main customer:', mainCustomerError)
        throw mainCustomerError
      }

      console.log('✅ บันทึกลูกค้าหลักสำเร็จ:', mainCustomerData[0].email)

      if (quantity > 1 && participantsData.length > 0) {
        const participantsToInsert = participantsData.map(participant => ({
          first_name: participant.firstName.trim(),
          last_name: participant.lastName.trim(),
          email: participant.email.trim(),
          phone: participant.phone.trim(),
          passport_num: participant.passportId.trim(),
          country: participant.country.trim(),
          address: formData.address.trim()
        }))

        const { data: participantsInserted, error: participantsError } = await supabase
          .from('customers')
          .insert(participantsToInsert)
          .select()

        if (participantsError) {
          console.error('Error inserting participants:', participantsError)
          throw participantsError
        }

        console.log(`✅ บันทึกผู้เข้าร่วมเพิ่มเติมสำเร็จ: ${participantsInserted.length} คน`)
      }

      const bookingData = {
        course_id: courseId,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        contact: formData.phone.trim(),
        booking_date: convertDateFormat(date),
        class_time: classTime as 'morning' | 'afternoon' | 'fullday',
        booking_status: 'success' as 'pending' | 'success',
        quantity: quantity,
        total_price: total,
        created_at: new Date().toISOString()
      }
      
      const { data: bookingInserted, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()

      if (bookingError) {
        console.error('Error inserting booking:', bookingError)
        throw bookingError
      }

      console.log('✅ บันทึกข้อมูลการจองสำเร็จ:', bookingInserted[0])

      try {
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.email.trim(),
            customerName: `${formData.firstName} ${formData.lastName}`,
            courseName: courseName,
            bookingDate: date,
            classTime: classTime,
            quantity: quantity,
            totalPrice: total,
            bookingId: bookingInserted[0].id
          })
        })

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email')
        } else {
          console.log('✅ ส่งอีเมลยืนยันสำเร็จ')
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
      }

      setPaymentSuccess(true)
      
    } catch (error: any) {
      console.error('Error submitting form:', error)
      
      if (error.code === '23505') {
        alert('Email นี้มีในระบบแล้ว กรุณาใช้ email อื่น')
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง\n' + (error.message || ''))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#8B7355] relative">
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-black mb-4">Payment Successful!</h2>
            <p className="text-black mb-2">Your booking has been confirmed.</p>
            <p className="text-sm text-gray-600 mb-6">
              <b>ID: 2025-12-22-morning</b> <br />
              Course: {courseName}<br />
              Date: {date}<br />
              Quantity: {quantity} ticket(s)<br />
              Total: ฿{total.toLocaleString()}.00
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-black text-white py-3 font-medium hover:opacity-80 transition-opacity"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/bg-test.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative container mx-auto px-6 py-12 max-w-7xl ">
        <div className="grid lg:grid-cols-2 gap-8 pt-30 pb-30">
          <div className="bg-[#F5F1EC] p-8">
            <Link 
              href={`/courses/${courseId}`}
              className="inline-flex items-center text-black hover:opacity-70 transition-opacity mb-6"
            >
              <span className="mr-2">←</span>
              <span className="underline">Return to reservation</span>
            </Link>

            <h1 className="text-4xl font-bold text-black mb-8">
              Billing Details
            </h1>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Last Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Passport Num/ ID Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="passportId"
                  value={formData.passportId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Country <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  E-mail Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              {quantity > 1 && (
                <div className="mt-8 pt-8 border-t-2 border-black">
                  <button
                    type="button"
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="flex items-center justify-between w-full text-left mb-6 hover:opacity-70 transition-opacity"
                  >
                    <h2 className="text-2xl font-bold text-black">
                      Additional Participants Information
                    </h2>
                    <span className="text-2xl text-black">
                      {showParticipants ? '−' : '+'}
                    </span>
                  </button>
                  
                  {showParticipants && (
                    <div>
                      {Array.from({ length: quantity - 1 }).map((_, index) => (
                        <div key={index} className="mb-8 p-6 bg-white border border-gray-300">
                          <h3 className="font-semibold text-black mb-4">
                            Participant {index + 2}
                          </h3>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                  First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={participantsData[index]?.firstName || ''}
                                  onChange={(e) => handleParticipantChange(index, 'firstName', e.target.value)}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                  Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={participantsData[index]?.lastName || ''}
                                  onChange={(e) => handleParticipantChange(index, 'lastName', e.target.value)}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-black mb-2">
                                E-mail Address <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="email"
                                value={participantsData[index]?.email || ''}
                                onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-black mb-2">
                                Country <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="text"
                                value={participantsData[index]?.country || ''}
                                onChange={(e) => handleParticipantChange(index, 'country', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-black mb-2">
                                Passport Num/ ID Number <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="text"
                                value={participantsData[index]?.passportId || ''}
                                onChange={(e) => handleParticipantChange(index, 'passportId', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-black mb-2">
                                Phone <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="tel"
                                value={participantsData[index]?.phone || ''}
                                onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#F5F1EC] p-8">
            <h2 className="text-4xl font-bold text-black mb-8">
              Your Order
            </h2>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-start pb-6 border-b border-black">
                <div>
                  <div className="font-bold text-black">{courseName}</div>
                  <div className="text-sm text-black italic mt-1">
                    your selected date: {date} x {quantity}
                  </div>
                </div>
                <div className="font-bold text-black">
                  ฿{subtotal.toLocaleString()}.00
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-black">Vat 7%</div>
                <div className="text-black">฿{vat.toFixed(2)}</div>
              </div>

              <div className="flex justify-between items-center font-bold text-lg pt-4 border-t border-black">
                <div className="text-black">Total</div>
                <div className="text-black">฿{total.toLocaleString()}.00</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="credit-card"
                      checked={paymentMethod === 'credit-card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium text-black">Credit Card</span>
                  </div>
                  <div className="flex gap-4">
                    <img src="/mastercard-logo.png" style={{ width:'40px'}} alt=""  />
                    <img src="/visa-logo.png"style={{ width:'60px', height:'auto'}}  alt=""  />
                  </div>
                </label>

                {paymentMethod === 'credit-card' && (
                  <div className="mt-4 space-y-4 pl-8">
                    <div>
                      <label className="block text-sm text-black mb-2">
                        Cardholder Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-black mb-2">
                        Card number <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 1234 1234 1234"
                          required
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                           <img src="/mastercard-logo.png" style={{ width:'40px'}} alt=""  />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-black mb-2">
                          Expiration date <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="expirationDate"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-black mb-2">
                          Security code <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          name="securityCode"
                          value={formData.securityCode}
                          onChange={handleInputChange}
                          placeholder="CVC"
                          required
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="qr-promptpay"
                    checked={paymentMethod === 'qr-promptpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 mr-3"
                  />
                  <span className="font-medium text-black">QR Promptpay</span>
                </label>
              </div>

              <button
                type="button"
                disabled={!isFormValid() || isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-4 font-medium transition-opacity mt-8 ${
                  isFormValid() && !isSubmitting
                    ? 'bg-black text-white hover:opacity-80 cursor-pointer' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#8B7355] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}