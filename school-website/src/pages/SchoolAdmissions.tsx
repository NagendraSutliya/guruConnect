import SchoolPageHeader from "../components/SchoolPageHeader";
import { 
  MdCheckCircle, 
  MdAssignment, 
  MdDateRange, 
  MdPayments, 
  MdArrowForward,
  MdInfoOutline,
  MdCloudUpload,
  MdVerified,
  MdHelpOutline,
  MdAdd,
  MdGroups
} from "react-icons/md";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const SchoolAdmissions = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);
  const [admissionsData, setAdmissionsData] = useState({
    bannerTitle: "Join Our Learning Community",
    bannerSubtitle: "Secure your child's future by enrolling them in an environment that fosters intellectual curiosity, emotional intelligence, and technological fluency for the 2026-27 session.",
    bannerImage: "/images/redesign/admissions_banner.png",
    steps: [
      { step: "01", title: "Online Inquiry", desc: "Begin by submitting the digital inquiry form to schedule a campus tour or virtual counseling." },
      { step: "02", title: "Campus Interaction", desc: "A personalized meeting to understand your child's needs and our educational approach." },
      { step: "03", title: "Application Review", desc: "Submission of documents and previous records for our pedagogical committee to review." },
      { step: "04", title: "Final Enrollment", desc: "Confirmation of admission followed by an orientation session for parents and students." }
    ],
    faqs: [
      { q: "What is the teacher-student ratio?", a: "We maintain a strict 1:20 ratio to ensure that every student receives individual attention and personalized guidance." },
      { q: "Do you provide international curriculum options?", a: "Yes, we offer both CBSE and IGCSE pathways, allowing students to choose a curriculum that aligns with their future goals." },
      { q: "Is transport available for all areas?", a: "Our GPS-enabled bus fleet covers a 20km radius from the campus, ensuring safe and timely pick-up/drop-off." },
      { q: "What extracurricular activities are offered?", a: "From robotics and coding to classical dance and professional sports coaching, we offer over 30+ activity clubs." }
    ],
    eligibilityTitle: "Grades & Age Matrix",
    eligibilityDesc: "We follow a standardized age criteria to ensure that children are socially and emotionally ready for their respective grade levels.",
    matrix: [
      { grade: "Nursery - KG", age: "3 - 5 Years" },
      { grade: "Grade 1 - 5", age: "6 - 10 Years" },
      { grade: "Grade 6 - 8", age: "11 - 13 Years" },
      { grade: "Grade 9 - 12", age: "14 - 17 Years" },
    ],
    documents: [
      "Birth Certificate",
      "Passport Size Photos (4)",
      "Previous Report Cards",
      "Transfer Certificate",
      "Address Proof",
      "Medical Fitness Record",
      "Parent ID Proofs",
      "Aadhar Card (Student)"
    ]
  });

  useEffect(() => {
    const fetchAdmissionsData = async () => {
      try {
        setFetching(true);
        const response = await api.get('/cms/admissions');
        if (response.data.success && response.data.data) {
          const incoming = response.data.data;
          const cleanData: any = {};
          
          Object.keys(incoming).forEach(key => {
            const val = incoming[key];
            if (Array.isArray(val)) {
              const cleanArray = val.filter(item => {
                if (typeof item === 'object') {
                  return Object.values(item).some(v => v !== "" && v !== null);
                }
                return item !== "" && item !== null;
              });
              if (cleanArray.length > 0) cleanData[key] = cleanArray;
            } else if (val && val !== "") {
              cleanData[key] = val;
            }
          });
          
          setAdmissionsData(prev => ({ ...prev, ...cleanData }));
        }
      } catch (error) {
        console.error("Error fetching admissions data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchAdmissionsData();
  }, []);

  const faqs = admissionsData.faqs.length > 0 ? admissionsData.faqs : [
    { q: "What is the age criteria for Nursery?", a: "The child should be 3+ years old as of March 31st of the academic year." },
    { q: "Do you offer sibling discounts?", a: "Yes, we offer a 10% concession on tuition fees for the younger sibling." },
    { q: "Is there a transport facility available?", a: "Yes, we have a fleet of GPS-enabled buses covering a 15km radius." },
    { q: "What is the teacher-student ratio?", a: "We maintain a strict 1:25 ratio to ensure personalized attention." }
  ];

  return (
    <div className="bg-[#020617] text-white overflow-hidden">
      <SchoolPageHeader 
        title={admissionsData.bannerTitle} 
        subtitle={admissionsData.bannerSubtitle}
        bgImage={admissionsData.bannerImage || "/images/redesign/admissions_banner.png"}
      />

      {/* Process Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent hidden lg:block z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] animate-fadeIn">The Pathway</h5>
            <h2 className="text-4xl md:text-3xl font-black text-white tracking-tighter">Streamlined Admission Cycle</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {(admissionsData.steps || []).map((item, i) => (
              <div key={i} className="group relative text-center space-y-8 animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-4xl text-indigo-400 mx-auto group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MdAssignment className="relative z-10" />
                  <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-slate-900 border-2 border-indigo-600/30 flex items-center justify-center text-[11px] font-black text-indigo-500 group-hover:text-white group-hover:border-white/50 transition-all">
                    {item.step}
                  </div>
                </div>
                
                <div className="space-y-3 px-2">
                  <h4 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-[220px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>

                {/* Mobile/Tablet Arrow Connector */}
                {i < (admissionsData.steps?.length - 1) && (
                  <div className="lg:hidden flex justify-center py-4 text-indigo-500/20">
                    <MdArrowForward className="rotate-90 text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Criteria & Matrix */}
      <section className="py-24 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Eligibility</h5>
                <h2 className="text-4xl font-black text-white tracking-tight">Grades & Age Matrix</h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  We follow a standardized age criteria to ensure that children are socially and emotionally ready for their respective grade levels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(admissionsData.matrix || []).map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-7 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-500 group">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest opacity-60 group-hover:opacity-100">Grade Level</p>
                      <span className="font-black text-base text-white tracking-tight uppercase">{row.grade}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Age Criteria</p>
                      <span className="text-sm font-black text-slate-400">{row.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-10 bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/5 shadow-2xl space-y-8">
                <div className="flex items-center gap-4 text-indigo-400">
                  <MdInfoOutline size={24} />
                  <h4 className="font-black uppercase tracking-widest text-xs">Note to Parents</h4>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                  "Choosing a school is one of the most important decisions for your child's future. We encourage you to visit our campus, interact with our faculty, and witness our learning culture firsthand."
                </p>
                <div className="pt-6 border-t border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black">26</div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Seats</p>
                         <p className="text-sm font-bold text-white">Admissions Open for 2026-27</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
             <div className="aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="/images/redesign/admissions_checklist.png" alt="Documents" className="w-full h-full object-cover opacity-80" />
             </div>
             <div className="absolute -bottom-6 -right-6 p-8 bg-indigo-600 rounded-3xl shadow-2xl animate-float">
                <MdCloudUpload size={32} className="text-white" />
             </div>
          </div>
          
          <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Verification</h5>
              <h2 className="text-4xl font-black text-white tracking-tight">Required Documents</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(admissionsData.documents || []).map((doc, i) => (
                <div key={i} className="group flex items-center gap-5 p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/5">
                    <MdCheckCircle size={20} />
                  </div>
                  <span className="text-[13px] font-black text-slate-300 group-hover:text-white transition-colors">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-950/50 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl font-black text-white tracking-tight">Common Inquiries</h2>
             <p className="text-slate-500 text-sm font-medium">Everything you need to know about the admission cycle.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-200">{faq.q}</span>
                  <div className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`}>
                    <MdAdd size={20} className="text-indigo-500" />
                  </div>
                </button>
                <div className={`px-6 transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-12 md:p-20 rounded-[4rem] bg-indigo-600 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="space-y-4 max-w-xl">
                <h2 className="text-4xl font-black text-white tracking-tight">Ready to join our community?</h2>
                <p className="text-indigo-100 font-medium">Start your digital application today and secure a seat for the 2026-27 academic session.</p>
              </div>
              <button className="flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 shrink-0">
                Apply Online Now
                <MdArrowForward size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchoolAdmissions;
