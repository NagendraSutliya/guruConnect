import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdSend } from "react-icons/md";

const SchoolContact = () => {
  return (
    <div className="bg-[#020617] text-white overflow-hidden">
      <SchoolPageHeader 
        title="Connect With Us" 
        subtitle="Have questions? Our administrative team is here to support you in every step of your journey."
        bgImage="/images/redesign/hero.png"
      />

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-2">
              <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Get In Touch</h5>
              <h2 className="text-3xl font-black text-white tracking-tight">Contact Information</h2>
              <p className="text-slate-500 font-medium text-sm">Our administrative office is open from Monday to Saturday to assist you.</p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <MdLocationOn />, title: "Campus Address", detail: "123 Educational Square, Knowledge City, Bangalore, IN 560001" },
                { icon: <MdPhone />, title: "Contact Support", detail: "+91 (800) 123-4567 | +91 (800) 123-4568" },
                { icon: <MdEmail />, title: "Email Inquiry", detail: "info@gyansthali.edu | admissions@gyansthali.edu" },
                { icon: <MdAccessTime />, title: "Operation Hours", detail: "Mon - Sat: 9:00 AM - 4:00 PM" },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-indigo-400 flex items-center justify-center shrink-0 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-[11px] uppercase tracking-wider mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none" />
              <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase">Send us a Message</h3>
              <form className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 transition-all font-bold text-white text-sm placeholder:text-slate-700" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 transition-all font-bold text-white text-sm placeholder:text-slate-700" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                  <input className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3.5 outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 transition-all font-bold text-white text-sm placeholder:text-slate-700" placeholder="Admission Query" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea rows={4} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:bg-white/[0.07] focus:border-indigo-500/50 transition-all font-bold text-white text-sm placeholder:text-slate-700 no-scrollbar" placeholder="Tell us how we can help..." />
                </div>
                <button className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 mt-4">
                  <MdSend size={18} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="h-[400px] w-full bg-[#020617] grayscale contrast-125 opacity-40 hover:grayscale-0 hover:opacity-80 transition-all duration-1000 border-t border-white/5">
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
};

export default SchoolContact;
