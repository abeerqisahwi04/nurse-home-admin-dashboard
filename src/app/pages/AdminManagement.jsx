import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

  id;
  name;
  email;
  createdDate;
  lastActive;
}

const mockAdmins[] = [
  {
    id"A001",
    name"Admin Sarah",
    email"sarah.admin@nursehome.com",
    createdDate"2025-06-15",
    lastActive"2026-03-01 09:30 AM",
  },
  {
    id"A002",
    name"Admin Michael",
    email"michael.admin@nursehome.com",
    createdDate"2025-08-20",
    lastActive"2026-03-01 08:15 AM",
  },
  {
    id"A003",
    name"Admin Jessica",
    email"jessica.admin@nursehome.com",
    createdDate"2025-10-05",
    lastActive"2026-02-28 05:45 PM",
  },
];

const recentActions = [
  { admin"Admin Sarah", action"Approved nurse verification for Dr. Emily Chen", time"10 mins ago" },
  { admin"Admin Michael", action"Updated payment transaction status", time"1 hour ago" },
  { admin"Admin Jessica", action"Resolved complaint #4521", time"2 hours ago" },
  { admin"Admin Sarah", action"Created new admin account for Admin Tom", time"3 hours ago" },
];

export default function AdminManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          
            <h2 className="text-gray-800 mb-1">Admin Management</h2>
            <p className="text-sm text-gray-500">Manage administrator accounts</p>
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

      {/* Admin List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              
                <th className="px-6 py-3 text-left text-xs text-gray-600">Admin ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Created Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Last Active</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{admin.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{admin.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.createdDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-[#1F7A8C] hover:bg-[#1F7A8C]/10 rounded transition-colors" title="View Actions">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action Log */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Recent Admin Actions</h3>
        <div className="space-y-3">
          {recentActions.map((action, index) => (
            <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-[#1F7A8C] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="text-[#1F7A8C]">{action.admin}</span> {action.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{action.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-800">Add New Administrator</h3>
            </div>
            <div className="p-6 space-y-4">
              
                <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="Enter name..." />
              </div>
              
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" placeholder="admin@nursehome.com" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("New admin account created!");
                  setShowModal(false);
                }}
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
