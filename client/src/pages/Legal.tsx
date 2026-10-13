import { useState } from "react";
import { PublicHeader, PublicFooter } from "../components/landing/PublicLayoutElements";
import { BookDemoModal } from "../components/landing/BookDemoModal";
import { CookieNotice } from "../components/landing/CookieNotice";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface LegalTabProps {
  initialTab?: "privacy" | "terms" | "dpa";
}

export default function LegalPage({ initialTab = "privacy" }: LegalTabProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms" | "dpa">(initialTab);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
      <PublicHeader onOpenDemoModal={() => setShowDemoModal(true)} />

      <section className="pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto space-y-8">
          
          {/* Top Document Switcher Tabs */}
          <div role="tablist" aria-label="Legal documents" className="flex gap-2 border-b border-line overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`pb-3 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "privacy"
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-secondary hover:text-ink"
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`pb-3 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "terms"
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-secondary hover:text-ink"
              }`}
            >
              Terms of Use
            </button>
            <button
              onClick={() => setActiveTab("dpa")}
              className={`pb-3 px-5 text-sm sm:text-base font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "dpa"
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-secondary hover:text-ink"
              }`}
            >
              Data Processing Agreement (DPA)
            </button>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-ink">
              {activeTab === "privacy" && "Privacy Policy"}
              {activeTab === "terms" && "Terms of Use"}
              {activeTab === "dpa" && "Data Processing Agreement (DPA)"}
            </h1>
            <div className="text-xs sm:text-sm text-ink-secondary">
              Last updated: October 2026 · Applies to guruConnect School ERP & LMS, operated by guruConnect Technologies Private Limited
            </div>
          </div>

          {/* Legal Notice Callout */}
          <div className="bg-warning-bg border border-warning-border rounded-panel p-4 text-xs sm:text-sm text-warning-strong leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-accent shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Indian Legal & Regulatory Alignment.</strong> Built specifically to comply with the <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong> and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </div>
          </div>

          {/* Two Columns: Content Nav + Article Body */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Table of Contents */}
            <nav aria-label="Table of Contents" className="w-full lg:w-72 bg-white border border-line rounded-card p-5 space-y-2 shrink-0 sticky top-24 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block pb-1 border-b border-line">
                Contents
              </span>

              {activeTab === "privacy" && (
                <div className="flex flex-col gap-1 text-xs text-ink-secondary">
                  <a href="#privacy-1" className="py-1 hover:text-primary transition-colors">1. Who we are</a>
                  <a href="#privacy-2" className="py-1 hover:text-primary transition-colors">2. What this policy covers</a>
                  <a href="#privacy-3" className="py-1 hover:text-primary transition-colors">3. Data we collect</a>
                  <a href="#privacy-4" className="py-1 hover:text-primary transition-colors">4. How we use it</a>
                  <a href="#privacy-5" className="py-1 hover:text-primary transition-colors font-semibold text-primary">5. Children's data & parental consent</a>
                  <a href="#privacy-6" className="py-1 hover:text-primary transition-colors">6. Sharing & service providers</a>
                  <a href="#privacy-7" className="py-1 hover:text-primary transition-colors">7. Where data is stored (India)</a>
                  <a href="#privacy-8" className="py-1 hover:text-primary transition-colors">8. Retention & backups</a>
                  <a href="#privacy-9" className="py-1 hover:text-primary transition-colors">9. Your statutory rights</a>
                  <a href="#privacy-10" className="py-1 hover:text-primary transition-colors">10. Cookies & telemetry</a>
                  <a href="#privacy-11" className="py-1 hover:text-primary transition-colors">11. Technical security</a>
                  <a href="#privacy-12" className="py-1 hover:text-primary transition-colors">12. Grievance officer contact</a>
                </div>
              )}

              {activeTab === "terms" && (
                <div className="flex flex-col gap-1 text-xs text-ink-secondary">
                  <a href="#terms-1" className="py-1 hover:text-primary transition-colors">1. Agreement & authority to sign</a>
                  <a href="#terms-2" className="py-1 hover:text-primary transition-colors">2. Accounts, roles & credentials</a>
                  <a href="#terms-3" className="py-1 hover:text-primary transition-colors font-semibold text-primary">3. 30-Day free trial terms</a>
                  <a href="#terms-4" className="py-1 hover:text-primary transition-colors">4. Plans, pricing per student & taxes</a>
                  <a href="#terms-5" className="py-1 hover:text-primary transition-colors">5. Invoices, payment & renewals</a>
                  <a href="#terms-6" className="py-1 hover:text-primary transition-colors">6. Acceptable campus use</a>
                  <a href="#terms-7" className="py-1 hover:text-primary transition-colors font-semibold text-primary">7. School ownership of data</a>
                  <a href="#terms-8" className="py-1 hover:text-primary transition-colors">8. Uptime & support commitments</a>
                  <a href="#terms-9" className="py-1 hover:text-primary transition-colors">9. Cancellation & export guarantee</a>
                  <a href="#terms-10" className="py-1 hover:text-primary transition-colors">10. Limitations of liability</a>
                  <a href="#terms-11" className="py-1 hover:text-primary transition-colors">11. Governing law & jurisdiction</a>
                </div>
              )}

              {activeTab === "dpa" && (
                <div className="flex flex-col gap-1 text-xs text-ink-secondary">
                  <a href="#dpa-1" className="py-1 hover:text-primary transition-colors font-semibold text-primary">1. Parties: Fiduciary & Processor</a>
                  <a href="#dpa-2" className="py-1 hover:text-primary transition-colors">2. Purpose & documented instructions</a>
                  <a href="#dpa-3" className="py-1 hover:text-primary transition-colors">3. Categories of data subjects</a>
                  <a href="#dpa-4" className="py-1 hover:text-primary transition-colors">4. Technical security measures</a>
                  <a href="#dpa-5" className="py-1 hover:text-primary transition-colors">5. Authorized sub-processors</a>
                  <a href="#dpa-6" className="py-1 hover:text-primary transition-colors">6. Data breach notifications</a>
                  <a href="#dpa-7" className="py-1 hover:text-primary transition-colors">7. Facilitation of data rights</a>
                  <a href="#dpa-8" className="py-1 hover:text-primary transition-colors">8. Time-bounded support access</a>
                  <a href="#dpa-9" className="py-1 hover:text-primary transition-colors">9. Complete data return & purge</a>
                  <a href="#dpa-10" className="py-1 hover:text-primary transition-colors">10. Audits & statutory term</a>
                </div>
              )}
            </nav>

            {/* Main Article Content */}
            <article className="flex-1 bg-white border border-line rounded-hero p-6 sm:p-10 space-y-8 shadow-xs">
              
              {/* PRIVACY POLICY */}
              {activeTab === "privacy" && (
                <div className="space-y-8 text-sm sm:text-[15px] text-ink-body2 leading-relaxed">
                  <p className="text-base text-ink font-medium">
                    This policy explains how guruConnect handles personal data on our website and in our cloud software, and how India's <strong>Digital Personal Data Protection Act, 2023 (DPDP)</strong> applies. Student, parent, and staff data entered inside an institution's account belongs 100% to that institution; we act solely as a secure data processor.
                  </p>

                  <section id="privacy-1" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">1. Who we are</h2>
                    <p>guruConnect Technologies Private Limited is a registered Indian company with headquarters in Jaipur, Rajasthan. You can contact our data protection team directly at <a href="mailto:privacy@guruconnect.in" className="text-primary hover:underline">privacy@guruconnect.in</a>.</p>
                  </section>

                  <section id="privacy-2" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">2. What this policy covers</h2>
                    <p>This policy covers visitors to our marketing website, users booking interactive demos or signing up for trials, and schools deploying our SaaS ERP modules. Data uploaded inside a school tenant is governed by the school's own internal policies and our Data Processing Agreement.</p>
                  </section>

                  <section id="privacy-3" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">3. Data we collect</h2>
                    <p>We collect contact details provided during demo bookings, account registration identifiers (principal mobile number, email, school affiliation), authentication logs, and payment records processed securely by RBI-authorized payment aggregators.</p>
                  </section>

                  <section id="privacy-4" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">4. How we use it</h2>
                    <p>Data is used exclusively to operate the campus management services, deliver automated attendance SMS/WhatsApp alerts, process online fee collections, maintain audit trails, and provide requested customer support.</p>
                  </section>

                  <section id="privacy-5" className="space-y-2 pt-6 border-t border-line/60 bg-primary-row/40 p-4 rounded-card border border-primary-tint">
                    <h2 className="text-lg font-bold text-ink flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      5. Children's data & DPDP Act compliance
                    </h2>
                    <p>We enforce strict adherence to the DPDP Act 2023 regulations regarding minors. Schools must obtain verifiable parental consent during enrollment. We never track children's behavior across web platforms, and we strictly forbid targeted commercial advertising anywhere on student or parent portals.</p>
                  </section>

                  <section id="privacy-6" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">6. Sharing & service providers</h2>
                    <p>We work only with vetted infrastructure partners: MeitY-empanelled Indian cloud hosting providers, DLT-registered SMS gateways, and RBI-regulated payment aggregators (e.g. Razorpay, Cashfree). We NEVER sell student or institutional records.</p>
                  </section>

                  <section id="privacy-7" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">7. Where data is stored (Data residency)</h2>
                    <p>In full compliance with Indian data sovereignty laws, all production databases, application servers, encrypted object storage, and daily automated backups reside physically inside Tier-4 data centers within the Republic of India.</p>
                  </section>

                  <section id="privacy-8" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">8. Retention & backups</h2>
                    <p>Institutional databases maintain automated point-in-time recovery backups. Upon contract termination or cancellation, schools can download their entire history in Excel/CSV formats, after which data is purged in accordance with our retention schedule.</p>
                  </section>

                  <section id="privacy-9" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">9. Your statutory rights</h2>
                    <p>Under the DPDP Act, individuals have the right to access, rectify, or request erasure of their personal data. Parents and students should direct their requests to their school administration, who have administrative tools in guruConnect to update records instantly.</p>
                  </section>

                  <section id="privacy-10" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">10. Cookies & telemetry</h2>
                    <p>We utilize strictly essential session cookies to manage authenticated sessions. Analytics cookies are only enabled if you explicitly click "Accept analytics" in our cookie banner.</p>
                  </section>

                  <section id="privacy-11" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">11. Technical security</h2>
                    <p>All traffic is encrypted using TLS 1.3 in transit and AES-256 at rest. Sensitive fields like Aadhaar and staff bank account numbers are masked. Role-based isolation ensures staff view only their assigned classes.</p>
                  </section>

                  <section id="privacy-12" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">12. Grievance officer contact</h2>
                    <p>In accordance with the Information Technology Act and DPDP guidelines, our designated Grievance Officer is:</p>
                    <div className="bg-surface-subtle p-3.5 rounded-card border border-line text-xs font-mono">
                      <div>Name: Priya R. (Compliance Officer)</div>
                      <div>Email: grievance@guruconnect.in</div>
                      <div>Address: guruConnect Technologies Pvt. Ltd., Sitapura Industrial Area, Jaipur 302022</div>
                    </div>
                  </section>
                </div>
              )}

              {/* TERMS OF USE */}
              {activeTab === "terms" && (
                <div className="space-y-8 text-sm sm:text-[15px] text-ink-body2 leading-relaxed">
                  <p className="text-base text-ink font-medium">
                    These Terms of Use govern the subscription agreement between guruConnect Technologies Private Limited and the school, coaching institute, or academic trust subscribing to the guruConnect ERP system.
                  </p>

                  <section id="terms-1" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">1. Agreement & authority to sign</h2>
                    <p>By creating an account or activating a trial, you represent that you are an authorized representative (Principal, Director, Trustee, or Administrator) with the legal authority to bind the school or institution to these terms.</p>
                  </section>

                  <section id="terms-2" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">2. Accounts, roles & credentials</h2>
                    <p>The institution is responsible for maintaining the confidentiality of admin credentials and assigning appropriate roles to staff, teachers, and accountants. Two-step mobile verification is enforced for administrative logins.</p>
                  </section>

                  <section id="terms-3" className="space-y-2 pt-6 border-t border-line/60 bg-primary-row/40 p-4 rounded-card border border-primary-tint">
                    <h2 className="text-lg font-bold text-ink">3. 30-Day free trial terms</h2>
                    <p>Every new school is eligible for a full-featured 30-day free trial. No credit card is required to begin. During the trial period, the institution has access to all core modules, onboarding import assistance, and live customer support.</p>
                  </section>

                  <section id="terms-4" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">4. Plans, pricing per student & taxes</h2>
                    <p>Subscriptions are billed per active student per academic year. Optional modules (such as Transport, Library, or WhatsApp automation) can be enabled on-demand. All published prices exclude applicable Goods and Services Tax (GST).</p>
                  </section>

                  <section id="terms-5" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">5. Invoices, payment & renewals</h2>
                    <p>Invoices are generated upon plan selection and payable via Bank NEFT/RTGS, UPI, or Credit Card. A grace period of 15 days is provided on annual renewals before accounts transition to read-only status.</p>
                  </section>

                  <section id="terms-6" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">6. Acceptable campus use</h2>
                    <p>The service must only be used for legitimate educational, academic, and administrative operations. Sending unauthorized promotional bulk SMS or abusing messaging credits is strictly prohibited.</p>
                  </section>

                  <section id="terms-7" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">7. School ownership of data</h2>
                    <p>The school retains 100% proprietary ownership of all data, marks, records, fee collections, and ledgers uploaded to the platform. guruConnect holds zero ownership claim over your institutional data.</p>
                  </section>

                  <section id="terms-8" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">8. Uptime & support commitments</h2>
                    <p>guruConnect targets a 99.8% service uptime availability, excluding scheduled maintenance conducted outside standard school operational hours. Phone, ticket, and WhatsApp support is provided during working days.</p>
                  </section>

                  <section id="terms-9" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">9. Cancellation & export guarantee</h2>
                    <p>Schools may cancel subscriptions at the end of their academic billing cycle. We guarantee comprehensive export tools allowing schools to extract all student, staff, and ledger data without lock-in penalties.</p>
                  </section>

                  <section id="terms-10" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">10. Limitations of liability</h2>
                    <p>Neither party shall be liable for indirect, punitive, or consequential damages. Maximum aggregate liability is limited to the fees paid by the institution in the preceding twelve months.</p>
                  </section>

                  <section id="terms-11" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">11. Governing law & jurisdiction</h2>
                    <p>These terms are governed by the laws of India. The courts of Jaipur, Rajasthan shall have exclusive jurisdiction over any disputes arising from this agreement.</p>
                  </section>
                </div>
              )}

              {/* DATA PROCESSING AGREEMENT */}
              {activeTab === "dpa" && (
                <div className="space-y-8 text-sm sm:text-[15px] text-ink-body2 leading-relaxed">
                  <p className="text-base text-ink font-medium">
                    This Data Processing Agreement (DPA) supplements the Terms of Use and defines how guruConnect processes personal data on behalf of subscribing educational institutions under the <strong>Digital Personal Data Protection Act, 2023</strong>.
                  </p>

                  <section id="dpa-1" className="space-y-2 pt-6 border-t border-line/60 bg-primary-row/40 p-4 rounded-card border border-primary-tint">
                    <h2 className="text-lg font-bold text-ink">1. Parties & statutory roles</h2>
                    <p>The <strong>School or Academic Institution</strong> is the <strong>Data Fiduciary</strong> determining the purpose and means of student and parent data. <strong>guruConnect Technologies Pvt. Ltd.</strong> is the <strong>Data Processor</strong> handling data strictly on the Fiduciary's documented instructions.</p>
                  </section>

                  <section id="dpa-2" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">2. Purpose & documented instructions</h2>
                    <p>We process personal data solely to deliver the software capabilities (admissions, attendance, fee collection, grade reporting, and communication) and never for secondary monetization or advertising.</p>
                  </section>

                  <section id="dpa-3" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">3. Categories of data subjects</h2>
                    <p>The data subjects covered under this agreement include students, parents/guardians, teaching staff, non-teaching employees, and campus visitors.</p>
                  </section>

                  <section id="dpa-4" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">4. Technical & organizational security</h2>
                    <p>We implement industry-standard safeguards including AES-256 encryption at rest, TLS 1.3 transit encryption, strict role-based access control (RBAC), multi-factor authentication, and immutable audit logs for sensitive operations.</p>
                  </section>

                  <section id="dpa-5" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">5. Authorized sub-processors</h2>
                    <p>Sub-processors are engaged solely for technical infrastructure (cloud hosting, transactional SMS, email notifications, payment processing). Sub-processors are bound by data processing standards matching or exceeding this agreement.</p>
                  </section>

                  <section id="dpa-6" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">6. Personal data breach notification</h2>
                    <p>In the event of a confirmed personal data breach affecting school records, guruConnect will notify the school administrator without undue delay and assist the school in meeting any statutory reporting obligations to the Data Protection Board of India.</p>
                  </section>

                  <section id="dpa-7" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">7. Facilitation of data rights</h2>
                    <p>We provide administrative software features enabling the school to fulfill requests for data access, correction, update, and erasure initiated by parents or staff.</p>
                  </section>

                  <section id="dpa-8" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">8. Time-bounded support access</h2>
                    <p>guruConnect technical support personnel cannot view private school records unless explicitly granted temporary, time-bounded permission by the school's master administrator. All support actions are audited and logged.</p>
                  </section>

                  <section id="dpa-9" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">9. Data return & purge</h2>
                    <p>Upon contract expiration, the school has a 30-day window to export all digital databases. After the retention grace period, all institutional data is permanently deleted from primary servers and subsequent backup rotations.</p>
                  </section>

                  <section id="dpa-10" className="space-y-2 pt-6 border-t border-line/60">
                    <h2 className="text-lg font-bold text-ink">10. Audits & statutory term</h2>
                    <p>This agreement remains in effect for the duration of the institution's active subscription. The school may request third-party security audit reports and compliance attestations upon reasonable notice.</p>
                  </section>
                </div>
              )}

            </article>

          </div>

        </div>
      </section>

      <PublicFooter onOpenDemoModal={() => setShowDemoModal(true)} />
      <CookieNotice />
      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  );
}
