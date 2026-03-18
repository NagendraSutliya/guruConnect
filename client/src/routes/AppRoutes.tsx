import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";

import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verify from "../pages/auth/Verify";

import AdminDashboard from "../pages/admin/Dashboard";

import TeacherDashboard from "../pages/teacher/Dashboard";

import AdminRoute from "../guards/AdminRoute";
import TeacherRoute from "../guards/TeacherRoute";
import Teachers from "../pages/admin/panels/TeacherPanel";
import FeedbackPanel from "../pages/admin/panels/FeedbackPanel";
import LinksPanel from "../pages/admin/panels/LinksPanel";
import TeacherLogin from "../pages/teacher/Login";
import TeacherFeedback from "../pages/teacher/TeacherFeedback";
// import PublicFeedback from "../pages/public/PublicFeedback";
import FeedbackForm from "../pages/student/FeedbackForm";
import AcademicYears from "../pages/admin/academic/AcademicYears";
import Classes from "../pages/admin/academic/Classes";
import Sections from "../pages/admin/academic/Sections";
import Subjects from "../pages/admin/academic/Subjects";
import TeacherAssignPanel from "../pages/admin/panels/TeacherAssignPanel";
import MyAssignments from "../pages/teacher/MyAssignments";
import AttendanceTeacher from "../pages/teacher/Attendance";
import Result from "../pages/teacher/Result";
import StudyMaterial from "../pages/teacher/StudyMaterial";
import Tests from "../pages/teacher/Tests";
// import Students from "../pages/student/Students";
import Attendance from "../pages/admin/student/Attendance";
import Routine from "../pages/admin/academic/Routine";
import Exams from "../pages/admin/exams/Exams";
import Results from "../pages/admin/exams/Results";
import Students from "../pages/admin/student/Students";
import StudentLogin from "../pages/student/Login";
import StudentRoute from "../guards/StudentRoute";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/Dashboard";
import ChangePassword from "../pages/student/ChangePassword";
import StudentResults from "../pages/student/StudentResults";
import StudentMaterial from "../pages/student/StudentMaterial";
import StudentTests from "../pages/student/StudentTests";
import StudentProfile from "../pages/student/StudentProfile";
import StudentAttendance from "../pages/student/StudentAttendance";
import AdminProfile from "../pages/admin/AdminProfile";
import ExamSubjectPanel from "../pages/admin/panels/ExamSubjectPanel";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/feedback/:code" element={<FeedbackForm />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="profile" element={<AdminProfile />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="feedback" element={<FeedbackPanel />} />
        <Route path="link" element={<LinksPanel />} />

        {/* NEW */}
        <Route path="academic-years" element={<AcademicYears />} />
        <Route path="classes" element={<Classes />} />
        <Route path="sections" element={<Sections />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="teacher-assign" element={<TeacherAssignPanel />} />

        <Route path="students" element={<Students />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="routine" element={<Routine />} />

        <Route path="exam" element={<Exams />} />
        <Route path="exam-subjects/:examId" element={<ExamSubjectPanel />} />
        <Route path="result" element={<Results />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <TeacherRoute>
            <TeacherLayout />
          </TeacherRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="feedback" element={<TeacherFeedback />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="attendance" element={<AttendanceTeacher />} />
        <Route path="results" element={<Result />} />
        <Route path="material" element={<StudyMaterial />} />
        <Route path="tests" element={<Tests />} />
      </Route>

      <Route
        path="/student"
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="material" element={<StudentMaterial />} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}
