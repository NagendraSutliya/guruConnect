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
import PublicFeedback from "../pages/public/PublicFeedback";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify" element={<Verify />} />
        <Route path="/feedback/:code" element={<PublicFeedback />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* <Route path="dashboard" element={<Dashboard />} /> */}
        <Route path="teachers" element={<Teachers />} />
        <Route path="feedback" element={<FeedbackPanel />} />
        <Route path="link" element={<LinksPanel />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="/teacher/login" element={<TeacherLogin />} />

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
      </Route>
    </Routes>
  );
}
