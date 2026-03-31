"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabaseClient";

declare const OmiseCard: any;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const courseName = searchParams.get("course") || "Mastering Pad Thai Class";
  const date = searchParams.get("date") || "17/12/2025";
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const price = parseInt(searchParams.get("price") || "3000");
  const courseId = searchParams.get("courseId") || "2";
  const slotId = searchParams.get("slotId") || "";
  const slotName = searchParams.get("slotName") || "";
  const slotTime = searchParams.get("slotTime") || "";
  const [countries, setCountries] = useState<string[]>([]);

  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [showParticipants, setShowParticipants] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [omiseReady, setOmiseReady] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    passportId: "",
    country: "",
    address: "",
    email: "",
  });

  const [participantsData, setParticipantsData] = useState(
    Array.from({ length: quantity - 1 }, () => ({
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      phone: "",
      passportId: "",
    })),
  );

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const names = data
          .map((c: any) => c.name.common)
          .sort((a: string, b: string) => a.localeCompare(b));
        setCountries(names);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleParticipantChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...participantsData];
    updated[index] = { ...updated[index], [field]: value };
    setParticipantsData(updated);
  };

  const subtotal = price * quantity;
  const vat = parseInt(searchParams.get("vat") || "0") * quantity;
  const total = subtotal + vat;

  const isFormValid = () => {
    const main =
      formData.firstName &&
      formData.lastName &&
      formData.phone &&
      formData.passportId &&
      formData.country &&
      formData.address &&
      formData.email;

    let participants = true;
    if (quantity > 1) {
      participants = participantsData.every(
        (p) =>
          p.firstName &&
          p.lastName &&
          p.email &&
          p.country &&
          p.phone &&
          p.passportId,
      );
    }

    return !!(main && participants);
  };

  const convertDateFormat = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // ===== Step 1: validate ทุกอย่างก่อนตัดเงิน =====
  const validateBeforePayment = async (): Promise<boolean> => {
    // เช็คฟอร์มครบ
    if (!isFormValid()) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    const allEmails = [
      formData.email.trim(),
      ...participantsData.map((p) => p.email.trim()),
    ];

    // เช็ค email ซ้ำในฟอร์ม
    if (new Set(allEmails).size !== allEmails.length) {
      alert("มี email ซ้ำกันในฟอร์ม กรุณาใช้ email ที่ไม่ซ้ำกันสำหรับแต่ละคน");
      return false;
    }

    // เช็ค email ซ้ำใน DB
    const { data: existing, error } = await supabase
      .from("customers")
      .select("email")
      .in("email", allEmails);

    if (error) {
      alert("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่");
      return false;
    }

    if (existing && existing.length > 0) {
      const dupes = existing.map((c: any) => c.email).join(", ");
      alert(`Email ต่อไปนี้มีในระบบแล้ว:\n${dupes}\n\nกรุณาใช้ email อื่น`);
      return false;
    }

    return true;
  };

  // ===== Step 2: บันทึก Supabase หลังตัดเงินสำเร็จ =====
  const saveToSupabase = async (chargeId: string) => {
    // Insert main customer
    const { data: mainCustomerData, error: mainErr } = await supabase
      .from("customers")
      .insert([
        {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          passport_num: formData.passportId.trim(),
          country: formData.country.trim(),
          address: formData.address.trim(),
        },
      ])
      .select();
    if (mainErr) throw mainErr;

    // Insert participants
    if (quantity > 1 && participantsData.length > 0) {
      const { error: partErr } = await supabase.from("customers").insert(
        participantsData.map((p) => ({
          first_name: p.firstName.trim(),
          last_name: p.lastName.trim(),
          email: p.email.trim(),
          phone: p.phone.trim(),
          passport_num: p.passportId.trim(),
          country: p.country.trim(),
          address: formData.address.trim(),
        })),
      );
      if (partErr) throw partErr;
    }

    // Insert booking
    const { data: bookingInserted, error: bookingErr } = await supabase
      .from("bookings")
      .insert([
        {
          customer_id: mainCustomerData[0].id,
          course_id: courseId,
          time_slot_id: slotId,
          booking_date: convertDateFormat(date),
          booking_status: "success",
          quantity,
          total_price: total,
          omise_charge_id: chargeId,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    if (bookingErr) throw bookingErr;

    // ส่งอีเมล
    try {
      await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email.trim(),
          customerName: `${formData.firstName} ${formData.lastName}`,
          courseName,
          bookingDate: date,
          classTime: slotName,
          quantity,
          slotName,
          totalPrice: total,
          bookingId: bookingInserted[0].id,
        }),
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }

    const ref = `${courseName.replace(/\s/g, "-")}-${slotName.replace(/\s/g, "-")}-${date.replace(/\//g, "-")}`;
    setBookingRef(ref);
    setPaymentSuccess(true);
  };

  // ===== Credit Card ผ่าน OmiseCard Popup =====
  const handleCreditCard = () => {
    return new Promise<void>((resolve, reject) => {
      OmiseCard.configure({
        publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
        currency: "THB",
        frameLabel: "Nai Baan Studio",
        submitLabel: "Pay",
        buttonLabel: "Pay with Omise",
      });

      OmiseCard.open({
        amount: total * 100,
        onCreateTokenSuccess: async (token: string) => {
          try {
            const res = await fetch("/api/omise-charge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token,
                amount: total,
                paymentMethod: "credit-card",
                description: `${courseName} - ${date} (${slotName})`,
                returnUri: `${window.location.origin}/checkout/complete`,
              }),
            });
            const data = await res.json();

            if (!data.success)
              throw new Error(data.message || "Payment failed");

            if (data.status === "successful") {
              await saveToSupabase(data.chargeId);
              resolve();
            } else if (data.status === "pending" && data.authorizeUri) {
              sessionStorage.setItem("pendingChargeId", data.chargeId);
              sessionStorage.setItem(
                "pendingBooking",
                JSON.stringify({
                  formData,
                  participantsData,
                  courseName,
                  date,
                  slotName,
                  slotTime,
                  courseId,
                  slotId,
                  quantity,
                  total,
                }),
              );
              window.location.href = data.authorizeUri; // ✅ redirect ไปหน้า OTP
            } else {
              throw new Error(
                data.failureMessage || "บัตรถูกปฏิเสธ กรุณาติดต่อธนาคาร",
              );
            }
          } catch (err) {
            reject(err);
          }
        },
        onFormClosed: () => {
          reject(new Error("FORM_CLOSED"));
        },
      });
    });
  };

  // ===== QR PromptPay =====
  const handlePromptPay = async () => {
    const res = await fetch("/api/omise-charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        paymentMethod: "qr-promptpay",
        description: `${courseName} - ${date} (${slotName})`,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    setQrCodeUrl(data.qrCodeUrl);
    setShowQR(true);

    let attempts = 0;
    const maxAttempts = 100;
    await new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await fetch(
            `/api/omise-charge-status?chargeId=${data.chargeId}`,
          );
          const pollData = await pollRes.json();

          if (pollData.status === "successful") {
            clearInterval(interval);
            setShowQR(false);
            await saveToSupabase(data.chargeId);
            
            resolve();
          } else if (pollData.status === "failed" || attempts >= maxAttempts) {
            clearInterval(interval);
            reject(
              new Error(
                pollData.status === "failed"
                  ? "QR Payment failed"
                  : "Payment timeout",
              ),
            );
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 3000);
    });
  };

  // ===== handleSubmit: เช็คก่อน → ตัดเงิน → บันทึก =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔵 handleSubmit called");
    console.log("isFormValid:", isFormValid());
    console.log("isSubmitting:", isSubmitting);
    console.log("omiseReady:", omiseReady);

    setIsSubmitting(true);

    try {
      console.log("🔵 calling validateBeforePayment...");
      const isValid = await validateBeforePayment();
      console.log("🔵 isValid:", isValid);

      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      console.log("🔵 calling handleCreditCard...");
      if (paymentMethod === "credit-card") {
        await handleCreditCard();
      } else if (paymentMethod === "qr-promptpay") {
        await handlePromptPay();
      }
    } catch (error: any) {
      console.log("🔴 error:", error.message);
      if (error.message !== "FORM_CLOSED") {
        alert("เกิดข้อผิดพลาด: " + (error.message || "กรุณาลองใหม่อีกครั้ง"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src="https://cdn.omise.co/omise.js"
        strategy="afterInteractive"
        onLoad={() => setOmiseReady(true)}
      />

      <div className="min-h-screen bg-[#8B7355] relative">
        {/* Payment Success Modal */}
        {paymentSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-3xl font-bold text-black mb-4">
                Payment Successful!
              </h2>
              <p className="text-black mb-2">
                Your booking has been confirmed.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                <b>Ref: {bookingRef}</b>
                <br />
                Course: {courseName}
                <br />
                Date: {date} ({slotName})<br />
                {slotTime && `Time: ${slotTime}`}
                <br />
                Quantity: {quantity} ticket(s)
                <br />
                Total: ฿{total.toLocaleString()}.00
              </p>
              <Link
                href="/"
                className="block w-full bg-black text-white py-3 font-medium hover:opacity-80 transition-opacity"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {/* QR PromptPay Modal */}
        {showQR && qrCodeUrl && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-sm w-full mx-4 text-center">
              <h2 className="text-xl font-bold text-black mb-2">
                QR PromptPay
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Amount ฿{total.toLocaleString()}
              </p>
              <img
                src={qrCodeUrl}
                alt="QR PromptPay"
                className="mx-auto w-64 h-64 mb-4"
              />
              <p className="text-xs text-gray-400 mb-4">
                Pending Payment...
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-4" />
              <button
                onClick={() => {
                  setShowQR(false);
                  setIsSubmitting(false);
                }}
                className="text-sm text-gray-400 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url(/new/cta.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative container mx-auto px-6 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 pt-30 pb-30">
            {/* Left - Billing Details */}
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
                    Passport Num / ID Number{" "}
                    <span className="text-red-600">*</span>
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
                  <select
                    name="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
                        {showParticipants ? "−" : "+"}
                      </span>
                    </button>

                    {showParticipants && (
                      <div>
                        {Array.from({ length: quantity - 1 }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="mb-8 p-6 bg-white border border-gray-300"
                            >
                              <h3 className="font-semibold text-black mb-4">
                                Participant {index + 2}
                              </h3>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      First Name{" "}
                                      <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={
                                        participantsData[index]?.firstName || ""
                                      }
                                      onChange={(e) =>
                                        handleParticipantChange(
                                          index,
                                          "firstName",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                      Last Name{" "}
                                      <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={
                                        participantsData[index]?.lastName || ""
                                      }
                                      onChange={(e) =>
                                        handleParticipantChange(
                                          index,
                                          "lastName",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-black mb-2">
                                    E-mail Address{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    value={participantsData[index]?.email || ""}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        index,
                                        "email",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-black mb-2">
                                    Country{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <select
                                    value={
                                      participantsData[index]?.country || ""
                                    }
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        index,
                                        "country",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                  >
                                    <option value="">Select Country</option>
                                    {countries.map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-black mb-2">
                                    Passport Num / ID Number{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      participantsData[index]?.passportId || ""
                                    }
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        index,
                                        "passportId",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-black mb-2">
                                    Phone{" "}
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    value={participantsData[index]?.phone || ""}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        index,
                                        "phone",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                                  />
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Order Summary + Payment */}
            <div className="bg-[#F5F1EC] p-8">
              <h2 className="text-4xl font-bold text-black mb-8">Your Order</h2>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-start pb-6 border-b border-black">
                  <div>
                    <div className="font-bold text-black">{courseName}</div>
                    <div className="text-sm text-black italic mt-1">
                      {date} · {slotName} {slotTime && `(${slotTime})`} x{" "}
                      {quantity}
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
                {/* Credit Card Option */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="credit-card"
                        checked={paymentMethod === "credit-card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 mr-3"
                      />
                      <span className="font-medium text-black">
                        Credit Card
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <img
                        src="/mastercard-logo.png"
                        style={{ width: "40px" }}
                        alt="Mastercard"
                      />
                      <img
                        src="/visa-logo.png"
                        style={{ width: "60px", height: "20px" }}
                        alt="Visa"
                      />
                    </div>
                  </label>
                </div>

                {/* QR PromptPay Option */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="qr-promptpay"
                      checked={paymentMethod === "qr-promptpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 mr-3"
                    />
                    <span className="font-medium text-black">QR PromptPay</span>
                  </label>
                </div>

                <p className="text-sm text-gray-600">
                  By proceeding with payment, you agree to our Terms &
                  Conditions and Refund Policy.
                </p>

                <button
                  type="button"
                  disabled={!isFormValid() || isSubmitting}
                  onClick={handleSubmit}
                  className={`w-full py-4 font-medium transition-opacity mt-8 ${
                    isFormValid() && !isSubmitting
                      ? "bg-[#919077] text-white hover:opacity-80 cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Processing..." : `Submit`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#8B7355] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
