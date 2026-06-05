export interface Student {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  admissionNo: string;
  enrollmentNo?: string;
  classId: any;
  sectionId: any;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  phone?: string;
  dob?: string;
  admissionDate?: string;
  aadharNo?: string;
  category?: string;
  religion?: string;
  nationality?: string;
  previousSchool?: string;
  previousClass?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  isActive: boolean;
}

export interface StudentFormData {
  name: string;
  email: string;
  password?: string;
  rollNo: string;
  admissionNo: string;
  enrollmentNo?: string;
  classId: string;
  sectionId: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  phone?: string;
  dob?: string;
  admissionDate?: string;
  aadharNo?: string;
  category?: string;
  religion?: string;
  nationality?: string;
  previousSchool?: string;
  previousClass?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
}

export interface Admission extends Student { status: string; appliedDate?: string; }
export interface AdmissionFormData extends StudentFormData { }