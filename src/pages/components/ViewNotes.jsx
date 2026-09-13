import {
  BookOpen,
  Search,
  Download,
  Eye,
  X,
  FileText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "./../../services/api";

export default function ViewNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notes");

      if (res.data.success) {
        setNotes(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      `${note.title} ${note.description} ${note.creator_id}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notes, search]);

  const downloadFile = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    a.target = "_blank";
    a.click();
  };

  const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Shared Notes
          </h1>

          <p className="text-slate-400">
            Browse study materials shared by coordinators.
          </p>
        </div>

        <div className="rounded-xl border border-orbit-border bg-orbit-surface p-5">

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-orbit-border bg-orbit-surface2 py-2 pl-10 pr-3 text-sm text-slate-200"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center py-20">
              <BookOpen className="h-16 w-16 text-slate-500" />

              <h3 className="mt-4 text-lg font-semibold text-white">
                No Notes Available
              </h3>

              <p className="mt-2 text-slate-500">
                Shared notes will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((note) => (
                <div
                  key={note.note_id}
                  className="rounded-xl border border-orbit-border bg-orbit-surface2 p-5"
                >
                  <div className="flex items-start justify-between">

                    <FileText className="h-8 w-8 text-orbit-primary" />

                    <span className="text-xs text-slate-500">
                      {note.created_at.split("T")[0] + "by" + note.creator_id}
                    </span>

                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {note.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {note.description}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() => setSelectedNote(note)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orbit-primary px-4 py-2 text-white"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => downloadFile(note.note_url)}
                      className="flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                    >
                      <Download size={16} />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}

      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-xl bg-orbit-surface">

            <div className="flex items-center justify-between border-b border-orbit-border p-4">

              <h2 className="font-semibold text-white">
                {selectedNote.title}
              </h2>

              <button
                onClick={() => setSelectedNote(null)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>

            </div>

            <div className="flex-1 bg-black">

              {isPdf(selectedNote.note_url) ? (
                <iframe
                  src={selectedNote.note_url}
                  className="h-full w-full"
                  title={selectedNote.title}
                />
              ) : (
                <img
                  src={selectedNote.note_url}
                  alt={selectedNote.title}
                  className="h-full w-full object-contain"
                />
              )}

            </div>

            <div className="border-t border-orbit-border p-4">

              <button
                onClick={() => downloadFile(selectedNote.note_url)}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-white"
              >
                Download
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}