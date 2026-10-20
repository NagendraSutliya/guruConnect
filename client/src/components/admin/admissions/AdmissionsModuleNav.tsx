import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  extraContext?: string;
}

export default function AdmissionsModuleNav({ extraContext }: Props) {
  const location = useLocation();
  const path = location.pathname;

  const isPipeline = path === "/admin/admissions" || path.startsWith("/admin/admissions/pipeline");
  const isRecords = path.startsWith("/admin/admissions/records") || path.startsWith("/admin/admissions/manage");

  return (
    <div className="text-small text-ink-secondary flex flex-wrap items-center gap-2">
      {/* Pipeline */}
      {isPipeline ? (
        <span className="text-ink font-semibold">Pipeline</span>
      ) : (
        <Link
          to="/admin/admissions/pipeline"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Pipeline
        </Link>
      )}

      <span>·</span>

      {/* Register & Records */}
      {isRecords ? (
        <span className="text-ink font-semibold">Register & Records</span>
      ) : (
        <Link
          to="/admin/admissions/records"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Register & Records
        </Link>
      )}

      {extraContext && (
        <>
          <span>·</span>
          <span className="font-mono text-micro text-ink-muted">{extraContext}</span>
        </>
      )}
    </div>
  );
}
