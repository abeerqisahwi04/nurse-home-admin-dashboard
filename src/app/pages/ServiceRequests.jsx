import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import {
  getServiceRequests,
  getServiceRequestDetails,
} from "../../services/serviceRequestsService";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadRequests() {
    try {
      setLoading(true);
      const data = await getServiceRequests({
        search: searchTerm,
        status: statusFilter,
      });
      setRequests(data);
    } catch (err) {
      alert(err.message || "Failed to load service requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  async function handleSearch() {
    await loadRequests();
  }

  async function handleView(requestId) {
    try {
      const data = await getServiceRequestDetails(requestId);
      setSelectedRequest(data);
    } catch (err) {
      alert(err.message || "Failed to load request details");
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Assigned: "bg-blue-100 text-blue-800",
      "In Progress": "bg-purple-100 text-purple-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
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

  function formatDateTime(date) {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  }

  function formatTime(time) {
    if (!time) return "-";
    return time.toString();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Service Requests Management</h2>
            <p className="text-sm text-gray-500">
              Monitor all service requests
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search requests..."
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
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Assigned Nurse
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Date & Time
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
                    Loading service requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No service requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request.requestId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      SR{String(request.requestId).padStart(3, "0")}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {request.patientName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.nurseName === "Unassigned" ? (
                        <span className="text-yellow-600 italic">
                          Unassigned
                        </span>
                      ) : (
                        request.nurseName
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.serviceType}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(request.dateTime)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleView(request.requestId)}
                        className="p-1 text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Service Request Details</h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info
                  label="Request ID"
                  value={`SR${String(selectedRequest.requestId).padStart(
                    3,
                    "0",
                  )}`}
                />

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <Info
                  label="Patient Name"
                  value={selectedRequest.patient?.name}
                />
                <Info
                  label="Patient Email"
                  value={selectedRequest.patient?.email}
                />
                <Info
                  label="Patient Phone"
                  value={selectedRequest.patient?.phone}
                />

                <Info
                  label="Nurse Name"
                  value={selectedRequest.nurse?.name || "Unassigned"}
                />
                <Info
                  label="Nurse Email"
                  value={selectedRequest.nurse?.email}
                />
                <Info
                  label="Nurse Phone"
                  value={selectedRequest.nurse?.phone}
                />

                <Info
                  label="Service Type"
                  value={selectedRequest.service?.name}
                />
                <Info
                  label="Service Price"
                  value={selectedRequest.service?.price}
                />

                <Info
                  label="Booking Date"
                  value={formatDateTime(selectedRequest.bookingDate)}
                />
                <Info
                  label="Start Time"
                  value={formatTime(selectedRequest.startTime)}
                />
                <Info
                  label="End Time"
                  value={formatTime(selectedRequest.endTime)}
                />

                <div className="md:col-span-2">
                  <Info label="Address" value={selectedRequest.address} />
                </div>

                <div className="md:col-span-2">
                  <Info label="Notes" value={selectedRequest.notes} />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-gray-800 mb-3">Payment Information</h4>
                {selectedRequest.payment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info
                      label="Amount"
                      value={selectedRequest.payment.amount}
                    />
                    <Info
                      label="Payment Status"
                      value={selectedRequest.payment.status}
                    />
                    <Info
                      label="Payment Method"
                      value={selectedRequest.payment.method}
                    />
                    <Info
                      label="Payment Date"
                      value={formatDateTime(selectedRequest.payment.createdAt)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No payment information.
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
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
