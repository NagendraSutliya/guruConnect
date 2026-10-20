import React from "react";
import { Link, useLocation } from "react-router-dom";

interface Props {
  extraContext?: string;
}

export default function StudentModuleNav({ extraContext }: Props) {
  const location = useLocation();
  const path = location.pathname;

  const isStudents = path === "/admin/students" || path.startsWith("/admin/students/");
  const isPromotion = path === "/admin/promotion";
  const isCertificates = path.startsWith("/admin/certificates");

  return (
    <div className="text-small text-ink-secondary flex flex-wrap items-center gap-2">
      {/* Students Directory Link */}
      {isStudents ? (
        <span className="text-ink font-semibold">Students</span>
      ) : (
        <Link
          to="/admin/students"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Students
        </Link>
      )}

      <span>·</span>

      {/* Promotion Workflow Link */}
      {isPromotion ? (
        <span className="text-ink font-semibold">Promotion</span>
      ) : (
        <Link
          to="/admin/promotion"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Promotion
        </Link>
      )}

      <span>·</span>

      {/* Certificates Link */}
      {isCertificates ? (
        <span className="text-ink font-semibold">Certificates</span>
      ) : (
        <Link
          to="/admin/certificates"
          className="text-primary hover:underline font-medium transition-colors"
        >
          Certificates
        </Link>
      )}

      {/* Optional session or subtitle tag */}
      {extraContext && (
        <>
          <span className="text-ink-secondary/60">·</span>
          <span className="text-ink-secondary">{extraContext}</span>
        </>
      )}
    </div>
  );
}
