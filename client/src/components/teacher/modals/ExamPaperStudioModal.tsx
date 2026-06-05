import React, { useState, useEffect, useRef } from "react";
import { FiPenTool, FiAward, FiClock, FiCheckCircle, FiX } from "react-icons/fi";
import api from "../../../api/axiosInstance";
import { useToast } from "../../../context/ToastContext";
import html2pdf from "html2pdf.js";

interface ExamPaperStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDetails: {
    title: string;
    marks: string;
    duration: string;
    instructions: string;
    content: string;
  };
  examId: string | null;
  subjectId: string | null;
  onSuccess: () => void;
}

const ExamPaperStudioModal: React.FC<ExamPaperStudioModalProps> = ({
  isOpen,
  onClose,
  initialDetails,
  examId,
  subjectId,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const [paperDetails, setPaperDetails] = useState(initialDetails);
  const [savingPaper, setSavingPaper] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Sync internal state if initialDetails changes (e.g. opening different exams)
  useEffect(() => {
    if (isOpen) {
      setPaperDetails(initialDetails);
    }
  }, [isOpen, initialDetails]);

  if (!isOpen) return null;

  const saveTypedPaper = async () => {
    if (!paperDetails.content.trim()) return showToast("Questions Body cannot be empty ⚠️", "warn");
    if (!examId || !subjectId) return showToast("Missing exam context ❌", "error");

    try {
      setSavingPaper(true);

      // 1. Create a hidden HTML element for the PDF
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; color: #1e293b;">
          <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">${paperDetails.title || 'Question Paper'}</h1>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            <div><strong>Total Marks:</strong> ${paperDetails.marks || 'N/A'}</div>
            <div><strong>Duration:</strong> ${paperDetails.duration || 'N/A'}</div>
          </div>

          ${paperDetails.instructions ? `
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 8px;">General Instructions</h3>
            <div style="font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${paperDetails.instructions}</div>
          </div>
          ` : ''}

          <div>
            <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 12px;">Questions</h3>
            <div style="font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${paperDetails.content}</div>
          </div>
        </div>
      `;

      // 2. Configure html2pdf options
      const opt = {
        margin:       1,
        filename:     `${paperDetails.title ? paperDetails.title.trim() : 'Question Paper'}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      // 3. Generate PDF Blob
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      // 4. Create FormData and upload
      const formData = new FormData();
      formData.append("examId", examId);
      formData.append("subjectId", subjectId);
      formData.append("type", "question");
      formData.append("files", new File([pdfBlob], opt.filename, { type: "application/pdf" }));

      await api.post("/exam-files/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showToast("Question Paper generated & saved successfully ✍️", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to generate and save paper ❌", "error");
    } finally {
      setSavingPaper(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col max-h-[95vh]"
      >
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <FiPenTool className="text-[var(--primary)]" />
              Write Question Paper
            </h2>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Configure parameters & compose questions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 sm:p-6 flex flex-col gap-6">
          
          {/* Settings Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Paper Title / Heading</label>
                <div className="relative">
                  <FiPenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                     type="text" 
                     value={paperDetails.title}
                     onChange={(e) => setPaperDetails({...paperDetails, title: e.target.value})}
                     placeholder="e.g. Mid-Term Examination 2026 - Mathematics" 
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                  />
                </div>
             </div>
             
             <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Total Marks</label>
                <div className="relative">
                  <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                     type="text" 
                     value={paperDetails.marks}
                     onChange={(e) => setPaperDetails({...paperDetails, marks: e.target.value})}
                     placeholder="e.g. 100" 
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                  />
                </div>
             </div>

             <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Duration</label>
                <div className="relative">
                  <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                     type="text" 
                     value={paperDetails.duration}
                     onChange={(e) => setPaperDetails({...paperDetails, duration: e.target.value})}
                     placeholder="e.g. 3 Hours" 
                     className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm"
                  />
                </div>
             </div>
          </div>

          {/* Instructions */}
          <div>
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">General Instructions</label>
             <textarea
               value={paperDetails.instructions}
               onChange={(e) => setPaperDetails({...paperDetails, instructions: e.target.value})}
               placeholder="e.g. 1. All questions are compulsory. 2. Use of calculators is prohibited."
               className="w-full h-24 bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-600 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-sm resize-none leading-relaxed"
             />
          </div>

          {/* Main Questions Body */}
          <div className="flex-1 flex flex-col">
             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Questions Body</label>
             <textarea
               value={paperDetails.content}
               onChange={(e) => setPaperDetails({...paperDetails, content: e.target.value})}
               placeholder="Commence authoring questions here..."
               className="w-full min-h-[300px] bg-white border border-slate-200 rounded-xl p-6 text-sm font-medium text-slate-800 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all shadow-inner resize-none leading-relaxed"
             />
          </div>

        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveTypedPaper}
            disabled={savingPaper}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[var(--primary)] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/30 flex items-center gap-2 disabled:opacity-50"
          >
            {savingPaper ? "Finalizing..." : <><FiCheckCircle size={16} /> Save Question Paper</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPaperStudioModal;
