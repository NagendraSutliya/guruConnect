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
    <div className="bg-themeBg text-themeText overflow-hidden transition-colors duration-500">
      <SchoolPageHeader 
        title={admissionsData.bannerTitle} 
        subtitle={admissionsData.bannerSubtitle}
        bgImage={admissionsData.bannerImage || "/images/redesign/admissions_banner.png"}
      />

      {/* Process Section */}
      <section className="py-8 md:py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 dark:via-indigo-500/30 to-transparent hidden lg:block z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8 md:mb-12 space-y-4">
            <h5 className="text-[10px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.5em] animate-fadeIn">The Pathway</h5>
            <h2 className="text-xl md:text-3xl font-black text-themeText tracking-tighter">Streamlined Admission Cycle</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 relative">
            {/* Horizontal connector line for desktop */}
            <div className="absolute top-8 md:top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-green-500/30 dark:via-indigo-500/30 to-transparent hidden md:block z-0" />

            {(admissionsData.steps || []).map((item, i) => (
              <div key={i} className="group relative text-center space-y-4 md:space-y-8 animate-fadeIn" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-themeCard border border-themeBorder flex items-center justify-center text-2xl md:text-4xl text-green-500 dark:text-indigo-400 mx-auto group-hover:bg-green-600 dark:group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)] dark:shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <MdAssignment className="relative z-10" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 md:w-10 md:h-10 rounded-full bg-themeBg border-2 border-green-600/30 dark:border-indigo-600/30 flex items-center justify-center text-[9px] md:text-[11px] font-black text-green-500 dark:text-indigo-400 dark:group-hover:text-white group-hover:border-white/50 transition-all">
                    {item.step}
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3 px-1 md:px-2">
                  <h4 className="text-sm md:text-xl font-black text-themeText tracking-tight group-hover:text-green-500 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                  <p className="text-[10px] md:text-sm text-themeTextSec font-bold leading-relaxed max-w-[220px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Criteria & Matrix */}
      <section className="py-8 md:py-16 bg-themeBgSec border-y border-themeBorder">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-4 md:space-y-10">
              <div className="space-y-2 md:space-y-4">
                <h5 className="text-[10px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Eligibility</h5>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Grades & Age Matrix</h2>
                <p className="text-themeTextSec font-medium leading-relaxed">
                  We follow a standardized age criteria to ensure that children are socially and emotionally ready for their respective grade levels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(admissionsData.matrix || []).map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-4 md:p-7 rounded-2xl md:rounded-[2rem] bg-themeBg border border-themeBorder hover:border-green-500/40 dark:hover:border-indigo-500/40 hover:bg-themeCard transition-all duration-500 group">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-widest opacity-60 group-hover:opacity-100">Grade Level</p>
                      <span className="font-black text-base text-themeText tracking-tight uppercase">{row.grade}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-themeTextSec uppercase tracking-widest">Age Criteria</p>
                      <span className="text-sm font-black text-themeTextSec">{row.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-10 bg-green-500/10 dark:bg-indigo-500/10 blur-[80px] rounded-full" />
              <div className="relative bg-themeCard backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-themeBorder shadow-2xl space-y-4 md:space-y-8">
                <div className="flex items-center gap-4 text-green-500 dark:text-indigo-400">
                  <MdInfoOutline size={24} />
                  <h4 className="font-black uppercase tracking-widest text-xs">Note to Parents</h4>
                </div>
                <p className="text-themeTextSec text-sm font-medium leading-relaxed italic">
                  "Choosing a school is one of the most important decisions for your child's future. We encourage you to visit our campus, interact with our faculty, and witness our learning culture firsthand."
                </p>
                <div className="pt-6 border-t border-themeBorder">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 dark:bg-indigo-600 flex items-center justify-center font-black text-white">26</div>
                      <div>
                         <p className="text-[10px] font-black text-themeTextSec uppercase tracking-widest">Available Seats</p>
                         <p className="text-sm font-bold text-themeText">Admissions Open for 2026-27</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="py-8 md:py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
             <div className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-themeBorder shadow-2xl">
                <img src="/images/redesign/admissions_checklist.png" alt="Documents" className="w-full h-full object-cover opacity-80" />
             </div>
             <div className="absolute -bottom-6 -right-6 p-6 md:p-8 bg-green-500 dark:bg-indigo-600 rounded-3xl shadow-2xl animate-float">
                <MdCloudUpload size={24} className="text-white" />
             </div>
          </div>
          
          <div className="lg:col-span-7 space-y-6 md:space-y-10 order-1 lg:order-2">
            <div className="space-y-2 md:space-y-4">
              <h5 className="text-[10px] font-black text-green-500 dark:text-indigo-400 uppercase tracking-[0.4em]">Verification</h5>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Required Documents</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {(admissionsData.documents || []).map((doc, i) => (
                <div key={i} className="group flex items-center gap-3 md:gap-5 p-3 md:p-5 rounded-[1.5rem] bg-themeCard border border-themeBorder hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/5">
                    <MdCheckCircle size={20} />
                  </div>
                  <span className="text-[13px] font-black text-themeTextSec group-hover:text-themeText transition-colors">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-16 bg-themeBgSec border-t border-themeBorder">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4">
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-themeText tracking-tight">Common Inquiries</h2>
             <p className="text-themeTextSec text-sm font-medium">Everything you need to know about the admission cycle.</p>
          </div>

          <div className="space-y-2 md:space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-themeCard border border-themeBorder overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-themeBgSec transition-colors"
                >
                  <span className="font-bold text-sm text-themeText">{faq.q}</span>
                  <div className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`}>
                    <MdAdd size={20} className="text-green-500 dark:text-indigo-500" />
                  </div>
                </button>
                <div className={`px-4 md:px-6 transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-40 pb-4 md:pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-xs text-themeTextSec leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-8 md:p-12 lg:p-20 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-r from-green-600 to-indigo-400 dark:from-blue-600 dark:to-indigo-400 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="space-y-4 max-w-xl">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">Ready to join our community?</h2>
                <p className="text-indigo-100 font-medium">Start your digital application today and secure a seat for the 2026-27 academic session.</p>
              </div>
              <button className="flex items-center gap-3 px-4 py-2 md:px-10 md:py-5 bg-white text-green-600 dark:text-indigo-600 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-50 dark:hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 shrink-0">
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
