import React, { useState } from "react";
import { FiX, FiSend, FiMessageSquare, FiUsers, FiCheckCircle } from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";
import type { Student } from "../../../types/admin/student";

interface Props {
  students: Student[];
  onClose: () => void;
}

export default function StudentNoticeModal({ students, onClose }: Props) {
  const { showToast } = useToast();
  const [noticeType, setNoticeType] = useState<"general" | "fee" | "attendance" | "holiday">("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<"sms" | "app" | "both">("both");
  const [sending, setSending] = useState(false);

  const presets = {
    general: {
      sub: "Important Announcement for Parents",
      msg: "Dear Parent, this is an important notification regarding upcoming school activities. Kindly check the school diary/portal.",
    },
    fee: {
      sub: "Reminder: Outstanding School Fee Installment",
      msg: "Dear Parent, kindly clear the pending fee installment for the current quarter at your earliest convenience to avoid late charges.",
    },
    attendance: {
      sub: "Student Attendance Alert",
      msg: "Dear Parent, this is to inform you that your ward has attendance below the prescribed 85% requirement. Please contact the class teacher.",
    },
    holiday: {
      sub: "School Holiday Notification",
      msg: "Dear Parent, the school will remain closed tomorrow in observance of the declared local holiday. Classes resume the following day.",
    },
  };

  const applyPreset = (type: "general" | "fee" | "attendance" | "holiday") => {
    setNoticeType(type);
    setSubject(presets[type].sub);
    setMessage(presets[type].msg);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast("Please enter a notice message", "error");
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast(`Notice sent successfully to ${students.length} guardian(s) via ${channel.toUpperCase()}!`, "success");
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface rounded-card border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-surface-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-tint text-primary flex items-center justify-center">
              <FiMessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-h2 font-semibold text-ink m-0">Send Guardian Notice</h3>
              <p className="text-caption text-ink-secondary m-0">
                Broadcasting to {students.length} selected {students.length === 1 ? "student's" : "students'"} guardians
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-secondary hover:text-ink hover:bg-surface rounded-control border border-line transition cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="text-caption font-semibold text-ink-secondary block mb-1.5">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["general", "fee", "attendance", "holiday"] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => applyPreset(type)}
                  className={`px-3 py-1.5 rounded-control text-caption font-medium border text-center transition cursor-pointer capitalize ${
                    noticeType === type
                      ? "bg-primary text-white border-primary"
                      : "bg-surface border-line-input text-ink hover:bg-surface-subtle"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Channel */}
          <div>
            <label className="text-caption font-semibold text-ink-secondary block mb-1.5">
              Delivery Channel
            </label>
            <div className="flex gap-4 text-small">
              {[
                { key: "both", label: "SMS + Parent Portal" },
                { key: "sms", label: "SMS Only" },
                { key: "app", label: "Parent App Only" },
              ].map((c) => (
                <label key={c.key} className="flex items-center gap-2 cursor-pointer font-medium text-ink">
                  <input
                    type="radio"
                    name="channel"
                    value={c.key}
                    checked={channel === c.key}
                    onChange={() => setChannel(c.key as any)}
                    className="accent-primary"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-caption font-semibold text-ink-secondary block mb-1">
              Subject / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Attendance alert or fee update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-line-input rounded-control text-small text-ink focus:outline-none focus:border-primary bg-surface"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-caption font-semibold text-ink-secondary block mb-1">
              Message Content <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Type your notice to guardians here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-line-input rounded-control text-small text-ink focus:outline-none focus:border-primary bg-surface resize-none"
            />
            <div className="flex justify-between items-center text-caption text-ink-secondary mt-1">
              <span>Standard 160-char SMS units applied.</span>
              <span>{message.length} characters</span>
            </div>
          </div>

          {/* Recipients List Preview */}
          <div className="p-3 bg-surface-subtle rounded-control border border-line text-caption text-ink-secondary">
            <span className="font-semibold text-ink">Recipients include: </span>
            {students.slice(0, 3).map((s) => s.parentName || s.name).join(", ")}
            {students.length > 3 && ` and ${students.length - 3} more.`}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-line-input rounded-control text-small text-ink hover:bg-surface-subtle transition font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-control bg-primary text-white text-small font-semibold hover:bg-primary-dark transition cursor-pointer disabled:opacity-60"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend size={15} />
              )}
              <span>{sending ? "Transmitting..." : "Send Broadcast Notice"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
