export type Feedback = {
  _id: string;
  message: string;
  mood: "happy" | "neutral" | "sad";
  teacherName?: string;
  teacherId?: { name: string; _id?: string };
  studentName?: string;
  studentId?: { name: string };
  classOrBatch?: string;
  createdAt: string;
};
