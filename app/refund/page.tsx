import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6EFE7]">
      {/* Hero Section */}
      <section className=" py-12 md:py-16 bg-[#F6EFE7] max-w-7xl mx-auto">
        <div>
          <h1 className="text-bold font-bold">Refund & Cancellation Policy</h1>
          <br />

          <p>
            Last updated: 10/02/2026 <br />
            This Refund & Cancellation Policy outlines the terms under which
            cancellations, rescheduling, and refunds are handled for course
            bookings made through naibaanstudio.com. By completing a booking,
            you acknowledge and agree to the terms stated below.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">1. Booking Confirmation</h1>
          <br />
          <p>
            A booking is considered confirmed only after successful payment
            verification and receipt of confirmation from Naibaan Studio.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">2. Cancellation by Customer</h1>
          <br />
          <p>
            <br />• Cancellation requests must be submitted via email.
            <br />• Cancellation requests made at least 2 days before
            the scheduled course date may be eligible for refund or
            rescheduling.
            <br />• Cancellation requests made after the allowed timeframe may
            not be eligible for refunds.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">3. Refund Eligibility</h1>
          <br />
          <p>
            Refunds may be granted under the following conditions:
            <br />• Eligible cancellations within the allowed timeframe
            <br />• Course cancellation by the organizer
            <br />• Technical errors resulting in duplicate payment
            <br />
            Refunds will be processed using the original payment method where
            possible. Processing time depends on the payment provider.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">4. Non-Refundable Situations</h1>
          <br />
          <p>
            Refunds may not be provided in the following cases:
            <br />• Failure to attend the course ("No-show")
            <br />• Late arrival that prevents participation
            <br />• Personal schedule changes after booking confirmation
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">5. Rescheduling</h1>
          <br />
          <p>
            Rescheduling requests are subject to availability and must be made
            at least 2 days before the scheduled session. We reserve the
            right to approve or decline rescheduling requests.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">
            6. Cancellation by Naibaan Studio
          </h1>
          <br />
          <p>
            We reserve the right to cancel or reschedule courses due to:
            <br />• Insufficient enrollment
            <br />• Instructor availability
            <br />• Safety concerns
            <br />• Unforeseen circumstances
            <br />
            In such cases, customers will be offered either a full refund or
            alternative scheduling options.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">7. Payment Fees</h1>
          <br />
          <p>
            Transaction fees charged by payment providers or banks may be
            non-refundable unless required by law.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">8. Final Decision</h1>
          <br />
          <p>
            All refund decisions are final and subject to review based on the
            terms outlined in this policy.
          </p>

          <br />
          <br />

          <h1 className="text-bold font-bold">9. Contact</h1>
          <br />
          <p>Email: info@naibaanstudio.com</p>
        </div>
      </section>
    </main>
  );
}
