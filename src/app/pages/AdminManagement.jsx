import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  getAdmins,
  createAdmin,
  deleteAdmin,
} from "../../services/adminManagementService";

const SUPER_ADMIN_EMAIL = "admin@nursenow.com";

export default function AdminManagement() {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isSuperAdmin =
    adminUser?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  async function loadAdmins() {
    try {
      setLoading(true);
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      alert(err.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSuperAdmin) loadAdmins();
  }, [isSuperAdmin]);

  async function handleCreateAdmin() {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    // Validate email domain
    if (!email.trim().toLowerCase().endsWith("@nursenow.com")) {
      setEmailError("Email must be in the format: name@nursenow.com");
      return;
    }

    try {
      await createAdmin({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setShowModal(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setEmailError("");
      await loadAdmins();
    } catch (err) {
      alert(err.message || "Failed to create admin");
    }
  }

  async function handleDeleteAdmin(adminId, adminEmail) {
    if (adminEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert("Main admin cannot be deleted");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this admin?",
    );
    if (!confirmDelete) return;

    try {
      await deleteAdmin(adminId);
      await loadAdmins();
    } catch (err) {
      alert(err.message || "Failed to delete admin");
    }
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  }

  if (!isSuperAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6">
        You are not allowed to access Admin Management.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Admin Management</h2>
            <p className="text-sm text-gray-500">
              Manage administrator accounts
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Admin ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">
                  Created Date
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
                    colSpan="5"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    Loading admins...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin, index) => (
                  <tr
                    key={admin.adminId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      A{String(index + 1).padStart(3, "0")}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-800">
                      {admin.fullName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {admin.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(admin.createdDate)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleDeleteAdmin(admin.adminId, admin.email)
                        }
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Add New Administrator</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Enter admin name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border rounded-lg bg-white ${
                    emailError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="admin@nursenow.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setEmailError("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAdmin}
                className="px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
