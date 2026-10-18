import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiSearch, FiSend } from "react-icons/fi";

interface Message {
  id: string;
  sender: "teacher" | "parent";
  text: string;
  time: string;
}

interface Thread {
  id: string;
  avatar: string;
  title: string;
  subtitle: string;
  guardians: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: "t1",
    avatar: "SS",
    title: "Mother of Dev Saini",
    subtitle: "8-B · Roll 04",
    guardians: "Kamlesh Saini (father), Kusum Saini (mother)",
    lastMessage: "He had fever, will send doctor note",
    time: "9:10 am",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "teacher", text: "Namaste. Dev has been absent since Friday. Is everything all right?", time: "Mon 3:15 pm" },
      { id: "m2", sender: "parent", text: "Namaste ma’am. He had high fever. He will come from Wednesday.", time: "Today 9:05 am" },
      { id: "m3", sender: "parent", text: "I will send the doctor’s note with him.", time: "Today 9:10 am" },
      { id: "m4", sender: "teacher", text: "Thank you. I have shared the homework in the app so he can catch up.", time: "Today 9:20 am" },
    ],
  },
  {
    id: "t2",
    avatar: "RB",
    title: "Father of Kriti Bansal",
    subtitle: "8-B · Roll 11",
    guardians: "Ramesh Bansal (father), Seema Bansal (mother)",
    lastMessage: "Leave on 20 Oct for family function",
    time: "8:42 am",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "parent", text: "Good morning ma'am, applied leave for Kriti on 20 Oct for my brother's wedding.", time: "Today 8:42 am" },
      { id: "m2", sender: "teacher", text: "Received and approved. Please ensure she completes the pending homework.", time: "Today 8:50 am" },
    ],
  },
  {
    id: "t3",
    avatar: "AJ",
    title: "Mother of Aanya Bhatt",
    subtitle: "7-A · Roll 01",
    guardians: "Anil Bhatt (father), Sunita Bhatt (mother)",
    lastMessage: "Thank you ma’am",
    time: "Mon",
    messages: [
      { id: "m1", sender: "teacher", text: "Aanya's science lab report was very well presented.", time: "Mon 11:30 am" },
      { id: "m2", sender: "parent", text: "Thank you ma'am for encouraging her!", time: "Mon 12:15 pm" },
    ],
  },
  {
    id: "t4",
    avatar: "MK",
    title: "Father of Garima Joshi",
    subtitle: "8-B · Roll 07",
    guardians: "Mukesh Joshi (father)",
    lastMessage: "Can we meet at PTM?",
    time: "Mon",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "parent", text: "Respected ma'am, will you be available in slot 3 for PTM?", time: "Mon 4:20 pm" },
      { id: "m2", sender: "teacher", text: "Yes, slot 3 (10:30 am) is booked for you.", time: "Mon 4:45 pm" },
    ],
  },
  {
    id: "t5",
    avatar: "PM",
    title: "Mother of Kabir Meena",
    subtitle: "7-A · Roll 15",
    guardians: "Prakash Meena (father), Mamta Meena (mother)",
    lastMessage: "Homework photo not uploading",
    time: "Sun",
    messages: [
      { id: "m1", sender: "parent", text: "Ma'am, Kabir's app says upload error for homework.", time: "Sun 6:10 pm" },
      { id: "m2", sender: "teacher", text: "Please update the app or he can submit notebook tomorrow morning.", time: "Sun 6:30 pm" },
    ],
  },
];

const TeacherMessages: React.FC = () => {
  const { showToast } = useToast();
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [showStudentCard, setShowStudentCard] = useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      sender: "teacher",
      text: inputText.trim(),
      time: "Just now",
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: newMsg.text, time: "Just now" }
          : t
      )
    );

    setInputText("");
    showToast("Message sent to guardians", "success");
  };

  const handleAttach = () => {
    showToast("Attachment dialog opened (Photos, PDFs up to 10MB)", "info");
  };

  return (
    <div className="flex flex-col gap-5 w-full animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-title font-semibold tracking-tight text-ink">
          Messages
        </h1>
        <span className="text-body text-ink-secondary">
          Chats with guardians of your students. Office hours 8 am – 6 pm are shown to parents. The principal can see all threads.
        </span>
      </div>

      {/* Main Chat Container */}
      <section className="bg-surface border border-line rounded-card flex min-h-[620px] overflow-hidden shadow-2xs">
        {/* Left Pane (320px): Threads List */}
        <div className="w-full sm:w-[320px] shrink-0 border-r border-line flex flex-col bg-surface">
          {/* Search Bar */}
          <div className="p-3 border-b border-line-row">
            <div className="relative flex items-center">
              <input
                aria-label="Search chats"
                placeholder="Search student or parent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-h-[40px] px-3 pl-8 rounded-control border border-line-input bg-surface-subtle text-small text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none"
              />
              <FiSearch size={14} className="absolute left-2.5 text-ink-secondary" />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-line-row">
            {filteredThreads.map((t) => {
              const isActive = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`flex gap-3 p-3.5 cursor-pointer transition-colors ${
                    isActive ? "bg-primary-tint" : "hover:bg-surface-subtle bg-surface"
                  }`}
                >
                  <span className="w-9 h-9 rounded-full bg-primary-tint text-primary-dark font-semibold text-small flex items-center justify-center shrink-0 border border-primary/20">
                    {t.avatar}
                  </span>

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline gap-1">
                      <span className={`text-body truncate ${isActive ? "font-bold text-ink" : "font-medium text-ink"}`}>
                        {t.title}
                      </span>
                      <span className="text-micro font-mono text-ink-secondary shrink-0">
                        {t.time}
                      </span>
                    </div>
                    <span className="text-caption text-ink-secondary truncate">
                      {t.subtitle} · {t.lastMessage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Thread */}
        <div className="hidden sm:flex flex-1 flex-col min-w-0 bg-surface">
          {/* Thread Header */}
          <div className="p-3.5 px-5 border-b border-line-row flex justify-between items-center gap-3 bg-surface">
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-body text-ink truncate">
                {activeThread.title} · {activeThread.subtitle.split(" · ")[0]}
              </span>
              <span className="text-caption text-ink-secondary truncate">
                Guardians: {activeThread.guardians}
              </span>
            </div>

            <button
              onClick={() => setShowStudentCard(true)}
              className="text-small font-medium text-primary hover:underline shrink-0"
            >
              Student card
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto bg-surface-subtle">
            {activeThread.messages.map((m) => {
              const isTeacher = m.sender === "teacher";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col gap-1 max-w-[70%] ${
                    isTeacher ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-card text-body leading-relaxed ${
                      isTeacher
                        ? "bg-primary text-white"
                        : "bg-surface border border-line text-ink shadow-2xs"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-micro text-ink-secondary px-1">{m.time}</span>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-line-row bg-surface flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleAttach}
              aria-label="Attach file"
              className="min-h-[42px] px-3 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-ink font-semibold text-body transition-colors"
            >
              +
            </button>
            <input
              aria-label="Message"
              placeholder="Write a message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 min-h-[42px] px-3.5 rounded-control border border-line-input bg-surface text-body text-ink placeholder:text-ink-secondary focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="min-h-[42px] px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-body transition-colors inline-flex items-center gap-1.5"
            >
              <FiSend size={14} /> Send
            </button>
          </form>
        </div>
      </section>

      {/* Student Card Modal when clicked */}
      {showStudentCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-h2 font-semibold text-ink m-0">Student Profile</h3>
                <span className="text-caption text-ink-secondary">{activeThread.subtitle}</span>
              </div>
              <button
                onClick={() => setShowStudentCard(false)}
                className="text-ink-secondary hover:text-ink text-body font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 py-2 text-small">
              <div><strong>Student:</strong> {activeThread.title.replace("Mother of ", "").replace("Father of ", "")}</div>
              <div><strong>Guardians:</strong> {activeThread.guardians}</div>
              <div><strong>Class / Section:</strong> 8-B · Room 21</div>
              <div><strong>Attendance:</strong> 94% · No dues pending</div>
              <div><strong>Privacy rule:</strong> Direct guardian phone numbers are protected by institution privacy setting.</div>
            </div>

            <div className="flex justify-end pt-2 border-t border-line-row">
              <button
                onClick={() => setShowStudentCard(false)}
                className="px-4 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMessages;
