import { useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
} from "../../../components/ui";

import {
  Upload,
  Loader2,
  FileText,
  Image,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Download,
  Copy,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Link2,
  CheckCircle2,
} from "lucide-react";

import { api } from "../../../services/api";

function getFileName(url = "") {
  try {
    return decodeURIComponent(url.split("/").pop());
  } catch {
    return url;
  }
}

function isImage(url = "") {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function isPdf(url = "") {
  return /\.pdf$/i.test(url);
}

export default function ShareNotes() {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [uploadedUrl, setUploadedUrl] = useState("");

  const [viewerOpen, setViewerOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);

      const res = await api.get("/notes");

      setNotes(
        res?.data?.data ||
        res?.data ||
        []
      );

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setLoading(false);

    }
  }

  function update(field) {
    return (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
  }

  async function uploadNote(e) {

    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    setError("");

    setSuccess("");

    try {

      const res = await api.upload(
        "/uploads/notes",
        file
      );

      const url =
        res?.data?.fileUrl ||
        res?.fileUrl ||
        "";

      setUploadedUrl(url);

      setSuccess("File uploaded successfully.");

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setUploading(false);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

    }
  }

  async function saveNote() {

    if (!uploadedUrl && !editingId) {
      return alert("Upload a file first.");
    }

    if (!form.title.trim()) {
      return alert("Enter note title.");
    }

    try {

      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description,
        note_url: uploadedUrl,
      };

      if (editingId) {

        await api.put(
          `/notes/${editingId}`,
          payload
        );

        setSuccess("Note updated successfully.");

      } else {

        await api.post(
          "/notes",
          payload
        );

        setSuccess("Note shared successfully.");

      }

      setEditingId(null);

      setUploadedUrl("");

      setForm({
        title: "",
        description: "",
      });

      loadNotes();

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setSaving(false);

    }
  }

  const filteredNotes = useMemo(() => {

    return notes.filter((note) => {

      const keyword = search.toLowerCase();

      return (

        note.title
          ?.toLowerCase()
          .includes(keyword)

        ||

        note.description
          ?.toLowerCase()
          .includes(keyword)

      );

    });

  }, [notes, search]);
    return (
    <DashboardShell
      title="Share Notes"
      subtitle="Upload and share study materials with students"
    >
      <div className="space-y-6">

        {/* ===========================================
                    Upload Note
        =========================================== */}

        <Card>

          <CardBody>

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-white">
                  Upload Study Material
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload PDF or Images for your department students.
                </p>

              </div>

              <BookOpen
                size={34}
                className="text-orbit-primary"
              />

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Note Title"
                placeholder="DBMS Unit 1 Notes"
                value={form.title}
                onChange={update("title")}
              />

              <Input
                label="Description"
                placeholder="Optional description"
                value={form.description}
                onChange={update("description")}
              />

            </div>

            {/* ==========================
                  Upload Area
            ========================== */}

            <div className="mt-6">

              <label
                className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orbit-border bg-orbit-surface2/30 transition hover:border-orbit-primary hover:bg-orbit-primary/5"
              >

                {uploading ? (

                  <>

                    <Loader2
                      size={34}
                      className="animate-spin text-orbit-primary"
                    />

                    <p className="mt-4 text-slate-300">
                      Uploading...
                    </p>

                  </>

                ) : uploadedUrl ? (

                  isImage(uploadedUrl) ? (

                    <img
                      src={uploadedUrl}
                      alt="Preview"
                      className="h-full w-full rounded-2xl object-contain"
                    />

                  ) : (

                    <div className="text-center">

                      <FileText
                        size={60}
                        className="mx-auto text-red-400"
                      />

                      <p className="mt-4 font-medium text-white">

                        {getFileName(uploadedUrl)}

                      </p>

                      <p className="mt-2 text-xs text-slate-500">

                        PDF uploaded successfully

                      </p>

                    </div>

                  )

                ) : (

                  <>

                    <Upload
                      size={44}
                      className="text-orbit-primary"
                    />

                    <p className="mt-4 text-lg font-medium text-white">

                      Click to Upload

                    </p>

                    <p className="mt-2 text-sm text-slate-500">

                      PDF, DOC, DOCX, PPT, PPTX, JPG, PNG

                    </p>

                  </>

                )}

                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={uploadNote}
                />

              </label>

            </div>

            {/* Uploaded URL */}

            {uploadedUrl && (

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />

                  <span className="font-medium text-emerald-300">

                    Upload Successful

                  </span>

                </div>

                <p className="mt-3 break-all text-xs text-slate-300">

                  {uploadedUrl}

                </p>

              </div>

            )}

            {/* Alerts */}

            {success && (

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">

                {success}

              </div>

            )}

            {error && (

              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">

                {error}

              </div>

            )}

            {/* Buttons */}

            <div className="mt-6 flex gap-3">

              <Button
                loading={saving}
                icon={<Plus size={16} />}
                onClick={saveNote}
              >
                {editingId
                  ? "Update Note"
                  : "Share Note"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {

                  setUploadedUrl("");

                  setEditingId(null);

                  setSuccess("");

                  setError("");

                  setForm({
                    title: "",
                    description: "",
                  });

                }}
              >
                Clear
              </Button>

            </div>

          </CardBody>

        </Card>

        {/* ===========================================
                    Search
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-md">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <Input
                  className="pl-10"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <Button
                variant="outline"
                icon={<RefreshCw size={16} />}
                onClick={loadNotes}
              >
                Refresh
              </Button>

            </div>

          </CardBody>

        </Card>
                {/* ===========================================
                    Notes List
        =========================================== */}

        {loading ? (

          <Card>

            <CardBody>

              <div className="flex items-center justify-center gap-3 py-24">

                <Loader2
                  size={24}
                  className="animate-spin"
                />

                <span className="text-slate-400">
                  Loading shared notes...
                </span>

              </div>

            </CardBody>

          </Card>

        ) : filteredNotes.length === 0 ? (

          <Card>

            <CardBody>

              <div className="flex flex-col items-center justify-center py-24">

                <BookOpen
                  size={56}
                  className="mb-5 text-slate-600"
                />

                <h3 className="text-lg font-semibold text-white">
                  No Notes Found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Upload your first study material.
                </p>

              </div>

            </CardBody>

          </Card>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredNotes.map((note) => (

              <Card
                key={note.note_id}
                className="overflow-hidden transition hover:border-orbit-primary"
              >

                <CardBody>

                  {/* Preview */}

                  <div className="mb-5 overflow-hidden rounded-xl border border-orbit-border bg-orbit-surface2">

                    {isImage(note.note_url) ? (

                      <img
                        src={note.note_url}
                        alt={note.title}
                        className="h-52 w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-52 flex-col items-center justify-center">

                        <FileText
                          size={60}
                          className="text-red-400"
                        />

                        <p className="mt-4 font-medium text-white">
                          PDF Document
                        </p>

                      </div>

                    )}

                  </div>

                  {/* Title */}

                  <h3 className="line-clamp-1 text-lg font-semibold text-white">

                    {note.title}

                  </h3>

                  {/* Description */}

                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">

                    {note.description ||
                      "No description"}

                  </p>

                  {/* File */}

                  <div className="mt-4 rounded-lg bg-orbit-surface2 p-3">

                    <div className="flex items-center gap-2">

                      <Link2
                        size={16}
                        className="text-orbit-primary"
                      />

                      <span className="truncate text-xs text-slate-400">

                        {getFileName(note.note_url)}

                      </span>

                    </div>

                  </div>

                  {/* Date */}

                  <p className="mt-4 text-xs text-slate-500">

                    {note.created_on
                      ? new Date(
                          note.created_on
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}

                  </p>

                  {/* Actions */}

                  <div className="mt-6 grid grid-cols-3 gap-2">

                    {/* View */}

                    <Button
                      size="sm"
                      icon={<Eye size={15} />}
                      onClick={() => {

                        setSelectedNote(note);

                        setViewerOpen(true);

                      }}
                    >
                      View
                    </Button>

                    {/* Download */}

                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Download size={15} />}
                      onClick={() =>
                        window.open(
                          note.note_url,
                          "_blank"
                        )
                      }
                    >
                      Download
                    </Button>

                    {/* Copy */}

                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Copy size={15} />}
                      onClick={() => {

                        navigator.clipboard.writeText(
                          note.note_url
                        );

                        alert("Copied.");

                      }}
                    >
                      Copy
                    </Button>

                  </div>

                  {/* Edit / Delete */}

                  <div className="mt-3 flex gap-2">

                    <Button
                      className="flex-1"
                      variant="outline"
                      icon={<Pencil size={15} />}
                      onClick={() => {

                        setEditingId(
                          note.note_id
                        );

                        setUploadedUrl(
                          note.note_url
                        );

                        setForm({

                          title:
                            note.title,

                          description:
                            note.description ||

                            "",

                        });

                        window.scrollTo({

                          top: 0,

                          behavior:
                            "smooth",

                        });

                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      className="flex-1"
                      variant="destructive"
                      icon={<Trash2 size={15} />}
                      onClick={async () => {

                        if (
                          !window.confirm(
                            "Delete this note?"
                          )
                        )
                          return;

                        try {

                          await api.delete(
                            `/notes/${note.note_id}`
                          );

                          loadNotes();

                        } catch (err) {

                          alert(
                            err?.response
                              ?.data?.message ||

                              err.message
                          );

                        }

                      }}
                    >
                      Delete
                    </Button>

                  </div>

                </CardBody>

              </Card>

            ))}

          </div>

        )}
              </div>

      {/* ===========================================
                    Preview Modal
      =========================================== */}

      {viewerOpen && selectedNote && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">

          <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-orbit-border bg-orbit-surface">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-orbit-border px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-white">

                  {selectedNote.title}

                </h2>

                <p className="mt-1 text-xs text-slate-500">

                  {selectedNote.description || "No description"}

                </p>

              </div>

              <div className="flex items-center gap-2">

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={15} />}
                  onClick={() =>
                    window.open(
                      selectedNote.note_url,
                      "_blank"
                    )
                  }
                >
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<Copy size={15} />}
                  onClick={() => {

                    navigator.clipboard.writeText(
                      selectedNote.note_url
                    );

                    alert("Link copied.");

                  }}
                >
                  Copy
                </Button>

                <button
                  onClick={() => {

                    setViewerOpen(false);

                    setSelectedNote(null);

                  }}
                  className="rounded-lg p-2 transition hover:bg-red-500/20"
                >

                  <X className="text-red-400" />

                </button>

              </div>

            </div>

            {/* Preview */}

            <div className="flex-1 bg-black">

              {isImage(selectedNote.note_url) ? (

                <img
                  src={selectedNote.note_url}
                  alt={selectedNote.title}
                  className="h-full w-full object-contain"
                />

              ) : isPdf(selectedNote.note_url) ? (

                <iframe
                  src={selectedNote.note_url}
                  title={selectedNote.title}
                  className="h-full w-full"
                />

              ) : (

                <div className="flex h-full flex-col items-center justify-center">

                  <FileText
                    size={80}
                    className="text-red-400"
                  />

                  <p className="mt-5 text-lg text-white">

                    Preview unavailable

                  </p>

                  <Button
                    className="mt-6"
                    icon={<Download size={16} />}
                    onClick={() =>
                      window.open(
                        selectedNote.note_url,
                        "_blank"
                      )
                    }
                  >
                    Download File
                  </Button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </DashboardShell>

  );

}