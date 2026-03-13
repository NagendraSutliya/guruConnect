const CalendarWidget = () => {
  const events = [
    { id: 1, date: "10 Jun", title: "Math Test" },
    { id: 2, date: "12 Jun", title: "Science Assignment" },
    { id: 3, date: "15 Jun", title: "Parent Meeting" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Calendar</h2>

      <div className="space-y-3">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span className="text-gray-600">{e.date}</span>
            <span className="font-medium">{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
