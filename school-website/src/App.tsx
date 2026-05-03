import { Routes, Route } from 'react-router-dom'
import SchoolWebLayout from './layouts/SchoolWebLayout'
import SchoolLanding from './pages/SchoolLanding'
import SchoolAbout from './pages/SchoolAbout'
import SchoolAdmissions from './pages/SchoolAdmissions'
import SchoolAcademics from './pages/SchoolAcademics'
import SchoolGallery from './pages/SchoolGallery'
import SchoolContact from './pages/SchoolContact'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SchoolWebLayout />}>
        <Route index element={<SchoolLanding />} />
        <Route path="about" element={<SchoolAbout />} />
        <Route path="admissions" element={<SchoolAdmissions />} />
        <Route path="academics" element={<SchoolAcademics />} />
        <Route path="gallery" element={<SchoolGallery />} />
        <Route path="contact" element={<SchoolContact />} />
      </Route>
    </Routes>
  )
}

export default App
