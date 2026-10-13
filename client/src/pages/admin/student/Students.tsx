import { Link } from "react-router-dom";
import StudentPanel from "../panels/StudentPanel";
import { FiUpload, FiPrinter, FiTrendingUp, FiAward } from "react-icons/fi";

export default function Students() {
  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Action bar from Screen 10 */}
      <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-line/60 pb-3">
        <div className="flex items-center gap-2 font-medium text-navy-muted">
          <span className="font-semibold text-navy">Students Directory</span>
          <span>·</span>
          <Link
            to="/admin/promotion"
            className="text-teal hover:underline flex items-center gap-1 font-semibold"
          >
            <FiTrendingUp size={13} /> Promotion Workflow
          </Link>
          <span>·</span>
          <Link
            to="/admin/certificates"
            className="text-teal hover:underline flex items-center gap-1 font-semibold"
          >
            <FiAward size={13} /> Certificates (TC / Bonafide)
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/student-import"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-control bg-surface hover:bg-page text-navy font-semibold transition"
          >
            <FiUpload size={13} /> Import from Excel
          </Link>
          <Link
            to="/admin/certificates"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-line rounded-control bg-surface hover:bg-page text-navy font-semibold transition"
          >
            <FiPrinter size={13} /> Print ID Cards
          </Link>
        </div>
      </div>

      <StudentPanel />
    </div>
  );
}
