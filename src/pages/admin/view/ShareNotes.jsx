import { useEffect, useRef, useState } from "react";
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
  Plus,
  RefreshCw,
} from "lucide-react";
import { api } from "../../../services/api";

export default function ShareNotes() {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [notes, setNotes] = useState([]);
const [viewerOpen, setViewerOpen] = useState(false);

const [viewerUrl, setViewerUrl] = useState("");

const [viewerTitle, setViewerTitle] = useState("");
  const [search, setSearch] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    note_url: "",
  });

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);

      const res = await api.get("/notes");

      setNotes(res?.data?.data || []);

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setLoading(false);

    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function uploadFile(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setSaving(true);
      setError("");

      const res = await api.upload(
        "/uploads/notes",
        file
      );

      const url =
        res?.data?.fileUrl ||
        res?.fileUrl ||
        "";

      setPreviewUrl(url);

      setForm((prev) => ({
        ...prev,
        note_url: url,
      }));

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err.message
      );

    } finally {

      setSaving(false);

    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/notes", form);

      setSuccess("Note shared successfully.");

      setForm({
        title: "",
        description: "",
        note_url: "",
      });

      setPreviewUrl("");

      if (fileRef.current) {
        fileRef.current.value = "";
      }

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

  const filteredNotes = notes.filter((note) =>
    note.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );
    return (
    <DashboardShell
      title="Share Notes"
      subtitle="Upload and share notes with students"
    >
      <div className="space-y-6">

        {/* ===========================================
                    Upload Form
        =========================================== */}

        <Card>

          <CardBody>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="grid gap-5">

                <Input
                  label="Note Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Operating System Unit 1"
                  required
                />

                <Textarea
                  label="Description"
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description..."
                  required
                />

              </div>

              {/* Upload */}

              <div>

                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Upload PDF / Image
                </label>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orbit-border bg-orbit-surface2 hover:border-orbit-primary transition"
                >

                  {saving ? (

                    <>
                      <Loader2
                        size={34}
                        className="animate-spin text-orbit-primary"
                      />

                      <p className="mt-3 text-slate-400">
                        Uploading...
                      </p>
                    </>

                  ) : previewUrl ? (

                    previewUrl.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (

                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full rounded-xl object-contain"
                      />

                    ) : (

                      <div className="text-center">

                        <FileText
                          size={52}
                          className="mx-auto text-red-400"
                        />

                        <p className="mt-3 text-white">
                          PDF Uploaded
                        </p>

                      </div>

                    )

                  ) : (

                    <>

                      <Upload
                        size={42}
                        className="text-slate-500"
                      />

                      <p className="mt-3 text-slate-300">
                        Click to upload PDF or Image
                      </p>

                      <p className="text-xs text-slate-500">
                        PDF, JPG, PNG supported
                      </p>

                    </>

                  )}

                </div>

                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={uploadFile}
                />

              </div>

              {/* Messages */}

              {success && (

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">

                  {success}

                </div>

              )}

              {error && (

                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">

                  {error}

                </div>

              )}

              <div className="flex justify-end">

                <Button
                  type="submit"
                  loading={saving}
                  disabled={!form.note_url}
                  icon={<Plus size={16} />}
                >
                  Share Note
                </Button>

              </div>

            </form>

          </CardBody>

        </Card>

        {/* ===========================================
                    Search
        =========================================== */}

        <Card>

          <CardBody>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="relative w-full md:max-w-sm">

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
                  size={22}
                  className="animate-spin"
                />

                Loading notes...

              </div>

            </CardBody>

          </Card>

        ) : filteredNotes.length === 0 ? (

          <Card>

            <CardBody>

              <div className="flex flex-col items-center justify-center py-20 text-slate-500">

                <FileText
                  size={50}
                  className="mb-4 opacity-40"
                />

                <h3 className="text-lg font-medium">
                  No Notes Found
                </h3>

                <p className="mt-2 text-sm">
                  Upload your first note to get started.
                </p>

              </div>

            </CardBody>

          </Card>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredNotes.map((note) => {

              const isImage = note.note_url?.match(
                /\.(png|jpg|jpeg|gif|webp)$/i
              );

              return (

                <Card
                  key={note.note_id}
                  className="overflow-hidden"
                >

                  <CardBody>

                    {/* Preview */}

                    <div className="mb-5 overflow-hidden rounded-xl border border-orbit-border bg-orbit-surface2">

                      {isImage ? (

                        <img
                          src={note.note_url}
                          alt={note.title}
                          className="h-48 w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-48 flex-col items-center justify-center">

                          <FileText
                            size={60}
                            className="text-red-400"
                          />

                          <p className="mt-3 text-sm text-slate-400">
                            PDF Document
                          </p>

                        </div>

                      )}

                    </div>

                    {/* Details */}

                    <h3 className="line-clamp-1 text-lg font-semibold text-white">

                      {note.title}

                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-400">

                      {note.description}

                    </p>

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

                    <div className="mt-6 flex gap-2">

                      <Button
  className="flex-1"
  onClick={() => {
    setViewerTitle(note.title);
    setViewerUrl(note.note_url);
    setViewerOpen(true);
  }}
>
  View
</Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          const a =
                            document.createElement("a");

                          a.href = note.note_url;
                          a.download = "";

                          document.body.appendChild(a);

                          a.click();

                          document.body.removeChild(a);
                        }}
                      >
                        Download
                      </Button>

                    </div>

                  </CardBody>

                </Card>

              );

            })}

          </div>

        )}

      </div>
      {viewerOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">

    <div className="relative w-full max-w-6xl rounded-2xl bg-orbit-surface border border-orbit-border overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-orbit-border px-6 py-4">

        <h2 className="text-lg font-semibold text-white">
          {viewerTitle}
        </h2>

        <button
          onClick={() => setViewerOpen(false)}
          className="rounded-lg p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
        >
          ✕
        </button>

      </div>

      {/* Body */}

      <div className="h-[80vh] bg-black">

        {viewerUrl.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (

          <img
            src={viewerUrl}
            alt={viewerTitle}
            className="h-full w-full object-contain"
          />

        ) : (

          <iframe
            src={viewerUrl}
            title={viewerTitle}
            className="h-full w-full"
          />

        )}

      </div>

    </div>

  </div>
)}

    </DashboardShell>

  );

}