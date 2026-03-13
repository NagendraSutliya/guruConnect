const TodayClassesWidget = () => {
  const classes = [
    { subject: "Mathematics", class: "10A", time: "09:00 AM" },
    { subject: "Physics", class: "11B", time: "11:00 AM" },
    { subject: "Chemistry", class: "12A", time: "02:00 PM" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Today's Classes</h2>

      <div className="space-y-3">
        {classes.map((cls, index) => (
          <div key={index} className="flex justify-between border-b pb-2">
            <div>
              <p className="font-medium">{cls.subject}</p>
              <p className="text-sm text-gray-500">Class {cls.class}</p>
            </div>

            <p className="text-sm font-semibold">{cls.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayClassesWidget;
