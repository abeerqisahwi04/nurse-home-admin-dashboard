import { useState } from "react";
import { Search, Eye, Ban, CheckCircle, RotateCcw } from "lucide-react";

type UserType = "Patient" | "Nurse";
type UserStatus = "Active" | "Suspended";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: UserStatus;
  type: UserType;
}

const mockPatients: User[] = [
  { id: "P001", name: "John Doe", email: "john.doe@email.com", phone: "(555) 111-2222", joinDate: "2026-01-15", status: "Active", type: "Patient" },
  { id: "P002", name: "Jane Smith", email: "jane.smith@email.com", phone: "(555) 222-3333", joinDate: "2026-01-20", status: "Active", type: "Patient" },
  { id: "P003", name: "Robert Brown", email: "robert.b@email.com", phone: "(555) 333-4444", joinDate: "2026-02-10", status: "Suspended", type: "Patient" },
];

const mockNurses: User[] = [
  { id: "N001", name: "Dr. Emily Chen", email: "emily.chen@email.com", phone: "(555) 123-4567", joinDate: "2025-11-05", status: "Active", type: "Nurse" },
  { id: "N002", name: "Sarah Johnson", email: "s.johnson@email.com", phone: "(555) 345-6789", joinDate: "2025-12-15", status: "Active", type: "Nurse" },
  { id: "N003", name: "Maria Rodriguez", email: "maria.r@email.com", phone: "(555) 234-5678", joinDate: "2026-01-08", status: "Active", type: "Nurse" },
];

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState<UserType>("Patient");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");

  const currentUsers = activeTab === "Patient" ? mockPatients : mockNurses;

  const filteredUsers = currentUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      Active: "bg-green-100 text-green-800",
      Suspended: "bg-red-100 text-red-800",
    };
    return <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-gray-800 mb-1">Users Management</h2>
            <p className="text-sm text-gray-500">Manage patients and nurses accounts</p>
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
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | "All")}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("Patient")}
              className={`px-6 py-3 text-sm transition-colors ${
                activeTab === "Patient"
                  ? "border-b-2 border-[#1F7A8C] text-[#1F7A8C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Patients ({mockPatients.length})
            </button>
            <button
              onClick={() => setActiveTab("Nurse")}
              className={`px-6 py-3 text-sm transition-colors ${
                activeTab === "Nurse"
                  ? "border-b-2 border-[#1F7A8C] text-[#1F7A8C]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Nurses ({mockNurses.length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Phone</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Join Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded transition-colors" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === "Active" ? (
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Suspend">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Activate">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Reset Password">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
