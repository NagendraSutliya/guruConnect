# GuruConnect - Advanced Institute Management System (IMS)

GuruConnect is a high-performance, enterprise-grade Institute Management System designed to bridge the gap between administrators, faculty, and students. Built with a focus on high-density data management and premium aesthetics.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS (Glassmorphic & Modern High-Density Design)
- **State Management**: React Context API
- **Icons**: Lucide (React Icons / Fi / Fa)
- **Notifications**: Custom `useToast` system

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Cloud Storage**: Cloudinary (for Study Materials & Profile Images)

---

## 🏗 System Architecture

The project is divided into three distinct operational portals:

### 1. Admin Portal (`/admin`)
The central command center for the institute.
- **Teacher Management**: Complete faculty lifecycle management with Cloudinary-backed profile photos.
- **Student Management**: Detailed student records, class/section assignments, and academic tracking.
- **Academic Setup**: Configuration of Classes, Sections, and Subjects.
- **CMS Control**: Dynamic management of the public school website's content.

### 2. Teacher Portal (`/teacher`)
A high-productivity dashboard for faculty members.
- **Curriculum Vault**: Upload and manage study materials (PDF, DOCX, ZIP) powered by Cloudinary.
- **Academic Ledger**: Mark attendance and upload examination results.
- **Institution Calendar**: A synchronized schedule with interactive date-based event filtering.
- **Profile Customization**: Personal faculty dashboard with secure photo uplinking.

### 3. Student Portal (`/student`)
The end-user interface for academic consumption.
- **Resource Access**: Download study materials shared by faculty.
- **Academic Monitoring**: View attendance records and examination results.

---

## 💎 Premium Features & Refinements

- **Glassmorphic UI**: High-density layouts using backdrop blurs, subtle gradients, and rounded aesthetics.
- **Zero-Layout-Shift**: Components are locked with fixed dimensions to prevent jitter during interaction.
- **Cloudinary Integration**: Fully automated document and image storage with secure streaming uploads and cleanup protocols.
- **Interactive Calendar**: Custom-built calendar with 6-row adaptive scaling and real-time event contextualization.
- **Global Search & Filter**: Sophisticated filtering systems (Chips & Search) across all management panels.

---

## 🛠 Setup & Deployment

### Environment Variables (.env)
Required keys for full functionality:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Running Locally
1. **Server**: `cd server && npm install && npm start`
2. **Client**: `cd client && npm install && npm run dev`

---

*Generated for GuruConnect Development Team | May 2026*
