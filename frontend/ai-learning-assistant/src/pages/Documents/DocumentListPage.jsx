import React, { useEffect, useState } from "react";
import documentService from "../../services/documentService";
import toast from "react-hot-toast";
import {
  Upload,
  UploadCloud,
  X,
  Plus,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import DocumentCard from "../../components/documents/DocumentCard";
import Spinner from "../../components/common/Spinner";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Action States
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle);

      const newDoc = await documentService.uploadDocument(formData);

      // OPTIMISTIC UI: Add new doc to state without full refresh
      setDocuments((prev) => [newDoc, ...prev]);

      toast.success("Document uploaded successfully");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
    } catch (error) {
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await documentService.deleteDocument(selectedDoc._id);

      // OPTIMISTIC UI: Remove from state locally
      setDocuments((prev) => prev.filter((d) => d._id !== selectedDoc._id));

      toast.success("Document deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setSelectedDoc(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              My Documents
            </h1>
            <p className="text-slate-500 font-medium">
              Manage and organize your study materials
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Content */}
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[3rem]">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No documents yet
            </h3>
            <p className="text-slate-500 font-medium mb-8 text-center max-w-xs">
              Upload your first PDF to generate AI-powered quizzes and
              flashcards.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={() => handleDeleteRequest(doc)}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsUploadModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Upload PDF
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Ready to start learning?
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <label
                className={`group flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${
                  uploadFile
                    ? "border-emerald-500 bg-emerald-50/30"
                    : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                />
                <Upload
                  size={24}
                  className={uploadFile ? "text-emerald-500" : "text-slate-400"}
                />
                <p className="mt-2 text-sm font-bold text-slate-700">
                  {uploadFile ? uploadFile.name : "Click to upload PDF"}
                </p>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 h-14 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="flex-[2] h-14 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UploadCloud size={20} /> Upload Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Delete Document
              </h2>
              <p className="text-slate-500 font-medium mt-2">
                Are you sure? This will remove{" "}
                <span className="text-slate-900 font-bold">
                  "{selectedDoc?.title}"
                </span>{" "}
                and all associated study materials.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                disabled={deleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-14 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Keep it
              </button>
              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
