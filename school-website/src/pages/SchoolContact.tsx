import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdSend } from "react-icons/md";

export default function SchoolContact() {
  return (
    <div className="animate-fadeIn">
      <SchoolPageHeader 
        title="Get In Touch" 
        subtitle="Have questions? We're here to help. Reach out to us for any queries regarding admissions, academics, or campus visits."
        bgImage="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Contact Information</h2>
              <p className="text-slate-500 font-medium">Our administrative office is open from Monday to Saturday to assist you.</p>
            </div>

            <div className="space-y-8">
              {[
                { icon: <MdLocationOn />, title: "Our Location", detail: "123 Educational Square, Knowledge City, Bangalore, IN 560001" },
                { icon: <MdPhone />, title: "Call Us", detail: "+91 (800) 123-4567 | +91 (800) 123-4568" },
                { icon: <MdEmail />, title: "Email Us", detail: "info@gyansthali.edu | admissions@gyansthali.edu" },
                { icon: <MdAccessTime />, title: "Office Hours", detail: "Mon - Sat: 9:00 AM - 4:00 PM" },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-indigo-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Admission Query" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-slate-800" placeholder="Tell us how we can help..." />
                </div>
                <button className="flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                  <MdSend size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[500px] w-full bg-slate-200 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.984763582451!2d77.5922378!3d12.971942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
        />
      </section>
    </div>
  );
}
