import { useState } from "react";
import { Send, Users, UserCheck, Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  target: string;
  date: string;
  sentBy: string;
}

const recentNotifications: Notification[] = [
  {
    id: "N001",
    title: "System Maintenance",
    message: "Scheduled maintenance on March 5th at 2:00 AM",
    target: "All Users",
    date: "2026-02-28",
    sentBy: "Admin Sarah",
  },
  {
    id: "N002",
    title: "New Service Available",
    message: "Physical Therapy service is now available",
    target: "Patients Only",
    date: "2026-02-27",
    sentBy: "Admin Michael",
  },
];

export default function NotificationsAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Users");

  const handleSend = () => {
    if (title.trim() && message.trim()) {
      alert(`Notification sent to ${target}!`);
      setTitle("");
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-gray-800 mb-1">Notifications & Announcements</h2>
        <p className="text-sm text-gray-500">Send system-wide or targeted notifications to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send New Notification */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1F7A8C]" />
            Create New Notification
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Target Audience</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="All Users">All Users</option>
                <option value="Nurses Only">Nurses Only</option>
                <option value="Patients Only">Patients Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Notification Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Enter notification title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Message</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                rows={6}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              onClick={handleSend}
              className="w-full px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Notification
            </button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-800 mb-4">Quick Templates</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setTitle("Nurse Verification Approved");
                  setMessage("Congratulations! Your nurse verification has been approved. You can now start accepting service requests.");
                  setTarget("Nurses Only");
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm text-gray-800">Nurse Approval Notification</p>
                <p className="text-xs text-gray-500 mt-1">For approved nurse verifications</p>
              </button>

              <button
                onClick={() => {
                  setTitle("Nurse Verification Rejected");
                  setMessage("Your nurse verification application requires additional information. Please review and resubmit.");
                  setTarget("Nurses Only");
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm text-gray-800">Nurse Rejection Notification</p>
                <p className="text-xs text-gray-500 mt-1">For rejected applications</p>
              </button>

              <button
                onClick={() => {
                  setTitle("Appointment Reminder");
                  setMessage("This is a reminder for your upcoming appointment scheduled for tomorrow.");
                  setTarget("Patients Only");
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm text-gray-800">Appointment Reminder</p>
                <p className="text-xs text-gray-500 mt-1">For upcoming appointments</p>
              </button>
            </div>
          </div>

          {/* Target Audience Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-800 mb-4">Target Audience</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#1F7A8C]" />
                  <span className="text-sm text-gray-800">All Users</span>
                </div>
                <span className="text-sm text-gray-600">3,303</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#1F7A8C]" />
                  <span className="text-sm text-gray-800">Nurses Only</span>
                </div>
                <span className="text-sm text-gray-600">456</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#1F7A8C]" />
                  <span className="text-sm text-gray-800">Patients Only</span>
                </div>
                <span className="text-sm text-gray-600">2,847</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-800 mb-4">Recently Sent Notifications</h3>
        <div className="space-y-3">
          {recentNotifications.map((notif) => (
            <div key={notif.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm text-gray-800">{notif.title}</h4>
                <span className="text-xs text-gray-500">{notif.date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Target: {notif.target}</span>
                <span>•</span>
                <span>Sent by: {notif.sentBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
