import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PublicHeader, PublicFooter } from "../components/landing/PublicLayoutElements";
import { BookDemoModal } from "../components/landing/BookDemoModal";
import { CookieNotice } from "../components/landing/CookieNotice";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2
} from "lucide-react";

export default function Contact() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [inquiryType, setInquiryType] = useState<"sales" | "support" | "billing" | "other">("sales");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    institution: "",
    email: "",
    message: "",
    consentWhatsApp: true
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      alert("Please enter your name, mobile number and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-page text-ink font-sans flex flex-col">
      <PublicHeader onOpenDemoModal={() => setShowDemoModal(true)} />

      {/* Main Container */}
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-dark bg-primary-tint border border-primary-soft/40 px-3.5 py-1.5 rounded-full">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
              Talk to us
            </h1>
            <p className="text-base sm:text-lg text-ink-body2 leading-relaxed">
              Questions before you start, help with your existing school account, or a billing inquiry — pick the right team below or drop us a direct message.
            </p>
          </div>

          {/* 3 Department Route Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* New Schools */}
            <div className="bg-white border border-line rounded-card-m p-6 flex flex-col justify-between shadow-xs hover:border-primary-soft transition-all">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase text-primary">New Schools</span>
                <h2 className="text-xl font-bold text-ink">Thinking of switching?</h2>
                <p className="text-sm text-ink-body2 leading-relaxed">
                  See a live guided demo, ask about transferring your existing Excel data, or get a custom group discount.
                </p>
                <div className="pt-2 text-sm font-semibold text-ink flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-control shadow-2xs transition-colors"
                >
                  Book a demo
                </button>
              </div>
            </div>

            {/* Existing Customers */}
            <div className="bg-white border border-line rounded-card-m p-6 flex flex-col justify-between shadow-xs hover:border-primary-soft transition-all">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase text-primary">Existing Customers</span>
                <h2 className="text-xl font-bold text-ink">Need account assistance?</h2>
                <p className="text-sm text-ink-body2 leading-relaxed">
                  The fastest way is <strong>Help → Raise a ticket</strong> inside your school dashboard; it automatically connects with your campus records.
                </p>
                <div className="pt-2 text-sm font-semibold text-ink flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@guruconnect.in</span>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  to="/auth/login"
                  className="w-full py-2.5 bg-white border border-line-input hover:border-primary text-ink text-sm font-semibold rounded-control shadow-2xs flex items-center justify-center transition-colors"
                >
                  Log in to raise ticket
                </Link>
              </div>
            </div>

            {/* Billing */}
            <div className="bg-white border border-line rounded-card-m p-6 flex flex-col justify-between shadow-xs hover:border-primary-soft transition-all">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-wider uppercase text-primary">Billing & Accounts</span>
                <h2 className="text-xl font-bold text-ink">Invoices and payments</h2>
                <p className="text-sm text-ink-body2 leading-relaxed">
                  Questions regarding annual renewal invoices, GST certificates, SMS bundle packs or payment receipts.
                </p>
                <div className="pt-2 text-sm font-semibold text-ink flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>billing@guruconnect.in</span>
                </div>
              </div>
              <div className="pt-6">
                <a
                  href="mailto:billing@guruconnect.in"
                  className="w-full py-2.5 bg-white border border-line-input hover:border-primary text-ink text-sm font-semibold rounded-control shadow-2xs flex items-center justify-center transition-colors"
                >
                  Write to billing
                </a>
              </div>
            </div>

          </div>

          {/* Form + Aside Office Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Form Container (7 cols) */}
            <div className="lg:col-span-8 bg-white border border-line rounded-hero p-6 sm:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-success/20 text-success-text flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-ink">Message sent successfully!</h3>
                  <p className="text-sm text-ink-secondary max-w-md mx-auto">
                    Thank you, {formData.name}. Our team has received your message and will respond via phone or WhatsApp within 2-4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        mobile: "",
                        institution: "",
                        email: "",
                        message: "",
                        consentWhatsApp: true
                      });
                    }}
                    className="mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-control"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-ink">Send us a message</h2>
                    <p className="text-xs text-ink-secondary mt-1">Fill out the form below and the right department will respond quickly.</p>
                  </div>

                  {/* Inquiry Type Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-secondary">What is it about?</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "sales", label: "Sales / Demo" },
                        { id: "support", label: "Customer Support" },
                        { id: "billing", label: "Billing & Invoices" },
                        { id: "other", label: "Other" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInquiryType(item.id as any)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                            inquiryType === item.id
                              ? "bg-primary text-white shadow-xs"
                              : "bg-surface-subtle border border-line text-ink hover:border-primary-soft"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Principal / Director full name"
                        className="w-full px-3.5 py-2.5 bg-white border border-line-input rounded-control text-sm text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 bg-white border border-line-input rounded-control text-sm text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">School or Institute Name</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. Modern Academy, Jaipur"
                        className="w-full px-3.5 py-2.5 bg-white border border-line-input rounded-control text-sm text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-ink">Official Email (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="principal@school.edu"
                        className="w-full px-3.5 py-2.5 bg-white border border-line-input rounded-control text-sm text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our technical or academic team assist your school?"
                      className="w-full p-3.5 bg-white border border-line-input rounded-control text-sm text-ink placeholder:text-ink-secondary/50 focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-ink-body2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consentWhatsApp}
                      onChange={(e) => setFormData({ ...formData, consentWhatsApp: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span>You may reply to me on WhatsApp or SMS. See our <Link to="/privacy" className="text-primary hover:underline">Privacy policy</Link>.</span>
                  </label>

                  <button
                    type="submit"
                    className="px-7 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-control shadow-sm transition-all"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>

            {/* Aside Office & WhatsApp Box (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* WhatsApp Quick Chat */}
              <div className="bg-nav-bg text-nav-text rounded-card-m p-6 space-y-3 shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider text-gold">Direct Messenger</span>
                <h3 className="text-lg font-bold text-white">Chat on WhatsApp</h3>
                <p className="text-xs sm:text-sm text-nav-muted leading-relaxed">
                  Quickest for brief questions, fee plans or live walkthrough links. Available in English or Hindi.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hello%20guruConnect%20Team%2C%20I%20would%20like%20to%20inquire%20about%20the%20school%20management%20system."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-gold hover:bg-gold-hover text-nav-bg font-bold rounded-control text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp chat</span>
                </a>
              </div>

              {/* Office Details */}
              <div className="bg-white border border-line rounded-card-m p-6 space-y-4 shadow-xs text-xs sm:text-sm">
                <h3 className="text-base font-bold text-ink">Head Office</h3>
                
                <div className="space-y-1 text-ink-secondary">
                  <div className="font-bold text-ink">guruConnect Technologies Pvt. Ltd.</div>
                  <div>IT Park, Sitapura Industrial Area,</div>
                  <div>Jaipur, Rajasthan 302022, India</div>
                </div>

                <div className="pt-2 border-t border-line space-y-1 text-ink-secondary">
                  <div className="font-semibold text-ink">Working Hours</div>
                  <div>Monday to Saturday: 9:00 AM – 6:30 PM IST</div>
                  <div>Sunday: On-call emergency server monitoring</div>
                </div>

                <div className="pt-2 border-t border-line space-y-1 text-ink-secondary">
                  <div className="font-semibold text-ink">DPDP Grievance Officer</div>
                  <div>Priya R. (Officer for Data Inquiries)</div>
                  <div>Email: <a href="mailto:grievance@guruconnect.in" className="text-primary hover:underline">grievance@guruconnect.in</a></div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <PublicFooter onOpenDemoModal={() => setShowDemoModal(true)} />
      <CookieNotice />
      <BookDemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  );
}
