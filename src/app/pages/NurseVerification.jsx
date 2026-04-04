import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";


  id;
  name;
  email;
  phone;
  registrationDate;
  status;
  documents[];
}

const mockNurses[] = [
  {
    id"N001",
    name"Dr. Emily Chen",
    email"emily.chen@email.com",
    phone"(555) 123-4567",
    registrationDate"2026-02-28",
    status"Pending",
    documents["Medical License", "ID Card", "Certificates"],
  },
  {
    id"N002",
    name"Maria Rodriguez",
    email"maria.r@email.com",
    phone"(555) 234-5678",
    registrationDate"2026-02-27",
    status"Pending",
    documents["Medical License", "ID Card"],
  },
  {
    id"N003",
    name"Sarah Johnson",
    email"s.johnson@email.com",
    phone"(555) 345-6789",
    registrationDate"2026-02-26",
    status"Approved",
    documents["Medical License", "ID Card", "Certificates"],
  },
  {
    id"N004",
    name"Lisa Wong",
    email"lisa.wong@email.com",
    phone"(555) 456-7890",
    registrationDate"2026-02-25",
    status"Rejected",
    documents["Medical License", "ID Card"],
  },
];

export default function NurseVerification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "All">("All");
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredNurses = mockNurses.filter((nurse) => {
    const matchesSearch =
      nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || nurse.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Pending"bg-yellow-100 text-yellow-800",
      Approved"bg-green-100 text-green-800",
      Rejected"bg-red-100 text-red-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const handleApprove = (nurse) => {
    alert(`Nurse ${nurse.name} has been approved!`);
    setSelectedNurse(null);
  };

  const handleReject = () => {
    if (selectedNurse && rejectReason.trim()) {
      alert(`Nurse ${selectedNurse.name} has been rejected. Reason${rejectReason}`);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedNurse(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          
            <h2 className="text-gray-800 mb-1">Nurse Verification</h2>
            <p className="text-sm text-gray-500">Review and verify nurse registration applications</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value )}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              
                <th className="px-6 py-3 text-left text-xs text-gray-600">Nurse ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Phone</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Registration Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNurses.map((nurse) => (
                <tr key={nurse.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{nurse.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{nurse.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{nurse.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{nurse.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{nurse.registrationDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(nurse.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedNurse(nurse)}
                      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nurse Detail Modal */}
      {selectedNurse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Nurse Profile Review</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              
                <h4 className="text-gray-700 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedNurse.name}</p>
                  </div>
                  
                    <p className="text-sm text-gray-500">Nurse ID</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedNurse.id}</p>
                  </div>
                  
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedNurse.email}</p>
                  </div>
                  
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedNurse.phone}</p>
                  </div>
                  
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="text-sm text-gray-800 mt-1">{selectedNurse.registrationDate}</p>
                  </div>
                  
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedNurse.status)}</div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              
                <h4 className="text-gray-700 mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  {selectedNurse.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#1F7A8C]" />
                        <span className="text-sm text-gray-800">{doc}</span>
                      </div>
                      <button className="text-sm text-[#1F7A8C] hover:underline">View</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedNurse(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedNurse.status === "Pending" && (
                
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedNurse)}
                    className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Reject Nurse Application</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm text-gray-700 mb-2">Rejection Reason</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                rows={4}
                placeholder="Provide a reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
