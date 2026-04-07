"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";

interface BookingDetail {
  id: string;
  booking_date: string;
  booking_code: string;
  quantity: number;
  total_price: number;
  omise_charge_id: string;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
  };
  courses: {
    name: string;
  };
  course_time_slot: {
    slot_name: string;
    start_time: string;
    end_time: string;
  };
}

function CompleteContent() {
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  const convertDateFormat = (dateStr: string): string => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
  useEffect(() => {
    const run = async () => {
      const chargeId = sessionStorage.getItem("pendingChargeId");
      const bookingRaw = sessionStorage.getItem("pendingBooking");

      if (!chargeId || !bookingRaw) {
        setStatus("failed");
        setErrorMessage("Payment information not found.");
        return;
      }

      // ✅ เช็คสถานะ charge จาก Omise
      const pollRes = await fetch(
        `/api/omise-charge-status?chargeId=${chargeId}`,
      );
      const pollData = await pollRes.json();

      if (pollData.status !== "successful") {
        setStatus("failed");
        setErrorMessage(
          pollData.failureMessage || "Payment failed. Please try again.",
        );
        return;
      }

      // ✅ บันทึก Supabase
      try {
        const pendingBooking = JSON.parse(bookingRaw);
        const {
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
        } = pendingBooking;

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

        // Insert participants → เก็บ id ไว้
        let participantIds: string[] = [];
        if (quantity > 1 && participantsData.length > 0) {
          const { data: insertedParticipants, error: partErr } = await supabase
            .from("customers")
            .insert(
              participantsData.map((p: any) => ({
                first_name: p.firstName.trim(),
                last_name: p.lastName.trim(),
                email: p.email.trim(),
                phone: p.phone.trim(),
                passport_num: p.passportId.trim(),
                country: p.country.trim(),
                address: formData.address.trim(),
              })),
            )
            .select();
          if (partErr) throw partErr;
          participantIds = insertedParticipants.map((p: any) => p.id);
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

        const bookingId = bookingInserted[0].id;

        // ✅ Insert course_participants — main customer + participants ทุกคน
        const courseParticipantRows = [
          {
            course_id: Number(courseId),
            customer_id: mainCustomerData[0].id,
            booking_id: bookingId,
          },
          ...participantIds.map((pid) => ({
            course_id: Number(courseId),
            customer_id: pid,
            booking_id: bookingId,
          })),
        ];

        const { error: cpErr } = await supabase
          .from("course_participants")
          .insert(courseParticipantRows);
        if (cpErr) throw cpErr;

        // ✅ ดึงข้อมูลจาก Supabase โดยใช้ chargeId
        const { data: bookingData, error: fetchErr } = await supabase
          .from("bookings")
          .select(
            `
  id,
  booking_date,
  booking_code,
  quantity,
  total_price,
  omise_charge_id,
  customers (
    first_name,
    last_name,
    email
  ),
  courses (
    weekly_template (
      title
    )
  ),
  course_time_slot (
    slot_name,
    start_time,
    end_time
  )
`,
          )
          .eq("omise_charge_id", chargeId)
          .limit(1)
          .single();

        if (fetchErr) throw fetchErr;
        setBooking(bookingData as any);

        // ✅ ส่งอีเมล
        try {
          await fetch("/api/send-confirmation-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: formData.email.trim(),
              customerName: `${formData.firstName} ${formData.lastName}`,
              courseName,
              bookingDate: date,
              classTime: slotTime,
              slotName,
              quantity,
              totalPrice: total,
              bookingId: bookingData.id,
              bookingCode: bookingData.booking_code
            }),
          });
        } catch (emailErr) {
          console.error("Email error:", emailErr);
        }

        // ✅ เคลียร์ sessionStorage
        sessionStorage.removeItem("pendingChargeId");
        sessionStorage.removeItem("pendingBooking");

        setStatus("success");
      } catch (err: any) {
        console.error("Supabase error:", err);
        setStatus("success"); // ตัดเงินแล้ว แสดง success แต่แจ้งให้ติดต่อ
        setErrorMessage(
          "Payment successful, but the data could not be fully recorded. Please contact support.",
        );
      }
    };

    run();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F6EFE7] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4" />
          <p className="text-black">Verifying Payment...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#F6EFE7] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">✗</div>
          <h2 className="text-3xl font-bold text-black mb-4">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="block w-full bg-black text-white py-3 font-medium hover:opacity-80"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EFE7] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-3xl font-bold text-black mb-4">
          Payment Successful!
        </h2>
        <p className="text-black mb-2">Your booking has been confirmed.</p>

        {booking && (
          <div className="text-sm text-gray-600 mb-6 text-left p-4 rounded">
            <p>
              <b>Booking Code:</b> {booking.booking_code}
            </p>
            {/* <p>
              <b>Ref:</b> {booking.omise_charge_id}
            </p> */}
            <p>
              <b>Name:</b> {(booking.customers as any).first_name}{" "}
              {(booking.customers as any).last_name}
            </p>
            <p>
              <b>Email:</b> {(booking.customers as any).email}
            </p>
            <p>
              <b>Course:</b> {(booking.courses as any).weekly_template.title}
            </p>
            <p>
              <b>Date:</b> {formatDate(booking.booking_date)}
            </p>
            <p>
              <b>Class:</b> {(booking.course_time_slot as any).slot_name}(
              {(booking.course_time_slot as any).start_time} -{" "}
              {(booking.course_time_slot as any).end_time})
            </p>
            <p>
              <b>Quantity:</b> {booking.quantity} ticket(s)
            </p>
            <p>
              <b>Total:</b> ฿{booking.total_price.toLocaleString()}.00
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">
          Please check your email for the booking confirmation.
        </p>

        {errorMessage && (
          <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
        )}

        <Link
          href="/"
          className="block w-full bg-black text-white py-3 font-medium hover:opacity-80"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6EFE7] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}