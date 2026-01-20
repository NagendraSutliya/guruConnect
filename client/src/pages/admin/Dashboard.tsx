import StatsCards from "../../components/StatsCards";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <StatsCards />
    </div>
  );
}

// import { useState } from "react";
// import StatsCards from "../../components/StatsCards";
// import TeacherPanel from "./panels/TeacherPanel";
// import FeedbackPanel from "./panels/FeedbackPanel";
// import LinksPanel from "./panels/LinksPanel";

// export default function Dashboard() {
//   const [tab, setTab] = useState("teachers");

//   const TabButton = ({ id, label }: any) => (
//     <button
//       onClick={() => setTab(id)}
//       className={`px-4 py-2 rounded-lg text-sm font-medium transition
//         ${
//           tab === id
//             ? "bg-blue-600 text-white"
//             : "bg-white shadow text-gray-600 hover:bg-gray-100"
//         }
//       `}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <div className="space-y-8">
//       <h1 className="text-2xl font-bold">Admin Dashboard</h1>

//       <StatsCards />

//       <div className="flex gap-4">
//         <TabButton id="teachers" label="Teachers" />
//         <TabButton id="feedback" label="Feedback" />
//         <TabButton id="links" label="Public Links" />
//       </div>

//       <div className="bg-white rounded-xl shadow p-6">
//         {tab === "teachers" && <TeacherPanel />}
//         {tab === "feedback" && <FeedbackPanel />}
//         {tab === "links" && <LinksPanel />}
//       </div>
//     </div>
//   );
// }
