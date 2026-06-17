import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdSend } from "react-icons/md";

const SchoolContact = () => {
  const [fetching, setFetching] = useState(true);
  const [contactData, setContactData] = useState({
    bannerTitle: "Connect With Us",
    bannerSubtitle: "Have questions? Our administrative team is here to support you in every step of your journey.",
    bannerImage: "/images/redesign/hero.png",
    addressTitle: "Campus Address",
    addressDetail: "80 Feet Road, Mahesh Nagar, Jaipur, Rajasthan",
    phoneTitle: "Contact Support",
    phoneDetail: "+91 9425847076 | +91 9782994277",
    emailTitle: "Email Inquiry",
    emailDetail: "info@gyansthali.edu | admissions@gyansthali.edu",
    hoursTitle: "Operation Hours",
    hoursDetail: "Mon - Sat: 9:00 AM - 4:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28490.04604907973!2d75.7725835743164!3d26.880665999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db40a9257697b%3A0x892976f626c8a514!2sMahesh%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/contact');
        if (response.data.success && response.data.data) {
          setContactData(prev => ({ ...prev, ...response.data.data }));
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchContactData();
  }, []);

  const contactItems = [
    { icon: <MdLocationOn />, title: contactData.addressTitle, detail: contactData.addressDetail },
    { icon: <MdPhone />, title: contactData.phoneTitle, detail: contactData.phoneDetail },
    { icon: <MdEmail />, title: contactData.emailTitle, detail: contactData.emailDetail },
    { icon: <MdAccessTime />, title: contactData.hoursTitle, detail: contactData.hoursDetail },
  ];

  return (
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      <SchoolPageHeader 
        title={contactData.bannerTitle} 
        subtitle={contactData.bannerSubtitle}
        bgImage={contactData.bannerImage || "/images/redesign/hero.png"}
      />

      <section className="py-8 md:py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20">
          <div className="lg:col-span-5 space-y-4 md:space-y-12">
            <div className="space-y-2 md:space-y-4">
              <h5 className="text-[10px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.5em] animate-fadeIn">Get In Touch</h5>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tighter">Human Support. <br />Global Standards.</h2>
              <p className="text-themeTextSec font-bold text-sm opacity-80 leading-relaxed max-w-md">Our administrative office is open from Monday to Saturday to assist you with every query regarding our ecosystem.</p>
            </div>

            <div className="space-y-4 md:space-y-8">
              {contactItems.map((item, i) => (
                <div key={i} className="flex gap-6 group animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-14 h-14 rounded-2xl bg-themeCard border border-themeBorder text-green-500 dark:text-indigo-400 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-green-600 dark:group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-2xl">
                    {item.icon}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-black text-themeText text-[10px] uppercase tracking-[0.2em] mb-2 group-hover:text-green-500 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                    <p className="text-themeTextSec text-xs font-bold leading-relaxed whitespace-pre-line">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-themeCard backdrop-blur-3xl rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 border border-themeBorder shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/5 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-600/10 dark:group-hover:bg-indigo-600/10 transition-all duration-1000" />
              <h3 className="text-xl font-black text-themeText mb-4 md:mb-10 tracking-tight flex items-center gap-3">
                 <MdEmail className="text-green-500 dark:text-indigo-500" />
                 Official Inquiry Form
              </h3>
              <form className="space-y-4 md:space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[9px] font-black text-themeTextSec uppercase tracking-widest ml-1">Full Name</label>
                    <input className="w-full bg-themeBg border border-themeBorder rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-4 outline-none focus:bg-themeCard focus:border-green-500/50 dark:focus:border-indigo-500/50 transition-all font-black text-themeText text-sm placeholder:text-themeTextSec/50" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[9px] font-black text-themeTextSec uppercase tracking-widest ml-1">Email Address</label>
                    <input className="w-full bg-themeBg border border-themeBorder rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-4 outline-none focus:bg-themeCard focus:border-green-500/50 dark:focus:border-indigo-500/50 transition-all font-black text-themeText text-sm placeholder:text-themeTextSec/50" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] font-black text-themeTextSec uppercase tracking-widest ml-1">Inquiry Subject</label>
                  <input className="w-full bg-themeBg border border-themeBorder rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-4 outline-none focus:bg-themeCard focus:border-green-500/50 dark:focus:border-indigo-500/50 transition-all font-black text-themeText text-sm placeholder:text-themeTextSec/50" placeholder="e.g. Admission Query for Class XI" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="text-[9px] font-black text-themeTextSec uppercase tracking-widest ml-1">Detailed Message</label>
                  <textarea rows={4} className="w-full bg-themeBg border border-themeBorder rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-4 outline-none focus:bg-themeCard focus:border-green-500/50 dark:focus:border-indigo-500/50 transition-all font-bold text-themeText text-sm placeholder:text-themeTextSec/50 no-scrollbar" placeholder="How can our administrative team support you today?" />
                </div>
                <button className="flex items-center justify-center gap-4 w-full py-3 md:py-5 bg-green-600 dark:bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-green-500/20 dark:shadow-indigo-500/20 active:scale-95 mt-6 overflow-hidden relative group/btn">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  <MdSend size={20} className="relative z-10" />
                  <span className="relative z-10">Send Secure Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-auto border-t border-themeBorder" />  

      <section className="h-[400px] md:h-[500px] w-full bg-themeBg grayscale contrast-125 opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 border-t border-themeBorder relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-themeBg via-transparent to-themeBg z-10 pointer-events-none" />
        <iframe 
          src={contactData.mapEmbedUrl} 
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
