import { useEffect, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";

export function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewProfile = () => {
    alert("View Profile - This will navigate to profile page");
    onClose();
  };

  const handleEditProfile = () => {
    alert("Edit Profile - This will open profile editor");
    onClose();
  };

  const handleAccountSettings = () => {
    alert("Account Settings - This will navigate to settings page");
    onClose();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("Logout - This will clear session and redirect to login");
      onClose();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-14 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      {/* Profile Info */}
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-800">Admin User</p>
        <p className="text-xs text-gray-500 mt-1">admin@nursehome.com</p>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={handleViewProfile}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <User className="w-4 h-4 text-gray-600" />
          View Profile
        </button>

        <button
          onClick={handleEditProfile}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <User className="w-4 h-4 text-gray-600" />
          Edit Profile
        </button>

        <button
          onClick={handleAccountSettings}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
        >
          <Settings className="w-4 h-4 text-gray-600" />
          Account Settings
        </button>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 py-2">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
