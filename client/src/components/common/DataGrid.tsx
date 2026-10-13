import React, { useState, useMemo } from "react";
import { FiChevronDown, FiChevronUp, FiDownload } from "react-icons/fi";
import Pagination from "./Pagination";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedItems: T[]) => void;
  variant?: "primary" | "danger" | "secondary";
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyStateMessage?: string;
  emptyStateSubMessage?: string;
  bulkActions?: BulkAction<T>[];
  onExport?: () => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  setItemsPerPage?: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export default function DataGrid<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyStateMessage = "No data found",
  emptyStateSubMessage = "Try adjusting your filters",
  bulkActions = [],
  onExport,
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
}: DataGridProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = data.map(keyExtractor);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSort = (accessor: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === accessor && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: accessor, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const currentSort = sortConfig;
    return [...data].sort((a, b) => {
      const aVal = a[currentSort.key];
      const bVal = b[currentSort.key];
      if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const selectedItems = data.filter((item) => selectedIds.has(keyExtractor(item)));

  return (
    <div className="bg-surface rounded-card shadow-sm border border-line overflow-hidden flex flex-col">
      {/* Bulk Actions Toolbar */}
      {(selectedIds.size > 0 || onExport) && (
        <div className="bg-surface-subtle px-4 py-3 border-b border-line flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-primary bg-primary-tint px-2.5 py-1 rounded-control">
              {selectedIds.size} selected
            </span>
            {selectedIds.size > 0 && bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  action.onClick(selectedItems);
                  setSelectedIds(new Set());
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-control transition-colors ${
                  action.variant === "danger"
                    ? "bg-[#FFF6EC] text-[#7A4106] hover:bg-[#EBC99C]"
                    : action.variant === "primary"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-surface text-ink-secondary border border-line hover:bg-surface-subtle"
                }`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 text-xs font-semibold text-ink-secondary hover:text-primary transition-colors"
            >
              <FiDownload />
              Export
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-column text-ink-secondary text-micro uppercase tracking-wider font-semibold border-b border-line">
              {bulkActions.length > 0 && (
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-line-input text-primary focus:ring-primary cursor-pointer"
                    checked={selectedIds.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3 ${col.sortable ? "cursor-pointer hover:bg-surface-subtle transition-colors select-none" : ""}`}
                  onClick={() => col.sortable && col.accessor && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortConfig?.key === col.accessor && (
                      <span className="text-primary">
                        {sortConfig?.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-row">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-ink-secondary">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} className="p-16 text-center">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="text-base font-bold text-slate-700">{emptyStateMessage}</p>
                  <p className="text-xs text-slate-400 mt-1">{emptyStateSubMessage}</p>
                </td>
              </tr>
            ) : (
              sortedData.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    className={`group transition-colors duration-200 ${
                      isSelected ? "bg-indigo-50/30" : "hover:bg-slate-50/50"
                    }`}
                  >
                    {bulkActions.length > 0 && (
                      <td className="px-5 py-3 w-10">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleSelectOne(id)}
                        />
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td key={idx} className="px-5 py-3 text-sm text-slate-700">
                        {col.render ? col.render(item) : col.accessor ? String(item[col.accessor] || "") : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages !== undefined && currentPage !== undefined && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage || 10}
          setItemsPerPage={setItemsPerPage as React.Dispatch<React.SetStateAction<number>>}
          setCurrentPage={setCurrentPage as React.Dispatch<React.SetStateAction<number>>}
        />
      )}
    </div>
  );
}
