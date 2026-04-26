import { useEffect, useState } from "react";
import { Search, Eye, Ban, CheckCircle, RotateCcw } from "lucide-react";
import {
  getAdminUsers,
  getAdminUserDetails,
  toggleAdminUserStatus,
  resetAdminUserPassword,
} from "../../services/usersManagementService";

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState("Patient");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);

      const data = await getAdminUsers({
        type: activeTab,
        search: searchTerm,
        status: statusFilter,
      });

      setUsers(data);
    } catch (err) {
      alert(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [activeTab, statusFilter]);

  async function handleSearch() {
    await loadUsers();
  }

  async function handleView(userId) {
    try {
      const data = await getAdminUserDetails(userId);
      setSelectedUser(data);
    } catch (err) {
      alert(err.message || "Failed to load user details");
    }
  }

  async function handleToggleStatus(userId) {
    try {
      await toggleAdminUserStatus(userId);
      await loadUsers();
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  }

  async function handleResetPassword(userId) {
    const newPassword = prompt("Enter new password:");

    if (!newPassword) return;

    try {
      await resetAdminUserPassword(userId, newPassword);
      alert("Password reset successfully");
    } catch (err) {
      alert(err.message || "Failed to reset password");
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-800",
      Suspended: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status || "-"}
      </span>
    );
  };

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Users Management</h2>
            <p className="text-sm text-gray-500">
              Manage patients and approved nurses accounts
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search users..."
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
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("Patient");
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className={`px-6 py-3 text-sm transition-colors ${
                activeTab === "Patient"
                  ? "border-b-2 border-[#1F7A8C] text-[#1F7A8C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Patients
            </button>

            <button
              onClick={() => {
                setActiveTab("Nurse");
                setSearchTerm("");
                setStatusFilter("All");
              }}
              className={`px-6 py-3 text-sm transition-colors ${
                activeTab === "Nurse"
                  ? "border-b-2 border-[#1F7A8C] text-[#1F7A8C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Nurses
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  ID
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
                  Join Date
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
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {activeTab === "Patient"
                        ? `P${String(index + 1).padStart(3, "0")}`
                        : `N${String(index + 1).padStart(3, "0")}`}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.joinDate)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(user.userId)}
                          className="p-1 text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {user.status === "Active" ? (
                          <button
                            onClick={() => handleToggleStatus(user.userId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Suspend"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(user.userId)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Activate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleResetPassword(user.userId)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">User Details</h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Full Name" value={selectedUser.fullName} />
                <Info label="Email" value={selectedUser.email} />
                <Info label="Phone Number" value={selectedUser.phoneNumber} />
                <Info label="Role" value={selectedUser.roleType} />
                <Info label="Status" value={selectedUser.accountStatus} />
                <Info label="Created At" value={formatDate(selectedUser.createdAt)} />
                <Info label="Last Login" value={formatDate(selectedUser.lastLoginAt)} />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-gray-800 mb-3">Profile Information</h4>

                {selectedUser.profile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedUser.profile).map(([key, value]) => (
                      <Info key={key} label={key} value={formatValue(value)} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No profile information.</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

function formatValue(value) {
  if (!value) return "-";

  if (typeof value === "string" && value.includes("T")) {
    return new Date(value).toLocaleDateString();
  }

  return value.toString();
}