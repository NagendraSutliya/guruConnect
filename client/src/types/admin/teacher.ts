export interface Teacher {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  designation?: string;
  qualification?: string;
  specialization?: string[];
  phone?: string;
  emergencyPhone?: string;
  panNo?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  basicSalary?: number;
  joiningDate?: string;
  status: "active" | "inactive";
  profileImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherFormData {
  name: string;
  email: string;
  password?: string;
  employeeId: string;
  designation?: string;
  qualification?: string;
  specialization?: string; // Comma separated in form
  phone?: string;
  emergencyPhone?: string;
  panNo?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  basicSalary?: string | number;
  joiningDate?: string;
}
