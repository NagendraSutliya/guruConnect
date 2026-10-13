import React, { useState } from "react";
import {
  FiPackage,
  FiAlertTriangle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiShoppingBag,
  FiDollarSign,
  FiTruck
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Stationery" | "Lab Equipment" | "Sports" | "IT Assets" | "Furniture";
  inStock: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
  isLowStock?: boolean;
}

const DEFAULT_ITEMS: InventoryItem[] = [
  { id: "1", sku: "STN-0012", name: "A4 Printing Paper (75 GSM Rim)", category: "Stationery", inStock: 14, reorderLevel: 25, unitPrice: 280, location: "Main Store Rack A1", isLowStock: true },
  { id: "2", sku: "STN-0045", name: "Whiteboard Dry Erase Markers (Blue/Black)", category: "Stationery", inStock: 48, reorderLevel: 30, unitPrice: 35, location: "Main Store Rack A3" },
  { id: "3", sku: "LAB-0104", name: "Borosilicate Glass Beakers (250 ml)", category: "Lab Equipment", inStock: 60, reorderLevel: 20, unitPrice: 140, location: "Chemistry Lab Store" },
  { id: "4", sku: "SPT-0021", name: "Nivia Cosco Football (Size 5 Tournament)", category: "Sports", inStock: 6, reorderLevel: 10, unitPrice: 850, location: "Sports Complex Room 2", isLowStock: true },
  { id: "5", sku: "IT-0089", name: "Dell Optical USB Mice", category: "IT Assets", inStock: 22, reorderLevel: 15, unitPrice: 350, location: "Computer Lab 1 Cupboard" }
];

export default function InventoryPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(DEFAULT_ITEMS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const lowStockCount = items.filter(i => i.isLowStock).length;
  const totalStockValue = items.reduce((sum, i) => sum + i.inStock * i.unitPrice, 0);

  const handleCreatePO = () => {
    showToast("Automated Purchase Order generated for all items below reorder threshold.", "success");
  };

  const filtered = items.filter(i => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "All" || i.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Operations › Stores & Assets
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Inventory & Asset Management</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Real-time consumables stock, depreciation tracking, and automated purchase reorder triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreatePO}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            <FiShoppingBag size={14} /> Reorder Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => showToast("Add stock item modal opened.", "info")}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiPlus size={15} /> Add Item SKU
          </button>
        </div>
      </div>

      {/* Low stock alert banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-control p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <FiAlertTriangle className="text-amber-700 shrink-0" size={16} />
            <span>
              <b>{lowStockCount} items</b> have fallen below their minimum replenishment threshold. Replenishment purchase orders recommended.
            </span>
          </div>
          <button
            onClick={handleCreatePO}
            className="text-amber-800 font-bold hover:underline shrink-0"
          >
            Draft Purchase Orders →
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Total Tracked SKUs</div>
          <div className="font-mono text-2xl font-bold text-navy">{items.length}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-amber-800 font-medium">Items Below Threshold</div>
          <div className="font-mono text-2xl font-bold text-amber-800">{lowStockCount}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-teal font-medium">Total Store Inventory Value</div>
          <div className="font-mono text-2xl font-bold text-teal">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Suppliers in Network</div>
          <div className="font-mono text-2xl font-bold text-navy">18</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-surface border border-line rounded-panel shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-page/30">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-muted" size={14} />
            <input
              type="text"
              placeholder="Search by SKU, item name or shelf..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-line rounded-control text-xs text-navy focus:outline-none focus:border-teal"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-navy-muted font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-surface border border-line rounded-control px-2.5 py-1 text-xs text-navy font-semibold focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Stationery">Stationery</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Sports">Sports</option>
              <option value="IT Assets">IT Assets</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-page/70 border-b border-line text-navy-muted font-semibold">
                <th className="py-3 px-4 w-28">SKU Code</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Storage Location</th>
                <th className="py-3 px-4 text-center">In Stock</th>
                <th className="py-3 px-4 text-center">Reorder Lvl</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-page/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-navy">{item.sku}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-navy">{item.name}</div>
                    {item.isLowStock && (
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Critical Low
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-navy-muted font-medium">{item.category}</td>
                  <td className="py-3 px-4 text-navy-muted">{item.location}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-navy">
                    {item.inStock}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-navy-muted">
                    {item.reorderLevel}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-navy">
                    ₹{item.unitPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
