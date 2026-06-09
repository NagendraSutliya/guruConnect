import type { Routine } from "../types/admin/routine";
import type { Assignment } from "../types/admin/teacherassignment";

// A basic greedy auto-scheduler
// Assigns each assignment once per day to empty slots.
export const generateAutoSchedule = (
  assignments: Assignment[],
  existingRoutines: Routine[],
  days: string[],
  timeSlots: string[],
  classId: string,
  sectionId: string
): Omit<Routine, "_id">[] => {
  const newRoutines: Omit<Routine, "_id">[] = [];
  const scheduleGrid = [...existingRoutines]; // Keep track of filled slots locally

  // Helper to check local conflicts before sending to backend
  const checkConflictLocally = (day: string, time: string, teacherId: string) => {
    const [start, end] = time.split("-");
    // Check if slot is already occupied by ANY class in this section (or teacher)
    return scheduleGrid.find((r) => {
      return (
        r.day === day &&
        r.startTime === start &&
        r.endTime === end &&
        (r.teacherId === teacherId || (r.classId === classId && r.sectionId === sectionId))
      );
    });
  };

  // Iterate over days and slots, trying to place assignments
  for (const day of days) {
      for (const time of timeSlots) {
        if (time === "12:00-13:00" || !time.includes("-")) continue;
      
      const [start, end] = time.split("-");

      // Find an assignment that can fit here
      for (const assign of assignments) {
        if (!assign.subjectId || !assign.teacherId) continue;
        
        // Don't assign the same subject multiple times a day
        const alreadyHasSubjectToday = scheduleGrid.some(
          (r) => r.day === day && r.subjectId === assign.subjectId._id
        );
        if (alreadyHasSubjectToday) continue;

        const isConflict = checkConflictLocally(day, time, assign.teacherId._id);
        
        if (!isConflict) {
          const newRoutine = {
            classId,
            sectionId,
            subjectId: assign.subjectId._id,
            teacherId: assign.teacherId._id,
            day,
            startTime: start,
            endTime: end,
          };
          newRoutines.push(newRoutine);
          scheduleGrid.push(newRoutine as Routine);
          break; // Move to next time slot
        }
      }
    }
  }

  return newRoutines;
};
