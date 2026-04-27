import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, FileText } from "lucide-react";
import {
  getPendingNurses,
  getNurseVerificationDetails,
  approveNurse,
  rejectNurse,
} from "../../services/nurseVerificationService";

export default function NurseVerification() {
  const [nurses, setNurses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  async function loadPendingNurses(search = "") {
    try {
      setLoading(true);
      setError("");
      const data = await getPendingNurses(search);
      setNurses(data);
    } catch (err) {
      setError(err.message || "Failed to load pending nurses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingNurses();
  }, []);

  async function handleSearch() {
    await loadPendingNurses(searchTerm.trim());
  }

  async function handleReview(nurse) {
    try {
      setActionLoading(true);
      const data = await getNurseVerificationDetails(nurse.nurseProfileId);
      setSelectedNurse(data);
    } catch (err) {
      alert(err.message || "Failed to load nurse details.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove() {
    try {
      setActionLoading(true);
      await approveNurse(selectedNurse.nurseProfileId);
      setSelectedNurse(null);
      await loadPendingNurses(searchTerm.trim());
    } catch (err) {
      alert(err.message || "Failed to approve nurse.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      alert("Please enter rejection reason.");
      return;
    }

    try {
      setActionLoading(true);
      await rejectNurse(selectedNurse.nurseProfileId, rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedNurse(null);
      await loadPendingNurses(searchTerm.trim());
    } catch (err) {
      alert(err.message || "Failed to reject nurse.");
    } finally {
      setActionLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${styles[status] || "bg-gray-100 text-gray-700"}`}
      >
        {status || "Pending"}
      </span>
    );
  };

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  function getFileUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Nurse Verification</h2>
            <p className="text-sm text-gray-500">
              Review pending nurse registration applications
            </p>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F]"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Nurse ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Registration Date
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
                    Loading pending nurses...
                  </td>
                </tr>
              ) : nurses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No pending nurses found.
                  </td>
                </tr>
              ) : (
                nurses.map((nurse) => (
                  <tr
                    key={nurse.nurseProfileId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {nurse.nurseId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {nurse.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {nurse.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {nurse.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(nurse.registrationDate)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(nurse.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleReview(nurse)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedNurse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Nurse Profile Review</h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-gray-700 mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Full Name" value={selectedNurse.fullName} />
                  <Info label="Nurse ID" value={selectedNurse.nurseId} />
                  <Info label="Email" value={selectedNurse.email} />
                  <Info label="Phone" value={selectedNurse.phoneNumber} />
                  <Info label="Location" value={selectedNurse.location} />
                  <Info label="Address" value={selectedNurse.address} />
                  <Info
                    label="Registration Date"
                    value={formatDate(selectedNurse.registrationDate)}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(selectedNurse.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-700 mb-3">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info
                    label="Specialization"
                    value={selectedNurse.specialization}
                  />
                  <Info
                    label="Experience Years"
                    value={selectedNurse.experienceYears}
                  />
                  <Info
                    label="License Number"
                    value={selectedNurse.licenseNumber}
                  />
                  <Info label="National ID" value={selectedNurse.nationalId} />
                </div>
                <div className="mt-4">
                  <Info label="Bio" value={selectedNurse.bio} />
                </div>
              </div>

              <div>
                <h4 className="text-gray-700 mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  <DocumentItem
                    title="Profile Image"
                    url={getFileUrl(selectedNurse.profileImagePath)}
                  />
                  <DocumentItem
                    title="Certificate"
                    url={getFileUrl(selectedNurse.certificatePath)}
                  />
                  <DocumentItem
                    title="National ID Image"
                    url={getFileUrl(selectedNurse.nationalIdImagePath)}
                  />

                  {selectedNurse.documents?.map((doc) => (
                    <DocumentItem
                      key={doc.id}
                      title={doc.documentName}
                      url={getFileUrl(doc.fileUrl)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => setSelectedNurse(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-70"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>

              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] flex items-center gap-2 disabled:opacity-70"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Reject Nurse Application</h3>
            </div>

            <div className="p-6">
              <label className="block text-sm text-gray-700 mb-2">
                Rejection Reason
              </label>
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-70"
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

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 mt-1">{value || "-"}</p>
    </div>
  );
}

function DocumentItem({ title, url }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5 text-[#1F7A8C]" />
        <span className="text-sm text-gray-800">{title}</span>
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[#1F7A8C] hover:underline"
        >
          View
        </a>
      ) : (
        <span className="text-sm text-gray-400">Not uploaded</span>
      )}
    </div>
  );
}
