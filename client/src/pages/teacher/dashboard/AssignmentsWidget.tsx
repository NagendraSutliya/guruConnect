const AssignmentsWidget = () => {
  const assignments = [
    { title: "Math Homework", due: "Tomorrow" },
    { title: "Science Project", due: "Friday" },
    { title: "English Essay", due: "Next Week" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Assignments</h2>

      <div className="space-y-3">
        {assignments.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-2">
            <p>{item.title}</p>
            <p className="text-sm text-gray-500">{item.due}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsWidget;
