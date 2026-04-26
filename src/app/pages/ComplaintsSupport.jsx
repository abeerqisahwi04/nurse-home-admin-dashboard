import { useEffect, useState } from "react";
import { Search, Eye, MessageSquare, CheckCircle } from "lucide-react";
import {
  getComplaints,
  getComplaintDetails,
  sendComplaintResponse,
  markComplaintResolved,
} from "../../services/complaintsService";

export default function ComplaintsSupport() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComplaints() {
    try {
      setLoading(true);
      const data = await getComplaints({
        search: searchTerm,
        status: statusFilter,
      });
      setComplaints(data);
    } catch (err) {
      alert(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  async function handleSearch() {
    await loadComplaints();
  }

  async function handleView(id) {
    try {
      const data = await getComplaintDetails(id);
      setSelectedComplaint(data);
      setAdminResponse(data.adminResponse || "");
    } catch (err) {
      alert(err.message || "Failed to load complaint details");
    }
  }

  async function handleSendResponse() {
    if (!adminResponse.trim()) {
      alert("Please write a response first.");
      return;
    }

    try {
      await sendComplaintResponse(selectedComplaint.complaintId, adminResponse);
      alert("Response sent successfully");
      const data = await getComplaintDetails(selectedComplaint.complaintId);
      setSelectedComplaint(data);
      await loadComplaints();
    } catch (err) {
      alert(err.message || "Failed to send response");
    }
  }

  async function handleResolve() {
    try {
      await markComplaintResolved(selectedComplaint.complaintId);
      alert("Complaint marked as resolved");
      setSelectedComplaint(null);
      setAdminResponse("");
      await loadComplaints();
    } catch (err) {
      alert(err.message || "Failed to resolve complaint");
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Open: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
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

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  return (
    <div className="space-y-6">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
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

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F]"
            >
              Search
            </button>
          </div>
        </div>
      </div>

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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    Loading complaints...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No complaints found.
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.complaintId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      C{String(complaint.complaintId).padStart(3, "0")}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {complaint.submittedBy} ({complaint.userRole})
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${getCategoryColor(complaint.category)}`}
                      >
                        {complaint.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {complaint.subject}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(complaint.date)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(complaint.status)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(complaint.complaintId)}
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Complaint Details</h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info
                  label="Complaint ID"
                  value={`C${String(selectedComplaint.complaintId).padStart(3, "0")}`}
                />

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                <Info
                  label="Submitted By"
                  value={selectedComplaint.submittedBy?.fullName}
                />
                <Info
                  label="Role"
                  value={selectedComplaint.submittedBy?.role}
                />
                <Info
                  label="Email"
                  value={selectedComplaint.submittedBy?.email}
                />
                <Info
                  label="Phone"
                  value={selectedComplaint.submittedBy?.phone}
                />
                <Info
                  label="Date Submitted"
                  value={formatDate(selectedComplaint.createdAt)}
                />
                <Info
                  label="Urgent"
                  value={selectedComplaint.isUrgent ? "Yes" : "No"}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Category</p>
                <p
                  className={`text-sm ${getCategoryColor(selectedComplaint.category)}`}
                >
                  {selectedComplaint.category}
                </p>
              </div>

              <Info label="Subject" value={selectedComplaint.subject} />

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

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

              {selectedComplaint.adminResponse && (
                <Info
                  label="Previous Admin Response"
                  value={selectedComplaint.adminResponse}
                />
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setAdminResponse("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              {selectedComplaint.status !== "Resolved" && (
                <>
                  <button
                    onClick={handleSendResponse}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Response
                  </button>

                  <button
                    onClick={handleResolve}
                    className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] flex items-center gap-2"
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

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value || "-"}</p>
    </div>
  );
}
