import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Download, TrendingUp, Calendar } from "lucide-react";

const monthlyUsageData = [
  { month: "Jan", requests: 245, completed: 228, revenue: 28400 },
  { month: "Feb", requests: 289, completed: 267, revenue: 32100 },
  { month: "Mar", requests: 312, completed: 295, revenue: 35800 },
];

const nursePerformance = [
  { name: "Dr. Emily Chen", completed: 87, rating: 4.9, revenue: 10450 },
  { name: "Sarah Johnson", completed: 75, rating: 4.8, revenue: 9000 },
  { name: "Maria Rodriguez", completed: 68, rating: 4.7, revenue: 8160 },
  { name: "Lisa Wong", completed: 62, rating: 4.6, revenue: 7440 },
  { name: "Anna Kim", completed: 58, rating: 4.5, revenue: 6960 },
];

export default function Reports() {
  const handleExport = (format) => {
    alert(`Exporting report as ${format}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Reports & Analytics</h2>
            <p className="text-sm text-gray-500">View performance metrics and export reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport("PDF")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport("CSV")}
              className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#1F7A8C]/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#1F7A8C]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Requests (Mar)</p>
              <p className="text-xl text-gray-800">312</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+7.9% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completion Rate</p>
              <p className="text-xl text-gray-800">94.6%</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+2.1% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue (Mar)</p>
              <p className="text-xl text-gray-800">$35,800</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+11.5% from last month</span>
          </div>
        </div>
      </div>

      {/* Monthly Usage Report */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Monthly Usage Report</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#1F7A8C" name="Total Requests" />
            <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#1F7A8C" strokeWidth={2} name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Nurse Performance Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Nurse Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Nurse Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Completed Requests</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Average Rating</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nursePerformance.map((nurse, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{nurse.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{nurse.completed}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800">{nurse.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(nurse.rating) ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">${nurse.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
