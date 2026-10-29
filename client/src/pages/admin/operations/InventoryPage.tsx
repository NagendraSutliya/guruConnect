import React, { useState } from "react";
import {
  FiPlus,
  FiShoppingBag,
  FiAlertTriangle,
  FiDownload,
  FiCheckCircle,
  FiX,
  FiSearch,
  FiTool
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface StoreItem {
  id: string;
  name: string;
  category: "Stationery" | "Uniform" | "Lab consumables" | "Housekeeping" | "Sports" | "IT";
  inStock: number;
  reorderAt: number;
  value: number;
  lastMovement: string;
}

interface MaintenanceAsset {
  id: string;
  assetCode: string;
  title: string;
  location: string;
  scheduleText: string;
  isOverdue?: boolean;
}

const INITIAL_STOCK: StoreItem[] = [
  {
    id: "1",
    name: "A4 paper (ream)",
    category: "Stationery",
    inStock: 18,
    reorderAt: 40,
    value: 4860,
    lastMovement: "Issued 12 to exam cell · 7 Oct"
  },
  {
    id: "2",
    name: "Whiteboard markers (box)",
    category: "Stationery",
    inStock: 9,
    reorderAt: 20,
    value: 2250,
    lastMovement: "Issued 6 to Class 6–8 · 5 Oct"
  },
  {
    id: "3",
    name: "Shirt, size 30 (uniform)",
    category: "Uniform",
    inStock: 64,
    reorderAt: 40,
    value: 22400,
    lastMovement: "Sold 3 at counter · 8 Oct"
  },
  {
    id: "4",
    name: "Tie, junior (uniform)",
    category: "Uniform",
    inStock: 22,
    reorderAt: 30,
    value: 2640,
    lastMovement: "Sold 8 at counter · 8 Oct"
  },
  {
    id: "5",
    name: "Chemistry lab — test tubes",
    category: "Lab consumables",
    inStock: 140,
    reorderAt: 100,
    value: 2800,
    lastMovement: "Received PO-0231 · 1 Oct"
  },
  {
    id: "6",
    name: "Floor cleaner (5 L)",
    category: "Housekeeping",
    inStock: 4,
    reorderAt: 10,
    value: 1760,
    lastMovement: "Issued 2 to housekeeping · 6 Oct"
  },
  {
    id: "7",
    name: "Football (size 5)",
    category: "Sports",
    inStock: 14,
    reorderAt: 8,
    value: 9100,
    lastMovement: "Issued 2 to PET · 2 Oct"
  },
  {
    id: "8",
    name: "Toner cartridge",
    category: "IT",
    inStock: 3,
    reorderAt: 2,
    value: 8700,
    lastMovement: "Issued 1 to office · 29 Sep"
  }
];

const INITIAL_ASSETS: MaintenanceAsset[] = [
  {
    id: "ast-1",
    assetCode: "AST-0412",
    title: "Water cooler, 150 L",
    location: "Ground floor corridor",
    scheduleText: "Filter change overdue 6 days",
    isOverdue: true
  },
  {
    id: "ast-2",
    assetCode: "AST-0098",
    title: "Smart board, Room 8-B",
    location: "Custodian: Sunita Rathore",
    scheduleText: "AMC visit 20 Oct"
  },
  {
    id: "ast-3",
    assetCode: "AST-0207",
    title: "Fire extinguishers (12)",
    location: "All floors",
    scheduleText: "Refill due 31 Oct"
  },
  {
    id: "ast-4",
    assetCode: "AST-0330",
    title: "Generator, 62.5 kVA",
    location: "Utility block",
    scheduleText: "Service due 15 Nov"
  }
];

export default function InventoryPage() {
  const { showToast } = useToast();
  const [stock, setStock] = useState<StoreItem[]>(INITIAL_STOCK);
  const [assets, setAssets] = useState<MaintenanceAsset[]>(INITIAL_ASSETS);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Issue Form State
  const [issueForm, setIssueForm] = useState({
    itemId: "1",
    quantity: 2,
    issuedTo: "Vice Principal / Exam Cell",
    remarks: "Internal test paper printouts"
  });

  // Purchase Request Form State
  const [purchaseForm, setPurchaseForm] = useState({
    itemTitle: "A4 paper (ream) + Markers replenishment",
    estimatedCost: 11000,
    vendorName: "Jaipur Paper & Stationery Mart",
    priority: "High" as "High" | "Normal"
  });

  const lowStockItems = stock.filter(item => item.inStock < item.reorderAt);

  const handleIssueItem = (e: React.FormEvent) => {
    e.preventDefault();
    const targetItem = stock.find(i => i.id === issueForm.itemId);
    if (!targetItem) return;

    if (targetItem.inStock < issueForm.quantity) {
      showToast(`Cannot issue ${issueForm.quantity}. Only ${targetItem.inStock} currently in stock.`, "error");
      return;
    }

    setStock(prev =>
      prev.map(i =>
        i.id === targetItem.id
          ? {
              ...i,
              inStock: i.inStock - issueForm.quantity,
              lastMovement: `Issued ${issueForm.quantity} to ${issueForm.issuedTo} · Today`
            }
          : i
      )
    );

    setIsIssueModalOpen(false);
    showToast(`Successfully issued ${issueForm.quantity} x ${targetItem.name} to ${issueForm.issuedTo}!`, "success");
  };

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchaseModalOpen(false);
    showToast(`Purchase requisition for ₹${purchaseForm.estimatedCost.toLocaleString("en-IN")} submitted for Principal approval!`, "success");
  };

  const handleReorderAllLowStock = () => {
    showToast(`Draft Purchase Order created for ${lowStockItems.length} low stock items totaling ₹${lowStockItems.reduce((acc, i) => acc + (i.reorderAt - i.inStock) * 150, 0).toLocaleString("en-IN")}!`, "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 34-Inventory.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Inventory › Stock · Purchase orders · Uniform counter · Assets
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Main store stock
          </h1>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsIssueModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Issue items</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPurchaseModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>New purchase request</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner (Matching 34-Inventory.html) */}
      {lowStockItems.length > 0 && (
        <div className="bg-warning-bg border border-warning-border rounded-card p-3 px-4 text-sm text-warning-strong flex items-center justify-between gap-3 flex-wrap">
          <span>
            <b>{lowStockItems.length} items</b> are below reorder level. Create one purchase request for all of them?
          </span>
          <button
            type="button"
            onClick={handleReorderAllLowStock}
            className="font-semibold text-xs text-warning-inline hover:underline cursor-pointer"
          >
            Create Consolidated PO →
          </button>
        </div>
      )}

      {/* Main Stock Inventory Table (Matching 34-Inventory.html) */}
      <section className="bg-white border border-line rounded-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[760px]">
            <thead>
              <tr className="bg-surface-head text-left text-xs text-ink font-semibold">
                <th className="py-3 px-4 font-semibold">Item</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">In stock</th>
                <th className="py-3 px-4 font-semibold text-right">Reorder at</th>
                <th className="py-3 px-4 font-semibold text-right">Value</th>
                <th className="py-3 px-4 font-semibold">Last movement</th>
              </tr>
            </thead>
            <tbody>
              {stock.map(item => {
                const isLow = item.inStock < item.reorderAt;
                return (
                  <tr
                    key={item.id}
                    className={`border-t border-line-row transition-colors ${
                      isLow ? "bg-[#FFFBF6]" : "bg-white hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="py-2.5 px-4 font-medium text-ink text-xs sm:text-sm">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-ink-secondary">
                      {item.category}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-xs text-right font-mono font-medium ${
                        isLow ? "text-warning-inline" : "text-ink"
                      }`}
                    >
                      {item.inStock}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-right font-mono text-ink-secondary">
                      {item.reorderAt}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-right font-mono text-ink">
                      ₹{item.value.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-ink-secondary">
                      {item.lastMovement}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assets Due for Maintenance (Matching 34-Inventory.html) */}
      <section className="bg-white border border-line rounded-card p-5 flex flex-col gap-3 shadow-xs">
        <h2 className="m-0 text-base font-semibold text-ink">
          Assets due for maintenance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {assets.map(asset => (
            <div
              key={asset.id}
              className="border border-line rounded-control p-3.5 flex flex-col gap-1 bg-white"
            >
              <span className="font-mono text-xs text-ink-secondary">
                {asset.assetCode}
              </span>
              <span className="font-semibold text-sm text-ink">{asset.title}</span>
              <span className="text-xs text-ink-secondary">{asset.location}</span>
              <span
                className={`text-xs font-semibold pt-0.5 ${
                  asset.isOverdue ? "text-warning-inline" : "text-ink-secondary"
                }`}
              >
                {asset.scheduleText}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Issue Items Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Issue Store Items</h3>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueItem} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Select Store Item</label>
                <select
                  value={issueForm.itemId}
                  onChange={e => setIssueForm(prev => ({ ...prev, itemId: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                >
                  {stock.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.inStock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Quantity to Issue</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={issueForm.quantity}
                  onChange={e => setIssueForm(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Issued To (Department / Person)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab / Vikram Singh"
                  value={issueForm.issuedTo}
                  onChange={e => setIssueForm(prev => ({ ...prev, issuedTo: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Purpose / Department Voucher</label>
                <input
                  type="text"
                  placeholder="e.g. Class 10 Board prep tests"
                  value={issueForm.remarks}
                  onChange={e => setIssueForm(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Purchase Request Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">New Purchase Requisition</h3>
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePurchase} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Requisition Items Description</label>
                <input
                  type="text"
                  required
                  value={purchaseForm.itemTitle}
                  onChange={e => setPurchaseForm(prev => ({ ...prev, itemTitle: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Preferred Vendor</label>
                <input
                  type="text"
                  required
                  value={purchaseForm.vendorName}
                  onChange={e => setPurchaseForm(prev => ({ ...prev, vendorName: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Estimated Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={purchaseForm.estimatedCost}
                    onChange={e => setPurchaseForm(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Priority</label>
                  <select
                    value={purchaseForm.priority}
                    onChange={e => setPurchaseForm(prev => ({ ...prev, priority: e.target.value as "High" | "Normal" }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="High">Urgent / Exam stock</option>
                    <option value="Normal">Routine refill</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
