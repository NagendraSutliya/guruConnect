exports.getExamStatus = (subjects) => {
  const now = new Date();

  if (!subjects || subjects.length === 0) return "upcoming";

  let isOngoing = false;
  let isUpcoming = false;

  for (let sub of subjects) {
    if (!sub.date || !sub.startTime || !sub.endTime) continue;

    const examDate = new Date(sub.date);
    const start = new Date(`${examDate.toDateString()} ${sub.startTime}`);
    const end = new Date(`${examDate.toDateString()} ${sub.endTime}`);

    if (now >= start && now <= end) {
      isOngoing = true;
    } else if (now < start) {
      isUpcoming = true;
    }
  }

  if (isOngoing) return "ongoing";
  if (isUpcoming) return "upcoming";
  return "completed";
};
