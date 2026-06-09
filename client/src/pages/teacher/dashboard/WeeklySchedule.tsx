const WeeklySchedule = () => {
  const schedule = [
    { day: "Monday", subject: "Mathematics", time: "10:00 AM" },
    { day: "Tuesday", subject: "Physics", time: "11:00 AM" },
    { day: "Wednesday", subject: "Chemistry", time: "9:30 AM" },
    { day: "Thursday", subject: "Biology", time: "10:30 AM" },
    { day: "Friday", subject: "Computer", time: "12:00 PM" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>

      <div className="space-y-3">
        {schedule.map((s, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{s.subject}</p>
              <p className="text-xs text-gray-500">{s.day}</p>
            </div>

            <span className="text-sm text-gray-600">{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
