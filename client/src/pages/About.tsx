import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PublicHeader, PublicFooter } from "../components/landing/PublicLayoutElements";
import { BookDemoModal } from "../components/landing/BookDemoModal";
import { CookieNotice } from "../components/landing/CookieNotice";
import { 
  Building2, 
  GraduationCap
} from "lucide-react";

export default function About() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
      <PublicHeader 
        onOpenDemoModal={() => setShowDemoModal(true)} 
      />

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-b from-primary-tint/50 via-primary-row to-surface-subtle border-b border-line">
        <div className="max-w-[860px] mx-auto flex flex-col items-start gap-5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-dark bg-primary-tint border border-primary-soft/40 px-3.5 py-1.5 rounded-full">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-ink">
            School work should take less time than teaching.
          </h1>
          <p className="text-base sm:text-xl text-ink-body2 leading-relaxed">
            Most schools in India still run on registers, Excel sheets, long WhatsApp groups and fee follow-up calls. Principals spend evenings on paperwork, accountants re-type the same numbers, and parents hear about an absence only at the end of the term. We are building one system that takes that work off the school's desk.
          </p>
        </div>
      </section>

      {/* What We Believe (4 Beliefs) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-line">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              What we believe
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-3 shadow-2xs hover:border-primary-soft hover:bg-white hover:shadow-md transition-all">
              <span className="font-mono text-sm font-bold text-primary">01</span>
              <h3 className="text-lg font-bold text-ink">The school owns its data</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                We process it only to run the school's software. Schools can export everything, any time, and we never sell or share it for advertising.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-3 shadow-2xs hover:border-primary-soft hover:bg-white hover:shadow-md transition-all">
              <span className="font-mono text-sm font-bold text-primary">02</span>
              <h3 className="text-lg font-bold text-ink">Parents should know the same day</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Absence, fees, homework and results should reach families when they happen, not weeks later.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-3 shadow-2xs hover:border-primary-soft hover:bg-white hover:shadow-md transition-all">
              <span className="font-mono text-sm font-bold text-primary">03</span>
              <h3 className="text-lg font-bold text-ink">Built for Hindi and English</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Office staff, teachers and parents should work in the language they are comfortable with.
              </p>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex flex-col gap-3 shadow-2xs hover:border-primary-soft hover:bg-white hover:shadow-md transition-all">
              <span className="font-mono text-sm font-bold text-primary">04</span>
              <h3 className="text-lg font-bold text-ink">Fair, simple pricing</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Pay per active student, see the price before you talk to anyone, and start with a free trial.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Who We Build For */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-surface-subtle border-b border-line">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Target Institutions</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Who we build for
            </h2>
            <p className="text-base text-ink-body2 leading-relaxed">
              Private schools, coaching institutes and school groups across India, starting with CBSE, RBSE and State Board institutions.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-line rounded-card p-6 space-y-2 border-t-4 border-t-primary shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-primary-tint flex items-center justify-center text-primary mb-2">
                <School className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">K-12 Schools</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Nursery to Class XII, one campus or several, with board-ready report cards, TC generation and fee receipt vouchers.
              </p>
            </div>

            <div className="bg-white border border-line rounded-card p-6 space-y-2 border-t-4 border-t-primary shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-primary-tint flex items-center justify-center text-primary mb-2">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">Coaching Institutes</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Courses and batches instead of classes, installment plans, test tracking and instantaneous absent alerts.
              </p>
            </div>

            <div className="bg-white border border-line rounded-card p-6 space-y-2 border-t-4 border-t-primary shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-primary-tint flex items-center justify-center text-primary mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-ink">School Trusts</h3>
              <p className="text-sm text-ink-body2 leading-relaxed">
                Several branches under one central trust, with consolidated management analytics, branch-wise accounts and audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Team Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-b border-line">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Our Team</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Passionate educators & engineers
            </h2>
            <p className="text-sm text-ink-secondary">
              We are a dedicated team headquartered in Rajasthan, building software tailored specifically to Indian educational realities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-primary-tint border border-primary-soft flex items-center justify-center text-primary font-bold text-lg shrink-0">
                NS
              </div>
              <div>
                <h4 className="text-base font-bold text-ink">Nagendra S.</h4>
                <div className="text-xs font-semibold text-primary">Founder & Engineering Lead</div>
                <div className="text-xs text-ink-secondary mt-1">Ex-EdTech, product engineering and systems architecture.</div>
              </div>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-primary-tint border border-primary-soft flex items-center justify-center text-primary font-bold text-lg shrink-0">
                AK
              </div>
              <div>
                <h4 className="text-base font-bold text-ink">Amit Kumar</h4>
                <div className="text-xs font-semibold text-primary">School Success & Onboarding</div>
                <div className="text-xs text-ink-secondary mt-1">10+ years working directly with school principals and CBSE affiliations.</div>
              </div>
            </div>

            <div className="bg-surface-subtle border border-line rounded-card-m p-6 flex items-center gap-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-primary-tint border border-primary-soft flex items-center justify-center text-primary font-bold text-lg shrink-0">
                PR
              </div>
              <div>
                <h4 className="text-base font-bold text-ink">Priya R.</h4>
                <div className="text-xs font-semibold text-primary">Product & Security Compliance</div>
                <div className="text-xs text-ink-secondary mt-1">DPDP 2023 compliance specialist and user experience researcher.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 px-4 sm:px-6 bg-page">
        <div className="max-w-[1200px] mx-auto bg-primary rounded-hero p-8 sm:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              See whether it fits your school
            </h2>
            <p className="text-sm sm:text-base text-primary-tint/90 leading-relaxed">
              Try it free for 30 days, or let us show you around with an interactive demo personalized for your institution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              to="/auth/register"
              className="px-7 py-3.5 bg-gold hover:bg-gold-hover text-nav-bg font-bold rounded-control text-sm sm:text-base shadow-md transition-all active:scale-[0.98] text-center"
            >
              Start free trial
            </Link>

            <button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-3.5 bg-transparent hover:bg-white/10 border border-primary-soft text-white font-semibold rounded-control text-sm sm:text-base transition-all text-center"
            >
              Book a demo
            </button>
          </div>
        </div>
      </section>

      <PublicFooter onOpenDemoModal={() => setShowDemoModal(true)} />
      <CookieNotice />
      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  );
}

function School(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
      <path d="M18 5v17"/>
      <path d="m4 6 8-4 8 4"/>
      <path d="M6 5v17"/>
      <circle cx="12" cy="9" r="2"/>
    </svg>
  );
}
