import { Routes, Route } from 'react-router-dom'
import SchoolWebLayout from './layouts/SchoolWebLayout'
import SchoolLanding from './pages/SchoolLanding'
import SchoolAbout from './pages/SchoolAbout'
import SchoolAchievements from './pages/SchoolAchievements'
import SchoolAdmissions from './pages/SchoolAdmissions'
import SchoolAcademics from './pages/SchoolAcademics'
import SchoolGallery from './pages/SchoolGallery'
import SchoolContact from './pages/SchoolContact'

// CMS Admin Imports
import CMSLayout from './admin/layouts/CMSLayout'
import HeroCMS from './admin/cms/HeroCMS'
import AboutCMS from './admin/cms/AboutCMS'
import AdmissionsCMS from './admin/cms/AdmissionsCMS'
import AcademicsCMS from './admin/cms/AcademicsCMS'
import AchievementsCMS from './admin/cms/AchievementsCMS'
import GalleryCMS from './admin/cms/GalleryCMS'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SchoolWebLayout />}>
        <Route index element={<SchoolLanding />} />
        <Route path="about" element={<SchoolAbout />} />
        <Route path="achievements" element={<SchoolAchievements />} />
        <Route path="admissions" element={<SchoolAdmissions />} />
        <Route path="academics" element={<SchoolAcademics />} />
        <Route path="gallery" element={<SchoolGallery />} />
        <Route path="contact" element={<SchoolContact />} />
      </Route>

      {/* Separate CMS Portal */}
      <Route path="/cms-admin" element={<CMSLayout />}>
        <Route index element={<HeroCMS />} />
        <Route path="hero" element={<HeroCMS />} />
        <Route path="about" element={<AboutCMS />} />
        <Route path="admissions" element={<AdmissionsCMS />} />
        <Route path="academics" element={<AcademicsCMS />} />
        <Route path="achievements" element={<AchievementsCMS />} />
        <Route path="gallery" element={<GalleryCMS />} />
      </Route>
    </Routes>
  )
}

export default App;
