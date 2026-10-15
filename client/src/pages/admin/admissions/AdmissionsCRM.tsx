import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Copy,
  Check,
  Filter,
  Phone,
  Clock,
  AlertCircle,
  Columns,
  List,
  UserPlus,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  ArrowRight,
  X
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import AdmissionsPanel from "../student/AdmissionsPanel";
import ApplicationReviewDrawer, { type ApplicationDetail } from "../../../components/admin/admissions/ApplicationReviewDrawer";
import AddStudentModal from "../../../components/admin/admissions/AddStudentModal";

interface PipelineLead extends ApplicationDetail {
  followUpText: string;
  isOverdue?: boolean;
}

const INITIAL_PIPELINE_LEADS: PipelineLead[] = [
  {
    id: "ENQ-101",
    applicationNo: "APP/2728/0101",
    name: "Ishaan Agarwal",
    classGrade: "Nursery",
    appliedDate: "14 Oct",
    counsellor: "Neha Saini",
    source: "Website",
    stage: "enquiry",
    followUpText: "Call today",
    isOverdue: false,
    dob: "15 Sep 2022",
    gender: "Male",
    category: "General",
    fatherName: "Sanjay Agarwal",
    fatherPhone: "98290 12345",
    motherName: "Pooja Agarwal",
    motherPhone: "98290 54321",
    address: "B-12, Vaishali Nagar, Jaipur",
    previousSchool: "None (First admission)",
    siblingInSchool: "No",
    transportNeeded: "Yes · Route 4",
    ageCheckText: "Age check passed: 4 years 6 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Mon, 19 Oct · 11:00 am · Room 2",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 350 KB", status: "Verified" },
      { id: "d2", title: "Child photo", meta: "JPG · 120 KB", status: "Verified" },
      { id: "d3", title: "Address proof", meta: "Aadhaar · PDF", status: "Verified" },
      { id: "d4", title: "Category certificate", meta: "Not applicable", status: "Verified" },
    ],
    seatsSnapshot: { available: "41 of 60", rteAvailable: "12 of 15" },
    followUps: [
      { id: "fu1", dateType: "14 Oct · Web form", text: "Enquiry submitted via school admission landing page." }
    ]
  },
  {
    id: "ENQ-102",
    applicationNo: "APP/2728/0102",
    name: "Myra Khandelwal",
    classGrade: "Class 1",
    appliedDate: "14 Oct",
    counsellor: "Arjun Yadav",
    source: "Walk-in",
    stage: "enquiry",
    followUpText: "Tomorrow",
    isOverdue: false,
    dob: "12 May 2020",
    gender: "Female",
    category: "General",
    fatherName: "Deepak Khandelwal",
    fatherPhone: "94140 88921",
    motherName: "Ritu Khandelwal",
    motherPhone: "94140 88922",
    address: "Flat 402, Royal Palms, Mansarovar, Jaipur",
    previousSchool: "Kidzee Play School",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 6 years 10 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Tue, 20 Oct · 10:00 am · Room 1",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 410 KB", status: "Verified" },
      { id: "d2", title: "Child photo", meta: "JPG · 150 KB", status: "Verified" },
      { id: "d3", title: "UKG report card", meta: "PDF · 890 KB", status: "Verified" },
      { id: "d4", title: "Address proof", meta: "Electricity bill", status: "Verified" },
    ],
    seatsSnapshot: { available: "23 of 120", rteAvailable: "9 of 30" },
    followUps: [
      { id: "fu1", dateType: "14 Oct · Walk-in", text: "Parents visited front office. Requested prospectus." }
    ]
  },
  {
    id: "ENQ-103",
    applicationNo: "APP/2728/0103",
    name: "Kabir Saxena",
    classGrade: "Class 6",
    appliedDate: "13 Oct",
    counsellor: "Neha Saini",
    source: "Referral",
    stage: "enquiry",
    followUpText: "16 Oct",
    isOverdue: false,
    dob: "24 Nov 2015",
    gender: "Male",
    category: "General",
    fatherName: "Alok Saxena",
    fatherPhone: "99280 44512",
    motherName: "Kavita Saxena",
    motherPhone: "99280 44513",
    address: "18, Malviya Nagar, Jaipur",
    previousSchool: "St. Xavier's Senior School",
    siblingInSchool: "Yes · Tanvi Saxena (9-B)",
    transportNeeded: "Yes · Route 7",
    ageCheckText: "Age check passed: 11 years 4 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Thu, 22 Oct · 12:30 pm · Room 3",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 500 KB", status: "Verified" },
      { id: "d2", title: "Class 5 Marksheet", meta: "PDF · 1.2 MB", status: "Verified" },
      { id: "d3", title: "Transfer certificate", meta: "Pending previous school clearance", status: "Pending" }
    ],
    seatsSnapshot: { available: "8 of 120", rteAvailable: "0 of 30" },
    followUps: [
      { id: "fu1", dateType: "13 Oct · Call", text: "Referral from Tanvi's parents. Sibling admission discount discussed." }
    ]
  },
  {
    id: "ENQ-104",
    applicationNo: "APP/2728/0104",
    name: "Anaya Mathur",
    classGrade: "LKG",
    appliedDate: "10 Oct",
    counsellor: "Arjun Yadav",
    source: "Facebook",
    stage: "followup",
    followUpText: "2 days late",
    isOverdue: true,
    dob: "19 Dec 2021",
    gender: "Female",
    category: "General",
    fatherName: "Vikram Mathur",
    fatherPhone: "97720 90123",
    motherName: "Divya Mathur",
    motherPhone: "97720 90124",
    address: "C-44, Shyam Nagar, Jaipur",
    previousSchool: "Little Angels",
    siblingInSchool: "No",
    transportNeeded: "Yes · Route 2",
    ageCheckText: "Age check passed: 5 years 3 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Wed, 21 Oct · 11:30 am · Room 2",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 300 KB", status: "Verified" },
      { id: "d2", title: "Child photo", meta: "Pending", status: "Pending" },
    ],
    seatsSnapshot: { available: "18 of 60", rteAvailable: "5 of 15" },
    followUps: [
      { id: "fu1", dateType: "10 Oct · Facebook lead", text: "Inquired via Facebook ad campaign." },
      { id: "fu2", dateType: "12 Oct · Call", text: "Phone busy, need to follow up again." }
    ]
  },
  {
    id: "ENQ-105",
    applicationNo: "APP/2728/0105",
    name: "Vihaan Soni",
    classGrade: "Class 1",
    appliedDate: "14 Oct",
    counsellor: "Neha Saini",
    source: "Walk-in",
    stage: "followup",
    followUpText: "Today 4 pm",
    isOverdue: false,
    dob: "08 Aug 2020",
    gender: "Male",
    category: "OBC",
    fatherName: "Gopal Soni",
    fatherPhone: "98870 55142",
    motherName: "Suman Soni",
    motherPhone: "98870 55143",
    address: "Plot 89, Tonk Road, Jaipur",
    previousSchool: "EuroKids",
    siblingInSchool: "No",
    transportNeeded: "Yes · Route 7",
    ageCheckText: "Age check passed: 6 years 7 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Sat, 24 Oct · 10:00 am · Room 1",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 412 KB", status: "Verified" },
      { id: "d2", title: "OBC certificate", meta: "Pending verification", status: "Pending" }
    ],
    seatsSnapshot: { available: "23 of 120", rteAvailable: "9 of 30" },
    followUps: [
      { id: "fu1", dateType: "14 Oct · Walk-in", text: "Walked in for fee quote and brochure." }
    ]
  },
  {
    id: "APP-201",
    applicationNo: "APP/2728/0201",
    name: "Sara Bansal",
    classGrade: "Nursery",
    appliedDate: "12 Oct",
    counsellor: "Neha Saini",
    source: "Website",
    stage: "application",
    followUpText: "Docs pending",
    isOverdue: true,
    dob: "14 Feb 2022",
    gender: "Female",
    category: "General",
    fatherName: "Rohit Bansal",
    fatherPhone: "96490 33211",
    motherName: "Priyanka Bansal",
    motherPhone: "96490 33212",
    address: "65, Vidyadhar Nagar, Jaipur",
    previousSchool: "None",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 5 years 1 month on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Fri, 23 Oct · 9:30 am · Room 4",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 520 KB", status: "Verified" },
      { id: "d2", title: "Immunization record", meta: "Image blurred", status: "Pending" }
    ],
    seatsSnapshot: { available: "41 of 60", rteAvailable: "12 of 15" },
    followUps: [
      { id: "fu1", dateType: "12 Oct · Online portal", text: "Online application fee paid. Verification awaited." }
    ]
  },
  {
    id: "APP-202",
    applicationNo: "APP/2728/0202",
    name: "Aditya Rawat",
    classGrade: "Class 11",
    appliedDate: "13 Oct",
    counsellor: "Arjun Yadav",
    source: "Referral",
    stage: "application",
    followUpText: "Form complete",
    isOverdue: false,
    dob: "05 Apr 2010",
    gender: "Male",
    category: "General",
    fatherName: "Rajendra Rawat",
    fatherPhone: "94600 77123",
    motherName: "Meenakshi Rawat",
    motherPhone: "94600 77124",
    address: "A-15, Civil Lines, Jaipur",
    previousSchool: "DPS Jaipur",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 16 years 11 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Sat, 24 Oct · 2:00 pm · Room 5",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Class 10 CBSE Marksheet", meta: "PDF · 1.5 MB · 92.4%", status: "Verified" },
      { id: "d2", title: "Migration certificate", meta: "PDF · 600 KB", status: "Verified" }
    ],
    seatsSnapshot: { available: "37 of 120", rteAvailable: "0 of 0" },
    followUps: [
      { id: "fu1", dateType: "13 Oct · Visit", text: "Opted for PCM with Computer Science stream." }
    ]
  },
  {
    id: "APP-203",
    applicationNo: "APP/2728/0142",
    name: "Navya Jangid",
    classGrade: "Class 1",
    appliedDate: "28 Sep",
    counsellor: "Neha Saini",
    source: "Walk-in",
    stage: "verification",
    followUpText: "Interaction 13 Oct",
    isOverdue: false,
    dob: "18 Jan 2021",
    gender: "Female",
    category: "OBC",
    fatherName: "Mahendra Jangid",
    fatherPhone: "98281 99042",
    motherName: "Sushila Jangid",
    motherPhone: "94142 55190",
    address: "Sector 7, Mansarovar, Jaipur",
    previousSchool: "Little Steps Play School (UKG)",
    siblingInSchool: "No",
    transportNeeded: "Yes · Mansarovar sector 7",
    ageCheckText: "Age check passed: 6 years 2 months on 31 Mar 2027 (minimum 6 years for Class 1).",
    interactionSchedule: {
      dateTimeRoom: "Sat, 13 Oct · 10:30 am · Room 4",
      outcome: "Recommended",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 412 KB · verified by Neha S.", status: "Verified", verifiedBy: "Neha S." },
      { id: "d2", title: "Child photo", meta: "JPG · 180 KB", status: "Verified" },
      { id: "d3", title: "Address proof", meta: "Electricity bill · PDF", status: "Verified" },
      { id: "d4", title: "UKG report card", meta: "PDF · 1.1 MB", status: "Verified" },
      { id: "d5", title: "Category certificate", meta: "Image is blurred, name not readable", status: "Pending" },
    ],
    seatsSnapshot: {
      available: "23 of 120",
      rteAvailable: "9 of 30",
    },
    followUps: [
      { id: "f1", dateType: "04 Oct · Call", text: "Asked to re-upload category certificate." },
      { id: "f2", dateType: "30 Sep · Visit", text: "Parents toured campus, interested in transport." },
      { id: "f3", dateType: "26 Sep · Walk-in", text: "Enquiry created at front office." },
    ]
  },
  {
    id: "APP-204",
    applicationNo: "APP/2728/0204",
    name: "Reyansh Tak",
    classGrade: "Class 6",
    appliedDate: "13 Oct",
    counsellor: "Arjun Yadav",
    source: "Website",
    stage: "test",
    followUpText: "Result pending",
    isOverdue: false,
    dob: "11 Aug 2015",
    gender: "Male",
    category: "General",
    fatherName: "Kailash Tak",
    fatherPhone: "99830 11984",
    motherName: "Pooja Tak",
    motherPhone: "99830 11985",
    address: "56, Raja Park, Jaipur",
    previousSchool: "Tagore Public School",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 11 years 7 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Fri, 16 Oct · 11:00 am · Lab 2",
      outcome: "Not held yet",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 400 KB", status: "Verified" },
      { id: "d2", title: "Class 5 Marks card", meta: "PDF · 800 KB", status: "Verified" }
    ],
    seatsSnapshot: { available: "8 of 120", rteAvailable: "0 of 30" },
    followUps: [
      { id: "fu1", dateType: "13 Oct · Test scheduled", text: "Written assessment scheduled for English & Math." }
    ]
  },
  {
    id: "APP-205",
    applicationNo: "APP/2728/0205",
    name: "Kiara Purohit",
    classGrade: "Nursery",
    appliedDate: "12 Oct",
    counsellor: "Neha Saini",
    source: "RTE",
    stage: "test",
    followUpText: "RTE · lottery list",
    isOverdue: false,
    dob: "03 Mar 2022",
    gender: "Female",
    category: "EWS",
    fatherName: "Mukesh Purohit",
    fatherPhone: "95870 33412",
    motherName: "Kanta Purohit",
    motherPhone: "95870 33413",
    address: "Ward 12, Sanganer, Jaipur",
    previousSchool: "None",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 5 years on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Mon, 19 Oct · 10:00 am · Front Office",
      outcome: "Recommended",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "PDF · 300 KB", status: "Verified" },
      { id: "d2", title: "Income certificate (EWS)", meta: "Tehsildar verified", status: "Verified" }
    ],
    seatsSnapshot: { available: "41 of 60", rteAvailable: "12 of 15" },
    followUps: [
      { id: "fu1", dateType: "12 Oct · RTE Portal", text: "Allotted via Rajasthan RTE first round lottery." }
    ]
  },
  {
    id: "APP-206",
    applicationNo: "APP/2728/0206",
    name: "Dhruv Mehta",
    classGrade: "Class 1",
    appliedDate: "10 Oct",
    counsellor: "Arjun Yadav",
    source: "Referral",
    stage: "approved",
    followUpText: "Fee due 15 Oct",
    isOverdue: false,
    dob: "21 Sep 2020",
    gender: "Male",
    category: "General",
    fatherName: "Nitin Mehta",
    fatherPhone: "98290 88214",
    motherName: "Shilpa Mehta",
    motherPhone: "98290 88215",
    address: "B-22, Gandhi Nagar, Jaipur",
    previousSchool: "Bachpan Play School",
    siblingInSchool: "No",
    transportNeeded: "Yes · Route 3",
    ageCheckText: "Age check passed: 6 years 6 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Interaction completed",
      outcome: "Recommended",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" },
      { id: "d2", title: "Address proof", meta: "Verified", status: "Verified" }
    ],
    seatsSnapshot: { available: "23 of 120", rteAvailable: "9 of 30" },
    followUps: [
      { id: "fu1", dateType: "10 Oct · Principal Approval", text: "Principal signed off on admission. Fee invoice generated." }
    ]
  },
  {
    id: "APP-207",
    applicationNo: "APP/2728/0018",
    name: "Aarohi Sethi",
    classGrade: "Nursery",
    appliedDate: "08 Oct",
    counsellor: "Neha Saini",
    source: "Website",
    stage: "enrolled",
    followUpText: "Adm. no. 2027/0018",
    isOverdue: false,
    dob: "14 Jan 2022",
    gender: "Female",
    category: "General",
    fatherName: "Manish Sethi",
    fatherPhone: "94130 55190",
    motherName: "Ritu Sethi",
    motherPhone: "94130 55191",
    address: "C-11, C-Scheme, Jaipur",
    previousSchool: "None",
    siblingInSchool: "No",
    transportNeeded: "No",
    ageCheckText: "Age check passed: 5 years 2 months on 31 Mar 2027.",
    interactionSchedule: {
      dateTimeRoom: "Completed",
      outcome: "Recommended",
    },
    documents: [
      { id: "d1", title: "Birth certificate", meta: "Verified", status: "Verified" },
      { id: "d2", title: "Fee Receipt", meta: "Paid ₹35,000", status: "Verified" }
    ],
    seatsSnapshot: { available: "41 of 60", rteAvailable: "12 of 15" },
    followUps: [
      { id: "fu1", dateType: "08 Oct · Admission Office", text: "Admission confirmed. Admission No: 2027/0018 allotted." }
    ]
  }
];

const STAGE_COLUMNS: { key: PipelineLead["stage"]; label: string; count: number }[] = [
  { key: "enquiry", label: "Enquiry", count: 48 },
  { key: "followup", label: "Follow-up", count: 31 },
  { key: "application", label: "Application", count: 22 },
  { key: "verification", label: "Documents verified", count: 14 },
  { key: "test", label: "Test / interaction", count: 9 },
  { key: "approved", label: "Approved", count: 6 },
  { key: "enrolled", label: "Enrolled", count: 18 }
];

const SEATS_METRICS = [
  { className: "Nursery", filled: 41, total: 60, percent: 68 },
  { className: "Class 1", filled: 23, total: 120, percent: 19 },
  { className: "Class 6", filled: 8, total: 120, percent: 7 },
  { className: "Class 11", filled: 37, total: 120, percent: 31 }
];

export default function AdmissionsCRM() {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [leads, setLeads] = useState<PipelineLead[]>(INITIAL_PIPELINE_LEADS);
  const [classFilter, setClassFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [counsellorFilter, setCounsellorFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals & Drawers state
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetail | null>(null);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);

  // Quick Enquiry Form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    classGrade: "Nursery",
    guardian: "Father",
    phone: "",
    source: "Walk-in",
    counsellor: "Neha Saini",
  });

  const handleCopyLink = () => {
    const link = `${window.location.origin}/admissions/apply`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast("Application form link copied to clipboard!", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCardClick = (lead: PipelineLead) => {
    setSelectedApplication(lead);
    setIsReviewDrawerOpen(true);
  };

  const handleStatusChange = (appId: string, newStage: ApplicationDetail["stage"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === appId ? { ...l, stage: newStage } : l))
    );
  };

  const handleMarkLost = (appId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== appId));
    setIsReviewDrawerOpen(false);
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) {
      showToast("Please provide applicant name and phone number.", "error");
      return;
    }

    const newLead: PipelineLead = {
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      applicationNo: `APP/2728/${Math.floor(1000 + Math.random() * 9000)}`,
      name: enquiryForm.name,
      classGrade: enquiryForm.classGrade,
      appliedDate: "Today",
      counsellor: enquiryForm.counsellor,
      source: enquiryForm.source,
      stage: "enquiry",
      followUpText: "Call today",
      isOverdue: false,
      dob: "2021-05-10",
      gender: "Male",
      category: "General",
      fatherName: enquiryForm.guardian === "Father" ? "Guardian" : "",
      fatherPhone: enquiryForm.phone,
      motherName: "",
      motherPhone: "",
      address: "Jaipur",
      previousSchool: "None",
      siblingInSchool: "No",
      transportNeeded: "No",
      ageCheckText: "Age check passed for intake session.",
      interactionSchedule: {
        dateTimeRoom: "To be scheduled",
        outcome: "Not held yet",
      },
      documents: [
        { id: "d1", title: "Birth certificate", meta: "Awaited", status: "Pending" }
      ],
      seatsSnapshot: { available: "Seats open", rteAvailable: "RTE open" },
      followUps: [
        { id: "fu1", dateType: "Today · Enquiry", text: "Direct enquiry logged via Admin Portal." }
      ]
    };

    setLeads([newLead, ...leads]);
    setIsAddEnquiryOpen(false);
    setEnquiryForm({
      name: "",
      classGrade: "Nursery",
      guardian: "Father",
      phone: "",
      source: "Walk-in",
      counsellor: "Neha Saini",
    });
    showToast(`Enquiry for ${newLead.name} added!`, "success");
  };

  const moveStage = (leadId: string, direction: "next" | "prev", e: React.MouseEvent) => {
    e.stopPropagation();
    const stageOrder: PipelineLead["stage"][] = [
      "enquiry",
      "followup",
      "application",
      "verification",
      "test",
      "approved",
      "enrolled"
    ];
    setLeads((prev) =>
      prev.map((item) => {
        if (item.id === leadId) {
          const currentIndex = stageOrder.indexOf(item.stage);
          const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex >= 0 && nextIndex < stageOrder.length) {
            return { ...item, stage: stageOrder[nextIndex] };
          }
        }
        return item;
      })
    );
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.fatherPhone.includes(search) ||
      l.applicationNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "All" || l.classGrade === classFilter;
    const matchesSource = sourceFilter === "All" || l.source === sourceFilter;
    const matchesCounsellor = counsellorFilter === "All" || l.counsellor === counsellorFilter;
    const matchesOverdue = !overdueOnly || l.isOverdue;
    return matchesSearch && matchesClass && matchesSource && matchesCounsellor && matchesOverdue;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn font-sans w-full max-w-content mx-auto">
      
      {/* Breadcrumb & Header Section (06-Admissions.html) */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-small text-ink-secondary">
            Admissions › Pipeline · Session 2026-27 intake
          </div>
          <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
            Admission pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface border border-line rounded-control p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-small font-semibold transition-colors cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-nav-bg text-gold shadow-xs"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <Columns size={14} /> Pipeline
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-small font-semibold transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-nav-bg text-gold shadow-xs"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <List size={14} /> Table View
            </button>
          </div>

          <Link
            to="/admin/students/import"
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors"
          >
            <FileSpreadsheet size={15} className="text-emerald-700" />
            <span>Import from Excel</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-body font-medium text-ink transition-colors cursor-pointer"
          >
            {copiedLink ? <Check size={16} className="text-emerald-700" /> : <Copy size={16} />}
            <span>Copy application form link</span>
          </button>

          <button
            onClick={() => setIsAddEnquiryOpen(true)}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-body font-semibold transition-colors cursor-pointer"
          >
            <UserPlus size={16} /> Add enquiry
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <AdmissionsPanel
          isEmbedded={true}
          onOpenReviewDrawer={(appDetail) => {
            setSelectedApplication(appDetail);
            setIsReviewDrawerOpen(true);
          }}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
        />
      ) : (
        <>
          {/* Filters Bar (06-Admissions.html) */}
          <div className="flex flex-wrap items-center gap-3 bg-surface border border-line rounded-card p-3.5">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary" size={16} />
              <input
                type="text"
                placeholder="Search student, admission no. or parent mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-h-[40px] pl-9 pr-3 bg-surface-subtle border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary focus:bg-surface"
              />
            </div>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Class
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">All classes</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 11">Class 11</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Source
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">All sources</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Facebook">Facebook</option>
                <option value="RTE">RTE</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-small text-ink-secondary font-medium">
              Counsellor
              <select
                value={counsellorFilter}
                onChange={(e) => setCounsellorFilter(e.target.value)}
                className="min-h-[40px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
              >
                <option value="All">Everyone</option>
                <option value="Neha Saini">Neha Saini</option>
                <option value="Arjun Yadav">Arjun Yadav</option>
              </select>
            </label>

            <button
              onClick={() => setOverdueOnly(!overdueOnly)}
              className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-small font-semibold transition-colors cursor-pointer ${
                overdueOnly
                  ? "bg-warning-accent text-white"
                  : "bg-warning-bg text-warning-text border border-warning-border hover:bg-warning-bg/80"
              }`}
            >
              <Clock size={13} />
              <span>5 follow-ups overdue</span>
            </button>
          </div>

          {/* Kanban Board (7 Columns matching 06-Admissions.html) */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-3.5 min-w-max items-start">
              {STAGE_COLUMNS.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
                return (
                  <section
                    key={stage.key}
                    className="w-[248px] shrink-0 bg-[#ECEFEC] rounded-card p-3 flex flex-col gap-2.5"
                  >
                    {/* Column Header */}
                    <div className="flex justify-between items-center px-1">
                      <h2 className="m-0 text-small font-semibold text-ink">
                        {stage.label}
                      </h2>
                      <span className="font-mono text-caption text-ink-secondary bg-surface px-2 py-0.5 rounded-full border border-line/40">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Leads */}
                    <div className="space-y-2.5 min-h-[160px]">
                      {stageLeads.length === 0 ? (
                        <div className="h-24 border border-dashed border-line rounded-control flex items-center justify-center text-caption text-ink-secondary italic">
                          No applicants
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <article
                            key={lead.id}
                            onClick={() => handleCardClick(lead)}
                            className="bg-surface border border-line rounded-control p-3 shadow-none hover:border-primary hover:shadow-xs transition-all flex flex-col gap-2 cursor-pointer group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="font-semibold text-body text-ink group-hover:text-primary transition-colors">
                                {lead.name}
                              </div>
                              <span className="text-caption font-semibold text-primary-dark bg-primary-tint px-2 py-0.5 rounded-small whitespace-nowrap">
                                {lead.classGrade}
                              </span>
                            </div>

                            <div className="text-small text-ink-secondary">
                              Father · {lead.fatherPhone}
                            </div>

                            <div className="flex items-center justify-between text-caption pt-2 border-t border-line/50">
                              <span className="text-ink-secondary">{lead.source}</span>
                              <span
                                className={`font-semibold ${
                                  lead.isOverdue
                                    ? "text-warning-inline bg-warning-bg px-1.5 py-0.5 rounded-small"
                                    : "text-ink-secondary"
                                }`}
                              >
                                {lead.followUpText}
                              </span>
                            </div>

                            {/* Quick Stage Controls on Hover */}
                            <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-caption border-t border-line/30">
                              <button
                                onClick={(e) => moveStage(lead.id, "prev", e)}
                                disabled={stage.key === "enquiry"}
                                className="text-ink-secondary hover:text-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
                              >
                                <ChevronLeft size={12} /> Prev
                              </button>
                              <button
                                onClick={(e) => moveStage(lead.id, "next", e)}
                                disabled={stage.key === "enrolled"}
                                className="font-semibold text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-0.5"
                              >
                                Advance <ChevronRight size={12} />
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Seats Left for Session (Bottom Section matching 06-Admissions.html) */}
          <section className="bg-surface border border-line rounded-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-h2 font-semibold text-ink">
                Seats left for 2026-27
              </h2>
              <span className="text-small text-ink-secondary">
                Real-time enrolled intake capacity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {SEATS_METRICS.map((seat) => (
                <div key={seat.className} className="flex flex-col gap-1.5 p-3 rounded-control bg-surface-subtle border border-line/60">
                  <div className="flex justify-between items-center text-small">
                    <span className="font-semibold text-ink">{seat.className}</span>
                    <span className="font-mono text-ink-secondary">
                      {seat.filled} of {seat.total}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-line-track rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${seat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 07-AdmissionForm Drawer Component */}
      <ApplicationReviewDrawer
        application={selectedApplication}
        isOpen={isReviewDrawerOpen}
        onClose={() => setIsReviewDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onMarkLost={handleMarkLost}
      />

      {/* 08-AddStudent Direct Admission Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={(stu) => {
          showToast(`Student ${stu.name} added to pipeline!`, "success");
        }}
      />

      {/* Add Quick Enquiry Modal */}
      {isAddEnquiryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity" onClick={() => setIsAddEnquiryOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-surface rounded-card border border-line shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="m-0 text-h2 font-semibold text-ink">Add Admission Enquiry</h3>
                <button
                  onClick={() => setIsAddEnquiryOpen(false)}
                  className="w-8 h-8 rounded-control border border-line flex items-center justify-center text-ink-secondary hover:text-ink cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateEnquiry} className="space-y-4">
                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Student Full Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="min-h-[44px] px-3 border border-line-input rounded-control text-body text-ink focus:outline-none focus:border-primary"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Class
                    <select
                      value={enquiryForm.classGrade}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, classGrade: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option>Nursery</option>
                      <option>LKG</option>
                      <option>UKG</option>
                      <option>Class 1</option>
                      <option>Class 6</option>
                      <option>Class 11</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Source
                    <select
                      value={enquiryForm.source}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, source: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Facebook">Facebook</option>
                      <option value="RTE">RTE</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Guardian
                    <select
                      value={enquiryForm.guardian}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, guardian: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                    Mobile *
                    <input
                      type="tel"
                      required
                      placeholder="98290 xxxxx"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="min-h-[44px] px-3 border border-line-input rounded-control font-mono text-body text-ink focus:outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-small font-medium text-ink">
                  Assigned Counsellor
                  <select
                    value={enquiryForm.counsellor}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, counsellor: e.target.value })}
                    className="min-h-[44px] px-3 border border-line-input rounded-control bg-surface text-body text-ink focus:outline-none focus:border-primary"
                  >
                    <option value="Neha Saini">Neha Saini</option>
                    <option value="Arjun Yadav">Arjun Yadav</option>
                  </select>
                </label>

                <div className="flex justify-end gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAddEnquiryOpen(false)}
                    className="min-h-[40px] px-4 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-small font-medium text-ink transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white text-small font-semibold transition-colors cursor-pointer"
                  >
                    Save Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
