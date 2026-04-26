import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Clock,
  ClipboardList,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboardOverview } from "../../services/dashboardService";

const statusColors = {
  Pending: "#FFC107",
  Assigned: "#2196F3",
  Completed: "#4CAF50",
  Cancelled: "#FF5722",
  Canceled: "#FF5722",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const diffMinutes = Math.floor((new Date() - date) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await getDashboardOverview();
        setDashboard(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Patients",
      value: dashboard?.totalPatients ?? 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "#1F7A8C",
    },
    {
      title: "Total Nurses",
      value: dashboard?.totalNurses ?? 0,
      change: "+8%",
      trend: "up",
      icon: UserCheck,
      color: "#4CAF50",
    },
    {
      title: "Pending Verifications",
      value: dashboard?.pendingVerifications ?? 0,
      change: "-5%",
      trend: "down",
      icon: Clock,
      color: "#FFC107",
    },
    {
      title: "Today's Requests",
      value: dashboard?.todaysRequests ?? 0,
      change: "+15%",
      trend: "up",
      icon: ClipboardList,
      color: "#FF5722",
    },
  ];

  const requestStatusData =
    dashboard?.requestStatusDistribution?.map((item) => ({
      name: item.status,
      value: item.count,
      color: statusColors[item.status] || "#1F7A8C",
    })) || [];

  const weeklyActivityData =
    dashboard?.weeklyActivity?.map((item) => ({
      day: formatDate(item.date),
      requests: item.requests,
      completed: item.completed,
    })) || [];

  const recentActivities = dashboard?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>

                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  <span>{stat.change}</span>
                </div>
              </div>

              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4">Request Status Distribution</h3>

          {requestStatusData.length === 0 ? (
            <p className="text-sm text-gray-500">No request data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4">Weekly Activity Overview</h3>

          {weeklyActivityData.length === 0 ? (
            <p className="text-sm text-gray-500">No weekly activity data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#1F7A8C"
                  strokeWidth={2}
                  name="Requests"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Recent Activity</h3>

        {recentActivities.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-[#1F7A8C] rounded-full mt-2"></div>

                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {activity.description || activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}