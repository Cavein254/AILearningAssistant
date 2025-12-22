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

  console.log(dashboardData);

  return (
    <div className="min-h-screen">
      <div className="absolute insert-0 bg-[radial-gradient(#e5e5e5_1px, transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header  */}
        <div className="">
          <h1 className="">Dashboard</h1>
          <p className="">Track your learning and activities</p>
        </div>

        {/* Stats */}
        <div className="">
          {stats.map((stat, index) => (
            <div className="" key={index}>
              <div className="">
                <span className="">{stat.label}</span>
                <div
                  className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon
                    size={20}
                    strokeWidth={2.5}
                    className="text-white"
                  />
                </div>
                <span className="">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div className="">
          <div className="">
            <div className="">
              <Clock className="" strokeWidth={2.5} />
            </div>
            <h3 className="">Recent Activity</h3>
          </div>

          {dashboardData?.recentActivity &&
          (dashboardData.recentActivity.documents?.length > 0 ||
            dashboardData.recentActivity.quizzes?.length > 0) ? (
            <div className="">
              {[
                ...(dashboardData.recentActivity.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.description,
                    timestamp: doc.lastAccessedAt,
                    link: `/document/${doc._id}`,
                    type: "document",
                  })
                ),
                ...(dashboardData.recentActivity.quizzes || []).map((quiz) => ({
                  id: quiz._id,
                  description: quiz.title,
                  timestamp: quiz.completedAt,
                  link: `/quiz/${quiz._id}`,
                  type: "quiz",
                })),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((activity, index) => (
                  <div key={activity.id || index} className="">
                    <div className="">
                      <div className="">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "document"
                              ? "bg-linear-to-r from-blue-500 to-cyan-600"
                              : "bg-linear-to-r from-emerald-400 to-teal-600"
                          }`}
                        />
                        <p className="">
                          {activity.type === "document"
                            ? "Accessed Document"
                            : "Attempted Quiz"}
                          <span className="">{activity.description}</span>
                        </p>
                      </div>
                      <p className="">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.link && (
                      <a href={activity.link} className="">
                        View
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="">
              <div className="">
                <Clock className="" strokeWidth={2.5} />
              </div>
              <p className="">No recent activity</p>
              <p className="">
                Start creating documents, quizzes, and flashcards to see your
                activity here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
