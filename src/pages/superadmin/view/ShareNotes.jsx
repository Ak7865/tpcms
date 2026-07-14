import { useEffect, useRef, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button, Input } from "../../../components/ui";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  BookOpen,
  X,
  Link,
  Save,
  Eye,
} from "lucide-react";
import { api } from "../../../services/api";

function fileName(url) {
  return url.split("/").pop();
}

export default function ShareNotes() {
  const fileRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);

  const [uploadedUrl, setUploadedUrl] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  function previewNote(note) {
    setSelectedNote(note);
    setPreviewOpen(true);
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const res = await api.get("/notes");

      console.log("GET /notes =>", res);

      setNotes(res.data || res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploading(true);

    setError("");

    setSuccess("");

    try {
      const res = await api.upload("/uploads/notes", files);

      const url = res?.fileUrl || res?.data?.fileUrl || "";

      setUploadedUrl(url);

      setSuccess("File uploaded successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  }

  async function handleSave() {
    if (!uploadedUrl) {
      return alert("Please upload a file first.");
    }

    if (!form.title.trim()) {
      return alert("Enter note title.");
    }

    try {
      setSaving(true);

      await api.post("/notes", {
        title: form.title,
        description: form.description,
        note_url: uploadedUrl,
      });

      setSuccess("Note saved successfully.");

      setUploadedUrl("");

      setForm({
        title: "",
        description: "",
      });

      await loadNotes();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  function update(field) {
    return (e) =>
      setForm({
        ...form,
        [field]: e.target.value,
      });
  }

  function copyLink(url) {
    navigator.clipboard.writeText(url);

    alert("Link copied.");
  }

  function removeFromList(id) {
    setNotes((prev) => prev.filter((n) => n.note_id !== id));
  }
  return (
    <DashboardShell
      title="Share Notes"
      subtitle="Upload study materials for students"
    >
      <div className="space-y-6">
        {/* ============================
              Upload Card
      ============================ */}

        <Card>
          <CardBody>
            <p className="mb-5 flex items-center gap-2 border-b border-orbit-border pb-2 text-sm font-semibold text-slate-300">
              <Upload size={16} className="text-orbit-primary" />
              Upload Study Material
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Note Title
                </label>

                <Input
                  value={form.title}
                  onChange={update("title")}
                  placeholder="DBMS Unit 1 Notes"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-slate-400">
                  Description
                </label>

                <Input
                  value={form.description}
                  onChange={update("description")}
                  placeholder="Optional description"
                />
              </div>
            </div>

            {/* Upload Area */}

            <div className="mt-6">
              <label className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orbit-border bg-orbit-surface2/30 transition hover:border-orbit-primary hover:bg-orbit-primary/5">
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2
                      size={28}
                      className="animate-spin text-orbit-primary"
                    />

                    <span className="text-sm text-slate-300">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload size={34} className="mb-3 text-orbit-primary" />

                    <p className="text-sm font-medium text-slate-300">
                      Click to Upload
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
                    </p>

                    <p className="mt-2 text-xs text-orbit-primary">
                      Multiple files supported
                    </p>
                  </>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={handleUpload}
                />
              </label>
            </div>

            {/* Uploaded URL */}

            {uploadedUrl && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-xs font-medium text-emerald-300">
                  Uploaded File
                </p>

                <p className="mt-2 break-all text-xs text-slate-300">
                  {uploadedUrl}
                </p>
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                {success}
              </div>
            )}

            {/* Error */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Buttons */}

            <div className="mt-6 flex gap-3">
              <Button
                loading={saving}
                icon={<Save size={16} />}
                onClick={handleSave}
              >
                Save Note
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  setUploadedUrl("");

                  setForm({
                    title: "",
                    description: "",
                  });

                  setError("");

                  setSuccess("");
                }}
              >
                Clear
              </Button>
            </div>
          </CardBody>
        </Card>
        {/* ==========================================
                Saved Notes
      ========================================== */}

        <Card>
          <CardBody>
            <p className="mb-4 flex items-center gap-2 border-b border-orbit-border pb-2 text-sm font-semibold text-slate-300">
              <BookOpen size={16} className="text-orbit-primary" />
              Shared Notes ({notes.length})
            </p>

            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <BookOpen size={42} className="mb-3 opacity-30" />

                <p>No notes uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.note_id}
                    className="flex items-center gap-4 rounded-xl border border-orbit-border bg-orbit-surface2/30 p-4 transition hover:border-orbit-primary"
                  >
                    {/* Icon */}

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orbit-primary/10">
                      <FileText size={18} className="text-orbit-primary" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-slate-200">
                        {note.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {note.description || "No description"}
                      </p>

                      <p className="mt-2 truncate text-xs text-slate-600">
                        {note.note_url}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => previewNote(note)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-orbit-surface2 hover:bg-blue-500/20 transition"
                      title="View"
                    >
                      <Eye size={16} className="text-blue-400" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={note.note_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-orbit-surface2 transition hover:bg-orbit-primary/20"
                        title="Download"
                      >
                        <Download size={16} className="text-orbit-primary" />
                      </a>

                      <button
                        onClick={() => copyLink(note.note_url)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-orbit-surface2 transition hover:bg-orbit-primary/20"
                        title="Copy Link"
                      >
                        <Link size={16} className="text-orbit-primary" />
                      </button>

                      <button
                        onClick={() => removeFromList(note.note_id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-orbit-surface2 transition hover:bg-red-500/20"
                        title="Remove"
                      >
                        <X size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      {previewOpen && selectedNote && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

<div className="relative w-[90vw] h-[90vh] rounded-2xl bg-orbit-surface overflow-hidden">

<div className="flex items-center justify-between border-b border-orbit-border px-6 py-4">

<h2 className="font-semibold text-lg">

{selectedNote.title}

</h2>

<button
onClick={() => {

setPreviewOpen(false);

setSelectedNote(null);

}}
className="rounded-lg p-2 hover:bg-red-500/20"
>

<X />

</button>

</div>

<div className="h-[calc(90vh-70px)]">

{/* PDF */}

{selectedNote.note_url
.toLowerCase()
.endsWith(".pdf") ? (

<iframe
src={selectedNote.note_url}
title="PDF Preview"
className="h-full w-full"
/>

) :

/* Image */

(
<img
src={selectedNote.note_url}
alt={selectedNote.title}
className="h-full w-full object-contain bg-black"
/>
)}

</div>

</div>

</div>

)}
    </DashboardShell>
  );
}
