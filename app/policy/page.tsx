import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Nai Baan Studio privacy policy to learn how we collect, use, and protect your personal information.",
  alternates: { canonical: "/policy" },
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F6EFE7]">
      {/* Hero Section */}
      <section className=" py-12 md:py-16 bg-[#F6EFE7] max-w-7xl mx-auto">
        <div>
          <h1 className="text-bold font-bold">Privacy Policy</h1>
          <br />

          <p>
            Last updated: 10/02/2026 <br />
            This Privacy Policy describes how naibaanstudio.com collects, uses, and protects your personal information when
            you use our website and services, including course booking and
            payment processing. By accessing or using this website, you agree to
            the terms described in this policy.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">1. Information We Collect</h2>
          <br />
          <p>
            We may collect personal information including:
            <br />• Full name
            <br />• Email address
            <br />• Phone number
            <br />• Nationality or country of residence (if provided)
            <br />• Billing and payment information
            <br />• Booking details and course selections

            <br />• Cookies and analytics data
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">
            2. How We Use Your Information
          </h2>
          <br />
          <p>
            We use your information to:
            <br />• Process course bookings and payments
            <br />• Confirm reservations
            <br />• Communicate regarding bookings and services
            <br />• Provide customer support
            <br />• Improve website performance and user experience
            <br />• Analyze website usage through analytics tools
            <br />• Comply with legal and regulatory obligations
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">3. Payment Processing</h2>
          <br />
          <p>
            Payments are processed through third-party payment providers. We do
            not store full credit card information on our servers. Payment
            providers may collect and process your payment data according to
            their own privacy policies.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">
            4. Cookies and Tracking Technologies
          </h2>
          <br />
          <p>
            We use cookies and similar technologies to:
            <br />• Improve website functionality
            <br />• Analyze traffic and user behavior
            <br />• Enhance user experience
            <br />
            You may disable cookies through your browser settings.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">5. Third-Party Services</h2>
          <br />
          <p>
            We may use third-party services including analytics providers,
            payment gateways, and hosting providers. These services may process
            your data according to their own privacy policies.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">6. Data Retention</h2>
          <br />
          <p>
            We retain personal data only as long as necessary for operational,
            legal, accounting, and security purposes.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">7. Data Security</h2>
          <br />
          <p>
            We implement industry-standard technical and organizational
            measures, including HTTPS encryption, to protect your personal data
            from unauthorized access, loss, or misuse.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">8. International Users</h2>
          <br />
          <p>
            As our services are available to international users, your
            information may be processed in jurisdictions outside your country
            of residence.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">9. Your Rights</h2>
          <br />
          <p>
            Depending on applicable laws, you may have the right to:
            <br />• Access your personal data
            <br />• Request correction or deletion
            <br />• Withdraw consent where applicable
            <br />
            Please contact us to exercise these rights.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">10. Data Controller</h2>
          <br />
          <p>Data Controller: Nai Baan Studio</p>

          <br />
          <br />

          <h2 className="text-bold font-bold">11. Changes to This Policy</h2>
          <br />
          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page.
          </p>

          <br />
          <br />

          <h2 className="text-bold font-bold">12. Contact</h2>
          <br />
          <p>Email: naibaanstudio@gmail.com</p>
        </div>
      </section>
    </main>
  );
}
