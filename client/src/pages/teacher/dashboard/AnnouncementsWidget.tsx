const AnnouncementsWidget = () => {
  const announcements = [
    "Holiday on Monday",
    "Staff meeting at 4 PM",
    "Exam schedule released",
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Announcements</h2>

      <ul className="space-y-2">
        {announcements.map((item, index) => (
          <li key={index} className="border-b pb-2 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsWidget;
