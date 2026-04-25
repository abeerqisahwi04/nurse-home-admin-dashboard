import { Users, UserCheck, Clock, ClipboardList, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Converted from TypeScript
const statsCards = [
  { title: "Total Patients", value: "2,847", change: "+12%", trend: "up", icon: Users, color: "#1F7A8C" },
  { title: "Total Nurses", value: "456", change: "+8%", trend: "up", icon: UserCheck, color: "#4CAF50" },
  { title: "Pending Verifications", value: "23", change: "-5%", trend: "down", icon: Clock, color: "#FFC107" },
  { title: "Today's Requests", value: "87", change: "+15%", trend: "up", icon: ClipboardList, color: "#FF5722" },
];

const requestStatusData = [
  { name: "Pending", value: 35, color: "#FFC107" },
  { name: "Assigned", value: 45, color: "#2196F3" },
  { name: "Completed", value: 120, color: "#4CAF50" },
  { name: "Cancelled", value: 12, color: "#FF5722" },
];

const weeklyActivityData = [
  { day: "Mon", requests: 65, completed: 52 },
  { day: "Tue", requests: 78, completed: 68 },
  { day: "Wed", requests: 82, completed: 75 },
  { day: "Thu", requests: 71, completed: 65 },
  { day: "Fri", requests: 88, completed: 80 },
  { day: "Sat", requests: 52, completed: 48 },
  { day: "Sun", requests: 45, completed: 42 },
];

const recentActivities = [
  { time: "10 mins ago", action: "Admin Sarah approved nurse verification for Dr. Emily Chen", type: "approval" },
  { time: "25 mins ago", action: "New service request submitted by Patient John Doe", type: "request" },
  { time: "1 hour ago", action: "Admin Michael updated pricing for Home Care service", type: "update" },
  { time: "2 hours ago", action: "Complaint #4521 resolved by Admin Jessica", type: "resolution" },
  { time: "3 hours ago", action: "New nurse registration: Maria Rodriguez", type: "registration" },
];

export default function Dashboard() {
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4">Request Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={requestStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {requestStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4">Weekly Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#1F7A8C" strokeWidth={2} name="Requests" />
              <Line type="monotone" dataKey="completed" stroke="#4CAF50" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-[#1F7A8C] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
