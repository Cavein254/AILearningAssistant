import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chat/ChatInterface";

const DocumentDetailsPage = () => {
  const { id } = useParams();
  console.log({ id });
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  // const getPdfUrl = () => {
  //   if (!document?.filePath) return null;

  //   let filePath = document.filePath;

  //   // If already absolute URL, return as-is
  //   if (/^https?:\/\//i.test(filePath)) {
  //     return filePath;
  //   }

  //   // Normalize Windows backslashes → URL slashes
  //   filePath = filePath.replace(/\\/g, "/");

  //   // Ensure leading slash
  //   if (!filePath.startsWith("/")) {
  //     filePath = `/${filePath}`;
  //   }

  //   const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //   console.log(`${baseUrl}${filePath}`);

  //   return `${baseUrl}${filePath}`;
  // };

  const getPdfUrl = () => {
    if (!document?.filePath) return null;

    // 1. First, convert ALL backslashes to forward slashes
    let cleanPath = document.filePath.replace(/\\/g, "/");

    // 2. Fix the protocol if it was mangled (e.g., http:/ or http:///)
    // This regex looks for http followed by any number of colons/slashes and fixes it
    cleanPath = cleanPath.replace(/^https?:\/+/i, (match) => {
      return match.toLowerCase().startsWith("https") ? "https://" : "http://";
    });

    // 3. Handle the "Double URL" issue we saw earlier
    const httpIndex = cleanPath.lastIndexOf("http");
    if (httpIndex > 0) {
      cleanPath = cleanPath.substring(httpIndex);
    }

    // 4. Final check: if it's now a full valid URL, return it
    if (/^https?:\/\//i.test(cleanPath)) {
      return cleanPath;
    }

    // 5. Fallback for relative paths
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const finalRelativePath = cleanPath.startsWith("/")
      ? cleanPath
      : `/${cleanPath}`;

    return `${baseUrl}${finalRelativePath}`;
  };

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (!document || !document?.filePath) {
      return <div className="text-center p-8">Document not found</div>;
    }

    const pdfUrl = getPdfUrl();
    const safeUrl = pdfUrl ? encodeURI(pdfUrl) : null;

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ExternalLink className="" size={16} /> Open in new tab
          </a>
        </div>
        <div className="">
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Document Viewer"
            className="w-full h-[70vh] bg-white rounded border border-gray-300"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
    return "renderAIActions";
  };

  const renderFlashcardsTab = () => {
    return "renderFlashcardsTabs";
  };

  const renderQuizzesTab = () => {
    return "renderQuizzesTabs";
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) return <Spinner />;

  if (!document)
    return <div className="text-center p-8">Document not found</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Link to="/documents" className="inline-flex items-center gap-2">
          <ArrowLeft className="" size={16} /> Back to Document List
        </Link>
      </div>
      <PageHeader title={document?.data?.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailsPage;
