import TeacherChart from "../../components/teacher/TeacherChart";
import TeacherOverview from "../../components/teacher/TeacherOverview";
import TeacherRecent from "../../components/teacher/TeacherRecent";

const TeacherDashboard = () => {
  return (
    <div className="space-y-6">
      <TeacherOverview />
      <div className="grid grid-cols-2 gap-6">
        <TeacherRecent />
        {/* <TeacherChart /> */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
