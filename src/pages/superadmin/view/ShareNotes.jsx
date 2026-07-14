import { useRef, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { Card, CardBody, Button } from "../../../components/ui";
import {
  Upload,
  FileText,
  Download,
  Loader2,
  BookOpen,
  X,
  Link,
} from "lucide-react";
import { api } from "../../../services/api";

function fileName(url) {
  return url.split("/").pop();
}

export default function ShareNotes() {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");
    setSuccess("");

    try {
      setUploading(true);
      const res = await api.upload("/uploads/notes", files);

      const urls = res?.data?.fileUrl || res?.fileUrl || res?.data?.fileUrls || res?.fileUrls;
      const list = Array.isArray(urls) ? urls : urls ? [urls] : [];
      setUploadedFiles((prev) => [...prev, ...list]);
      setSuccess(`${list.length} file(s) uploaded successfully!`);
    } catch (err) {
      setError("Upload failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeFile(url) {
    setUploadedFiles((prev) => prev.filter((u) => u !== url));
  }

  function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  }

  return (
    <DashboardShell title="Share Notes" subtitle="Upload study materials and notes for students">
      <div className="space-y-6">

        {/* Upload zone */}
        <Card>
          <CardBody>
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4 pb-2 border-b border-orbit-border/50">
              <Upload size={16} className="text-orbit-primary" />
              Upload Notes / Study Material
            </p>

            <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-orbit-border hover:border-orbit-primary cursor-pointer transition-colors bg-orbit-surface2/20 hover:bg-orbit-primary/5">
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-orbit-primary">
                  <Loader2 size={28} className="animate-spin" />
                  <span className="text-sm">Uploading files...</span>
                </div>
              ) : (
                <>
                  <Upload size={28} className="text-slate-500 mb-2" />
                  <span className="text-sm text-slate-400 font-medium">Click or drag files to upload</span>
                  <span className="text-xs text-slate-600 mt-1">PDF, Word, PowerPoint, Images supported</span>
                  <span className="text-xs text-slate-700 mt-0.5">Multiple files allowed</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            {success && <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}
            {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
          </CardBody>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardBody>
              <p className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-4 pb-2 border-b border-orbit-border/50">
                <BookOpen size={16} className="text-orbit-primary" />
                Uploaded Notes ({uploadedFiles.length})
              </p>

              <div className="space-y-3">
                {uploadedFiles.map((url) => (
                  <div
                    key={url}
                    className="flex items-center gap-3 rounded-xl border border-orbit-border bg-orbit-surface2/40 px-4 py-3 hover:border-orbit-primary/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orbit-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-orbit-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{fileName(url)}</p>
                      <p className="text-xs text-slate-600 truncate mt-0.5">{url}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-orbit-surface2 hover:bg-orbit-primary/20 text-slate-400 hover:text-orbit-primary transition-colors"
                        title="Download"
                      >
                        <Download size={14} />
                      </a>
                      <button
                        onClick={() => copyLink(url)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-orbit-surface2 hover:bg-orbit-primary/20 text-slate-400 hover:text-orbit-primary transition-colors text-xs font-bold"
                        title="Copy link"
                      >
                        🔗
                      </button>
                      <button
                        onClick={() => removeFile(url)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-orbit-surface2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove from list"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-600 mt-4">
                Share the download links above with students. Files are stored on the server permanently.
              </p>
            </CardBody>
          </Card>
        )}

        {/* Help card */}
        {uploadedFiles.length === 0 && (
          <Card>
            <CardBody>
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-slate-600">
                <BookOpen size={40} className="opacity-30" />
                <p className="text-sm">No notes shared yet. Upload files above to share with students.</p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
