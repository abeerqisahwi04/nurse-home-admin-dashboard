import { useState } from "react";
import { Search, Eye, MessageSquare, CheckCircle } from "lucide-react";

const mockComplaints = [
  {
    id: "C001",
    submittedBy: "John Doe (Patient)",
    userType: "Patient",
    category: "Service Quality",
    subject: "Nurse arrived late",
    description:
      "The nurse arrived 30 minutes late to the scheduled appointment without prior notice.",
    date: "2026-03-01",
    status: "Open",
  },
  {
    id: "C002",
    submittedBy: "Dr. Emily Chen (Nurse)",
    userType: "Nurse",
    category: "Technical",
    subject: "App not loading patient details",
    description: "Unable to load patient medical history in the mobile app.",
    date: "2026-02-28",
    status: "In Progress",
  },
  {
    id: "C003",
    submittedBy: "Jane Smith (Patient)",
    userType: "Patient",
    category: "Billing",
    subject: "Incorrect charge",
    description:
      "I was charged for a 3-hour service but only received 2 hours of care.",
    date: "2026-02-27",
    status: "Resolved",
  },
];

export default function ComplaintsSupport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Open: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Service Quality": "text-red-600",
      Billing: "text-orange-600",
      Technical: "text-blue-600",
      Other: "text-gray-600",
    };

    return colors[category] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Complaints & Support</h2>
            <p className="text-sm text-gray-500">
              Manage user complaints and support tickets
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Complaint ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {complaint.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {complaint.submittedBy}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-sm ${getCategoryColor(
                        complaint.category
                      )}`}
                    >
                      {complaint.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {complaint.subject}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {complaint.date}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(complaint.status)}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedComplaint(complaint)}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Complaint Details</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Complaint Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Complaint ID</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedComplaint.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Submitted By</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedComplaint.submittedBy}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p
                    className={`text-sm mt-1 ${getCategoryColor(
                      selectedComplaint.category
                    )}`}
                  >
                    {selectedComplaint.category}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedComplaint.date}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Subject</p>
                <p className="text-sm text-gray-800">
                  {selectedComplaint.subject}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Admin Response */}
              {selectedComplaint.status !== "Resolved" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Admin Response
                  </label>

                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    rows={4}
                    placeholder="Type your response to the user..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setAdminResponse("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              {selectedComplaint.status !== "Resolved" && (
                <>
                  <button
                    onClick={() => {
                      alert("Response sent to user!");
                      setAdminResponse("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Response
                  </button>

                  <button
                    onClick={() => {
                      alert("Complaint marked as resolved!");
                      setSelectedComplaint(null);
                      setAdminResponse("");
                    }}
                    className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Resolved
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}