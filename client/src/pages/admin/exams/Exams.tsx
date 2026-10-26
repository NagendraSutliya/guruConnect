import ExaminationsPage from "./ExaminationsPage";
import type { ExamTab } from "../../../components/admin/exams/ExamModuleNav";

interface ExamsProps {
  initialTab?: ExamTab;
}

export default function Exams({ initialTab = "setup" }: ExamsProps) {
  return <ExaminationsPage initialTab={initialTab} />;
}
