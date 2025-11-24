'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Footer } from '@/components/footer'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const courseName = searchParams.get('course') || 'Mastering Pad Thai Class'
  const date = searchParams.get('date') || '17/12/2025'
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const price = parseInt(searchParams.get('price') || '3000')
  const courseId = searchParams.get('courseId') || '2'

  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  
  const subtotal = price * quantity
  const vat = subtotal * 0.07
  const total = subtotal + vat

  return (
    <div className="min-h-screen bg-[#8B7355] relative">
      {/* Background cooking image */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/placeholder.svg?height=1080&width=1920&query=thai+cooking+kitchen+scene+warm+lighting)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Billing Details */}
          <div className="bg-[#F5F1EC] p-8">
            <Link 
              href={`/courses/${courseId}`}
              className="inline-flex items-center text-black hover:opacity-70 transition-opacity mb-6"
            >
              <span className="mr-2">←</span>
              <span className="underline">Return to reservation</span>
            </Link>

            <h1 className="font-serif text-4xl font-bold text-black mb-8">
              Billing Details
            </h1>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  E-mail Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>
            </form>
          </div>

          {/* Right Column - Your Order */}
          <div className="bg-[#F5F1EC] p-8">
            <h2 className="font-serif text-4xl font-bold text-black mb-8">
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

            {/* Payment Methods */}
            <div className="space-y-6">
              {/* Credit Card Option */}
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
                  <div className="flex gap-2">
                    <div className="w-10 h-6 rounded bg-gradient-to-r from-red-500 to-orange-500"></div>
                    <div className="w-10 h-6 rounded bg-gradient-to-r from-red-600 to-yellow-500"></div>
                  </div>
                </label>

                {paymentMethod === 'credit-card' && (
                  <div className="mt-4 space-y-4 pl-8">
                    <div>
                      <label className="block text-sm text-black mb-2">
                        Card number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="w-6 h-4 rounded bg-gradient-to-r from-red-500 to-orange-500"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-black mb-2">
                          Expiration date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-black mb-2">
                          Security code
                        </label>
                        <input
                          type="text"
                          placeholder="CVC"
                          className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Promptpay Option */}
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
                type="submit"
                className="w-full bg-black text-white py-4 font-medium hover:opacity-80 transition-opacity mt-8"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
