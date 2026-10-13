# School ERP — UI/UX Screens

43 screens: 39 web (admin, office and staff) and 4 mobile (parent and teacher).

## Folders

- `index.html` — open this first: gallery of every screen with links.
- `images/web`, `images/mobile` — PNG of every screen (2x resolution).
- `html/web`, `html/mobile` — each screen as a plain HTML page that opens offline in any browser. Links between screens work.
- `source` — original design files (`.dc.html`) and `canvas.json` from the design canvas.
- `tailwind.config.js` — colours, fonts, radius and spacing tokens from Appendix A of the spec, ready for React + Tailwind.

Notes: screens show their first state (for example the Overview tab of Teacher Profile). Buttons and toggles are interactive only in the online design canvas. Fonts: IBM Plex Sans, IBM Plex Mono and Noto Sans Devanagari (loaded from Google Fonts when online).

## Screen list

### Core

- Login — `images/web/Login.png`, `html/web/Login.html`
- Admin Dashboard — `images/web/Main.png`, `html/web/Main.html`
- School Setup Wizard — `images/web/SetupWizard.png`, `html/web/SetupWizard.html`

### Admissions & students

- Admission CRM — `images/web/Admissions.png`, `html/web/Admissions.html`
- Application Review — `images/web/AdmissionForm.png`, `html/web/AdmissionForm.html`
- Student List — `images/web/Students.png`, `html/web/Students.html`
- Add Student — `images/web/AddStudent.png`, `html/web/AddStudent.html`
- Student Profile — `images/web/StudentProfile.png`, `html/web/StudentProfile.html`
- Year-end Promotion — `images/web/Promotion.png`, `html/web/Promotion.html`
- Transfer Certificate — `images/web/Certificates.png`, `html/web/Certificates.html`

### Academics & exams

- Daily Attendance — `images/web/Attendance.png`, `html/web/Attendance.html`
- Timetable — `images/web/Timetable.png`, `html/web/Timetable.html`
- Homework & Syllabus — `images/web/Homework.png`, `html/web/Homework.html`
- Exam Setup & Date Sheet — `images/web/ExamSetup.png`, `html/web/ExamSetup.html`
- Marks Entry — `images/web/Marks.png`, `html/web/Marks.html`
- Results & Report Cards — `images/web/ReportCards.png`, `html/web/ReportCards.html`

### Fees & accounts

- Fee Collection Counter — `images/web/FeeCounter.png`, `html/web/FeeCounter.html`
- Fee Structure — `images/web/FeeStructure.png`, `html/web/FeeStructure.html`
- Defaulters & Reminders — `images/web/Defaulters.png`, `html/web/Defaulters.html`
- Online Payment Reconciliation — `images/web/Reconciliation.png`, `html/web/Reconciliation.html`
- Day-end Cash Closing — `images/web/CashClosing.png`, `html/web/CashClosing.html`
- Accounts — Day Book — `images/web/Accounts.png`, `html/web/Accounts.html`

### Staff & HR

- Staff Directory — `images/web/Staff.png`, `html/web/Staff.html`
- Teacher Profile — `images/web/TeacherProfile.png`, `html/web/TeacherProfile.html`
- Staff Attendance — `images/web/StaffAttendance.png`, `html/web/StaffAttendance.html`
- Leave Approvals — `images/web/Leave.png`, `html/web/Leave.html`
- Payroll Run — `images/web/Payroll.png`, `html/web/Payroll.html`

### Operations

- Transport Routes — `images/web/Transport.png`, `html/web/Transport.html`
- Hostel Rooms — `images/web/Hostel.png`, `html/web/Hostel.html`
- Library Issue & Return — `images/web/Library.png`, `html/web/Library.html`
- Inventory & Assets — `images/web/Inventory.png`, `html/web/Inventory.html`
- Front Office — Visitors — `images/web/Visitors.png`, `html/web/Visitors.html`
- Complaints & Discipline — `images/web/Complaints.png`, `html/web/Complaints.html`

### Communication & reports

- Notices & Communication — `images/web/Notices.png`, `html/web/Notices.html`
- Parent-Teacher Meeting — `images/web/PTM.png`, `html/web/PTM.html`
- Reports & KPIs — `images/web/Reports.png`, `html/web/Reports.html`

### Users & audit

- Users — `images/web/Users.png`, `html/web/Users.html`
- Roles & Permissions — `images/web/Roles.png`, `html/web/Roles.html`
- Audit Log — `images/web/AuditLog.png`, `html/web/AuditLog.html`

### Mobile app

- Parent — Home — `images/mobile/ParentHome.png`, `html/mobile/ParentHome.html`
- Parent — Fees & Pay — `images/mobile/ParentFees.png`, `html/mobile/ParentFees.html`
- Parent — Report Card — `images/mobile/ParentReportCard.png`, `html/mobile/ParentReportCard.html`
- Teacher — Home — `images/mobile/TeacherHome.png`, `html/mobile/TeacherHome.html`
