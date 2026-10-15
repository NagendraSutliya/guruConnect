# 🏫 GuruConnect - Comprehensive Project Structure & Audit Report

> **Status Legend**:
> - 🟢 **[SAHI HAI / KEEP]** : File/Folder sahi jagah par hai aur active use me hai.
> - 🟡 **[MISPLACED / REORGANIZE]** : File useful hai lekin galat folder me padi hai.
> - 🔴 **[EXTRA / UNUSED]** : File dead, unreferenced, duplicate ya temporary hai (Review ke baad remove ho sakti hai).
> - ⚠️ **[SECURITY / ACTION REQUIRED]** : Security risk ya critical configuration issue.

---

## 📑 Quick Executive Summary of Issues

| Category | Count / Issue | Primary Recommendation |
|---|---|---|
| **Security Risk** | `server/.env` git me commit hai | `.gitignore` me daal kar git cache se untrack karein. |
| **Loose Server Scripts** | 17 `.js` test/migration files root of `server/` me hain | Ek `server/scripts/` folder me move karein ya delete karein. |
| **Dead Route Code** | `server/src/routes/old_code/` (5 files) | Archive karein ya remove karein. |
| **Unreferenced Images** | `client/public/referenced_images/` (13 images) | Kahin use nahi ho rahi hain, remove karein. |
| **Duplicate Logos** | `guruconnect-logo.png` vs `guruconnect_logo.png` | Ek standardized logo rakhein. |
| **Duplicate Assets** | `client/public/images/redesign/` vs `school-website/public/images/redesign/` | ~20 heavy images dono jagah duplicate hain. |
| **Empty Directories** | `shared/constants`, `types`, `validations` | Jab tak shared package setup na ho, empty hain. |
| **Orphan Source Files** | `client/src/pages/teacher/TopBar.jsx` (loose .jsx) & `admin/TO-DO.text` | Clean / remove karein. |
| **Temporary Patch/Script** | `school-website/todays_changes_backup.patch` & `.cjs` | Root se hatayein. |
| **Root Package Pollution** | Root `package.json` me `@mui/material`, `multer` etc. installed hain | Root package clean karein. |

---

## 🌳 Full Directory Tree With Status & Notes

```text
guruConnect/
├── 📄 .gitignore                                          ⚠️ [SECURITY] .env, dist, server/uploads missing hain
├── 📄 package.json                                        🟡 [CLEANUP] Root me frontend/backend deps mix ho gayi hain
├── 📄 package-lock.json                                   🟢 [SAHI HAI] Root lockfile
├── 📄 tailwind.config.js                                  🔴 [EXTRA] Root me koi UI build nahi hoti, client/school-website ki apni config hai
├── 📄 README.md                                           🟢 [SAHI HAI] Project documentation
├── 📄 IMS_DOCUMENTATION.md                                🟢 [SAHI HAI] Architecture documentation
├── 📄 UI_ENHANCEMENTS_TODO.md                             🟢 [SAHI HAI] UI roadmap notes
├── 📄 implementation_plan.md                              🟢 [SAHI HAI] Feature implementation notes
├── 📄 School-ERP-End-to-End-Flow.pdf                      🟢 [SAHI HAI] Business flow specification document
├── 📄 School_Management_System_Development_Specification.docx 🟢 [SAHI HAI] Requirement spec document
│
├── 📁 scratch/                                            🟢 [SAHI HAI] Temporary dev notes (.gitignore me added)
│   ├── 📄 admin_spec_text.txt
│   ├── 📄 fix_attendance_fields.js
│   └── 📄 pdf_text.txt
│
├── 📁 shared/                                             🟡 [EMPTY] Empty folders, filhal codebase me import nahi ho rahe
│   ├── 📁 constants/                                      🟡 [EMPTY]
│   ├── 📁 types/                                          🟡 [EMPTY]
│   └── 📁 validations/                                    🟡 [EMPTY]
│
├── 📁 requirement/                                        🟢 [SAHI HAI] Design & HTML specs reference
│   └── 📁 Admin-Panel-Complete/
│       ├── 📄 Admin-Panel-Specification.pdf
│       ├── 📄 README.md
│       ├── 📄 index.html
│       └── 📁 UI/                                         🟢 [SAHI HAI] 11 sections of HTML wireframes
│
├── 📁 School-ERP-UI-UX/                                   🟢 [SAHI HAI] Reference UI kit / Dashboard prototypes
│   ├── 📄 README.md
│   ├── 📄 index.html
│   ├── 📄 tailwind.config.js
│   ├── 📁 html/
│   ├── 📁 images/
│   └── 📁 source/                                         🟢 [SAHI HAI] 46 component templates (.dc.html)
│
├── 📁 server/                                             🟢 [BACKEND ROOT]
│   ├── 📄 .env                                            ⚠️ [SECURITY CRITICAL] Git me commit ho chuka hai! Untrack karein
│   ├── 📄 package.json                                    🟢 [SAHI HAI] Server dependencies
│   ├── 📄 package-lock.json                               🟢 [SAHI HAI]
│   │
│   │── ⚠️ LOOSE TESTING / MIGRATION SCRIPTS (Server Root me bikhre hue hain)
│   ├── 📄 check_db_total.js                               🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 check_examsubject_data.js                       🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 check_raw_results.js                            🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 check_results_data.js                           🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 check_teachers.js                               🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 create_test_attendance.js                       🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 drop_attendance_indexes.js                      🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 ensure_routine_both.js                          🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 find_ids_temp.js                                🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 fix_attendance_fields.js                       🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 force_routine.js                                🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 insert_routine.js                               🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 migrate_results.js                              🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 routine_v3.js                                   🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 update_routine_v2.js                            🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 verify_id.js                                    🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   ├── 📄 verify_routine.js                               🟡 [MISPLACED] Suggestion: Move to server/scripts/
│   │
│   ├── 📁 uploads/                                        🟢 [DISK STORAGE]
│   │   ├── 📁 answers/                                    🟢 [SAHI HAI] Student answer sheets upload folder
│   │   ├── 📁 others/                                     🟢 [SAHI HAI] General uploads folder
│   │   └── 📁 papers/                                     🟢 [SAHI HAI] Question paper PDFs (active uploads)
│   │
│   └── 📁 src/
│       ├── 📄 server.js                                   🟢 [SAHI HAI] Express app entrypoint
│       ├── 📄 seedData.js                                 🟢 [SAHI HAI] Database seeding utility
│       │
│       ├── 📁 config/                                     🟢 [SAHI HAI]
│       │   ├── 📄 db.js                                   🟢 [SAHI HAI] Mongoose connection
│       │   └── 📄 cloudinary.js                           🟢 [SAHI HAI] Cloudinary CDN setup
│       │
│       ├── 📁 middleware/
│       │   ├── 📄 auth.js                                 🟢 [SAHI HAI] JWT Authentication & Role authorization
│       │   ├── 📄 upload.js                               🟢 [SAHI HAI] Disk storage Multer (for PDFs/papers)
│       │   └── 📄 uploadMiddleware.js                     🟡 [RENAME SUGGESTION] Memory storage Multer (Cloudinary uploads)
│       │
│       ├── 📁 models/                                     🟢 [SAHI HAI] 24 Database Schemas
│       │   ├── 📄 AcademicYear.js, Admin.js, Admission.js, Attendance.js
│       │   ├── 📄 Class.js, Exam.js, ExamFile.js, ExamMaterial.js, ExamSubject.js
│       │   ├── 📄 FeePayment.js, FeeStructure.js, Feedback.js, Institute.js
│       │   ├── 📄 PublicLink.js, Result.js, Routine.js, Section.js, Student.js
│       │   ├── 📄 StudyMaterial.js, Subject.js, SuperAdmin.js, Teacher.js
│       │   ├── 📄 TeacherAssignment.js, WebsiteCMS.js
│       │
│       ├── 📁 controllers/                                🟢 [SAHI HAI]
│       │   ├── 📁 admin/                                  🟢 [SAHI HAI] Sub-controllers (Academic, Exam, Routine, etc.)
│       │   ├── 📁 auth/                                   🟢 [SAHI HAI] Login, Register, Verification
│       │   ├── 📁 student/                                🟢 [SAHI HAI] Student actions
│       │   ├── 📁 superadmin/                             🟢 [SAHI HAI] Superadmin dashboard & management
│       │   ├── 📁 teacher/                                🟢 [SAHI HAI] Teacher actions
│       │   ├── 📄 cmsController.js                        🟡 [NAMING] CamelCase vs dot.notation
│       │   ├── 📄 examFile.controller.js                  🟢 [SAHI HAI]
│       │   ├── 📄 feedback.controller.js                  🟢 [SAHI HAI]
│       │   ├── 📄 public.controller.js                    🟢 [SAHI HAI]
│       │   └── 📄 uploadController.js                     🟡 [NAMING]
│       │
│       ├── 📁 routes/
│       │   ├── 📄 index.js                                🟢 [SAHI HAI] Root route aggregator
│       │   ├── 📄 cmsRoutes.js                            🟡 [MISPLACED] suggestion: Move inside routes/v1/
│       │   ├── 📄 uploadRoutes.js                         🟡 [MISPLACED] suggestion: Move inside routes/v1/
│       │   ├── 📁 old_code/                               🔴 [EXTRA / DEPRECATED] 5 Purani unused route files
│       │   │   ├── 📄 admin.routes.js
│       │   │   ├── 📄 auth.routes.js
│       │   │   ├── 📄 feedback.routes.js
│       │   │   ├── 📄 public.routes.js
│       │   │   └── 📄 teacher.routes.js
│       │   └── 📁 v1/                                     🟢 [SAHI HAI] Versioned active routes
│       │       ├── 📄 auth.routes.js, examFile.routes.js, feedback.routes.js
│       │       ├── 📄 index.js, public.routes.js, superadmin.routes.js, teacher.routes.js
│       │       ├── 📁 admin/
│       │       ├── 📁 student/
│       │       └── 📁 teacher/
│       │
│       ├── 📁 services/                                   🟢 [SAHI HAI] Business logic layer
│       │   ├── 📄 feedback.service.js
│       │   ├── 📄 institute.service.js
│       │   └── 📄 teacher.service.js
│       │
│       ├── 📁 utils/
│       │   ├── 📄 examStatus.js, mailer.js, response.js, token.js, verificationCode.js 🟢 [SAHI HAI]
│       │   └── 📄 smsService.js                           🟡 [MISPLACED] Service hai, utils ki jagah services/ me hona chahiye
│       │
│       └── 📁 validators/                                 🟢 [SAHI HAI]
│           ├── 📄 auth.validator.js
│           └── 📄 feedback.validator.js
│
├── 📁 client/                                             🟢 [MAIN FRONTEND ERP]
│   ├── 📄 index.html                                      🟢 [SAHI HAI]
│   ├── 📄 package.json                                    🟢 [SAHI HAI] React 19, Lucide, Recharts, Vite
│   ├── 📄 vite.config.ts                                  🟢 [SAHI HAI]
│   ├── 📄 tailwind.config.js                              🟢 [SAHI HAI]
│   ├── 📄 postcss.config.js                               🟢 [SAHI HAI]
│   ├── 📄 tsconfig*.json                                  🟢 [SAHI HAI]
│   │
│   ├── 📁 public/
│   │   ├── 📄 vite.svg                                    🟢 [SAHI HAI]
│   │   ├── 📄 guruconnect-logo.png                        🔴 [DUPLICATE] guruconnect_logo.png ke sath duplicate hai
│   │   ├── 📄 guruconnect_logo.png                        🟢 [SAHI HAI] Standard logo
│   │   ├── 📁 referenced_images/                          🔴 [EXTRA / UNUSED] 13 Scraped long-hash images (Kahin use nahi ho rahi)
│   │   └── 📁 images/                                     🟢 [SAHI HAI]
│   │       ├── 📄 login.png, admin_login.png, teacher_login.png, student_login.png 🟢 [SAHI HAI]
│   │       ├── 📄 hero.png, dashboard-preview.png, easy.png, safe.png, insights.png 🟢 [SAHI HAI]
│   │       └── 📁 redesign/                               🟡 [DUPLICATE ASSETS] 21 images (school-website ke sath duplicate hain)
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx, App.tsx, App.css, index.css       🟢 [SAHI HAI] App core
│       ├── 📁 api/                                        🟢 [SAHI HAI] axiosInstance.ts
│       ├── 📁 assets/                                     🟢 [SAHI HAI] react.svg (Default Vite asset)
│       ├── 📁 context/                                    🟢 [SAHI HAI] AuthContext, TeacherContext, ToastContext
│       ├── 📁 guards/                                     🟢 [SAHI HAI] Role guards (AdminRoute, TeacherRoute, etc.)
│       ├── 📁 hooks/                                      🟢 [SAHI HAI] useClickOutside.ts
│       ├── 📁 layouts/                                    🟢 [SAHI HAI] AdminLayout, TeacherLayout, StudentLayout, etc.
│       ├── 📁 routes/                                     🟢 [SAHI HAI] AppRoutes.tsx
│       ├── 📁 types/                                      🟢 [SAHI HAI] TypeScript definitions (admin, teacher)
│       ├── 📁 utils/                                      🟢 [SAHI HAI] autoScheduler.ts
│       │
│       ├── 📁 components/
│       │   ├── 📄 PortalSlider.tsx                        🟡 [MISPLACED] Suggestion: Move to components/common/ or landing/
│       │   ├── 📄 Toast.tsx                               🟡 [MISPLACED] Suggestion: Move to components/common/
│       │   ├── 📁 common/                                 🟢 [SAHI HAI] DataGrid, Pagination, CommandPalette
│       │   ├── 📁 admin/                                  🟢 [SAHI HAI] Admin specific UI widgets
│       │   ├── 📁 teacher/                                🟢 [SAHI HAI] Teacher UI widgets
│       │   ├── 📁 student/                                🟢 [SAHI HAI] Student UI widgets
│       │   ├── 📁 landing/                                🟢 [SAHI HAI] Landing page components
│       │   └── 📁 school/                                 🟢 [SAHI HAI] School specific UI
│       │
│       └── 📁 pages/
│           ├── 📄 Landing.tsx, About.tsx, Contact.tsx, Legal.tsx 🟢 [SAHI HAI] Public portal pages
│           ├── 📁 auth/                                   🟢 [SAHI HAI] Login.tsx, Register.tsx, Verify.tsx
│           ├── 📁 parent/                                 🟢 [SAHI HAI] Login.tsx
│           ├── 📁 superadmin/                             🟢 [SAHI HAI] 16 SaaS management pages
│           │
│           ├── 📁 student/
│           │   ├── 📁 panels/                             🟢 [SAHI HAI] Concrete student feature panels
│           │   └── 📄 RoutineStudent.tsx, StudentAttendance.tsx etc. 🟢 [SAHI HAI] Route wrapper pages
│           │
│           ├── 📁 teacher/
│           │   ├── 📄 Dashboard.tsx, TeacherProfile.tsx etc. 🟢 [SAHI HAI]
│           │   ├── 📄 TopBar.jsx                          🔴 [EXTRA / UNUSED] Dead .jsx file with missing @heroicons/react
│           │   ├── 📁 dashboard/                          🟢 [SAHI HAI] 12 Dashboard widgets
│           │   └── 📁 panels/                             🟢 [SAHI HAI] 8 Teacher operational panels
│           │
│           └── 📁 admin/
│               ├── 📄 Dashboard.tsx, AccountSettings.tsx, AdminProfile.tsx 🟢 [SAHI HAI]
│               ├── 📄 TO-DO.text                          🔴 [EXTRA / MISPLACED] Scratch checklist inside source code
│               ├── 📄 Feedback.tsx, Links.tsx             🟢 [SAHI HAI] Wrappers for panels
│               ├── 📁 panels/                             🟢 [SAHI HAI] 14 Core Admin panels
│               ├── 📁 academic/                           🟢 [SAHI HAI] Academic wrapper views
│               ├── 📁 admissions/                         🟢 [SAHI HAI] Admissions CRM
│               ├── 📁 billing/                            🟢 [SAHI HAI] Plan & Billing
│               ├── 📁 cms/                                🟢 [SAHI HAI] Website CMS managers
│               ├── 📁 communication/                      🟢 [SAHI HAI] Notice & SMS page
│               ├── 📁 exams/                              🟢 [SAHI HAI] Exams & Results
│               ├── 📁 finance/                            🟢 [SAHI HAI] Accounts, Fees, Invoices
│               ├── 📁 home/                               🟢 [SAHI HAI] Approvals
│               ├── 📁 hr/                                 🟢 [SAHI HAI] Staff, Payroll, Leave
│               ├── 📁 operations/                         🟢 [SAHI HAI] Library, Transport, Hostel, Inventory
│               ├── 📁 reports/                            🟢 [SAHI HAI] Reports view
│               ├── 📁 settings/                           🟢 [SAHI HAI] Setup wizard & roles
│               ├── 📁 student/                            🟢 [SAHI HAI] Admissions & Students
│               ├── 📁 support/                            🟢 [SAHI HAI] Help & Support
│               └── 📁 teacher/                            🟢 [SAHI HAI] Teacher assignments
│
└── 📁 school-website/                                     🟢 [PUBLIC SCHOOL WEBSITE]
    ├── 📄 package.json                                    🟢 [SAHI HAI]
    ├── 📄 vite.config.ts                                  🟢 [SAHI HAI]
    ├── 📄 tailwind.config.js                              🟢 [SAHI HAI]
    ├── 📄 vercel.json                                     🟢 [SAHI HAI]
    ├── 📄 todays_changes_backup.patch                     🔴 [EXTRA / BACKUP] 78KB loose patch file root me pada hai
    ├── 📄 update_school_landing.cjs                       🔴 [EXTRA / SCRIPT] Temporary text-update script
    │
    ├── 📁 public/images/redesign/                         🟡 [DUPLICATE ASSETS] 22 images (Hero, labs, gallery, etc.)
    │
    └── 📁 src/
        ├── 📄 main.tsx, App.tsx, index.css                🟢 [SAHI HAI]
        ├── 📁 api/                                        🟢 [SAHI HAI] axiosInstance.ts
        ├── 📁 components/                                 🟢 [SAHI HAI] SchoolPageHeader.tsx
        ├── 📁 layouts/                                    🟢 [SAHI HAI] SchoolWebLayout.tsx
        └── 📁 pages/                                      🟢 [SAHI HAI] Gyansthali school pages (About, Academics, Admissions, etc.)
```

---

## 🎯 Step-by-Step Suggested Cleanup Plan (Aapke Review Ke Liye)

Agar aap approve karte hain, toh hum in steps me cleanup aur structure standardisation kar sakte hain:

### Phase 1: Security & Git Cleanup
1. **`server/.env` ko git cache se untrack karna**:
   `git rm --cached server/.env` run karke `.env` ko disk par preserve rakhein lekin git repo se untrack karein.
2. **Root `.gitignore` ko update karna**:
   `.env`, `dist`, `server/uploads` ko add karein taaki private files aur uploaded PDFs git par push na hon.

### Phase 2: Server Cleanup & Organization
1. **Server Scripts Reorganization**:
   `server/` root ke 17 loose scripts ko ek dedicated folder `server/scripts/` (ya `server/migrations/`) me shift karein taaki server ka root neat and clean ho jaye.
2. **Dead / Deprecated Route Removal**:
   `server/src/routes/old_code/` folder ko delete ya archive karein.
3. **Route Structure Standardization**:
   `cmsRoutes.js` aur `uploadRoutes.js` ko `server/src/routes/v1/` ke andar move karke `index.js` ko update karein.
4. **SMS Service Placement**:
   `server/src/utils/smsService.js` ko `server/src/services/sms.service.js` me place karein.

### Phase 3: Assets & Public Directory Cleanup
1. **Unused Scraped Images**:
   `client/public/referenced_images/` (13 useless images) ko delete karein.
2. **Duplicate Logos**:
   `client/public/guruconnect-logo.png` aur `guruconnect_logo.png` me se ek standard logo finalize karke doosra hata dein.
3. **School Website Loose Files**:
   `school-website/todays_changes_backup.patch` aur `school-website/update_school_landing.cjs` ko remove karein.

### Phase 4: Client Source Code Optimization
1. **Dead Files Removal**:
   - `client/src/pages/teacher/TopBar.jsx` (unused JSX component) ko remove karein.
   - `client/src/pages/admin/TO-DO.text` ko root documentation me move karein.
2. **Components Organization**:
   - `client/src/components/Toast.tsx` aur `PortalSlider.tsx` ko `client/src/components/common/` me shift karein.
3. **Root Package Clean**:
   - Root `tailwind.config.js` ko remove karein (kyunki root par koi frontend compile nahi hota).
