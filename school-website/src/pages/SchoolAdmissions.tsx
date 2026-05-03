import SchoolPageHeader from "../components/SchoolPageHeader";
import { MdCheckCircle, MdAssignment, MdDateRange, MdPayments } from "react-icons/md";

export default function SchoolAdmissions() {
  return (
    <div className="animate-fadeIn">
      <SchoolPageHeader 
        title="Join Our Community" 
        subtitle="Start your child's journey towards excellence with our simplified admission process."
        bgImage="https://images.unsplash.com/photo-1577891729319-f6ef70014271?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admission Process</h2>
          <p className="text-slate-500 font-medium mt-4">Simple steps to secure a bright future for your child.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Enquiry", desc: "Fill out the online enquiry form or visit our campus for a tour.", icon: <MdAssignment /> },
            { step: "02", title: "Assessment", desc: "A friendly interaction or basic evaluation based on the grade level.", icon: <MdCheckCircle /> },
            { step: "03", title: "Documents", desc: "Submit required records including birth certificate and previous reports.", icon: <MdDateRange /> },
            { step: "04", title: "Confirmation", desc: "Finalize the admission with fee payment and orientation.", icon: <MdPayments /> },
          ].map((item, i) => (
            <div key={i} className="relative group p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="text-6xl font-black text-slate-50 absolute -top-4 -right-4 transition-colors group-hover:text-indigo-50">
                {item.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
                {item.icon}
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-3">{item.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[4rem] bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200">
          <div className="max-w-xl">
            <h3 className="text-3xl font-black mb-4 tracking-tight">Ready to Apply for 2024-25?</h3>
            <p className="text-indigo-100 font-medium leading-relaxed">
              Applications are currently open for all grades from Pre-Primary to High School. Limited seats available per class to ensure personalized attention.
            </p>
          </div>
          <button className="px-10 py-5 bg-white text-indigo-600 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 shrink-0">
            Apply Online Now
          </button>
        </div>
      </section>
    </div>
  );
}
