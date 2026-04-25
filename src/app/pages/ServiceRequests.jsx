import { useState } from "react";
import { Search, Eye, X, UserX } from "lucide-react";

const mockRequests = [
  {
    id: "SR001",
    patientName: "John Doe",
    nurseName: "Dr. Emily Chen",
    serviceType: "Home Care",
    date: "2026-03-05",
    time: "10:00 AM",
    status: "Assigned",
    address: "123 Main St, Apt 4B",
  },
  {
    id: "SR002",
    patientName: "Jane Smith",
    nurseName: "Unassigned",
    serviceType: "Wound Care",
    date: "2026-03-05",
    time: "2:00 PM",
    status: "Pending",
    address: "456 Oak Ave",
  },
  {
    id: "SR003",
    patientName: "Robert Brown",
    nurseName: "Sarah Johnson",
    serviceType: "Physical Therapy",
    date: "2026-03-04",
    time: "11:00 AM",
    status: "In Progress",
    address: "789 Pine Rd",
  },
  {
    id: "SR004",
    patientName: "Alice Williams",
    nurseName: "Maria Rodriguez",
    serviceType: "IV Therapy",
    date: "2026-03-03",
    time: "3:00 PM",
    status: "Completed",
    address: "321 Elm St",
  },
];

export default function ServiceRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Assigned: "bg-blue-100 text-blue-800",
      "In Progress": "bg-purple-100 text-purple-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Service Requests Management</h2>
            <p className="text-sm text-gray-500">
              Monitor and manage all service requests
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
          </div>
        </div>
      </div>

      {/* Table */}
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
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {request.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-800">
                    {request.patientName}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.nurseName === "Unassigned" ? (
                      <span className="text-yellow-600 italic">
                        {request.nurseName}
                      </span>
                    ) : (
                      request.nurseName
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.serviceType}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {request.date} at {request.time}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-1 text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {request.status !== "Cancelled" &&
                        request.status !== "Completed" && (
                          <>
                            <button
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Reassign Nurse"
                            >
                              <UserX className="w-4 h-4" />
                            </button>

                            <button
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Cancel Request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No service requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Service Request Details</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Request ID</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.patientName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Assigned Nurse</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.nurseName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.serviceType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.date} at {selectedRequest.time}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              {selectedRequest.status !== "Cancelled" &&
                selectedRequest.status !== "Completed" && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Reassign Nurse
                    </button>

                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Cancel Request
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
