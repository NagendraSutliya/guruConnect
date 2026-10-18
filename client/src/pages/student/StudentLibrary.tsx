import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { FiBook, FiSearch, FiClock, FiBookmark, FiMapPin, FiCheck } from "react-icons/fi";

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  rack: string;
  status: "Available" | "Issued";
}

const CATALOGUE_BOOKS: LibraryBook[] = [
  { id: "b1", title: "The Blue Umbrella", author: "Ruskin Bond", category: "Fiction", rack: "Rack F-3", status: "Available" },
  { id: "b2", title: "Rusty Runs Away", author: "Ruskin Bond", category: "Fiction", rack: "Rack F-3", status: "Issued" },
  { id: "b3", title: "The Room on the Roof", author: "Ruskin Bond", category: "Fiction", rack: "Rack F-4", status: "Available" },
  { id: "b4", title: "Malgudi Days", author: "R. K. Narayan", category: "Literature", rack: "Rack D-2", status: "Available" },
  { id: "b5", title: "Gitanjali", author: "Rabindranath Tagore", category: "Literature", rack: "Rack B-1", status: "Available" },
  { id: "b6", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", rack: "Rack S-1", status: "Available" },
  { id: "b7", title: "Discovery of India", author: "Jawaharlal Nehru", category: "History", rack: "Rack H-2", status: "Issued" },
];

const StudentLibrary: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("Ruskin Bond");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = CATALOGUE_BOOKS.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.rack.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || b.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleReserve = (book: LibraryBook) => {
    if (book.status === "Issued") {
      showToast(`Added to your waitlist. You will be notified when "${book.title}" is returned.`, "info");
    } else {
      showToast(`Reserved "${book.title}". Please collect from ${book.rack} within 24 hours.`, "success");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn font-sans text-ink">
      {/* Top Header */}
      <div>
        <div className="text-small text-ink-secondary">Resource Center · Shiksha Central Library</div>
        <h1 className="text-title font-semibold text-ink m-0">Library & Reading Hub</h1>
      </div>

      {/* Currently Issued Books Strip */}
      <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-line-row">
          <div className="flex items-center gap-2">
            <FiBookmark className="text-primary" size={18} />
            <h2 className="text-body font-semibold text-ink m-0">Books Currently Issued To You (2)</h2>
          </div>
          <span className="text-caption text-ink-secondary">Max quota: 2 books</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Book 1: Amber Alert */}
          <div className="bg-[#FFF8F0] border border-[#EBC99C] rounded-control p-4 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-body font-semibold text-[#17201D]">Wings of Fire</span>
                <span className="text-small text-[#4F5B57]">A. P. J. Abdul Kalam · Issued on 1 Oct</span>
              </div>
              <span className="font-semibold text-caption px-2.5 py-1 rounded-full bg-amber-100/90 text-[#8F4A09] border border-amber-300 shrink-0">
                Due in 2 days
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-caption text-[#8F4A09]">
              <span>Return deadline: Thu 15 Oct 2026</span>
              <span className="font-semibold">No overdue fine</span>
            </div>
          </div>

          {/* Book 2: Normal Due */}
          <div className="bg-surface-subtle border border-line rounded-control p-4 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-body font-semibold text-ink">The Story of My Experiments with Truth</span>
                <span className="text-small text-ink-secondary">M. K. Gandhi · Issued on 8 Oct</span>
              </div>
              <span className="font-semibold text-caption px-2.5 py-1 rounded-full bg-surface text-ink-secondary border border-line shrink-0">
                Due in 9 days
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line-row text-caption text-ink-secondary">
              <span>Return deadline: Thu 22 Oct 2026</span>
              <span>Shelf: Bio-G2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalogue Search & Browser */}
      <div className="bg-surface border border-line rounded-card p-6 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-line-row">
          <div className="flex items-center gap-2">
            <FiSearch className="text-primary" size={18} />
            <h2 className="text-body font-semibold text-ink m-0">Library Catalogue Search</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-subtle p-1 rounded-control border border-line overflow-x-auto">
            {["all", "fiction", "literature", "science", "history"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-control text-small font-semibold capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-surface text-ink shadow-2xs"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, author name, or rack code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] px-4 pl-10 rounded-control border border-line-input bg-surface-subtle text-body text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-secondary" size={16} />
        </div>

        {/* Books Table */}
        <div className="overflow-x-auto border border-line rounded-control">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line-row text-caption text-ink-secondary bg-surface-subtle/40">
                <th className="py-3 px-6 font-semibold">Book Title</th>
                <th className="py-3 px-6 font-semibold">Author</th>
                <th className="py-3 px-6 font-semibold">Genre</th>
                <th className="py-3 px-6 font-semibold">Shelf Location</th>
                <th className="py-3 px-6 font-semibold">Availability</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-row text-small">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-ink">
                    {book.title}
                  </td>
                  <td className="py-3.5 px-6 text-ink-secondary">
                    {book.author}
                  </td>
                  <td className="py-3.5 px-6 text-ink-secondary">
                    {book.category}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-ink-secondary">
                    {book.rack}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`text-caption font-semibold px-2.5 py-1 rounded-full ${
                      book.status === "Available"
                        ? "bg-[#E4F1E8] text-[#1E5A33] border border-[#BCE1C7]"
                        : "bg-[#F1F2EF] text-[#4F5B57] border border-[#DDE2DE]"
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleReserve(book)}
                      className="text-caption font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {book.status === "Available" ? "Reserve Book" : "Notify When Free"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentLibrary;
