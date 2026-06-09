import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axiosInstance";
import type { Admission } from "../../../types/admin/student";

export default function PrintAdmissionForm() {
  const { id } = useParams();
  const [admission, setAdmission] = useState<Admission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const res = await api.get(`/admin/admissions`);
        const list = res.data.data;
        const adm = list.find((a: any) => a._id === id);
        if (adm) setAdmission(adm);
      } catch (err) {
        console.error("Failed to fetch admission", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmission();
  }, [id]);

  useEffect(() => {
    if (admission) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [admission]);

  if (loading) return <div className="p-10 text-center font-bold">Loading Form...</div>;
  if (!admission) return <div className="p-10 text-center font-bold text-red-500">Admission not found</div>;

  return (
    <div className="bg-white text-black p-10 max-w-4xl mx-auto font-sans min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest">GuruConnect Academy</h1>
          <p className="text-sm font-semibold uppercase text-gray-600 mt-1">Official Admission Application Form</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-gray-500">Form No: {admission._id.slice(-6).toUpperCase()}</p>
          <p className="text-xs font-bold uppercase text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="border border-black p-6 space-y-6">
        <h2 className="text-xl font-bold bg-gray-100 p-2 uppercase border-b border-black">Student Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-bold uppercase mr-2">Full Name:</span> {admission.name}</div>
          <div><span className="font-bold uppercase mr-2">Email:</span> {admission.email || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Gender:</span> {admission.gender || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Date of Birth:</span> {admission.dob ? new Date(admission.dob).toLocaleDateString() : "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Blood Group:</span> {admission.bloodGroup || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Aadhar No:</span> {admission.aadharNo || "N/A"}</div>
        </div>

        <h2 className="text-xl font-bold bg-gray-100 p-2 uppercase border-b border-black mt-6">Academic Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-bold uppercase mr-2">Target Class:</span> {admission.classId?.name || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Target Section:</span> {admission.sectionId?.name || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Previous School:</span> {admission.previousSchool || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Previous Class:</span> {admission.previousClass || "N/A"}</div>
        </div>

        <h2 className="text-xl font-bold bg-gray-100 p-2 uppercase border-b border-black mt-6">Parent/Guardian Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="font-bold uppercase mr-2">Parent Name:</span> {admission.parentName || "N/A"}</div>
          <div><span className="font-bold uppercase mr-2">Primary Phone:</span> {admission.parentPhone || "N/A"}</div>
          <div className="col-span-2"><span className="font-bold uppercase mr-2">Residential Address:</span> {admission.address || "N/A"}</div>
        </div>

        <div className="mt-10 pt-10 border-t border-dashed border-gray-400">
          <p className="text-xs text-justify mb-8 italic">
            DECLARATION: I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to the cancellation of this admission. I agree to abide by the rules and regulations of the institution.
          </p>

          <div className="flex justify-between items-end mt-16 px-10">
            <div className="text-center">
              <div className="border-b border-black w-48 mb-2"></div>
              <p className="text-xs font-bold uppercase">Signature of Parent/Guardian</p>
            </div>
            
            <div className="text-center">
              <div className="border-b border-black w-48 mb-2"></div>
              <p className="text-xs font-bold uppercase">Signature of Student</p>
            </div>

            <div className="text-center">
              <div className="border-b border-black w-48 mb-2"></div>
              <p className="text-xs font-bold uppercase">Principal / Admission Incharge</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-[10px] uppercase text-gray-500 font-bold">
        -- End of Official Admission Document --
      </div>
    </div>
  );
}
