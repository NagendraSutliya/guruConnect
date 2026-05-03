import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { 
  MdAttachMoney, 
  MdAdd, 
  MdDelete, 
  MdSave, 
  MdSchool,
  MdLayers,
  MdHistory
} from "react-icons/md";
import { useToast } from "../../../context/ToastContext";

export default function FeeStructure() {
  const { showToast } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [feeHeads, setFeeHeads] = useState<{name: string, amount: number, type: string}[]>([
    { name: "Admission Fee", amount: 0, type: "one-time" },
    { name: "Tuition Fee", amount: 0, type: "monthly" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch classes for dropdown
    api.get("/admin/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Error fetching classes", err));
  }, []);

  const addHead = () => {
    setFeeHeads([...feeHeads, { name: "", amount: 0, type: "monthly" }]);
  };

  const removeHead = (index: number) => {
    setFeeHeads(feeHeads.filter((_, i) => i !== index));
  };

  const updateHead = (index: number, field: string, value: any) => {
    const updated = [...feeHeads];
    updated[index] = { ...updated[index], [field]: value };
    setFeeHeads(updated);
  };

  const saveStructure = async () => {
    if (!selectedClass) {
      showToast("Please select a class first", "error");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/admin/finance/fee-structure", {
        classId: selectedClass,
        heads: feeHeads
      });
      showToast("Fee structure saved successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save structure", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = feeHeads.reduce((sum, head) => sum + (Number(head.amount) || 0), 0);

  return (
    <div className="py-6 space-y-8 animate-fadeIn">
      
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-indigo-100 via-white to-purple-100 pb-4 pt-6 -mt-6 -mx-8 px-8 mb-6 border-b border-indigo-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdAttachMoney className="text-indigo-600" />
            Fee Structure
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Define institutional fee models for each class.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <MdHistory size={18} />
            History
          </button>
          <button 
            onClick={saveStructure}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
          >
            {loading ? "Saving..." : (
              <>
                <MdSave size={18} />
                Save Structure
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdSchool size={16} className="text-indigo-500" />
              General Settings
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Target Academic Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-semibold text-slate-900"
              >
                <option value="">Select a Class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.className}</option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Calculated Total</span>
                <span className="text-2xl font-black text-indigo-700">₹{totalAmount}</span>
              </div>
              <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                Total aggregate amount for all active fee heads listed in this structure.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-lg mb-2">Need Help?</h3>
              <p className="text-indigo-100 text-xs leading-relaxed opacity-80 mb-4">
                Fee structures can be applied individually to students or as a group. Monthly fees will automatically appear in student dashboards.
              </p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Read Guide
              </button>
            </div>
            <MdAttachMoney size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        {/* Right: Fee Heads List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-widest text-[10px]">
              <MdLayers size={16} className="text-indigo-500" />
              Active Fee Heads
            </div>
            <button 
              onClick={addHead}
              className="flex items-center gap-2 text-indigo-600 font-bold text-xs hover:underline"
            >
              <MdAdd size={16} />
              Add New Head
            </button>
          </div>

          <div className="space-y-3">
            {feeHeads.map((head, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center group hover:border-indigo-200 transition-all">
                <div className="flex-1 w-full">
                  <input 
                    placeholder="Fee Head Name (e.g. Lab Fee)"
                    value={head.name}
                    onChange={(e) => updateHead(index, "name", e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300"
                  />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <select 
                    value={head.type}
                    onChange={(e) => updateHead(index, "type", e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-xs font-bold text-slate-600 outline-none"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-Time</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>

                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 w-32">
                    <span className="text-slate-400 font-bold text-sm">₹</span>
                    <input 
                      type="number"
                      value={head.amount}
                      onChange={(e) => updateHead(index, "amount", e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-black text-slate-700 text-sm"
                    />
                  </div>

                  <button 
                    onClick={() => removeHead(index)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}

            {feeHeads.length === 0 && (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 mb-4">
                  <MdAdd size={32} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No fee heads added yet</p>
                <button onClick={addHead} className="text-indigo-600 font-bold text-xs mt-2 hover:underline">Click here to start</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
