import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { loginAdmin } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError("");

      await loginAdmin(email.trim(), password);

      navigate("/", { replace: true });
    } catch (err) {
      setServerError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md px-10 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500">
            Access the NurseNow Admin Dashboard.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-2">
              Email address
            </label>

            <div
              className={`flex items-center border rounded-lg px-4 py-3 gap-3 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            >
              <Mail className="w-4 h-4 text-gray-400" />

              <input
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="admin@nursenow.com"
                className="flex-1 outline-none text-sm"
              />
            </div>

            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Password</label>

            <div
              className={`flex items-center border rounded-lg px-4 py-3 gap-3 ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            >
              <Lock className="w-4 h-4 text-gray-400" />

              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter your password"
                className="flex-1 outline-none text-sm"
              />
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F7A8C] hover:bg-[#18626F] text-white py-3 rounded-lg disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
