# guruConnect

MASTER FLOW CHART (MERMAID FORMAT)

https://mermaid.live/edit#pako:eNqNlu1u4kYUhm9lZGmrXSlJQ0gIILXVxDYbN2CQPSSigNDEnoC7xkb-2F0a8rcX0EvslXQ-bbM4UH4xZ945M-fMc874VfNin2hd7SWMv3krnGQAGbNoFn34AH6p-_EZOEb34CfgDPume0zqIuigj1N3m2ZkDdyMup9_Yt75BDg__5W7eu3HyyACaLshb2yWu6eTO-ivg2gHoDGw7EV_-Nmyp9wE-IJ5RYkI9lYk2QFkQv3edKRamg_1bpb7JMp2wEVjw7SR1EtzoT-VB3Yw0OsPn44JK8cXIfOxAd17GY2B09VzjBOf71hOK_VCBuVOBzjCSwJkWOm8Vi1DKtQyqHfUUIeGObD0KfSwT9aBB1yS5Zv3xPpwzFxDz4tz6pNS0CPkHdeOORo6VOyQTZxwLYxwuM0CL1W5FQn49-9_ipi4pyJi6ctQBpoxX0nnNVKDDlAhNqgwC77ijBxbA13X-mwv3PHd76bOYkvTYBkBN3_-k3gqbbVL9D79YxYr9BCnKamJTd2A8KTup4hNGnhsUjqvkYrYlLgS25E11YPuHZNehkujC-Lo8LiKBOFPAcL9FUmS2QGCsXW5_Z5cJeiHLauI7S9AposWzpj2FVq7aQZ0Gt8yTgLCVjt5qFDbX6UGi4kJnRLkCcEJ0OPoJVjWBSkIVu4E2Nxdz6TbU6xpYpPcy_KEzGtUIzihuYZo7E5HeMsywDpclqd1YnuIrJ6lQ2QNbeHbjrPgJfAwy0d6utVI_E42m73-J-7g3tQf5ElfIWOG_EbbbNXMW6Id78Bdf6g_mAYrb0Iv7C6MvS-EtaUD9YSkZbPlvUz12v1uVpUIgiiek8UAoul4E8ZYEL-lHGUkCXA4r1nCoKAMJUQUcspr8kAFETJtA9q6SRtf8gXALCORjyOP1KkH0Hlw1RGYXtxBcTopYvXmjHU0dswCeUaPvsIbemD-fxD7FEwZrSsvnINsmAhafYkye97mQqImeCZFbTDJDuioRjCiiYn9wNuBUd30IGAdMVnvwMAyauZ7AW26O9CzbNhnZ-SRFzmQxTbA30UWwM_A_IrDnHNZVNwJOGXLOQnn3mNb0LDgcFXQLI0FmNyk6BSfCyWcP-g5mtzGuVRv-j6XxbxsILrpupzKx4B8O2SyVv7kqkJ5imnqVoRwMmu17FoEB4zL9SY7ED5a5tNCYMnPoKCsUVHUpyXe4DFIg-cgDLKt-IAodywKYzBSbVVu_3-v1oAIgj6cmM4xIVNNPxo4w884JZ_kd0zxaovni2qEVeFSWvfLTtjKWhLjklvpqaj3ipG17srwRHB0_TEFna5-vD6HhD1hHg7ZX_Yhq51pyyTwtS59J8iZtqZViNlQe51FAMy0bEVfxpnWpX998oLzMJtps-iNLtvg6I84XquVSZwvV1r3BYcpHeUbn5JnBHiZ4FJCb5skOnuztO7VZaPFnWjdV-271j1vXF60Lls3181Op33Vvmk1zrSt1m002xfNy1bnunnVur1qXDXbb2faX3zfy4tO57rdaTdvmu3Obbtxc_v2H44wue0

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








🧭 PHASE-WISE BREAKDOWN (FOR FUTURE YOU)
🔹 Phase 1 – Foundation
    1.Auth (Admin / Teacher / Student)
    2.Teacher & Student management
    3.Class, section, subject setup
🔹 Phase 2 – Academic Core
    1.Study materials
    2.Attendance
    3.Test creation
    4.Marks upload
🔹 Phase 3 – Student Experience
    1.Test attempts
    2.Marks visibility
    3.Attendance visibility
    4.Worksheets
🔹 Phase 4 – Accounts & Control
    1.Fees
    2.Notifications
    3.Admin analytics
    4.Reports
