import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles, User, Bot } from "lucide-react";
import aiServices from "../../services/aiService";
import { useAuth } from "../../context/Authcontext";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer.jsx";
import { useParams } from "react-router-dom";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiServices.getChatHistory(documentId);
        setHistory(response.data.messages || []);
      } catch (error) {
        console.error("History fetch error", error);
        setHistory([]);
      } finally {
        setInitialLoading(false); // Fixed: was true
      }
    };
    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const currentMsg = message;
    const userMsgObj = {
      role: "user",
      content: currentMsg,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMsgObj]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiServices.chat(documentId, currentMsg);
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantchunks,
      };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error("Failed to send message");
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";
    return (
      <div
        key={index}
        className={`flex w-full mb-6 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex max-w-[85%] gap-3 ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${
              isUser ? "bg-slate-900 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {isUser ? <User size={18} /> : <Bot size={18} />}
          </div>

          <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-4 rounded-[1.5rem] shadow-sm ${
                isUser
                  ? "bg-emerald-500 text-white rounded-tr-none"
                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
              }`}
            >
              <MarkdownRenderer content={msg.content} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white border border-slate-200 rounded-[2rem] items-center justify-center">
        <Spinner size="lg" />
        <p className="text-sm text-slate-500 mt-4 font-bold uppercase tracking-widest">
          Analysing History
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[75vh] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Sparkles size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Document AI</h3>
              <p className="text-slate-500 max-w-[240px]">
                Ask me anything about your document content.
              </p>
            </div>
          </div>
        ) : (
          history?.map(renderMessage)
        )}

        {loading && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center animate-pulse">
              <Bot size={18} />
            </div>
            <div className="px-4 py-3 bg-slate-100 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="w-full h-14 pl-6 pr-16 bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 rounded-2xl outline-none transition-all font-medium text-slate-900"
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="absolute right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95"
          >
            <Send size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
