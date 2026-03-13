import AttendanceSummary from "./dashboard/AttendanceSummary";
import TodayClassesWidget from "./dashboard/TodayClassesWidget";
import MessagesWidget from "./dashboard/MessagesWidget";
import OverviewCards from "./dashboard/OverviewCards";
import WeeklySchedule from "./dashboard/WeeklySchedule";
import PerformanceChart from "./dashboard/PerformanceChart";
import StudentsTable from "./dashboard/StudentsTable";
import AssignmentsWidget from "./dashboard/AssignmentsWidget";
import AnnouncementsWidget from "./dashboard/AnnouncementsWidget";
import NotesWidget from "./dashboard/NotesWidget";

const TeacherDashboard = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Welcome 👋 Mr. {}</h1>
      <div className="space-y-6">
        {/* Attendance First */}
        <div className="grid grid-cols-1 gap-6">
          <AttendanceSummary />
          <TodayClassesWidget />
          <MessagesWidget />
        </div>

        {/* Overview */}
        <OverviewCards />

        {/* Schedule + Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <WeeklySchedule />
          <PerformanceChart />
        </div>

        {/* Students */}
        <StudentsTable />

        {/* Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AssignmentsWidget />
          <AnnouncementsWidget />
        </div>

        {/* Personal Notes */}
        <NotesWidget />
      </div>
    </>
  );
};

export default TeacherDashboard;
