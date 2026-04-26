import { useEffect, useState } from "react";
import { Send, Users, UserCheck, Bell } from "lucide-react";
import {
  getAudienceCounts,
  sendAdminNotification,
} from "../../services/adminNotificationsService";

const templates = [
  {
    label: "Nurse Approval Notification",
    description: "For approved nurse verifications",
    target: "Nurses",
    title: "Nurse Verification Approved",
    message:
      "Congratulations! Your nurse verification has been approved. You can now start accepting service requests.",
  },
  {
    label: "Nurse Rejection Notification",
    description: "For rejected applications",
    target: "Nurses",
    title: "Nurse Verification Rejected",
    message:
      "Your nurse verification application requires additional information. Please review and resubmit.",
  },
  {
    label: "Appointment Reminder",
    description: "For upcoming appointments",
    target: "Patients",
    title: "Appointment Reminder",
    message:
      "This is a reminder for your upcoming appointment scheduled for tomorrow.",
  },
];

export default function NotificationsAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All");
  const [counts, setCounts] = useState({
    allUsers: 0,
    nursesOnly: 0,
    patientsOnly: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await getAudienceCounts();
        setCounts(data);
      } catch (err) {
        alert(err.message || "Failed to load audience counts");
      }
    }

    loadCounts();
  }, []);

  async function handleSend() {
    if (!title.trim() || !message.trim()) {
      alert("Please enter title and message.");
      return;
    }

    try {
      setLoading(true);

      const result = await sendAdminNotification({
        targetAudience: target,
        title: title.trim(),
        message: message.trim(),
      });

      setTitle("");
      setMessage("");
      setTarget("All");
    } catch (err) {
      alert(err.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  }

  function applyTemplate(template) {
    setTitle(template.title);
    setMessage(template.message);
    setTarget(template.target);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-gray-800 mb-1">Notifications & Announcements</h2>
        <p className="text-sm text-gray-500">
          Send system-wide or targeted notifications to users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1F7A8C]" />
            Create New Notification
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Target Audience
              </label>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="All">All Users</option>
                <option value="Nurses">Nurses Only</option>
                <option value="Patients">Patients Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Notification Title
              </label>

              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                placeholder="Enter notification title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Message
              </label>

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
              disabled={loading}
              className="w-full px-4 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-800 mb-4">Quick Templates</h3>

            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.label}
                  onClick={() => applyTemplate(template)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-gray-800">{template.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-800 mb-4">Target Audience</h3>

            <div className="space-y-3">
              <AudienceRow
                icon={Users}
                label="All Users"
                value={counts.allUsers}
              />

              <AudienceRow
                icon={UserCheck}
                label="Nurses Only"
                value={counts.nursesOnly}
              />

              <AudienceRow
                icon={Users}
                label="Patients Only"
                value={counts.patientsOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudienceRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#1F7A8C]" />
        <span className="text-sm text-gray-800">{label}</span>
      </div>

      <span className="text-sm text-gray-600">{value ?? 0}</span>
    </div>
  );
}
