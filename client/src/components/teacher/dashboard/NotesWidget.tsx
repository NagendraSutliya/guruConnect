import { useState } from "react";

const NotesWidget = () => {
  const [notes, setNotes] = useState([
    "Prepare exam questions",
    "Check assignment submissions",
  ]);

  const [text, setText] = useState("");

  const addNote = () => {
    if (!text) return;
    setNotes([...notes, text]);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Add note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={addNote}
          className="bg-purple-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {notes.map((n, i) => (
          <li key={i} className="border-b pb-1">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesWidget;
