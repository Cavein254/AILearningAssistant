import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  return (
    <>
      <div
        className="group relative bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-6 
             hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 
             transition-all duration-500 flex flex-col justify-between cursor-pointer 
             hover:-translate-y-1.5"
        onClick={handleNavigate}
      >
        {/* Action Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
            <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>

          {/* Delete Button - Fixed Positioning */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 transform group-hover:translate-x-0 translate-x-2"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {document?.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
              {document?.fileSize ? formatFileSize(document?.fileSize) : "N/A"}
            </span>
          </div>
        </div>

        {/* Stats & Footer Wrapper */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 text-slate-500">
            {document?.flashcardCount > 0 && (
              <div className="flex items-center gap-1.5">
                <BookOpen
                  size={14}
                  className="text-emerald-500"
                  strokeWidth={2.5}
                />
                <span className="text-xs font-bold">
                  {document?.flashcardCount} Flashcards
                </span>
              </div>
            )}
            {document?.quizCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <BrainCircuit
                  size={14}
                  className="text-cyan-500"
                  strokeWidth={2.5}
                />
                <span className="text-xs font-bold">
                  {document?.quizCount} Quizzes
                </span>
              </div>
            )}
          </div>

          {/* Timestamp Footer */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={12} strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Uploaded {moment(document?.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentCard;
