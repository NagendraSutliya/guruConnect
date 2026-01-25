# guruConnect

MASTER FLOW CHART (MERMAID FORMAT)

flowchart TD

%% =====================
%% AUTH & ROLES
%% =====================
START([System Start])

START --> AUTH{Login Type}

AUTH -->|Admin| ADMIN_LOGIN[Admin Login]
AUTH -->|Teacher| TEACHER_LOGIN[Teacher Login]
AUTH -->|Student| STUDENT_LOGIN[Student Login]

%% =====================
%% ADMIN FLOW
%% =====================
ADMIN_LOGIN --> ADMIN_DASH[Admin Dashboard]

ADMIN_DASH --> ADM_TEACHERS[Manage Teachers]
ADMIN_DASH --> ADM_STUDENTS[Manage Students]
ADMIN_DASH --> ADM_ACADEMIC[Academic Setup]
ADMIN_DASH --> ADM_ACCOUNTS[Accounts & Fees]
ADMIN_DASH --> ADM_REPORTS[Reports & Analytics]

%% Admin → Teachers
ADM_TEACHERS --> ADD_TEACHER[Add Teacher]
ADM_TEACHERS --> DEACT_TEACHER[Deactivate Teacher]
ADM_TEACHERS --> ASSIGN_SUBJECTS[Assign Subjects]
ADM_TEACHERS --> ASSIGN_CLASSES[Assign Classes]

%% Admin → Students
ADM_STUDENTS --> ADD_STUDENT[Add Student]
ADM_STUDENTS --> DEACT_STUDENT[Deactivate Student]
ADM_STUDENTS --> ASSIGN_CLASS[Assign Class & Section]

%% Admin → Academic
ADM_ACADEMIC --> SUBJECTS[Subject Management]
ADM_ACADEMIC --> CLASSES[Class & Section Setup]
ADM_ACADEMIC --> TEST_RULES[Test Categories & Rules]
ADM_ACADEMIC --> ACADEMIC_YEAR[Academic Year Config]

%% Admin → Accounts
ADM_ACCOUNTS --> FEES[Fee Structure]
ADM_ACCOUNTS --> PAY_STATUS[Payment Status]
ADM_ACCOUNTS --> NOTIFICATIONS[Fee Notifications]

%% =====================
%% TEACHER FLOW
%% =====================
TEACHER_LOGIN --> CHECK_STATUS{Active?}
CHECK_STATUS -->|No| BLOCKED[Access Blocked]
CHECK_STATUS -->|Yes| TEACHER_DASH[Teacher Dashboard]

TEACHER_DASH --> STUDY_MAT[Upload Study Material]
TEACHER_DASH --> TESTS[Create Tests]
TEACHER_DASH --> ATTENDANCE[Mark Attendance]
TEACHER_DASH --> MARKS[Upload Marks]

STUDY_MAT --> MAT_STRUCTURE[Subject → Chapter → Module]

TESTS --> TEST_DETAILS[Test Type]
TEST_DETAILS -->|Class Test| CT
TEST_DETAILS -->|Periodic| PT
TEST_DETAILS -->|Mid Term| MID
TEST_DETAILS -->|Final| FINAL

MARKS --> MARK_RULES[Max Marks / Evaluation Rules]

%% =====================
%% STUDENT FLOW
%% =====================
STUDENT_LOGIN --> STUD_CHECK{Active?}
STUD_CHECK -->|No| STUD_BLOCKED[Login Blocked]
STUD_CHECK -->|Yes| STUD_DASH[Student Dashboard]

STUD_DASH --> ACCESS_MAT[View Study Material]
STUD_DASH --> ACCESS_WS[Access Worksheets]
STUD_DASH --> ACCESS_TEST[Test Attempt]
STUD_DASH --> VIEW_MARKS[View Marks]
STUD_DASH --> VIEW_ATT[Attendance Visibility]

ACCESS_TEST --> ATTEMPT_RULES[Attempt Rules]

%% =====================
%% DATA LAYER
%% =====================
DATA[(Database)]

ADD_TEACHER --> DATA
ADD_STUDENT --> DATA
STUDY_MAT --> DATA
TESTS --> DATA
MARKS --> DATA
ATTENDANCE --> DATA
FEES --> DATA

%% =====================
%% END
%% =====================
END([System Stable & Scalable])
