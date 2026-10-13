# Admin Portal UI/UX Enhancement Tasks

This document tracks the premium UI/UX features and enhancements needed to elevate the Admin Portal to a state-of-the-art modern ERP standard.

## 1. Global Search / Command Palette (Priority: High)
- **Goal:** Implement a Spotlight/Raycast style command palette triggered by `Ctrl+K` or `Cmd+K`.
- **Features:**
  - Omnipresent search bar accessible from any route.
  - Instantly search across Students, Teachers, Invoices, and System Settings.
  - Keyboard navigation (Up/Down arrows to select, Enter to navigate).
  - Quick actions (e.g., "Add New Student", "Collect Fees").

## 2. Advanced Data Grids / Tables (Priority: High)
- **Goal:** Upgrade all basic HTML tables (Students, Teachers, Classes) to powerful data grids.
- **Features:**
  - **Bulk Actions:** Select multiple rows via checkboxes for bulk SMS, delete, or status change.
  - **Export Capabilities:** One-click Export to CSV, Excel, and PDF.
  - **Column Toggling:** Ability to show/hide specific columns dynamically.
  - **Inline Editing:** Quick edits without opening a new page or modal.
  - **Advanced Filtering & Sorting:** Multi-column sort and complex filters.

## 3. Multi-Step Forms / Wizards (Priority: Medium)
- **Goal:** Improve UX for long, complex forms like New Admission and Institute Settings.
- **Features:**
  - Split long vertical forms into logical steps (e.g., Step 1: Basic Details, Step 2: Parent Info, Step 3: Documents).
  - Visual progress bar or stepper component at the top.
  - Form state persistence (save draft before moving to the next step).

## 4. Interactive Timetable / Calendar View (Priority: Medium)
- **Goal:** Replace the static tabular view of the `Routine` module with an interactive visual calendar.
- **Features:**
  - Google Calendar-style daily/weekly grid view.
  - Drag-and-drop functionality to assign/reassign classes or change timings.
  - Color-coding for different subjects/teachers to make it visually scannable.

## 5. Notifications & Action Center (Priority: Medium)
- **Goal:** Provide a comprehensive notification system beyond just a bell icon.
- **Features:**
  - A slide-out right drawer (Action Center).
  - Categorized alerts (e.g., Fee Bounces, Leave Requests, System Alerts).
  - Unread badge counters.
  - Quick action buttons inside the notification (e.g., "Approve Leave" directly from the drawer).

## 6. Dark Mode / Theme Customization (Priority: Low)
- **Goal:** Reduce eye strain for admins who use the ERP for extended hours.
- **Features:**
  - System-wide Light/Dark mode toggle switch.
  - State persistence in `localStorage` or user preferences.
  - Smooth CSS transitions between themes.
  - (Optional) Primary brand color customization for different schools.

---
**Note:** These tasks should be picked up sequentially based on priority to incrementally improve the overall user experience of the GuruConnect ERP.
