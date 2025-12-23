import { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await progressService.getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-500 text-sm">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-600",
      shadowColor: "shadow-blue-500/50",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      shadowColor: "shadow-purple-500/50",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-600",
      shadowColor: "shadow-emerald-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Modern Dot Grid Background */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Track your learning and activities in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon
                      size={22}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                      {stat.label}
                    </p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <Clock size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Your latest interactions across the platform
              </p>
            </div>
          </div>

          {dashboardData?.recentActivity &&
          (dashboardData.recentActivity.documents?.length > 0 ||
            dashboardData.recentActivity.quizzes?.length > 0) ? (
            <div className="relative space-y-2 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
              {[
                ...(dashboardData.recentActivity.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.title, // Changed from description to title based on your data log
                    timestamp: doc.lastAccessedAt,
                    link: `/document/${doc._id}`,
                    type: "document",
                  })
                ),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt || quiz.createdAt,
                  link: `/quiz/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="relative flex items-center justify-between group pl-10 py-4"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`absolute left-0 w-10 h-10 flex items-center justify-center`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 z-10 ${
                          activity.type === "document"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {activity.type === "document"
                            ? "Accessed "
                            : "Attempted "}
                          <span className="text-slate-600 font-medium">
                            "{activity.description}"
                          </span>
                        </p>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                          {new Date(activity.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {activity.link && (
                      <a
                        href={activity.link}
                        className="ml-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 text-xs font-bold rounded-lg transition-all"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6 border-2 border-dashed border-slate-200">
                <Clock size={40} strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                No recent activity
              </h4>
              <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">
                Start creating documents, quizzes, and flashcards to see your
                activity timeline here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
