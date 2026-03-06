// // import TeacherChart from "../../components/teacher/TeacherChart";
// import TeacherOverview from "../../components/teacher/TeacherOverview";
// // import TeacherRecent from "../../components/teacher/TeacherRecent";

// import OverviewCards from "../../components/teacher/dashboard/OverviewCards";
// import MessagesWidget from "../../components/teacher/dashboard/MessagesWidget";
// import PerformanceChart from "../../components/teacher/dashboard/PerformanceChart";
// import StudentsTable from "../../components/teacher/dashboard/StudentsTable";
// import CalendarWidget from "../../components/teacher/dashboard/CalendarWidget";
// import WeeklySchedule from "../../components/teacher/dashboard/WeeklySchedule";
// import NotesWidget from "../../components/teacher/dashboard/NotesWidget";

// const TeacherDashboard = () => {
//   return (
//     <div className="space-y-6">
//       <TeacherOverview />
//       <div className="grid grid-cols-2 gap-6">
//         {/* <TeacherRecent /> */}
//         {/* <TeacherChart /> */}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;

import OverviewCards from "../../components/teacher/dashboard/OverviewCards";
import MessagesWidget from "../../components/teacher/dashboard/MessagesWidget";
import PerformanceChart from "../../components/teacher/dashboard/PerformanceChart";
import StudentsTable from "../../components/teacher/dashboard/StudentsTable";
import CalendarWidget from "../../components/teacher/dashboard/CalendarWidget";
import WeeklySchedule from "../../components/teacher/dashboard/WeeklySchedule";
import NotesWidget from "../../components/teacher/dashboard/NotesWidget";

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <OverviewCards />

      {/* Messages + Performance + Calendar */}
      <div className="grid grid-cols-3 gap-6">
        <MessagesWidget />
        <PerformanceChart />
        <CalendarWidget />
      </div>

      {/* Students Table + Weekly Schedule */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <StudentsTable />
        </div>

        <WeeklySchedule />
      </div>

      {/* Notes */}
      <NotesWidget />
    </div>
  );
};

export default TeacherDashboard;
