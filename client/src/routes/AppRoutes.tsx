import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import { TeacherProvider } from "../context/TeacherContext";

// Super Admin
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminRoute from "../guards/SuperAdminRoute";
import SuperAdminLogin from "../pages/superadmin/Login";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import SuperAdminSchools from "../pages/superadmin/Schools";
import SuperAdminPlans from "../pages/superadmin/Plans";
import SuperAdminBilling from "../pages/superadmin/Billing";
import SuperAdminCredits from "../pages/superadmin/Credits";
import SuperAdminMasters from "../pages/superadmin/Masters";
import SuperAdminSupport from "../pages/superadmin/Support";
import SuperAdminMonitoring from "../pages/superadmin/Monitoring";
import SuperAdminAnnouncements from "../pages/superadmin/Announcements";
import SuperAdminFlags from "../pages/superadmin/Flags";
import SuperAdminDataRequests from "../pages/superadmin/DataRequests";
import SuperAdminUsersAudit from "../pages/superadmin/UsersAudit";
import SuperAdminSettings from "../pages/superadmin/Settings";
import SuperAdminDemos from "../pages/superadmin/Demos";

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
import AttendanceTeacher from "../pages/teacher/Attendance";
import Result from "../pages/teacher/Result";
import Attendance from "../pages/admin/student/Attendance";
import Routine from "../pages/admin/academic/Routine";
import Exams from "../pages/admin/exams/Exams";
import Results from "../pages/admin/exams/Results";
import Students from "../pages/admin/student/Students";
import AdmissionsPanel from "../pages/admin/student/AdmissionsPanel";
import PrintAdmissionForm from "../pages/admin/student/PrintAdmissionForm";
import StudentLogin from "../pages/student/Login";
import ParentLogin from "../pages/parent/Login";
import StudentRoute from "../guards/StudentRoute";
import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/Dashboard";
import StudentTimetable from "../pages/student/StudentTimetable";
import StudentHomework from "../pages/student/StudentHomework";
import StudentNotices from "../pages/student/StudentNotices";
import StudentLibrary from "../pages/student/StudentLibrary";
import StudentNotifications from "../pages/student/StudentNotifications";
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

import RoutineTeacher from "../pages/teacher/RoutineTeacher";
import TeacherMyClass from "../pages/teacher/TeacherMyClass";
import TeacherHomework from "../pages/teacher/TeacherHomework";
import TeacherMessages from "../pages/teacher/TeacherMessages";
import TeacherLeavePayslip from "../pages/teacher/TeacherLeavePayslip";
import RoutineStudent from "../pages/student/RoutineStudent";
import FeeStructure from "../pages/admin/finance/FeeStructure";
import Invoices from "../pages/admin/finance/Invoices";
import FeeCounter from "../pages/admin/finance/FeeCounter";
import DefaultersPage from "../pages/admin/finance/DefaultersPage";
import CashClosingPage from "../pages/admin/finance/CashClosingPage";
import AccountsPage from "../pages/admin/finance/AccountsPage";

import Approvals from "../pages/admin/home/Approvals";
import StudentImport from "../pages/admin/student/StudentImport";
import AdmissionsCRM from "../pages/admin/admissions/AdmissionsCRM";
import PromotionPage from "../pages/admin/student/PromotionPage";
import CertificatesPage from "../pages/admin/student/CertificatesPage";

import StaffDirectory from "../pages/admin/hr/StaffDirectory";
import LeaveApprovals from "../pages/admin/hr/LeaveApprovals";
import StaffAttendancePage from "../pages/admin/hr/StaffAttendancePage";
import PayrollRun from "../pages/admin/hr/PayrollRun";

import TransportPage from "../pages/admin/operations/TransportPage";
import HostelPage from "../pages/admin/operations/HostelPage";
import LibraryPage from "../pages/admin/operations/LibraryPage";
import InventoryPage from "../pages/admin/operations/InventoryPage";
import FrontOfficePage from "../pages/admin/operations/FrontOfficePage";

import CommunicationPage from "../pages/admin/communication/CommunicationPage";
import ReportsPage from "../pages/admin/reports/ReportsPage";
import UsersAuditPage from "../pages/admin/settings/UsersAuditPage";
import PlanBillingPage from "../pages/admin/billing/PlanBillingPage";
import HelpSupportPage from "../pages/admin/support/HelpSupportPage";

import InstituteSettings from "../pages/admin/settings/InstituteSettings";
import RolesPermissions from "../pages/admin/settings/RolesPermissions";
import AccountSettings from "../pages/admin/AccountSettings";
import SetupWizard from "../pages/admin/settings/SetupWizard";
import CMSDashboard from "../pages/admin/cms/CMSDashboard";
import HomeCMS from "../pages/admin/cms/HomeCMS";
import AboutCMS from "../pages/admin/cms/AboutCMS";
import AdmissionsCMS from "../pages/admin/cms/AdmissionsCMS";
import AcademicsCMS from "../pages/admin/cms/AcademicsCMS";
import AchievementsCMS from "../pages/admin/cms/AchievementsCMS";
import GalleryCMS from "../pages/admin/cms/GalleryCMS";
import ContactCMS from "../pages/admin/cms/ContactCMS";
import StudentHelp from "../pages/student/StudentHelp";

import About from "../pages/About";
import Contact from "../pages/Contact";
import LegalPage from "../pages/Legal";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
        <Route path="/terms" element={<LegalPage initialTab="terms" />} />
        <Route path="/dpa" element={<LegalPage initialTab="dpa" />} />
        <Route path="/legal" element={<LegalPage initialTab="privacy" />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/feedback/:code" element={<FeedbackForm />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
      </Route>

      <Route
        path="/superadmin"
        element={
          <SuperAdminRoute>
            <SuperAdminLayout />
          </SuperAdminRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="schools" element={<SuperAdminSchools />} />
        <Route path="demos" element={<SuperAdminDemos />} />
        <Route path="plans" element={<SuperAdminPlans />} />
        <Route path="billing" element={<SuperAdminBilling />} />
        <Route path="credits" element={<SuperAdminCredits />} />
        <Route path="masters" element={<SuperAdminMasters />} />
        <Route path="support" element={<SuperAdminSupport />} />
        <Route path="monitoring" element={<SuperAdminMonitoring />} />
        <Route path="announcements" element={<SuperAdminAnnouncements />} />
        <Route path="flags" element={<SuperAdminFlags />} />
        <Route path="data-requests" element={<SuperAdminDataRequests />} />
        <Route path="users" element={<SuperAdminUsersAudit />} />
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route path="institutes" element={<SuperAdminSchools />} />
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
        <Route path="approvals" element={<Approvals />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="feedback" element={<FeedbackPanel />} />
        <Route path="link" element={<LinksPanel />} />

        {/* ACADEMIC & ADMISSIONS */}
        <Route path="academic-years" element={<AcademicYears />} />
        <Route path="classes" element={<Classes />} />
        <Route path="sections" element={<Sections />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="teacher-assign" element={<TeacherAssignPanel />} />
        <Route path="students" element={<Students />} />
        <Route path="students/import" element={<StudentImport />} />
        <Route path="student-import" element={<StudentImport />} />
        <Route path="promotion" element={<PromotionPage />} />
        <Route path="certificates" element={<CertificatesPage />} />
        <Route path="admissions" element={<AdmissionsCRM />} />
        <Route path="admissions/import" element={<StudentImport />} />
        <Route path="admissions/manage" element={<AdmissionsPanel />} />
        <Route path="admissions/print/:id" element={<PrintAdmissionForm />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="routine" element={<Routine />} />

        {/* FINANCE & ACCOUNTS */}
        <Route path="fees" element={<Navigate to="/admin/collect-fees" replace />} />
        <Route path="collect-fees" element={<FeeCounter />} />
        <Route path="fee-structure" element={<FeeStructure />} />
        <Route path="defaulters" element={<DefaultersPage />} />
        <Route path="cash-closing" element={<CashClosingPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="invoices" element={<Invoices />} />

        {/* HR & PAYROLL */}
        <Route path="staff" element={<StaffDirectory />} />
        <Route path="staff/leave" element={<LeaveApprovals />} />
        <Route path="staff/attendance" element={<StaffAttendancePage />} />
        <Route path="leaves" element={<LeaveApprovals />} />
        <Route path="payroll" element={<PayrollRun />} />

        {/* OPERATIONS & FRONT OFFICE */}
        <Route path="transport" element={<TransportPage />} />
        <Route path="transport/routes" element={<TransportPage />} />
        <Route path="transport/vehicles" element={<TransportPage />} />
        <Route path="transport/drivers" element={<TransportPage />} />
        <Route path="hostel" element={<HostelPage />} />
        <Route path="hostel/list" element={<HostelPage />} />
        <Route path="hostel/rooms" element={<HostelPage />} />
        <Route path="hostel/allotment" element={<HostelPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="library/books" element={<LibraryPage />} />
        <Route path="library/issue" element={<LibraryPage />} />
        <Route path="library/members" element={<LibraryPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/assets" element={<InventoryPage />} />
        <Route path="inventory/suppliers" element={<InventoryPage />} />
        <Route path="inventory/purchase" element={<InventoryPage />} />
        <Route path="front-office" element={<FrontOfficePage />} />

        {/* CERTIFICATES */}
        <Route path="certificates/id-cards" element={<CertificatesPage />} />
        <Route path="certificates/tc" element={<CertificatesPage />} />
        <Route path="certificates/transcripts" element={<CertificatesPage />} />

        {/* COMMUNICATION & REPORTS */}
        <Route path="communication" element={<CommunicationPage />} />
        <Route path="notices" element={<CommunicationPage />} />
        <Route path="send-message" element={<CommunicationPage />} />
        <Route path="reports" element={<ReportsPage />} />

        {/* SETTINGS, USERS & AUDIT */}
        <Route path="users" element={<UsersAuditPage />} />
        <Route path="audit-log" element={<UsersAuditPage />} />
        <Route path="settings/setup" element={<SetupWizard />} />
        <Route path="settings/institute" element={<InstituteSettings />} />
        <Route path="settings/roles" element={<RolesPermissions />} />
        <Route path="settings" element={<AccountSettings />} />

        {/* PLAN & SUPPORT */}
        <Route path="plan-billing" element={<PlanBillingPage />} />
        <Route path="help-support" element={<HelpSupportPage />} />

        {/* WEBSITE CMS (Synced with school-website) */}
        <Route path="cms" element={<CMSDashboard />} />
        <Route path="cms/home" element={<HomeCMS />} />
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
        <Route path="timetable" element={<RoutineTeacher />} />
        <Route path="routine" element={<RoutineTeacher />} />
        <Route path="my-class" element={<TeacherMyClass />} />
        <Route path="students" element={<TeacherMyClass />} />
        <Route path="attendance" element={<AttendanceTeacher />} />
        <Route path="homework" element={<TeacherHomework />} />
        <Route path="syllabus" element={<TeacherHomework />} />
        <Route path="assignments" element={<TeacherHomework />} />
        <Route path="material" element={<TeacherHomework />} />
        <Route path="marks" element={<Result />} />
        <Route path="remarks" element={<Result />} />
        <Route path="results" element={<Result />} />
        <Route path="messages" element={<TeacherMessages />} />
        <Route path="leave-payslip" element={<TeacherLeavePayslip />} />
        <Route path="leave" element={<TeacherLeavePayslip />} />
        <Route path="leaves" element={<TeacherLeavePayslip />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="settings" element={<TeacherSettings />} />
        <Route path="help" element={<TeacherHelp />} />
        <Route path="feedback" element={<TeacherFeedback />} />
        <Route path="exams" element={<ExamsTeacher />} />
        <Route path="results/upload-marks" element={<UploadMarksPage />} />
      </Route>

      <Route
        path="/student"
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="routine" element={<StudentTimetable />} />
        <Route path="exams" element={<StudentTimetable />} />
        <Route path="homework" element={<StudentHomework />} />
        <Route path="submit-homework" element={<StudentHomework />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="report-card" element={<StudentResults />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="library" element={<StudentLibrary />} />
        <Route path="material" element={<StudentMaterial />} />
        <Route path="study-material" element={<StudentMaterial />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<ChangePassword />} />
        <Route path="tests" element={<StudentTests />} />
        <Route path="help" element={<StudentHelp />} />
      </Route>

    </Routes>
  );
}
