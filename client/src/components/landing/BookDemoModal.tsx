import { useState } from "react";
import { X, Calendar, CheckCircle2, MapPin, Building, User, Phone, Mail } from "lucide-react";

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial?: () => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose, onStartTrial }) => {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [formData, setFormData] = useState({
    name: "",
    role: "Principal",
    instituteName: "",
    city: "",
    studentCount: "500–1,000",
    currentSoftware: "Registers and Excel",
    mobile: "",
    email: "",
    format: "Online (video call)",
    language: "Hindi",
    date: "Tomorrow",
    timeSlot: "11:00 am - 11:30 am"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmed");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-page rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-line flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-ink-secondary hover:text-ink hover:bg-black/5 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Context & Trust Banner */}
        <div className="w-full md:w-[340px] bg-nav-bg text-nav-text p-6 md:p-8 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="/guruconnect-logo.png" 
                alt="guruConnect Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="font-extrabold text-white text-lg tracking-tight">
                guru<span className="text-gold">Connect</span>
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              See it working for a school like yours
            </h3>
            <p className="text-nav-muted text-xs md:text-sm mb-6 leading-relaxed">
              A 30-minute interactive live walkthrough with our onboarding specialist. Free, custom to your board & zero obligation.
            </p>

            <ul className="space-y-3.5 text-xs md:text-sm">
              <li className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white block font-medium">Customized for your board</strong>
                  <span className="text-nav-muted text-xs">CBSE or State Board report cards & fee setups.</span>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white block font-medium">Hindi or English</strong>
                  <span className="text-nav-muted text-xs">Comfortable explanation for both management & staff.</span>
                </span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white block font-medium">Data migration guidance</strong>
                  <span className="text-nav-muted text-xs">How to switch smoothly from Excel registers.</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-nav-divider text-xs text-nav-muted mt-6">
            Want to test by yourself?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onStartTrial) onStartTrial();
              }}
              className="text-gold font-semibold hover:underline"
            >
              Start free trial
            </button>
          </div>
        </div>

        {/* Right Side: Form or Confirmation */}
        <div className="flex-1 bg-surface p-6 md:p-8 overflow-y-auto">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Quick Scheduling</span>
                <h2 className="text-xl md:text-2xl font-bold text-ink">Book your personalised demo</h2>
                <p className="text-xs text-ink-secondary mt-0.5">Fill basic details and pick your convenient slot.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Suresh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Your Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>School Owner / Director</option>
                    <option>Principal</option>
                    <option>Administrator / Manager</option>
                    <option>Accountant</option>
                    <option>Coaching Head</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">School / Institute Name *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Bright Future Public School"
                      value={formData.instituteName}
                      onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">City *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Number of Students *</label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-3 py-2 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>Under 300</option>
                    <option>300 – 600</option>
                    <option>600 – 1,200</option>
                    <option>1,200 – 3,000</option>
                    <option>Over 3,000 / Multi-Branch Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">What do you use today?</label>
                  <select
                    value={formData.currentSoftware}
                    onChange={(e) => setFormData({ ...formData, currentSoftware: e.target.value })}
                    className="w-full px-3 py-2 border border-line-input rounded-control text-ink text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option>Paper Registers & Excel</option>
                    <option>Another School Software</option>
                    <option>New School (Starting Fresh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Mobile Number (WhatsApp) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      required
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-ink text-sm font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="principal@school.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-line-input rounded-control text-ink text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-2 border-t border-line space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-ink">Preferred Mode & Language:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, format: "Online (video call)" })}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                        formData.format === "Online (video call)"
                          ? "bg-primary text-white border-primary"
                          : "bg-surface border-line-input text-ink"
                      }`}
                    >
                      Online Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, format: "Visit at School" })}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                        formData.format === "Visit at School"
                          ? "bg-primary text-white border-primary"
                          : "bg-surface border-line-input text-ink"
                      }`}
                    >
                      On-site School Visit
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-xs font-medium text-ink">Language:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "Hindi" })}
                    className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
                      formData.language === "Hindi"
                        ? "bg-nav-bg text-white border-nav-bg"
                        : "bg-surface border-line-input text-ink"
                    }`}
                  >
                    Hindi (हिंदी)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: "English" })}
                    className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
                      formData.language === "English"
                        ? "bg-nav-bg text-white border-nav-bg"
                        : "bg-surface border-line-input text-ink"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-control text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-gold" />
                  Confirm & Schedule Demo
                </button>
                <span className="text-xs text-ink-secondary text-center sm:text-left">
                  Instant confirmation link sent to your WhatsApp.
                </span>
              </div>
            </form>
          ) : (
            <div className="py-4 space-y-6 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-success-bg text-success-text flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-success-text uppercase tracking-wider bg-success-bg px-2.5 py-1 rounded-full">
                  Demo Booked Successfully
                </span>
                <h2 className="text-2xl font-bold text-ink mt-2">
                  See you soon, {formData.name || "Sir/Madam"}!
                </h2>
                <p className="text-sm text-ink-secondary mt-1">
                  Our senior onboarding expert has reserved a custom 30-min walkthrough for{" "}
                  <strong>{formData.instituteName || "your institution"}</strong>.
                </p>
              </div>

              <div className="bg-page border border-line rounded-card p-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink-secondary">Mode & Language:</span>
                  <span className="font-semibold text-ink">{formData.format} · {formData.language}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink-secondary">Students & Location:</span>
                  <span className="font-semibold text-ink">{formData.studentCount} · {formData.city || "India"}</span>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink-secondary">Confirmation Sent:</span>
                  <span className="font-semibold text-ink font-mono">{formData.mobile || "Verified Mobile"}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ink-secondary">Booking Reference:</span>
                  <span className="font-mono font-bold text-primary">DEMO-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-ink-secondary">
                <p className="font-semibold text-ink">What happens next?</p>
                <p>1. Video call invitation and Google Calendar invite sent to your WhatsApp/Email.</p>
                <p>2. We will bring sample CBSE/RBSE report cards and mock student records for your review.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-control hover:bg-primary-dark transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
