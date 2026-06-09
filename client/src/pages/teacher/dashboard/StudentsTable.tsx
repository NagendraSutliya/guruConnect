import { useState } from "react";

const StudentsTable = () => {
  const [students] = useState([
    { id: 1, name: "Rahul Sharma", class: "10 A", attendance: "92%" },
    { id: 2, name: "Priya Singh", class: "10 A", attendance: "88%" },
    { id: 3, name: "Arjun Patel", class: "9 B", attendance: "95%" },
    { id: 4, name: "Neha Verma", class: "9 B", attendance: "90%" },
    { id: 5, name: "Karan Mehta", class: "8 C", attendance: "85%" },
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Students</h2>

      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Class</th>
            <th className="p-3">Attendance</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.class}</td>
              <td className="p-3">{s.attendance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
