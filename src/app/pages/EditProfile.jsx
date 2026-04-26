import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminProfileService";

export default function EditProfile() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    try {
      setLoading(true);
      const profile = await getAdminProfile();
      setFullName(profile.fullName || "");
      setEmail(profile.email || adminUser.email || "");
      setAddress(profile.address || "");
      setPhoneNumber(profile.phoneNumber || "");
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Use data from localStorage if API fails
      setFullName(adminUser.fullName || "");
      setEmail(adminUser.email || "");
      setAddress(adminUser.address || "");
      setPhoneNumber(adminUser.phoneNumber || "");
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{10,}$/.test(phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Phone Number must be at least 10 digits";
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSaveChanges() {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage("");

      const updateData = {
        fullName: fullName.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      if (password) {
        updateData.password = password;
      }

      await updateAdminProfile(updateData);

      // Update localStorage
      const updatedUser = {
        ...adminUser,
        fullName: fullName.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
      };
      localStorage.setItem("adminUser", JSON.stringify(updatedUser));

      setSuccessMessage("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-800">Edit Profile</h2>
            <p className="text-sm text-gray-500">
              Update your account information
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg bg-white ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-gray-500 text-xs">(Read-only)</span>
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              placeholder="Email"
              value={email}
              disabled
            />
            <p className="text-gray-500 text-xs mt-1">
              Your email cannot be changed
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              className={`w-full px-4 py-2 border rounded-lg bg-white ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your address"
              rows="3"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: "" });
              }}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className={`w-full px-4 py-2 border rounded-lg bg-white ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (errors.phoneNumber)
                  setErrors({ ...errors, phoneNumber: "" });
              }}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Change Password{" "}
              <span className="text-gray-500 text-xs">(Optional)</span>
            </h3>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password (leave blank to keep current)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 border rounded-lg bg-white ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#1F7A8C] text-white rounded-lg hover:bg-[#18626F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
