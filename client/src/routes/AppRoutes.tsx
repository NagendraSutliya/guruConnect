import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import { TeacherProvider } from "../context/TeacherContext";

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
import UploadMarksPage from "../pages/teacher/panels/UploadMarksPanel";
import ExamsTeacher from "../pages/teacher/ExamsTeacher";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import TeacherSettings from "../pages/teacher/TeacherSettings";
import TeacherHelp from "../pages/teacher/TeacherHelp";

import StudentsTeacher from "../pages/teacher/Students";
import RoutineTeacher from "../pages/teacher/RoutineTeacher";
import RoutineStudent from "../pages/student/RoutineStudent";
import FeeStructure from "../pages/admin/finance/FeeStructure";
import CollectFees from "../pages/admin/finance/CollectFees";
import Invoices from "../pages/admin/finance/Invoices";
import ComingSoon from "../pages/admin/ComingSoon";
import InstituteSettings from "../pages/admin/settings/InstituteSettings";
import RolesPermissions from "../pages/admin/settings/RolesPermissions";
import AccountSettings from "../pages/admin/AccountSettings";
import CMSDashboard from "../pages/admin/cms/CMSDashboard";
import HeroCMS from "../pages/admin/cms/HeroCMS";
import AboutCMS from "../pages/admin/cms/AboutCMS";
import AdmissionsCMS from "../pages/admin/cms/AdmissionsCMS";
import AcademicsCMS from "../pages/admin/cms/AcademicsCMS";
import AchievementsCMS from "../pages/admin/cms/AchievementsCMS";
import GalleryCMS from "../pages/admin/cms/GalleryCMS";
import ContactCMS from "../pages/admin/cms/ContactCMS";

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

        {/* ACADEMIC */}
        <Route path="academic-years" element={<AcademicYears />} />
        <Route path="classes" element={<Classes />} />
        <Route path="sections" element={<Sections />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="teacher-assign" element={<TeacherAssignPanel />} />
        <Route path="students" element={<Students />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="routine" element={<Routine />} />

        {/* FINANCE */}
        <Route path="fee-structure" element={<FeeStructure />} />
        <Route path="collect-fees" element={<CollectFees />} />
        <Route path="invoices" element={<Invoices />} />

        {/* HR & PAYROLL */}
        <Route path="staff" element={<ComingSoon featureName="Staff Management" />} />
        <Route path="payroll" element={<ComingSoon featureName="Payroll System" />} />
        <Route path="leaves" element={<ComingSoon featureName="Leave Management" />} />

        {/* TRANSPORT */}
        <Route path="transport/routes" element={<ComingSoon featureName="Transport Routes" />} />
        <Route path="transport/vehicles" element={<ComingSoon featureName="Vehicle Tracking" />} />
        <Route path="transport/drivers" element={<ComingSoon featureName="Driver Logs" />} />

        {/* INVENTORY */}
        <Route path="inventory/assets" element={<ComingSoon featureName="Asset Inventory" />} />
        <Route path="inventory/suppliers" element={<ComingSoon featureName="Supplier Network" />} />
        <Route path="inventory/purchase" element={<ComingSoon featureName="Purchase Orders" />} />

        {/* LIBRARY */}
        <Route path="library/books" element={<ComingSoon featureName="Library Catalog" />} />
        <Route path="library/issue" element={<ComingSoon featureName="Book Circulation" />} />
        <Route path="library/members" element={<ComingSoon featureName="Library Membership" />} />

        {/* HOSTEL */}
        <Route path="hostel/list" element={<ComingSoon featureName="Hostel Directory" />} />
        <Route path="hostel/rooms" element={<ComingSoon featureName="Room Inventory" />} />
        <Route path="hostel/allotment" element={<ComingSoon featureName="Hostel Allotment" />} />

        {/* CERTIFICATES */}
        <Route path="certificates/id-cards" element={<ComingSoon featureName="ID Card Generator" />} />
        <Route path="certificates/tc" element={<ComingSoon featureName="Transfer Certificates" />} />
        <Route path="certificates/transcripts" element={<ComingSoon featureName="Academic Transcripts" />} />

        {/* COMMUNICATION */}
        <Route path="notices" element={<ComingSoon featureName="Notice Board" />} />
        <Route path="send-message" element={<ComingSoon featureName="Broadcast System" />} />

        {/* SETTINGS */}
        <Route path="settings/institute" element={<InstituteSettings />} />
        <Route path="settings/roles" element={<RolesPermissions />} />
        <Route path="settings" element={<AccountSettings />} />

        {/* WEBSITE CMS (Synced with school-website) */}
        <Route path="cms" element={<CMSDashboard />} />
        <Route path="cms/hero" element={<HeroCMS />} />
        <Route path="cms/about" element={<AboutCMS />} />
        <Route path="cms/admissions" element={<AdmissionsCMS />} />
        <Route path="cms/academics" element={<AcademicsCMS />} />
        <Route path="cms/achievements" element={<AchievementsCMS />} />
        <Route path="cms/gallery" element={<GalleryCMS />} />
        <Route path="cms/contact" element={<ContactCMS />} />


        <Route path="exam" element={<Exams />} />
        <Route path="exam-subjects/:examId" element={<ExamSubjectPanel />} />
        <Route path="result" element={<Results />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <TeacherRoute>
            <TeacherProvider>
              <TeacherLayout />
            </TeacherProvider>
          </TeacherRoute>
        }
      >
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="feedback" element={<TeacherFeedback />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="attendance" element={<AttendanceTeacher />} />
        <Route path="results" element={<Result />} />
        <Route path="material" element={<StudyMaterial />} />
        <Route path="exams" element={<ExamsTeacher />} />
        <Route path="students" element={<StudentsTeacher />} />
        <Route path="routine" element={<RoutineTeacher />} />
        <Route path="results/upload-marks" element={<UploadMarksPage />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<TeacherSettings />} />
        <Route path="help" element={<TeacherHelp />} />
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
        <Route path="routine" element={<RoutineStudent />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

    </Routes>
  );
}
